---
title: "Theory (1) : 단어 정리"
date: 2021-05-08T15:33:28+09:00
#draft: true
categories: [Graphics]
tags: [theory]
weight: 1
mathjax: true
---

점은 점이다. 근데 그래픽스를 논할 때, point/vertex 등을 단순 점이라고하면 헷갈릴 수 있다. point는 점, vertex는 정점이라고 번역하는 텍스트들도 있지만 필자는 point는 point 혹은 포인트, vertex는 vertex혹은 정점이라고 표현하겠다.

## point

먼저 **좌표**(**coordinate**)에 대한 생각을 버리자. 점은 점이다. point를 보고서 x좌표, y좌표 ... 를 떠올리는 습관을 버리도록하자.

<p align="center">
point는 보통 $\tilde{p}$ 와 같이 표기한다. ( vector는 $\vec{q}$ )
</p>

두 point $\tilde{p},\tilde{q}$ 간에는 $-$ 연산이 가능하다.

$$\tilde{p}-\tilde{q} = \vec{v}$$

여기서 $\vec{v}$는  $\tilde{q}$ 에서 $\tilde{p}$로 향하는 벡터다. 뒤집어서 벡터+포인트도 가능하다.

$$\tilde{p} = \tilde{q} + \vec{v}$$

## Frames
