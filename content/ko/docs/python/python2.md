---
title: "if __name__ == '__main__': 이 뭘까"
date: 2021-05-15T16:13:15+09:00
#draft: true
categories: [python]
tags: [syntax,python]
weight: 2
---

__name__은 모듈 이름을 나타낸다. main 모듈일 경우 모듈이름은 main이된다.

자세히 알아보기 위해 main.py랑 hello.py가 다음과 같이 있다 치자.

```python
#hello.py
def foo():
    print("hello.py : " + __name__)
foo()
```

```python
#main.py
import "hello.py"

print("main.py : " + __name__)
```

main.py를 실행하면 다음과 같다.

```powershell
PS C:\dev\ml> & "C:/Program Files/Python39/python.exe" c:/dev/ml/main.py
hello.py : hello
main.py : __main__
```

hello.py를 실행하면 다음과 같다.

```powershell
PS C:\dev\ml> & "C:/Program Files/Python39/python.exe" c:/dev/ml/hello.py
hello.py : __main__
```

C++에서는 모듈 한 곳을 정해서 main 함수를 정의해야한다. 그리고 그 main함수가 프로그램의 엔트리 포인트가 된다.

근데 python에서는 main함수가 딱히 정의 안 되어있어도 된다. 그냥 실행한 모듈이 main모듈이 되는 것이다.

그래서 `if __name__ == '__main__':`의 정체는 바로, "해당 모듈이 main일 경우에~" 라는 의미다.
