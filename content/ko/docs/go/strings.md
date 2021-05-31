---
title: "strings 패키지"
date: 2021-06-01T03:16:24+09:00
#draft: true
categories: [golang]
tags: [package]
weight: 100
---

[https://golang.org/pkg/strings/](https://golang.org/pkg/strings/)

스트링 관련 많은 함수들을 제공한다. 몇가지 예를 들면

`func Contains(s, substr string) bool`
`func HasSuffix(s, suffix string) bool`
`func Index(s, substr string) int` (첫번째 index)
`func Split(s, sep string) []string`
`func Replace(s, old, new string, n int) string` (n개의 old를 new로 치환한 카피 리턴)
`func ToUpper(s string) string`