---
title: "Migration to Pytorch Lightning : Pytorch tutorial (3)"
date: 2021-05-11T14:51:01+09:00
categories: [MNIST, pytorch]
tags: [pytorch, mnist]
weight: 5
---

[Lightning in 2 steps](https://pytorch-lightning.readthedocs.io/en/latest/starter/new-project.html) 참고.

## Migration할 코드

```python
import torch
device = 'cuda' if torch.cuda.is_available() else 'cpu'

from torch.utils.data import Dataset
from torchvision import datasets
from torchvision.transforms import ToTensor

training_data = datasets.FashionMNIST(root="data", train=True,download=True,transform=ToTensor())

test_data = datasets.FashionMNIST(root="data", train=False,download=True,transform=ToTensor())

from torch.utils.data import DataLoader

train_dataloader = DataLoader(training_data, batch_size=64, shuffle=True)
test_dataloader = DataLoader(test_data, batch_size=64, shuffle=True)

from torch import nn
class NeuralNetwork(nn.Module):
    def __init__(self):
        super(NeuralNetwork, self).__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10),
            nn.ReLU()
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

model = NeuralNetwork().to(device)

def train_loop(dataloader, model, loss_fn, optimizer):
    size = len(dataloader.dataset)
    for batch, (X, y) in enumerate(dataloader):
        X = X.to(device)    
        y = y.to(device)
        # Compute prediction and loss
        pred = model(X)
        loss = loss_fn(pred, y)

        # Backpropagation
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if batch % 100 == 0:
            loss, current = loss.item(), batch * len(X)
            print(f"loss: {loss:>7f}  [{current:>5d}/{size:>5d}]")


def test_loop(dataloader, model, loss_fn):
    size = len(dataloader.dataset)
    test_loss, correct = 0, 0

    with torch.no_grad():
        for X, y in dataloader:
            X = X.to(device)
            y = y.to(device)
            pred = model(X)
            test_loss += loss_fn(pred, y).item()
            correct += (pred.argmax(1) == y).type(torch.float).sum().item()

    test_loss /= size
    correct /= size
    print(f"Test Error: \n Accuracy: {(100*correct):>0.1f}%, Avg loss: {test_loss:>8f} \n")

loss_fn = nn.CrossEntropyLoss().to(device)
learning_rate = 1e-3
optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate)

epochs = 5
for t in range(epochs):
    print(f"Epoch {t+1}\n-------------------------------")
    train_loop(train_dataloader, model, loss_fn, optimizer)
    test_loop(test_dataloader, model, loss_fn)
print("Done!")
```

## Defining Network Module

NeuralNetwork, training_loop, test_loop, hyper parameter 설정은 모두 이 class안으로 모아준다.

```python
import os
import torch
from torch import nn
import torch.nn.functional as F
import pytorch_lightning as pl

class NeuralNetwork(pl.LightningModule):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10),
            nn.ReLU()
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

    def training_step(self, batch, batch_idx):
        x, y = batch
        z = self.forward(x)
        loss = F.cross_entropy(z,y)
        self.log('train_loss', loss)
        return loss

    def configure_optimizers(self):
        optimizer = torch.optim.SGD(self.parameters(), lr = 1e-3)
        return optimizer
```

> training_step에서 forward 쓰지 말라고 권고하지만 일단 왜인지 모르겠으니 쓰고본다.

## Defining Data Module

MNIST data 다운로드, 로딩부분은 Data module class로 모은다.

```python
from torchvision import datasets
from torchvision.transforms import ToTensor
from torch.utils.data import DataLoader, random_split

from typing import Optional

class MyDataModule(pl.LightningDataModule):

    def __init__(self, data_dir: str = "./data", batch_size: int = 64, num_workers = 1):
        super().__init__()
        self.data_dir = data_dir
        self.batch_size = batch_size
        self.num_workers = num_workers

    def setup(self, stage: Optional[str] = None):
        self.mnist_test = datasets.FashionMNIST(root=self.data_dir, train=False, download=True, transform=ToTensor())
        
        mnist_full = datasets.FashionMNIST(root=self.data_dir, train=True,download=True,transform=ToTensor())
        self.mnist_train, self.mnist_val = random_split(mnist_full, [55000, 5000])

    def train_dataloader(self):
        return DataLoader(self.mnist_train, batch_size=self.batch_size, shuffle=True, num_workers=self.num_workers)

    def val_dataloader(self):
        return DataLoader(self.mnist_val, batch_size=self.batch_size, shuffle=True, num_workers=self.num_workers)

    def test_dataloader(self):
        return DataLoader(self.mnist_test, batch_size=self.batch_size, shuffle=True, num_workers=self.num_workers)

```

Optional을 이용해서 string arg별로 다른 behavior를 설정할 수 있다. [예시](https://pytorch-lightning.readthedocs.io/en/latest/extensions/datamodules.html):

```python
def setup(self, stage: Optional[str] = None):

        # Assign train/val datasets for use in dataloaders
        if stage == 'fit' or stage is None:
            mnist_full = MNIST(self.data_dir, train=True, transform=self.transform)
            self.mnist_train, self.mnist_val = random_split(mnist_full, [55000, 5000])

            # Optionally...
            # self.dims = tuple(self.mnist_train[0][0].shape)

        # Assign test dataset for use in dataloader(s)
        if stage == 'test' or stage is None:
            self.mnist_test = MNIST(self.data_dir, train=False, transform=self.transform)

            # Optionally...
            # self.dims = tuple(self.mnist_test[0][0].shape)
```

## Module 인스턴스 생성 및 트레이닝

다음과 같이 모듈 인스턴스를 생성한다.

```python
model = NeuralNetwork()
dm = MyDataModule(data_dir="./lightningData", num_workers = 12)
dm.setup()
```

>num_workers는 쓰레드 수다.

트레이닝 설정은 다음과 같이 하면 된다.

```python
from pytorch_lightning import Trainer
trainer = Trainer(gpus=1, max_epochs=10)
```

```powershell
GPU available: True, used: True
TPU available: False, using: 0 TPU cores
```

Trainier의 파라미터로 여러 설정들을 정할 수 있다. gpus는 사용할 gpu 수, max_epochs는 트레이닝 반복 횟수다.

콘솔 출력으로 사용가능한/선택된 디바이스를 알 수 있다.

트레이닝은 다음과 같이 하면 된다.

```python
trainer.fit(model,dm.train_dataloader(), dm.test_dataloader())
```

`.fit` 외에도 `.test`도 있다. 각각 Optional에서 behavior를 정해줄 수 있다.

## Migration 후 전체코드

```python
import os
import torch
from torch import nn
import torch.nn.functional as F
import pytorch_lightning as pl

class NeuralNetwork(pl.LightningModule):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.linear_relu_stack = nn.Sequential(
            nn.Linear(28*28, 512),
            nn.ReLU(),
            nn.Linear(512, 512),
            nn.ReLU(),
            nn.Linear(512, 10),
            nn.ReLU()
        )

    def forward(self, x):
        x = self.flatten(x)
        logits = self.linear_relu_stack(x)
        return logits

    def training_step(self, batch, batch_idx):
        x, y = batch
        z = self.forward(x)
        loss = F.cross_entropy(z,y)
        self.log('train_loss', loss)
        return loss

    def configure_optimizers(self):
        optimizer = torch.optim.SGD(self.parameters(), lr = 1e-3)
        return optimizer

from torchvision import datasets
from torchvision.transforms import ToTensor
from torch.utils.data import DataLoader, random_split

from typing import Optional

class MyDataModule(pl.LightningDataModule):

    def __init__(self, data_dir: str = "./data", batch_size: int = 64, num_workers = 1):
        super().__init__()
        self.data_dir = data_dir
        self.batch_size = batch_size
        self.num_workers = num_workers

    def setup(self, stage: Optional[str] = None):
        self.mnist_test = datasets.FashionMNIST(root=self.data_dir, train=False, download=True, transform=ToTensor())
        
        mnist_full = datasets.FashionMNIST(root=self.data_dir, train=True,download=True,transform=ToTensor())
        self.mnist_train, self.mnist_val = random_split(mnist_full, [55000, 5000])

    def train_dataloader(self):
        return DataLoader(self.mnist_train, batch_size=self.batch_size, shuffle=True, num_workers=self.num_workers)

    def val_dataloader(self):
        return DataLoader(self.mnist_val, batch_size=self.batch_size, shuffle=True, num_workers=self.num_workers)

    def test_dataloader(self):
        return DataLoader(self.mnist_test, batch_size=self.batch_size, shuffle=True, num_workers=self.num_workers)

model = NeuralNetwork()
dm = MyDataModule(data_dir="./lightningData", num_workers = 12)
dm.setup()

from pytorch_lightning import Trainer
trainer = Trainer(gpus=1, max_epochs=10)

trainer.fit(model,dm.train_dataloader(), dm.test_dataloader())
```
