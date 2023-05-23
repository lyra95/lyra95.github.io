# Conventional Commits

https://www.conventionalcommits.org/en/v1.0.0/

machine friendly하면서도 human readable한 형식으로 커밋 summary 및 메세지를 작성하자라는 내용.

장점은:

- 형식이 정해져 있으니 history 보기가 편함
- CI/CD의 조건으로 사용할 수도 있음
- CHANGELOGS 같은거 자동 생성 가능 (Major version 올라갈 때 무슨무슨 breaking change 있었는지 등등)

git hook 같은 걸로 강제할 수도 있고, [github action](https://github.com/webiny/action-conventional-commits)도 있다.
이 블로그에 적용할 까 했는데 자승자박 같아서 안 함
