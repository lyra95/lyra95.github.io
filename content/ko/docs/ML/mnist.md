---
title: "Loading MNIST data : Pytorch tutorial (1)"
date: 2021-05-11T14:51:01+09:00
categories: [MNIST, pytorch]
tags: [pytorch, mnist]
weight: 3
---

[pytorch 튜토리얼 코스](https://pytorch.org/tutorials/beginner/basics/intro.html)를 참고했다.

## 전체 코드

링크를 새탭에서 열고 ctr+s해서 저장가능.
<!--path dependency-->
[주피터 노트북 파일(.ipynb)](/ml/MNIST.ipynb)

## device 선택 gpu/cpu

먼저 cpu와 gpu중 device를 선택한다. gpu가 있고 cuda가 설치되어 있으면 cuda를 사용하고, 아니면 cpu를 사용한다.

```python
import torch
device = 'cuda' if torch.cuda.is_available() else 'cpu'
#print('Using {} device'.format(device)) 로 device 확인가능
```

## MNIST 데이터 가져오기

본디 MNIST는 28*28 사이즈의 흑백으로된 0~9 숫자 손글씨 이미지 데이터다. 근데 지금와서는 일종의 프로토콜처럼 사용되고 있다.

FashionMNIST는 28*28 사이즈, 흑백, 10 종류의 의상 이미지 데이터이다. 다음 코드로 데이터를 `{프로젝트최상위}/data`에 설치할 수 있다.

```python
from torch.utils.data import Dataset
from torchvision import datasets
from torchvision.transforms import ToTensor
training_data = datasets.FashionMNIST(root="data", train=True,download=True,transform=ToTensor())

test_data = datasets.FashionMNIST(root="data", train=False,download=True,transform=ToTensor())
```

- `root` 파라미터에 설치 경로를 주면된다.
- `train` 파라미터로 트레이닝에 쓸 데이터인지 아닌지 정할 수 있다.
- 해당 경로에 데이터가 없으므로 `download=True`로 받아올 수 있다.
- `ToTensor()`는 PIL이미지나 `np.array`를 Tensor로 바꾸어준다.

> `train=False`로 하게되면, gradient값을 계산/저장할 필요가 없어서 성능이 향상된다.
> gredient 부분에 대해서 [`Autograd` 간단히 살펴보기](https://pytorch.org/tutorials/beginner/basics/autogradqs_tutorial.html)를 참고. [중간 난이도 설명](https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html#sphx-glr-beginner-blitz-autograd-tutorial-py), [어려운 설명](https://pytorch.org/docs/stable/notes/autograd.html)

FashionMNIST말고도 다양한 데이터들이 미리 준비되어 있다. 일본어 고대 히라가나 글씨 데이터 같은 KMNIST도 있다. 마찬가지로 `datasets.KMNIST(...)`로 데이터를 받아올 수 있다.

만약 자신만의 데이터셋을 쓰고 싶으면 `class CustomDataset(Dateset)`과 같이 클래스를 만들고, `__init__, __len__, __getitem__`을 구현하면 된다. [링크: Creating a Custom Dataset for your files](https://pytorch.org/tutorials/beginner/basics/data_tutorial.html)참고.

## (optional) matplotlib으로 데이터 가시화해보기

다음 코드로 전체 데이터 중에 `rows*cols=9`개 만큼의 데이터를 가져와서 이미지를 볼 수 있다.

```python
import matplotlib.pyplot as plt
labels_map = {
    0: "T-Shirt",
    1: "Trouser",
    2: "Pullover",
    3: "Dress",
    4: "Coat",
    5: "Sandal",
    6: "Shirt",
    7: "Sneaker",
    8: "Bag",
    9: "Ankle Boot",
}
figure = plt.figure(figsize=(8, 8))
cols, rows = 3, 3
for i in range(1, cols * rows + 1):
    sample_idx = torch.randint(len(training_data), size=(1,)).item()
    img, label = training_data[sample_idx]
    figure.add_subplot(rows, cols, i)
    plt.title(labels_map[label])
    plt.axis("off")
    plt.imshow(img.squeeze(), cmap="gray")
plt.show()
```

<!--path dependency-->
![sample.png](/ml/sample.png)

이 글의 목표는 matplotlib 사용법을 공부하려는 것이 아니다. `training_data[index]`로 index번째 데이터를 가져올 수 있다는 것에 주목하자.

## 데이터 로딩하기

```python
from torch.utils.data import DataLoader

train_dataloader = DataLoader(training_data, batch_size=64, shuffle=True)
test_dataloader = DataLoader(test_data, batch_size=64, shuffle=True)
```

- `batch_size`는 한 번에 올라가는 데이터의 개수다. 즉 (텐서로 변환된) 이미지 파일이 한 번에 `batch_size=64`개 씩 `device`로 올라간다.
- `shuffle=True`로 두면 데이터의 순서가 랜덤해진다. [overfitting](https://en.wikipedia.org/wiki/Overfitting)을 완화하기 위해 보통 True로 둔다.

> gpu는 병렬연산에 특화되어있어서, 한 번에 많이 올릴 수 있으면 모델 트레이닝이 빨라진다. 대신 트레이닝 시, 모델 파라미터 업데이트 횟수가 그만큼 줄어든다.(전체 데이터 수/batch_size 번)

## (optional) train_dataloader iterator화

`iter(train_dataloader)`로 iterator화 할 수 있다. train_dataloader의 첫번째에 어떤게 들어있는지 보자.

```python
iterator = iter(train_dataloader)
first = next(iterator)
print(first)
```

```powershell
[tensor([[[[0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0000, 0.0000],
          [0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0000, 0.0000],
          [0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0000, 0.0000],
          ...,
          [0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0000, 0.0000],
          [0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0000, 0.0000],
          [0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0000, 0.0000]]],

        ...,

        [[[0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0000, 0.0000],
          [0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0000, 0.0000],
          [0.0000, 0.0000, 0.4353,  ..., 0.5686, 0.0000, 0.0000],
          ...,
          [0.0000, 0.0000, 0.1176,  ..., 0.1333, 0.0000, 0.0000],
          [0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0157, 0.0000],
          [0.0000, 0.0000, 0.0000,  ..., 0.0000, 0.0000, 0.0000]]]]), 
 tensor([7, 2, 8, 6, 0, 8, 9, 2, 0, 9, 1, 5, 9, 8, 1, 6, 3, 0, 6, 4, 6, 2, 4, 2,
        9, 4, 0, 6, 3, 0, 1, 4, 2, 2, 2, 8, 7, 3, 5, 1, 4, 8, 5, 6, 1, 4, 1, 6,
        4, 2, 3, 0, 9, 7, 6, 3, 2, 2, 2, 6, 9, 8, 1, 8])
]
```

잘 모르겠지만 first에 텐서가 2개 들어있다. 다음 결과를 보면 2개의 정체가 뭔지 알 수 있다.

```python
imgs, labels = first
print(imgs.shape, labels.shape)
```

```powershell
torch.Size([64, 1, 28, 28]) torch.Size([64])
```

`batch_size=64`와 이미지 파일이 **흑백** 28\*28 픽셀이었다는 것을 상기하자. imgs는 batch_size개수만큼의 데이터, labels는 각각 데이터의 레이블이다.

실제로 그림을 그려서 확인해볼수 있다.

```python
import matplotlib.pyplot as plt
# Display image and label.
train_features, train_labels = next(iter(train_dataloader))
print(f"Feature batch shape: {train_features.size()}")
print(f"Labels batch shape: {train_labels.size()}")
img = train_features[0].squeeze()
label = train_labels[0]
plt.imshow(img, cmap="gray")
plt.show()
print(f"Label: {label.item()}")
```

<!--path dependency-->
![sample.png](/ml/sample2.png)