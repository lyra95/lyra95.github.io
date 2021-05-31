---
title: "디렉토리 유무확인/생성하기"
date: 2021-06-01T03:06:09+09:00
#draft: true
categories: [golang]
tags: [os]
weight: 100
---

```go
// 이미 있는지 확인
if _, err := os.Stat(path); os.IsNotExist(err) {
    // 없으므로 생성
	e := os.Mkdir(path, os.ModeDir)
}
```