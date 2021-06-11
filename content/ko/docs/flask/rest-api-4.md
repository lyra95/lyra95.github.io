---
title: "Flask로 Restful Api (4): sqlAlchemy로 DB와 연동하기"
date: 2021-06-11T18:31:49+09:00
#draft: true
categories: [rest api, flask, python]
tags: [python, flask, rest api]
weight: 4
---

## 전체코드

```python3
# main.py
from flask import Flask, request
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy
import time

app = Flask(__name__)
api = Api(app)

config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300,
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///database.db'
}
app.config.from_mapping(config)

# db 객체 생성
db = SQLAlchemy(app)

# 테이블 생성
class VideoModel(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), nullable=False)
	views = db.Column(db.Integer, nullable=False)
	likes = db.Column(db.Integer, nullable=False)

	def __repr__(self):
		return f"Video(name = {self.name}, views = {self.views}, likes = {self.likes})"


# 프로젝트 최상위에 db생성
# db.create_all() # 한번만 실행해야함. 첫 실행 후에는 주석처리

# cache initialize
cache = Cache(app)

# request parser
videos_put_args = reqparse.RequestParser()
videos_put_args.add_argument("name",type=str, help='Name of the video',required=True)
videos_put_args.add_argument("views",type=int, help='Views of the video',required=True)
videos_put_args.add_argument("likes",type=int, help='Likes of the video',required=True)

# for mashal_with 
resources_fields = {
    'id' : fields.Integer,
    'name' : fields.String,
    'views' : fields.Integer,
    'likes' : fields.Integer
}

class Video(Resource):
    # 순서 상관 x
    # get 404에러시 캐싱이 안되는게 맞는걸까?
    @marshal_with(resources_fields)
    @cache.cached(key_prefix='get%s')
    def get(self,video_id):
        time.sleep(1)
        result = VideoModel.query.filter_by(id=video_id).first()
        if not result:
            abort(404, message="Could not find video with that id")
        return result
    
    @marshal_with(resources_fields)
    def put(self,video_id):
        args = videos_put_args.parse_args()
        result = VideoModel.query.filter_by(id=video_id).first()
        video = VideoModel(id=video_id, name=args['name'], views=args['views'], likes=args['likes'])
        db.session.add(video)
        db.session.commit()
        cache.delete(f'get/videos/{video_id}')
        return video, 201
    
    def delete(self,video_id):
        result = VideoModel.query.filter_by(id=video_id).delete()
        db.session.commit()
        cache.delete(f'get/videos/{video_id}')
        return {}, 204

api.add_resource(Video,"/videos/<int:video_id>")
if __name__ == "__main__":
    app.run(debug=True)
```

## import

sqlalchemy, fields, marshal_with를 추가로 import한다.

```python3
# main.py
from flask import Flask, request
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_caching import Cache
from flask_sqlalchemy import SQLAlchemy
import time
```

sqlalchemy는 일종의 ORM이다. 파이썬과 DB를 연결해준다. DB에 저장된 record는 파이썬에서 정의된 class 객체와 대응되게 된다.

## db 생성

config에 'SQLALCHEMY_DATABASE_URI': 'sqlite:///database.db'를 추가하고 db를 이니셜라이즈 한다.

```python3
config = {
    "DEBUG": True,          # some Flask specific configs
    "CACHE_TYPE": "SimpleCache",  # Flask-Caching related configs
    "CACHE_DEFAULT_TIMEOUT": 300,
    'SQLALCHEMY_DATABASE_URI': 'sqlite:///database.db'
}
app.config.from_mapping(config)

# db 이니셜라이즈
db = SQLAlchemy(app)
```

다음과 같이 db에 테이블을 추가할 수 있다. db.create_all()이 실행되면 프로젝트 최상위에 database.db라는 이름으로 파일이 생길 것이다.
db.create_all()가 또 다시 실행되면 기존의 데이터들을 갈아엎고 다시 텅빈 database.db 파일을 생성할 거기 때문에, 첫 실행 후에는 주석처리하자.

```python3
# 테이블 생성
class VideoModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False) # 100자 제한
    views = db.Column(db.Integer, nullable=False)
    likes = db.Column(db.Integer, nullable=False)

    # print할 때 출력될 내용
    def __repr__(self):
        return f"Video(name = {self.name}, views = {self.views}, likes = {self.likes})"


# 프로젝트 최상위에 db생성
# db.create_all() # 한번만 실행해야함. 첫 실행 후에는 주석처리
```

## marshal_with로 VideoModel 인스턴스를 json으로 변환

줄여서 serialization이라고 한다. cache처럼 데코레이터로 활용한다. 먼저 어떤 필드들이 있는지 marshal_with에게 넘겨주기 위해 딕셔너리를 하나 만든다.

```python3
# marshal_with 
resources_fields = {
    'id' : fields.Integer,
    'name' : fields.String,
    'views' : fields.Integer,
    'likes' : fields.Integer
}
```

앞서 말한대로 데코레이터로 활용한다.

```python
class Video(Resource):
    # ...
    # 생략
    # ...
    @marshal_with(resources_fields)
    def put(self,video_id):
        # ...
        # 생략
        # ...
        video = VideoModel(id=video_id, name=args['name'], views=args['views'], likes=args['likes'])
        # ...
        # 생략
        # ...
        return video, 201
```

cache 데코레이터가 있는 경우, 테스트 결과 순서는 크게 중요하지 않았다. 단지 cache 안의 결과를 저장하는 딕셔너리에 value로써 VideoModel 타입이 들어갈지, json타입이 들거갈 지의 차이다.

## Reference

- [flask-sqlalchemy docs](https://flask-sqlalchemy.palletsprojects.com/en/2.x/)
- [Python REST API Tutorial - Building a Flask REST API](https://www.youtube.com/watch?v=GMppyAPbLYk)