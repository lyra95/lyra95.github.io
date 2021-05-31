---
title: "file read write 하는 법"
date: 2021-06-01T01:37:10+09:00
#draft: true
categories: [golang]
tags: [golang,file,read,write]
weight: 100
---

방법이 너무 다양해서 하나 통일해서 정할 필요가 있어보인다.

## READ

- `os.ReadFile(path string) ([]byte, error)`
- `os.Open(path string) (*os.File , error)`로 file handle을 정의해서`file.Read(buffer []byte) (int n, error)`를 사용하는 방법
- file handle로 `bufio.NewReader(file io.Reader) *bufio.Scanner`를 정의해서 `.Read/.ReadByte/.ReadBytes/.ReadLine/.ReadRune/.ReadString/.ReadSlice`를 사용하는 방법
- file handle로 `bufio.NewReader(file io.Reader) *bufio.Scanner`를 정의해서 `.Scan(),.Split()` 과 `.Text()`를 사용하는 방법

> [https://pkg.go.dev/bufio#Scanner](https://pkg.go.dev/bufio#Scanner) example 참고

```go
// 1
// 파일을 열어서 내용물 전체를 []byte로 받는다.
result,_ := os.ReadFile(path)

// 2
file,_ := os.Open(path)
defer file.Close()
var buffer [100]byte
// 주어진 버퍼 크기만큼 데이터를 담는다.
result,_ := file.Read(buffer)

// 3
file,_ := os.Open(path)
defer file.Close()
scanner := bufio.NewReader(file)
// '\n'이 나올때까지 읽어서 string으로 받는다.
result, _ := scanner.ReadString(byte('\n'))

// 4
file,_ := os.Open(path)
defer file.Close()
scanner := bufio.NewReader(file)
// Split 기준을 단어 단위로 한다. 디폴트는 newline이다.
scanner.Split(bufio.ScanWords)
// 다음 토큰까지 scanner를 진행한다.
if scanner.Scan() {
    // 읽은 토큰을 string으로 받는다.
	result, _ = scanner.Text()

// 예시: 123 4567 jojo -> 123, 4567, jojo 이렇게 단어 단위로 읽음 
}
```

## WRITE

### 파일을 생성하고 write

```go
file, _ := os.Create(path)
defer file.Close()
w := bufio.NewWriter(file)
w.WriteString(text)
w.Flush()
```

### 기존 파일을 trunc 후 write

```go
// OpenFile(name string, flag int, perm FileMode) (*File, error)
file, _ := os.OpenFile(path, os.O_WRONLY|os.O_TRUNC, 0644)
defer file.Close()
w := bufio.NewWriter(file)
w.WriteString(text)
w.Flush()
```

- os.O_WRONLY은 write-only, os.O_TRUNC은 trunucation을 의미한다.
- FileMode는 좀 더 알아봐야 할 듯

Read든 Write든 bufio를 쓰는 방향으로 통일하는게 좋겠다.
