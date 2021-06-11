---
title: "Flask로 Restful Api (2): reqparse로 요청 파싱하기"
date: 2021-06-11T18:31:49+09:00
#draft: true
categories: [rest api, flask, python]
tags: [python, flask, rest api]
weight: 2
---

## 전체코드

```python3
#main.py
from flask import Flask
from flask_restful import Api, Resource, reqparse, abort
from flask_caching import Cache
import time
app = Flask(__name__)
api = Api(app)

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}
app.config.from_mapping(config)

# 데이터가 저장되는 곳
videos = {
    1:{'name':'HelloWorld', 'views':147, 'likes':3}
}

# cache initialize
cache = Cache(app)

# request parser
videos_put_args = reqparse.RequestParser()
videos_put_args.add_argument("name",type=str, help='Name of the video',required=True)
videos_put_args.add_argument("views",type=int, help='Views of the video',required=True)
videos_put_args.add_argument("likes",type=int, help='Likes of the video',required=True)

# exception handling
def abort_video_not_exist(video_id):
    if video_id not in videos:
        abort(404,message="video doesn't exist")

class Video(Resource):    
    @cache.cached(key_prefix='get%s')
    def get(self,video_id):
        #to see if cache work
        time.sleep(1)
        
        #to see how cache works
        #for k in cache.cache._cache:
        #   print(k,cache.get(k))
        
        abort_video_not_exist(video_id)
        return videos[video_id], 200
    
    def put(self,video_id):
        args = videos_put_args.parse_args()
        videos[video_id] = args
        cache.delete(f'get/videos/{video_id}')
        return videos[video_id], 201
        
    def delete(self,video_id):
        abort_video_not_exist(video_id)
        del videos[video_id]
        cache.delete(f'get/videos/{video_id}')
        return {}, 204

api.add_resource(Video,"/videos/<int:video_id>")

if __name__ == "__main__":
    app.run(debug=True)
```

## import

reqparse, abort, Cache를 추가로 import한다. cache가 실제로 동작하는지 확인하기 위해 time도 import했다.

```python3
from flask import Flask
from flask_restful import Api, Resource, reqparse, abort
from flask_caching import Cache
import time
```

abort는 *예외상황(get을 했을 때 해당하는 데이터가 없는 경우 등)*을 핸들링하기 위해 썼다.

reqparse는 클라이언트의 requset uri를 파싱하기 위한 용도다. 예를 들어서, 클라이언트가 `2:{'name':'ByeWorld', 'views':11, 'likes':2}`와 같은 데이터를 put을 이용해 서버에 저장한다고 하면,
`put http://127.0.0.1:5000/videos/2?name=ByeWorld&views=11&likes=2`라는 형태로 서버에 요청하게 된다. reqparse는 이 URI를 파싱해서 각각 필드에(name,views,likes) 값을 기록해준다.

## cache initialization

다음과 같이 configuration을 하고 cache를 이니셜라이즈한다.

```python3
app = Flask(__name__)
api = Api(app)

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300
}
app.config.from_mapping(config)

# cache initialize
cache = Cache(app)
```

SimpleCache는 flask_caching에서 제공하는 가장 기본적인 형태의 캐시다. 다른 여러가지 캐시들이 있으며, 사용자가 직접 만들수도 있다.
>자세한 것은 [https://flask-caching.readthedocs.io/en/latest/#built-in-cache-backends](https://flask-caching.readthedocs.io/en/latest/#built-in-cache-backends)참고.

cache의 기본적인 api는 차차 설명할테지만 docs을 참고하자.
>[https://flask-caching.readthedocs.io/en/latest/api.html#cache-api](https://flask-caching.readthedocs.io/en/latest/api.html#cache-api)

## 예외상황 핸들링

해당하는 video_id의 video가 없는데 get을 하라거나, 이미 video_id에 video가 저장되어있는데 put을 통해 새로운 video를 같은 video_id에 저장하려고하면 이상할 것이다.

```python3
# exception handling
def abort_video_not_exist(video_id):
    if video_id not in videos:
        abort(404,message="video doesn't exist")
```

Restful api 아키텍처에서는 예외상황에 대한 리턴값으로 몇가지 정해진 약속이 있다. 없는 데이터를 반환하는 요청에 대해서는 404 에러코드를 리턴하도록 한다.

## request parser

put을 위한 request parser 객체를 생성하고, field들을 추가해준다. field 이름, 타입, 헬프메시지(옵션), required 순이다. required=True로 설정함으로써, 모든 필드값이 주어진 요청만 valid하게 설정했다.

```python3
# request parser
videos_put_args = reqparse.RequestParser()
videos_put_args.add_argument("name",type=str, help='Name of the video',required=True)
videos_put_args.add_argument("views",type=int, help='Views of the video',required=True)
videos_put_args.add_argument("likes",type=int, help='Likes of the video',required=True)
```

이제 다음과 같이 파서를 활용할 수 있다.

```python3
class Video(Resource): 
    
    #중략
    
    def put(self,video_id):
        args = videos_put_args.parse_args()
        videos[video_id] = args
        cache.delete(f'get/videos/{video_id}')
        return videos[video_id], 201
```

`put http://127.0.0.1:5000/videos/2?name=ByeWorld&views=11&likes=2`과 같은 요청이 들어왔다면 `args = {'name':'ByeWorld', 'views':11, 'likes':2}`가 될 것이다. 201 코드는 created라는 의미로, put 요청이 성공했다는 의사전달을 위해 리턴된다.

## 테스트

다음과 같이 put/get 요청을 테스트해볼 수 있다.

```python3
#test.py
import requests

BASE = "http://127.0.0.1:5000/"

response = requests.put(BASE + "videos/2",{'name':'ByeWorld', 'views':11, 'likes':2})
print(response.json())
response = requests.get(BASE + "videos/2")
print(response.json())
```

```powershell
PS C:\dev\flask-rest-api-tuto> python test.py
{'name': 'ByeWorld', 'views': 11, 'likes': 2}
[{'name': 'ByeWorld', 'views': 11, 'likes': 2}]
```

## 다음 포스트에서는

cache에 대해 설명하겠다.

## Reference

- [https://flask-caching.readthedocs.io/en/latest](https://flask-caching.readthedocs.io/en/latest)
- [Python REST API Tutorial - Building a Flask REST API](https://www.youtube.com/watch?v=GMppyAPbLYk)