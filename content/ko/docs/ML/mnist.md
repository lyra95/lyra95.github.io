---
title: "Pytorch tutorial (1)"
date: 2021-05-11T14:51:01+09:00
#draft: true
categories: [MNIST, pytorch]
tags: [pytorch, mnist]
weight: 1
---

MNIST는 (28*28 의 흑백이미지,레이블)을 만족하는 dataset의 프로토콜

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