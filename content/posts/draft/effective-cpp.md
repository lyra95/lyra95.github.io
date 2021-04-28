---
title: "Effective Modern C++(1)"
date: 2021-04-28T16:29:19+09:00
categories: [c++]
tags: [c++, auto, type deduction]
draft: false
---

## Item4: Deduced type 확인하기

### A. 에디터에 마우스 갖다대면 뜸

### B. 컴파일러로 확인하기

다음과 같이 Declaration만 있고 Definition은 없는 class를 정의하자.
```c++
template<typename T> // declaration only for TD;
class TD; // TD == "Type Displayer"

int x;
const int *y;
// x랑 y의 type을 알고 싶다면...
TD<decltype(x)> xType; // elicit errors containing
TD<decltype(y)> yType; // x's and y's types
```

컴파일하면 컴파일러가 에러메세지로 deduced type을 알려준다.
```shell
error: 'xType' uses undefined class 'TD<int>'
error: 'yType' uses undefined class 'TD<const int *>'
```

### C. Run Time에 확인하기

```cpp
std::cout << typeid(x).name() << '\n'; // display types for
std::cout << typeid(y).name() << '\n'; // x and y
```

컴파일러 종류에 따라 다른 이름이 출력된다.

gcc
>i=int, PK=Pointer to Const, PKi = Pointer to Const int
 
microsoft
> int const * = const int *

type_id::name은 reference-ness를 무시할 때가 있으니, 정확한 걸 바라면 Boost::type_index라는 외부 라이브러리를 쓰자.

## item5: auto 적재적소에 쓰기

### A. declaration시 type이 너무 길 때;
```cpp
auto derefUPLess = // comparison func.
    [](const std::unique_ptr<Widget>& p1, // for Widgets
       const std::unique_ptr<Widget>& p2) // pointed to by
    { return *p1 < *p2; }; // std::unique_ptrs
```

한 술 더 떠서 parameter type에도 auto를 써도된다.

```cpp
auto derefUPLess = // comparison func.
    [](const auto& p1, 
       const auto& p2) 
    { return *p1 < *p2; }; 
```

### B. 별 중요하지 않은 type이 헷갈릴때

```cpp
std::vector<int> v;
…
unsigned sz = v.size();
auto sz_ = v.size();
```
사실 std::size의 return type은 std::vector<int>::size_type인데도 다들 잘 모르고 unsigned를 쓴다.
중요하지 않은데 헷갈린다. 그냥 auto를 쓰자.

예시 하나 더

```cpp
std::unordered_map<std::string, int> m;
…
for (const std::pair<std::string, int>& p : m)  // are you sure with the type?
{
… // do something with p
}
for (const auto& p : m)
{
… // do something with p
}
```

## item6: auto 주의사항

```cpp
std::vector<bool> features(const Widget& w);    // a bool vector

auto highPriority = features(w)[5];     // this isn't bool, unfortunately
```

std::vector<bool>의 구현은 다른 type의 vector들과 다르다: 메모리 사용량을 줄이기 위해, 각 bit가 true/false를 저장하도록 되어있다.

std::vector<bool>::operator[ ]의 type signature를 보면,

```cpp
namespace std { // from C++ Standards
    template <class Allocator>
    class vector<bool, Allocator> {
    public:
        …
        class reference { … };
        reference operator[](size_type n);
        …
    };
}
```
return type이 bool이 아니다! 그래서 auto는 bool을 deduce하지 않는다.

비슷하게 matrix class에서도 auto의 type deduction이 가끔 이상할 수 가 있다.

대체 언제 auto를 쓰고 언제 쓰지 말아야할까?

1. standard library 구현을 잘 숙지하던가
2. static_cast<>를 쓰던가

```cpp
auto highPriority = static_cast<bool>(features(w)[5]);
```