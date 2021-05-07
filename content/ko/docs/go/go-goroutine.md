---
title: "(3)-1 : golang goRoutine"
date: 2021-04-25T18:18:20+09:00
categories: [Golang]
tags: [golang, goroutine]
weight : 6
---

## 시작하기 전에

**스레드, 프로세스, 컨텍스트 스위칭**에대한 개념을 알고 있으면 도움이 됩니다. 몰라도 당장에는 대략적으로 이해할 수는 있겠지만 이번 기회에 알아두는 것도 좋습니다.

## go Routine

`func foo()`라는 함수가 있다고 합시다.

`go foo()`로 고루틴(스레드)를 생성함과 동시에 생성된 고루틴에서 foo() 함수가 수행됩니다.

```go
func foo() {
    fmt.Print("Hi from new Go routine")
}

func main() {
    go foo()
    go foo()
    go foo()
    fmt.Println("Hi from Go routine main")
}
```

>main 함수도 고루틴의 일종입니다.

이 프로그램을 실행하면 어떻게 될까요?

```powershell
PS C:\dev\goproject\prime\test> ./test.exe
Hi from Go routine main
PS C:\dev\goproject\prime\test> ./test.exe
Hi from new Go routine
Hi from new Go routine
Hi from new Go routine
Hi from Go routine main
```

**답은 "모른다"** 입니다. 4개의 고루틴( foo 3개, main 1개) 중 어느 것이 먼저 실행되고 끝날지는 OS 프로그램의 마음대로입니다.

3개의 foo 고루틴이 끝나기전에 main 고루틴이 끝나버리면, 실행이 끝나지 않은 foo 고루틴들도 강제로 끝나버립니다.

## WaitGroup

어떻게해야 main 고루틴에서 foo 서브 고루틴들이 정상적으로 끝날 때까지 기다리게 할 수 있을까요?

한가지 답은 **WaitGroup** 오브젝트입니다.

```go
package main

import (
	"fmt"
	"sync"  // 1. WaitGroup이 포함된 패키지 임포트
)

func foo(wg *sync.WaitGroup) {  // 2. WaitGroup Obj를 pass by ref로 받습니다.
	fmt.Println("Hi from new Go routine")
	wg.Done()   // 3. foo가 완료되었다고 알립니다.
}

func main() {
	var wg sync.WaitGroup   // 4. WaitGroup Obj를 생성합니다.
	wg.Add(3)   // 5. 3개의 foo 고루틴을 기다려야 한다고 알립니다.

	go foo(&wg)     // 6. WaitGroup Obj의 reference를 pass합니다.
	go foo(&wg)     
	go foo(&wg)
	fmt.Println("Hi from Go routine main")

	wg.Wait()   // 7. foo 고루틴이 다 끝날때까지 기다립니다 <=> wg.Done()이 3번 call되기를 기다립니다. 
}
```

>&,*가 뭔지 모르겠다면 포인터, pass by value/reference 개념을 공부해보세요

프로그램을 실행해 봅시다.

```powershell
PS C:\dev\goproject\prime\test> ./test.exe
Hi from new Go routine
Hi from Go routine main
Hi from new Go routine
Hi from new Go routine
PS C:\dev\goproject\prime\test> ./test.exe
Hi from Go routine main
Hi from new Go routine
Hi from new Go routine
Hi from new Go routine
```

`foo()`가 3번 실행되고는 있지만 Hi from Go routine main가 몇 번째로 출력될지는 알 수 없습니다. Hi from Go routine main가 마지막에 출력되게 하려면 어떻게 해야할까요?

간단합니다. wg.Wait()과 fmt.Print()의 순서를 바꿔주면 됩니다.

```go
package main

import (
	"fmt"
	"sync"
)

func foo(wg *sync.WaitGroup) {
	fmt.Println("Hi from new Go routine")
	wg.Done()
}

func main() {

	var wg sync.WaitGroup
	wg.Add(3)

	go foo(&wg)
	go foo(&wg)
	go foo(&wg)
	wg.Wait()

	fmt.Println("Hi from Go routine main")
}
```

이제 프로그램을 실행해보면 Hi from Go routine main이 마지막에 출력됩니다.

```powershell
PS C:\dev\goproject\prime\test> ./test.exe
Hi from new Go routine
Hi from new Go routine
Hi from new Go routine
Hi from Go routine main
PS C:\dev\goproject\prime\test> ./test.exe
Hi from new Go routine
Hi from new Go routine
Hi from new Go routine
Hi from Go routine main
```
