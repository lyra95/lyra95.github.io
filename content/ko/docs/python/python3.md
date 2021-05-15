---
title: "*args와 **kwargs"
date: 2021-05-15T16:13:15+09:00
#draft: true
categories: [python]
tags: [syntax,python]
weight: 3
---

\*args는 파라미터를 여러개(정해지지 않은 갯수)로 받을 때 쓴다.

굳이 이름이 args일 필요는 없다. \*Namelist 이렇게 써도 된다.

타입을 출력해보면 args는 tuple임을 알 수 있다.

\*\*kwargs도 파라미터를 여러개(정해지지 않은 갯수)로 받을 때 쓴다. **차이점**은 dict형태로 받는다는 것이다.

얘도 굳이 이름이 kwargs일 필요는 없다.

```python
def fo(*names):
    print(type(names),names)
    for n in names:
        print(n)

def foo(**names):
    print(type(names),names)
    for k,v in names.items():
        print(k,v)
fo("a",1,True)
foo(a=1,b=True,c="c")
```

```powershell
<class 'tuple'> ('a', 1, True)
a
1
True
<class 'dict'> {'a': 1, 'b': True, 'c': 'c'}
a 1
b True
c c
```
