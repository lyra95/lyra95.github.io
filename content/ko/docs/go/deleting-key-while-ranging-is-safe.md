---
title: "Deleting Key in Map While Ranging Is Safe"
date: 2021-06-07T15:49:24+09:00
#draft: true
categories: [golang,map]
tags: [golang]
weight: 100
---

[Is it safe to remove selected keys from map within a range loop?](https://stackoverflow.com/questions/23229975/is-it-safe-to-remove-selected-keys-from-map-within-a-range-loop)

delete(map,key)가 실제로 delete를 행하는게 아니라 그냥 flag를 setting할 뿐이라고 한다. 그래서 다음과 같은 코드를 작성해도 괜찮다.

```go
for key, value := range table {
    fmt.Printf("deleting %v=>%v\n", key, value.value)
    delete(table, key)
}
```