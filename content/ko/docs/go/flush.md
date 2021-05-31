---
title: "Input Buffer Flush하기"
date: 2021-06-01T01:25:48+09:00
#draft: true
categories: [golang]
tags: [golang]
weight: 100
---

Scan을 할 때, 인풋 버퍼를 비우지 않으면 엉뚱한 값을 입력 받을 수 있으니 인풋 버퍼를 비우는게 좋다.

비우는 방법:

```go
import (
    "os"
    "bufio"
)
stdin := bufio.NewReader(os.Stdin)
stdin.ReadString('\n') // '\n'이 나올때까지 버퍼를 읽는다.
```