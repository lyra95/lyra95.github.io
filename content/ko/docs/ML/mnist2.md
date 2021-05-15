---
title: "Network, Save & Load : Pytorch tutorial (2)"
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

model에는 한 번에 여러개의 이미지 데이터가 들어갈 수 있다. 예를 들어서 다음과 같이 64개의 이미지(1\*28\*28) 데이터를 랜덤 생성해서 model에 input으로 넣으면,

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

`model.named_parameters()`, `model.parameters`로 네트워크 아키텍쳐 각 레이어의 파라미터들에 접근할 수 있다.

```python
for name, param in model.named_parameters():
    print(f"Layer: {name} | Size: {param.size()} | Values : {param[:2]} \n")
```

```powershell
Layer: linear_relu_stack.0.weight | Size: torch.Size([512, 784]) | Values : tensor([[ 0.0173,  0.0143, -0.0196,  ..., -0.0248,  0.0211, -0.0135],
        [-0.0005, -0.0077, -0.0185,  ...,  0.0282, -0.0144, -0.0277]],
       device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.0.bias | Size: torch.Size([512]) | Values : tensor([-0.0183, -0.0115], device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.2.weight | Size: torch.Size([512, 512]) | Values : tensor([[ 0.0267, -0.0254,  0.0438,  ...,  0.0313,  0.0486, -0.0073],
        [-0.0043,  0.0259,  0.0271,  ...,  0.0395, -0.0398, -0.0206]],
       device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.2.bias | Size: torch.Size([512]) | Values : tensor([ 0.0035, -0.0162], device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.4.weight | Size: torch.Size([10, 512]) | Values : tensor([[ 0.0301, -0.0271, -0.0287,  ...,  0.0592, -0.0327,  0.0330],
        [-0.0630, -0.0218,  0.0230,  ...,  0.0007, -0.0350, -0.0216]],
       device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.4.bias | Size: torch.Size([10]) | Values : tensor([-0.0113,  0.0471], device='cuda:0', grad_fn=<SliceBackward>) 
```

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
```

- `.to(device)`를 해야 데이터가 gpu에 올라간다.
- 매 스탭마다 grad값을 초기화해야하므로 `zero_grad()`를 쓴다.

`optimizer.zero_grad()`로 그래디언트값을 초기화하고, `loss.backward()`로 각 네트워크 아키텍처 레이어의 파라미터에 대한 그래디언트 값을 계산하고, `optimizer.step()`으로 계산된 그레디언트 값 만큼 각 파라미터들을 adjust한다.

> 딥러닝이란게 결국 이론적으로, 네트워크 파라미터들의 공간 상의 임의의 한 점에서, loss fuction의 최솟값이 되는 점을 향해(gradient 방향) 조금씩 이동하며 최솟값 지점을 찾는 것이다.

```python
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

## 하이퍼 파라미터 설정

```python
loss_fn = nn.CrossEntropyLoss().to(device)
learning_rate = 1e-3
optimizer = torch.optim.SGD(model.parameters(), lr=learning_rate)
```

[CrossEntropyLoss](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html?highlight=crossentropy#torch.nn.CrossEntropyLoss), [SGD(stochastic gradient descent)](https://pytorch.org/docs/stable/optim.html?highlight=sgd#torch.optim.SGD) 참고.

CrossEntropyLoss는 지금과 같은 classification에 적절한 loss function이다. (regression 같은 경우 Mean Square Error 같은게 적절하다.)

SGD는 네트워크 파라미터들을 (gradient)/*learning_rate만큼 adjust해주는 옵티마이저 함수다.

## 트레이닝 하기

```python
import time
start = time.process_time()
epochs = 5
for t in range(epochs):
    print(f"Epoch {t+1}\n-------------------------------")
    train_loop(train_dataloader, model, loss_fn, optimizer)
    test_loop(test_dataloader, model, loss_fn)
print("Done!")
elapsed = time.process_time() - start
print(elapsed)
```

매 루프마다 `train_loop`와 `test_loop`를 한 번 씩 실행한다. 데이터 로딩할떄 `shuffle=True`를 줬으므로, 그때그때 데이터 순서는 달라진다.
time 라이브러리를 활용해서 총 걸리는 시간을 재보았다. (gpu 40초 / cpu 200초 정도)

네트워크 파라미터들을 보면 조금 달라진 것을 알 수 있다.

```python
for name, param in model.named_parameters():
    print(f"Layer: {name} | Size: {param.size()} | Values : {param[:2]} \n")
```

```powershell
Layer: linear_relu_stack.0.weight | Size: torch.Size([512, 784]) | Values : tensor([[-0.0281, -0.0329, -0.0056,  ...,  0.0345, -0.0171,  0.0036],
        [ 0.0189, -0.0298, -0.0091,  ..., -0.0213,  0.0022, -0.0199]],
       device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.0.bias | Size: torch.Size([512]) | Values : tensor([ 0.0055, -0.0174], device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.2.weight | Size: torch.Size([512, 512]) | Values : tensor([[-0.0050,  0.0341,  0.0291,  ..., -0.0029, -0.0033,  0.0412],
        [ 0.0176,  0.0081, -0.0205,  ...,  0.0429,  0.0473, -0.0005]],
       device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.2.bias | Size: torch.Size([512]) | Values : tensor([-0.0007,  0.0297], device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.4.weight | Size: torch.Size([10, 512]) | Values : tensor([[ 0.0511, -0.0308,  0.0171,  ..., -0.0294,  0.0052, -0.0327],
        [-0.0407, -0.0375, -0.0079,  ..., -0.0263, -0.0076,  0.0434]],
       device='cuda:0', grad_fn=<SliceBackward>) 

Layer: linear_relu_stack.4.bias | Size: torch.Size([10]) | Values : tensor([0.0302, 0.0821], device='cuda:0', grad_fn=<SliceBackward>) 
```

실험삼아 다음 그림을 model에 넣어서 결과를 보자. (매번 셔플되므로 그림은 실행할 때마다 다르다)

```python
import matplotlib.pyplot as plt
# Display image and label.
train_features, train_labels = next(iter(train_dataloader))
img = train_features[0].squeeze()
label = train_labels[0]
plt.imshow(img, cmap="gray")
plt.show()
```

![sample3.png](/ml/sample3.png)

```python
model(img.unsqueeze(0).unsqueeze(0).to(device))
```

```powershell
tensor([[0.0000, 0.0000, 0.0760, 0.0000, 0.0061, 3.4088, 0.0000, 3.1719, 3.3842,
         5.4894]], device='cuda:0', grad_fn=<ReluBackward0>)
```

>unsqueeze에 대해서는 일단 넘어가자

제일 마지막 값(label=9) 5.4894가 제일 크다. label=9는 Ankel boots이므로 모델이 성공적으로 예측했다고 볼 수 있다.

## 모델 저장/로드

다음과 같이 model을 프로젝트 최상위에 model_weights.pt라는 이름으로 저장할 수 있다.

```python
import torch
import torch.onnx as onnx
import torchvision.models as models
torch.save(model.state_dict(), 'model_weights.pt')
```

로드를 할 때는 먼저 인스턴스를 하나 이니셜라이즈한 후 로드해온다.

```python
model2 = NeuralNetwork().to(device)
model2.load_state_dict(torch.load('model_weights.pt'))
model2.eval()
```

>be sure to call model.eval() method before inferencing to set the dropout and batch normalization layers to evaluation mode. Failing to do this will yield inconsistent inference results.

다른 방법도 있다. 인스턴스를 이니셜라이제이션할 필요가 없다.

```python
torch.save(model, 'model.pth')
model2 = torch.load('model.pth')
```

또 다른 방법으로, 파이토치 이외의 플랫폼에서도 로드를 하고 싶으면 .onnx 확장자로 다음과 같이 저장한다.

```python
input_image = torch.zeros((1,1,28,28)).to(device)
onnx.export(model, input_image, 'model.onnx')
```

>[onnx 튜토리얼 참고](https://github.com/onnx/tutorials)

## 마치며

autograd의 메카니즘에 대해 자세히 알면 알수록 좋다. (chain rule, jacobian matrix)

boiler plate들이 많은데 다음 번에는 torch lightning을 쓰는 튜토리얼을 작성해보려고 한다.
