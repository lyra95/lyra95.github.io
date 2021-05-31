---
title: "(3)-2 : goRoutine으로 prime 개선 (draft)"
date: 2021-05-07T22:56:19+09:00
#draft: true
categories: [Golang]
tags: [golang, goroutine]
weight: 7
---

이제 goRoutine을 활용해봅니다. 다음 두 함수를 `prime.go`에 추가합니다.

```go
// prime.go
func prime_(start, end int, handle *int, wg *sync.WaitGroup) {
	cnt := 0
	for i := start; i <= end; i++ {
		if isPrime(i) {
			cnt++
		}
	}

	defer wg.Done()
	*handle = cnt
}

func prime_multi(n int) int {
	mid := n / 2

	var wg sync.WaitGroup
	wg.Add(2)

	handle1 := 0
	go prime_(1, mid, &handle1, &wg)

	handle2 := 0
	go prime_(mid+1, n, &handle2, &wg)

	wg.Wait()

	return handle1 + handle2
}
```

`prime_()`은 `[start, end]` 사이의 소수의 개수를 구하여, 개수를 `handle` 포인터에 저장합니다. 그리고 `wg.Done()`으로 작업이 끝났음을 알립니다.

`prime_multi()`는 `[1,n]`을 `[1,mid],[mid+1,n]`으로 작업을 둘로 나누어 동시에 진행하여 소수의 개수를 구합니다.

## 벤치마크 비교하기

`prime_test.go`에 다음을 추가합니다.

```go
// prime_test.go
func BenchmarkPrime(b *testing.B) {
	for i := 0; i < b.N; i++ {
		prime(1000)
	}
}

func BenchmarkPrimeM(b *testing.B) {
	for i := 0; i < b.N; i++ {
		prime_multi(1000)
	}
}
```

`go test -bench .`를 실행하면 go가 알아서 b.N을 키워가며 성능 비교를 해줍니다.

```powershell
PS C:\dev\goproject\prime> go test -bench .
goos: windows
goarch: amd64
pkg: prime
cpu: Intel(R) Core(TM) i5-10400F CPU @ 2.90GHz
BenchmarkPrime-12          24724             41346 ns/op
BenchmarkPrimeM-12         41620             28654 ns/op
PASS
ok      prime   3.089s
```

같은 시간동안 `BenchmarkPrimeM()`이 `BenchmarkPrime()` 보다 두배가까이 더 많이 실행됬습니다.(41620 > 24724) 또한, 한 번 실행 당 걸린 시간도 더 짧습니다.(28654 ns < 41346 ns)