---
title: "Pytorch tutorial (2)"
date: 2021-05-11T14:51:01+09:00
categories: [MNIST, pytorch]
tags: [pytorch, mnist]
weight: 4
---

저번 [포스트](/docs/ml/mnist/)에서 이어서...

이미지 데이터 한 개는(레이블 제외) 1\*28\*28 사이즈를 갖는다.

`batch_size=64`이므로 한 번에 64\*1\*28\*28 사이즈의 텐서가 모델에 들어간다.

## Network Architecture 설정하기

`nn.Module`을 상속받는 클래스를 생성하고, `__init__, __foward__`를 구현해서 모델 아키텍쳐를 설정할 수 있다.

```python
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
```

이제 다음과 같이 모델 인스턴스를 생성하면된다.

```python
model = NeuralNetwork().to(device)
```

- 모델 인스턴스을 gpu에 올리기 위해 `.to(device)`를 사용했다.

`print(model)`로 모델 아키텍쳐를 확인할 수 있다.

```powershell
NeuralNetwork(
  (flatten): Flatten(start_dim=1, end_dim=-1)
  (linear_relu_stack): Sequential(
    (0): Linear(in_features=784, out_features=512, bias=True)
    (1): ReLU()
    (2): Linear(in_features=512, out_features=512, bias=True)
    (3): ReLU()
    (4): Linear(in_features=512, out_features=10, bias=True)
    (5): ReLU()
  )
)
```

model에는 한 번에 여러개의 이미지 데이터가 들어갈 수 있다. 예를 들어서 다음과 같이 64개의 이미지(1*28*28) 데이터를 랜덤 생성해서 model에 input으로 넣으면,

```python
batch_size = 64
imgs = torch.randn(batch_size,1,28,28).to(device)
print(model(imgs).shape)
```

```powershell
torch.Size([64, 10])
```

이렇게 64개 이미지에 대한 예측 텐서가 나온다.

`model.forward(x)`를 프린트해보면 `model(x)`와 같다는 걸 알 수 있다. 즉 forward를 인풋(x)가 모델 네트워크 아키텍쳐를 거쳐서 나오는 아웃풋을 리턴하도록 구현하는 것이다.

## train loop, test loop 구현

```python
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
```

- `.to(device)`를 해야 데이터가 gpu에 올라간다.
- 매 스탭마다 grad값을 초기화해야하므로 `zero_grad()`를 쓴다.

## 하이퍼 파라미터 설정

```python
loss_fn = nn.CrossEntropyLoss().to(device)
learning_rate = 1e-3
optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate)
```

[CrossEntropyLoss](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html?highlight=crossentropy#torch.nn.CrossEntropyLoss), [SGD(stochastic gradient descent)](https://pytorch.org/docs/stable/optim.html?highlight=sgd#torch.optim.SGD) 참고.

CrossEntropyLoss는 지금과 같은 classification에 적절한 loss function이다. (regression 같은 경우 Mean Square Error 같은게 적절하다.)

SGD는 네트워크 파라미터들을 (gradient)/*learning_rate만큼 adjust해주는 옵티마이저 함수다.

> 딥러닝이란게 결국 이론적으로, 네트워크 파라미터들의 공간 상의 임의의 한 점에서, loss fuction의 최솟값이 되는 점을 향해 gradient*learning_rate 만큼 이동하며 근사하는 것이다.

`optimizer.zero_grad()`로 그래디언트값을 초기화하고, `loss.backward()`로 각 네트워크 아키텍처 레이어의 파라미터에 대한 그래디언트 값을 계산하고, `optimizer.step()`으로 계산된 그레디언트 값 만큼 각 파라미터들을 adjust한다.

##

autograd는 2단계 레이어로 설명

자주사용하는 함수들에 대해서 이미 자코비안 매트릭스(텐서)를 구현해놓고 chain rule을 이용해 backward로 계산하는 것

train_loop, test_loop에서 cuda를 쓸려면 다음과 같이 수정
X = X.to(device)    
        y = y.to(device)
한 번에 batch만큼씩 (batch_size=64) gpu 메모리에 데이터셋을 올려놓는것

foward 해서 모델예측값 구하고 참값과 차이를 주어진 metric으로 계산=loss function
loss function의 그래디언트 방향으로 파라메터를 조금씩 수정

cuda와 cpu 시간차이 비교

모델 저장, 로드