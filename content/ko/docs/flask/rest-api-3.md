---
title: "Flask로 Restful Api (3): 캐시 설정하기"
date: 2021-06-11T18:31:49+09:00
#draft: true
categories: [rest api, flask, python]
tags: [python, flask, rest api]
weight: 3
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

## 캐시에 대해서

캐시는 언제 적용되야할까?
서버에 get videos/1 요청이 오고, 바로 또 get videos/1 요청이 오면 같은 연산을 서버가 반복하는 것보다 캐시에 저장된 값을 리턴하는게 좋을 것이다.

근데 캐시를 쓰지 않거나 캐시가 지워져야 하는 상황들이 있다. 일반적으로 put/delete에 대해서는 캐시를 쓰지 않는 것이 원칙이고, post에 대해서도 제한적으로 활용한다.
>[https://restfulapi.net/caching/](https://restfulapi.net/caching/)

서버에 get videos/1 요청이 와서 캐시에 결과를 저장해 뒀더니, 누가 delete videos/1 요청을 했다고하자. 그럼 캐시도 당연히 없어져야 맞을 것이다. (누가 get 요청을 했을 때 없는 데이터를 있다고 반환하면 안되니까)

이러한 상황들을 머리에 두고 캐시를 활용하자.

## 캐시 API

cache의 기본적인 api는 차차 설명할테지만 docs을 참고하자.
>[https://flask-caching.readthedocs.io/en/latest/api.html#cache-api](https://flask-caching.readthedocs.io/en/latest/api.html#cache-api)

캐시를 사용할 함수에 데코레이터[wikidocs]](https://wikidocs.net/23106)로 적용한다.
만일 다른 데코레이터들도 있다면 데코레이터들 간 순서가 중요하다.[Caching View Functions Warning 참고](https://flask-caching.readthedocs.io/en/latest/#caching-view-functions)

```python3
class Video(Resource):    
    @cache.cached(key_prefix='get%s')
    def get(self,video_id):
        #to see if cache work
        time.sleep(1)
        
        #to see how cache works
        #for k in cache.cache._cache:
        #   print(k,cache.get(k))
        
        abort_video_not_exist(video_id)
        return videos[video_id],
```

연산 결과 값은 캐시에 딕셔너리처럼 저장된다. 클라이언트로부터 get http://127.0.0.1:5000/videos/1 같은 요청이 들어왔다고 치자. 그러면 캐시에서 view//vidoes/1이라는 스트링 키에 연산결과가 저장된다.(**key_prefix를 설정하지 않은 경우**)

위와 같이 **key_prefix를 설정한 경우**, 키값은 gets/videos/1이 된다. %s는 videos/1과 정확히 대응된다.

키값을 확인하고 싶으면 주석 처리된 부분을 활용해보자.( `_cache`에서 알 수 있듯, 개발자가 의도한 public api는 아니다.)

아까 말했듯, delete나 put을 할 때 get의 캐시도 지워줘야 한다. cache.delete(키)를 활용해 지울 수 있다.

```python3
def delete(self,video_id):
        abort_video_not_exist(video_id)
        del videos[video_id]
        cache.delete(f'get/videos/{video_id}')
        return {}, 204
```

참고로 "CACHE_DEFAULT_TIMEOUT": 300로 설정했으므로 300초가 지나면 캐시는 자동으로 지워진다. @cache.cached(key_prefix='get%s',**timeout=50**)과 같이 개별적으로 시간을 달리 적용할 수도 있다.

## 테스트

크롬, 파폭 확장 어플리케이션을 이용하는 게 편할 것이다.

캐시가 있으면 get이 1초가 걸리지 않는다. 캐시가 없으면 get 요청이 1초 이상 걸린다.

get-put-get, get-delete-get 등등 캐시가 올바르게 동작하는지 확인하자.

## PS: memoize()

cached()말고도 비슷하게 동작하는 memoize()가 있다. 함수의 파라미터에 넣어진 값 별로 캐시를 하고 싶을 때 쓰는 듯하다.

위의 코드에서 cached대신에 memoize를 쓰려고하면 문제가 발생한다: self도 파라미터라서, 같은 video_id에 대한 요청인데도 불구하고 다른 인스턴스(self)로 취급하고 사실상 캐시가 안 된다.

[flask-cache-memoize-not-working-with-flask-restful-resources](https://stackoverflow.com/questions/42721927/flask-cache-memoize-not-working-with-flask-restful-resources) 이렇게 customizing을 통해 첫번째 파라미터(self)를 무시하게 하는 방법으로 해결할 수 있다고 한다.

딱히 지금 필요한 함수도 아니라서 안 쓴다.

## Reference

- [https://flask-caching.readthedocs.io/en/latest](https://flask-caching.readthedocs.io/en/latest)
- [What is Rest](https://restfulapi.net)
- [What does `key_prefix` do for flask-cache?](https://stackoverflow.com/questions/14228985/what-does-key-prefix-do-for-flask-cache/14234456)