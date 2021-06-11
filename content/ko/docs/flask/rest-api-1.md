---
title: "Flask로 Restful Api (1)"
date: 2021-06-11T18:31:49+09:00
#draft: true
categories: [rest api, flask, python]
tags: [python, flask, rest api]
weight: 1
---

## Restful Api란?

특정 약속으로 정해놓은 server-client application 규약이다.

HTTP( or HTTPS) 통신을 이용하여 server와 client간 데이터를 주고받는다.

보통 4가지 오퍼레이션이 있다: get, put, post, delete. 각각 Read, Update, Create, Delete에 대응된다고 보면된다.

예를들어서, 학생들 성적을 관리하는 서버가 있다고 치자. 1번 학생의 성적을 보고 싶다면 `get https://{서버주소}/students/1` 이런식으로 요청한다. 무엇을 하려고 하는지 링크(URI)자체로 설명이 되고 있다.

그외에도 stateless, cache 등등 여러가지 규약이 있는데, (https://restfulapi.net/)[https://restfulapi.net/]를 참고하는게 더 좋을 것이다.

**간단한 server-client application을 쉽게 찍어내기 위한 설계도라고 이해하면 될 것 같다.**

## 준비물

python의 **flask** framework를 이용해서 restful api 서버를 만들어보자.
> python의 django, javascript의 node.js 등 다른 선택지도 많다. flask가 쉽고 간단해 보여서 선택했다.

필요 패키지들은(requirements.txt) 다음과 같다.
>이 txt파일을 프로젝트 최상위에 두고, `pip install -r requirements.txt`로 한꺼번에 다운받을 수 있다.

```txt
aniso8601==8.0.0
click==7.1.2
Flask==1.1.2
Flask-RESTful==0.3.8
Flask-SQLAlchemy==2.4.3
Flask-Caching==1.0.0
itsdangerous==1.1.0
Jinja2==2.11.2
MarkupSafe==1.1.1
pytz==2020.1
six==1.15.0
SQLAlchemy==1.3.18
Werkzeug==1.0.1
```

## Minimal API

대충 아래 처럼 사용한다.

```python3
#main.py
from flask import Flask
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}
# tell Flask to use the above defined config
app.config.from_mapping(config)

# 데이터가 저장되는 곳
videos = {
    1:{'name':'HelloWorld', 'views':147, 'likes':3}
}

class Video(Resource):
    def get(self,video_id):        
        return videos[video_id],
    
    def delete(self,video_id):
        del videos[video_id]
        return {}, 204

api.add_resource(Video,"/videos/<int:video_id>")

if __name__ == "__main__":
    app.run(debug=True)

```

## 추가 설명

아래와 같이 flask를 initialzation하고 configure할 수 있다.

```python3
from flask import Flask
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}
# tell Flask to use the above defined config
app.config.from_mapping(config)
```

Debug 모드로 실행하고자 할 때 다음을 추가한다.

```python3
if __name__ == "__main__":
    app.run(debug=True)

```

다음과 같이 Resource를 상속받아서 class를 구현하고 get,put,post,delete 등등을 구현한다.

```python3
class Video(Resource):
    def get(self,video_id):        
        return videos[video_id],
    
    def delete(self,video_id):
        del videos[video_id]
        return {}, 204

api.add_resource(Video,"/videos/<int:video_id>")
```

마지막 줄은 일종의 라우터로, 클라이언트가 `https://서버주소/videos/3`과 같이 서버에 접근할 수 있도록 해준다.
만일 클라이언트가 `get https://서버주소/videos/1`을 요청한다면, `{'name':'HelloWorld', 'views':147, 'likes':3}`가 반환될 것이다.

## 테스트

먼저 서버를 실행한다.

```powershell
PS C:\dev\flask-rest-api-tuto> python main.py
 * Serving Flask app "main" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: on
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 171-188-332
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Detected change in 'C:\\dev\\flask-rest-api-tuto\\main2.py', reloading
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 171-188-332
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

http://127.0.0.1:5000/가 서버의 주소라고 나와있다.

크롬, 파이어폭스 확장 기능 중에 rest api 클라이언트 어플리케이션이 있다.
<!--path dependency-->
![fig. 1.](/images/rest-api-test.jpg)

혹은 request 패키지를 이용해 .py파일로 테스트할 수 있다.

```python3
#test.py
import requests

BASE = "http://127.0.0.1:5000/"

response = requests.get(BASE + "videos/1")
print(response.json())
```

```powershell
PS C:\dev\flask-rest-api-tuto> python test.py
[{'name': 'HelloWorld', 'views': 147, 'likes': 3}]
```

## 다음 포스트에서는

flask_caching 패키지를 활용해서 캐시 기능을 구현할 것이다. `get https://서버주소/videos/1`가 여러번 요청되었을 때, 해당 데이터가 업데이트/삭제되지 않았다면, 캐시를 활용해 예전에 계산된 결과를 반환하게 함으로써 서버의 부하를 줄이고 송수신 시간을 단축할 수 있다.

그 다음 포스트에서는 flask_sqlalchemy 패키지와 sqlalchemy, sqlite를 활용하여 서버가 데이터베이스와 연계하도록 구현할 것이다. (지금은 그냥 videos라는 파이썬 딕셔너리에 데이터가 저장되어있는데, 이를 데이터베이스로 치환할 것이다.)

## Reference

- [https://flask-restful.readthedocs.io/en/latest/](https://flask-restful.readthedocs.io/en/latest/)
- [Python REST API Tutorial - Building a Flask REST API](https://www.youtube.com/watch?v=GMppyAPbLYk)