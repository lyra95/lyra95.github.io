---
title: "String <-> Int 변환하기"
date: 2021-06-01T01:31:21+09:00
#draft: true
categories: [golang]
tags: [golang,package]
weight: 100
---

`strconv` 패키지에 string, int를 변환하는 함수들이 있다.

`strconv.Atoi(s string) (int,erorr)`로 string->int
`strconv.ItoA(n int) string`로 int->string