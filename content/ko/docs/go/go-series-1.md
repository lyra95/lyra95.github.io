---
title: "Go 문법(1)"
date: 2021-04-25T16:22:05+09:00
categories: [Go]
tags: [go, syntax]
draft: false
weight: 1
---
참고서적: Tucker의 Go 언어 프로그래밍

## Variable declaration/Initialization

```go
var a int = 10
var a int
a := 10
```

## Type Casting

```go
var a int = 10
var b float64 = float64(a)
```

## Constant declaration/Initialization

```go
const FloatPI float64 = 3.141592
const (
    Red     int = iota
    Blue
    Green
)   // Red,Blue,Green = 0,1,2
const PI = 3.14    // 타입 없는 상수
```

## if/switch statments

```go
if x:= 10; x > 0 {
    // do something
} // x is gone after this

switch age := 22; age {
    case 10:
        // do something
    case 22:
        // do something
    default:
        // do something
}

temp := 18
switch true {
    case temp <10, temp > 30:
        // do something
    case temp >= 10, temp < 30:
        // do something
    default:
        // do something
}
switch {    // true dropped
    case temp <10, temp > 30:
        // do something
    case temp >= 10, temp < 30:
        // do something
    default:
        // do something
}
```

`switch`의 경우 디폴트로 `break`다. `break`를 걸기 싫은 `case`에는 `fallthrough`를 추가하면됨

## For statment

```go
for i:=0; i<10; i++ {
    // do something
}

i:=0
for ; i<10; i++ {   // 초기문 생략
    // do something
}

for i:=0; i<10; {   // 후처리 생략
    // do something
}

for ; i<10; {   // 초기문, 후처리 생략
    // do something
}

for i<10 {   // 초기문, 후처리 생략 ver.2
    // do something
}

for true {
    // 무한 루프
}

for {
    // 무한 루프
}
```

while은 for로 대체되었다.
