---
title: "Print하지 않고 Format String 쓰기"
date: 2021-06-01T03:03:04+09:00
#draft: true
categories: [golang]
tags: [golang,string]
weight: 100
---

`fmt.SprintF(s string, a ...interface{}) string`로 가능

```go
var tmp string
tmp = fmt.Sprintf("// Date  : %v %v %v\n", year, month, day)
```