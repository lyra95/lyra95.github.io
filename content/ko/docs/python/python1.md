---
title: "@staticmethod 와 @classmethod의 차이"
date: 2021-05-15T16:13:15+09:00
#draft: true
categories: [python]
tags: [syntax,python]
weight: 1
---

[출처](https://hamait.tistory.com/635)

둘 다 클래스 인스턴스를 생성하지 않고 메서드를 사용하는 법(정적메서드)과 관련되어있다.

## @staticmethod

```python
class Test :
    num = 0

    @staticmethod
    def add (x, y) :
        return x + y


print(Test.add(1,1))
t = Test()
print(t.add(1,1))    # allowed, but not recommended
```

객체를 통한 정적메소드 접근은 C#에서는 에러, Java, C++에서는 warning이라고 한다.

```python
class Test :
    num = 0

    @staticmethod
    def add (x, y) :
        return x + y + self.num


print(Test.add(1,1))     # error
t = Test()
print(t.add(1,1))    # error
```

class 생성까지는 문제가 안되지만 add를 콜할 때 self가 정의되지 않다고 에러가 뜬다. (self를 파라미터로 받지 않았으니...)

굳이 이렇게 헷갈릴만한 코드를 쓰느니 class 바깥으로 빼는게 좋다고 생각하는 사람들도 있다.

## @classmethod

cls를 파라미터로 꼭 넣어줘야 한다.

```python
class Test :
    num = 10

    @classmethod
    def add (cls, x, y) :
        return x + y


print(Test.add(1,1))    # work
t = Test()
print(t.add(1,1))   # work, but not recommended
```

## 차이점

상속(inheritance)가 있으면 차이가 발생한다.

```python
class Date :

    word = 'date : '

    def __init__(self, date):
        self.date = self.word + date

    @staticmethod
    def now():
        return Date("today")


    def show(self):
        print(self.date)

class KoreanDate(Date):
    word = '날짜 : '

d = KoreanDate.now()    # Date's instance, not KoreanDate's
d.show()     #  date : today, unexpected
```

```python
class Date :

    word = 'date : '

    def __init__(self, date):
        self.date = self.word + date

    @staticmethod
    def now(cls):
        return cls("today")


    def show(self):
        print(self.date)

class KoreanDate(Date):
    word = '날짜 : '

d = KoreanDate.now()    # KoreanDate's instance
d.show()     #  날짜 : today,  as expected
```

cls는 콜 될 때의 클래스가 된다. (KoreanDate로 콜됬으니 cls=KoreanDate)

@staticmethod는 왜 있는지 모르겠다는 악평이 많은듯 하다.
