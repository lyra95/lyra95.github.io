---
title: ".gitignore로 일부 파일 제외하기"
date: 2021-05-07T22:45:57+09:00
#draft: true
categories: [Git]
tags: [git]
weight: 1
---

__pycahce__,ps1같은 파일을 깃헙에 올리고 싶지는 않을 것이다.

이를 제외하려면 다음과 같이 하면된다.

1. 프로젝트 최상위 디렉토리에 `.gitignore` 파일 생성
2. 무시하고자하는 파일, 디렉토리를 `.gitignore`에 작성

와일드카드를 써서 ps1파일을 싹다 제외시켰다.

```.gitignore
*.ps1
.vscode/
```
