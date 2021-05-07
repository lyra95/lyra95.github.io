---
title: "(1)-1 : golang test"
date: 2021-04-25T18:18:20+09:00
categories: [Golang]
tags: [golang, test, benchmark]
weight : 3
---

Golang는 쉽고 간편한 테스트와 벤치마크를 제공합니다. 이 항목에서는 간단하게 소수판별 프로그램을 작성하며 golang의 테스트와 벤치마크를 사용해봅시다.

TDD(Test-Driven-Deleopment, 테스트 주도 개발) 절차에 따라 코드를 작성해 봅시다.

## 모듈 생성

프로젝트 디렉토리에서 터미널을 열고, `go mod init {module 이름}`을 입력합니다. 모듈이름은 prime으로 하겠습니다.

```powershell
PS C:\dev\goproject\prime> go mod init prime
go: creating new go.mod: module prime
```

go.mod 파일이 생성되었습니다.

## test go 파일 생성/작성

test를 위한 go 파일은 이름이 **_test.go**로 끝나야 합니다. 프로젝트 디렉토리에 prime_test.go라는 파일을 생성하고 다음과 같이 작성합니다.

```go
// prime_test.go
package main

import "testing"

func TestPrime1(t *testing.T) {

}
```

 - Test{테스트이름}(t *testing.T) 형식을 지키면 됩니다. 테스트이름의 첫 글자는 **대문자**여야 합니다.

이제 TestPrime1 함수 안에 테스트할 코드를 입력하면 됩니다.

하지만 아직 구체적으로 어떤 소수 판별 프로그램을 작성할지 정하지 않았군요. 대충 3가지가 떠오릅니다.

 - 1. 자연수 n을 입력받아서 n이 소수면 true 아니면 false를 리턴하는 프로그램
 - 2. 자연수 n을 입력받아서 1~n까지의 소수의 개수를 리턴하는 프로그램
 - 3. 자연수 n을 입력받아서 1~n까지의 소수의 리스트를 리턴하는 프로그램

어떤 걸로 할지는 여러분 마음대로입니다. 저는 2를 택하겠습니다. 그러면 이런식으로 테스트 코드를 작성하면 됩니다. (1~100까지 중에 소수가 25개가 있음을 참고)

```go
func TestPrime1(t *testing.T) {
	result := prime(100)
	if result != 25 {
		t.Errorf("prime(100) should be 25 but prime(100) returns %d", result)
	}
}
```

## 테스트 실행

prime이 아직 정의가 안 됬습니다. prime.go 파일을 생성하고 다음과 같이 작성합시다.

```go
// prime.go
package main

func prime(n int) int {
	return 0
}
```

터미널에서 `go test`를 입력하여 test를 실행할 수 있습니다.

```powershell
PS C:\dev\goproject\prime> go test
--- FAIL: TestPrime1 (0.00s)
    prime_test.go:8: prime(100) should be 25 but prime(100) returns 0
FAIL
exit status 1
FAIL    prime   4.138s
```

당연히 테스트는 실패합니다.

## prime.go 코드 작성

이 글의 주된 목표는 테스트 활용이기 때문에, 이 부분은 그냥 복붙하시고 다음 장으로 넘어가도 좋습니다.

```go
// prime.go
package main

func isPrime(n int) bool {
	if n == 0 || n == 1 {
		return false
	}
	for d := 2; d*d <= n; d++ {
		if n%d == 0 {
			return false
		}
	}
	return true
}

func prime(n int) int {
	cnt := 0
	for i := 1; i <= n; i++ {
		if isPrime(i) {
			cnt++
		}
	}
	return cnt
}

func main() {

}
```

>효율성이 주된 논제가 아니므로, 가독성을 위해 에라토스테네스의 체 알고리즘은 사용하지 않았습니다.

## 테스트 실행

`go test`로 테스트를 해봅시다.

```powershell
PS C:\dev\goproject\prime> go test
PASS
ok      prime   4.891s
PS C:\dev\goproject\prime> 
```

다음 포스트에서는 테스트 모듈에 대해 더 자세히 알아보겠습니다.

## 더 읽어볼거리

자연수를 다루다 보니 uint를 쓸까(unsigned) 고민했었는데 [링크](https://stackoverflow.com/questions/34165099/in-c-why-is-signed-int-faster-than-unsigned-int)를 참고해 보세요.
