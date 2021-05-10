---
title: "Pytorch Install (local)"
date: 2021-05-10T16:45:27+09:00
#draft: true
categories: [ML, pytorch]
tags: [setting, pytorch, cuda, ml, machine learning]
weight: 1
---

[가이드](https://pytorch.org/get-started/locally/)대로 차근차근 따라한다. (Windows 10 64bits)

## Prerequisites

- python 3.xx가 설치 되었는가?
    터미널에서 python으로 버젼 확인 가능

- pip3가 설치되었는가?
    터미널에서 pip3를 실행해서 확인

- CUDA가 설치되었는가?
    - CUDA가 지원되는 GPU인가?
    - CUDA ver. 10.x or 11.x?

## Install

가이드 링크 상단 참조

## Check

pytorch 설치 확인

```powershell
PS C:\Windows\system32> python
Python 3.9.4 (tags/v3.9.4:1f2e308, Apr  6 2021, 13:40:21) [MSC v.1928 64 bit (AMD64)] on win32
Type "help", "copyright", "credits" or "license" for more information.
>>> import torch
>>> x = torch.rand(5,3)
>>> print(x)
tensor([[0.3259, 0.3376, 0.0448],
        [0.1390, 0.5901, 0.6815],
        [0.6117, 0.7122, 0.8342],
        [0.8501, 0.0681, 0.7899],
        [0.7258, 0.3614, 0.1571]])
```

CUDA enabled 확인 (위에서 이어서)

```python
>>> import torch
>>> torch.cuda.is_available()
True
```
