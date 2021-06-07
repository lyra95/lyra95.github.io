---
title: "Git command list"
date: 2021-05-20T19:06:48+09:00
#draft: true
categories: [git]
tags: [git]
weight: 1
---

[git docs](https://git-scm.com/doc)

git 관리모듈 생성
git init {path}

virsion history 보기
git log
--stat 수정된 파일과 몇 line 수정됬는지 자세히 보기
-p

바뀐 status 보기
git status

변경사항 staging
git add {filename}

새 버젼 만들기
git commit
-m {msg}

업로드
git push

차이점 보기
git diff

마지막 버전으로 돌아가기
git reset --hard

특정 버전으로 이동(commit ID는 git log로 볼 수 있음)
git checkout {commit ID}
git checkout {branch name}

텍스트 에디터 바꾸기
git config --global core.editor "vim"