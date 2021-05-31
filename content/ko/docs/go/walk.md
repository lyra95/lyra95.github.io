---
title: "filepath.Walk로 디렉토리 순회하기"
date: 2021-06-01T03:24:18+09:00
#draft: true
categories: [golang]
tags: [filepath]
weight: 100
---

[https://pkg.go.dev/path/filepath#Walk](https://pkg.go.dev/path/filepath#Walk)

```go
// func Walk(root string, fn WalkFunc) error
err := filepath.Walk(root,
    // type WalkFunc func(path string, info fs.FileInfo, err error) error
    func(path string, info fs.FileInfo, err error) error {
        // do what you want to do with each file/directory, including root
    }
)
```
