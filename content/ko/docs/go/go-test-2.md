---
title: "(1)-2 : golang 테스트"
date: 2021-04-25T18:18:20+09:00
categories: [Golang]
tags: [golang, test, benchmark]
weight : 4
---

## 테스트 여러개 생성

그냥 Test 함수를 여러개 작성하면 됩니다.

```go
// prime_test.go
func TestPrimeZero(t *testing.T) {
	result := prime(0)
	if result != 0 {
		t.Errorf("prime(0) should be 0 but prime(0) returns %d", result)
	}
}

func TestPrimeNegative(t *testing.T) {
	result := prime(-100)
	if result != 0 {
		t.Errorf("prime(-100) should be 0 but prime(-100) returns %d", result)
	}
}

func TestPrime100(t *testing.T) {
	result := prime(100)
	if result != 25 {
		t.Errorf("prime(100) should be 25 but prime(100) returns %d", result)
	}
}

func TestPrime1000(t *testing.T) {
	result := prime(1000)
	if result != 168 {
		t.Errorf("prime(1000) should be 168 but prime(100) returns %d", result)
	}
}
```

## test 일부만 실행

`go test -run {테스트이름}`으로 일부 테스트만 실행할 수 있습니다.

```powershell
PS C:\dev\goproject\prime> go test -run Prime1000 
PASS
ok      prime   4.289s
PS C:\dev\goproject\prime> 
```

>이름에서 Test부분은 빠집니다!

`go test -run Prime`을 입력하면 이름이 Prime으로 시작하는 모든 테스트를 실행합니다.

## t.Error(), t.Fail()

t.Error()는 테스트가 실패하면 모든 테스트를 중단합니다. 반면에 t.Fail()은 테스트가 실패해도 다른 테스트들을 계속 진행합니다.
>T.Errorf()에서 f는 format string의 f입니다.

t.Fail()을 이용할 시에는 실패 메시지 출력을 위해 t.Log() 나 t.Logf()를 활용하세요. t.Fail() 플래그가 셋되면(=테스트가 실패하면) 메시지가 출력됩니다.

```go
// prime_test.go
func TestFail(t *testing.T) {
	t.Fail()
	t.Log("this test must fail")
}

func TestPrime100(t *testing.T) {
	result := prime(100)
	if result != 25 {
		t.Fail()
		t.Logf("prime(100) should be 25 but prime(100) returns %d", result)
	}
}

func TestPrime1000(t *testing.T) {
	result := prime(1000)
	if result != 168 {
		t.Fail()
		t.Logf("prime(1000) should be 168 but prime(1000) returns %d", result)
	}
}

func TestPrimeZero(t *testing.T) {
	result := prime(0)
	if result != 0 {
		t.Fail()
		t.Logf("prime(0) should be 0 but prime(100) returns %d", result)
	}
}

func TestPrimeNegative(t *testing.T) {
	result := prime(-100)
	if result != 0 {
		t.Fail()
		t.Logf("prime(-100) should be 0 but prime(100) returns %d", result)
	}
}
```

테스트를 해봅시다.

```powershell
PS C:\dev\goproject\prime> go test
--- FAIL: TestFail (0.00s)
    prime_test.go:7: this test must fail
FAIL
exit status 1
FAIL    prime   3.925s
PS C:\dev\goproject\prime>
```

쉘 출력문만 봐서는 의도적으로 실패하도록 작성한 TestFail이 실패하고 나머지 테스트들이 진행되었는지 알 수 없네요.

`go test -v`를 실행시켜 봅시다 (verbose의 v입니다.)

```go
PS C:\dev\goproject\prime> go test -v
=== RUN   TestFail
    prime_test.go:7: this test must fail
--- FAIL: TestFail (0.00s)
=== RUN   TestPrime100
--- PASS: TestPrime100 (0.00s)
=== RUN   TestPrime1000
--- PASS: TestPrime1000 (0.00s)
=== RUN   TestPrimeZero
--- PASS: TestPrimeZero (0.00s)
=== RUN   TestPrimeNegative
--- PASS: TestPrimeNegative (0.00s)
FAIL
exit status 1
FAIL    prime   3.317s
```

각 테스트 결과를 다 보여주네요.

## stretchr/testify 패키지

이 패키지에서는 테스트에 유용한 함수들을 제공합니다.

터미널에 `go get github/stretchr/testify`를 입력하여 패키지를 다운받습니다.

`assert.Equal(참값, 결과값, 실패시 메시지)` 함수로 더 간결하게 코드를 작성할 수 있습니다.

```go
package main

import (
	"testing"
	"github.com/stretchr/testify/assert"
)

func TestPrime100(t *testing.T) {
	assert := assert.New(t)
	assert.Equal(25, prime(100), "prime(100) should be 25" )
}
```

실패시 어떻게 메시지가 출력되나 보기 위해 TestPrime100을 조금 바꿔봅니다.

```go
func TestPrime100(t *testing.T) {
	assert := assert.New(t)
	assert.Equal(**0**, prime(100), "prime(100) should be **0**" )
}
```

테스트 실행 시 다음과 같이 상세하게 알려줍니다.

```powershell
PS C:\dev\goproject\prime> go test -v
=== RUN   TestPrime100
    prime_test.go:11: 
                Error Trace:    prime_test.go:11
                Error:          Not equal:
                                expected: 0
                                actual  : 25
                Test:           TestPrime100
                Messages:       prime(100) should be 0
--- FAIL: TestPrime100 (0.00s)
=== RUN   TestPrime1000
--- PASS: TestPrime1000 (0.00s)
=== RUN   TestPrimeZero
--- PASS: TestPrimeZero (0.00s)
=== RUN   TestPrimeNegative
--- PASS: TestPrimeNegative (0.00s)
FAIL
exit status 1
FAIL    prime   3.948s
```

`Equal()` 이외에도 `NotEqualf(), NotNilf()` 등 많은 함수가 해당 패키지에서 제공됩니다.

## 다음 주제들

벤치마크를 하는 법, 고루틴을 이용한 prime함수 개선, 분산 처리 하는 법(뮤텍스, 채널, 작업영역 분산 등등)을 다루겠습니다.