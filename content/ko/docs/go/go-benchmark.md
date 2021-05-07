---
title: "(2) : golang benchmark"
date: 2021-04-25T18:18:20+09:00
categories: [Golang]
tags: [golang, test, benchmark]
weight : 5
---

Golang은 벤치마크 기능을 지원합니다. 테스트와 마찬가지로

- 1. `_test.go`로 끝나는 파일에
- 2. testing 패키지를 임포트하고
- 3. func BenchmarkXxxx(b *testing.B) 형태로 함수를 작성하면 됩니다.

<!--path dependency-->
한 번 작성해 봅시다. (소스코드는 [이전 포스트](/docs/go/go-test-1/#primego-코드-작성)의 n이하의 소수의 개수를 리턴하는 함수 `prime(n)`를 참고하세요.)

```go
// prime_test.go
package main

import "testing"

func BenchmarkPrime(b *testing.B) {
	for i := 0; i < b.N; i++ {
		prime(1000)
	}
}
```

유의미한 시간 차이를 보일때까지 **b.N**은 알아서 조정됩니다.

터미널에 `go test -bench .`를 입력하여 벤치마크 결과를 볼 수 있습니다.

```powershell
PS C:\dev\goproject\prime> go test -bench .
goos: windows
goarch: amd64
pkg: prime
cpu: Intel(R) Core(TM) i5-10400F CPU @ 2.90GHz
BenchmarkPrime-12          29833             40675 ns/op
PASS
ok      prime   8.221s
PS C:\dev\goproject\prime>
```

먼저 os와 아키텍처, cpu에 대한 정보가 나옵니다.

`BenchmarkPrime-12          29833             40675 ns/op`의 의미는 `BenchmarkPrime()` 함수가 29833번 반복되었으며, 한 번 시행마다 40675ns 만큼 걸렸다는 뜻입니다.
>BenchmarkPrime-12에서 12의 의미는 뭘까요?

고루틴을 이용한 멀티쓰레딩 프로그래밍으로 `prime()` 함수를 조금 개선해 봅시다.
