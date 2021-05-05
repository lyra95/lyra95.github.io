---
title: "C++ containers in standard library (draft)"
date: 2021-04-28T02:18:28+09:00
categories: [algorithm, data structure]
tags: [c++,algorithm, data structure]

---

# Sequence Containers

## vector

기본 array의 강화판. array는 size 정보도 가지고 있지 않고, index bound error도 컴파일 타임에 체크해 주지 않는다. 반면에 vector는 다음과 같은 특징이 있다.

[+] memory에 연속적으로 element들을 저장한다.

[+] .size()를 통해 현재 element 개수를 알 수 있다.

[+] array와 마찬가지로 constant time element access가 가능하다.

[+] .at()같은 index bound를 체크해주는 member function들이 있다.

[+] heap allocation 알아서 해준다. ~~int x[n] 에러의 악몽~~

[-] ~~타이핑하기 귀찮다 vector<vector<...>>~~

그러니 잘 모르겠으면 vector를 쓰자.

- 양방향 iterator
- iterator + int 가능
- iterator - iterator 가능

- push_back: amortized O(1)
    > 현재 배정된 메모리에 여유가 있으면 O(1). 자리가 부족하면 새로운 메모리에 복사되서 새로 배정되느라 O(n)
- pop_back: O(1)

보통 constructor는 {}를 쓰는게 국룰이지만, vector의 경우 어쩔 수없이 ()를 쓰게될 때가 있다.
>vector<>(uint size, T val)  // val을 size개수만큼.

## array


## deque

## list

구현기반: doubly linked list

## forward_list

# Container Adapters

## queue

## priority queue

## stack

# Associative Containers

## map

구현기반: balanced binary tree

supported operations:

## unordered map

구현기반: hash

## set

## unorderd set
