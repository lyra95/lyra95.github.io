---
title: "CLI argument parsing : argparse"
date: 2021-05-16T17:28:58+09:00
#draft: true
categories: [python]
tags: [python]
weight: 4
---

## 개요

간단한 계산기 프로그램을 예로 들어 설명한다.

CLI에서 `python main.py -op sum 1 2 3`이런 식으로 프로그램에 인풋을 주고 싶다고 하자. (결과는 6을 출력하도록)

## sum, mul 함수 작성 (skip)

일단 argparse랑은 상관 없는 sum,mul함수를 작성한다.

```python
#main.py
def sum(args):
    temp = 0
    for num in args:
        temp += int(num)
    return temp

def mul(args):
    temp = 1
    for num in args:
        temp *= int(num)
    return temp
```

## ArgumentParser

다음과 같이 ArgumentParser 오브젝트를 생성한다. 그리고 어떤 종류의 argument를 받을지 `.add_argument()`로 추가할 수 있다. 물론 `.add_argument()`를 여러개 해도 된다

```python
import argparse

parser = argparse.ArgumentParser(description="usage examples:\npython main.py -op sum 1 2 3 4\npython main.py -op mul 1 2 3 4")

parser.add_argument("-op", default="sum",type=str, choices=["sum", "mul"])
```

- description은 `python main.py -h`를 입력했을 때 보여주게 할 설명을 적으면 된다.
- add_argument에 대한 API는 [docs](https://docs.python.org/ko/3/library/argparse.html) 참고

파싱은 `.parse_known_args()`를 통해 할 수 있다. 리턴값은 리터럴 리스트와 Namespace객체의 튜플이다.

```python
script_arg, args = parser.parse_known_args()
# print(type(parser.parse_known_args()),parser.parse_known_args())
# print(args,type(args))
```

예를 들어 `python main.py -op sum 1 2 3`라고 cmd에 입력했다면, `parser.parse_known_args()`의 결과값은 `<class 'tuple'> (Namespace(op='sum'), ['1', '2', '3'])`이 된다. (궁금하면 주석 빼고 실행해보길)

다른 argument들을 설정했다면 `<class 'tuple'> (Namespace(op='sum', justName=None), ['1', '2', '3'])`이런 식으로 될 것이다.

`script_arg`에 Namespace객체가 저장되어있다. 다음과 같이 꺼낼 수 있다.

```python
if script_arg.op == "sum":
    print(sum(args))
elif script_arg.op == "mul":
    print(mul(args))
else:
    raise ValueError(f"undefined input {script_arg.op}")
```

- 만약 `add_argument("-justName", ...)`이 또 있었다면 `.justName`이라고 하면된다.

## 동작 예시

어떤 식으로 동작하는지 다음을 참고하자.

```powershell
PS C:\dev\ml> python main.py -h
usage: main.py [-h] [-op {sum,mul}]

usage examples: python main.py -op sum 1 2 3 4 python main.py -op mul 1 2 3 4

optional arguments:
  -h, --help     show this help message and exit
  -op {sum,mul}
PS C:\dev\ml> python main.py -op mul 1 2 3 4 5
120
PS C:\dev\ml> python main.py -op abc 12 3     
usage: main.py [-h] [-op {sum,mul}]
main.py: error: argument -op: invalid choice: 'abc' (choose from 'sum', 'mul')
```

## 레퍼런스

[python docs](https://docs.python.org/ko/3/library/argparse.html)
