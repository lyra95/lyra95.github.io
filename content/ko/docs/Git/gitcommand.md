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

특정 버전으로 리셋(그 버전 이후 버전들 삭제됨)
git reset --hard {commit ID}

특정 버전으로 revert(commit ID 직전 버전으로 시점이 이동하고, commit을 새로 생성함)
git revert {commit ID}
(What is the meaning of revert this commit and roll back this commit in GitHub for Windows?)[https://stackoverflow.com/questions/15039271/what-is-the-meaning-of-revert-this-commit-and-roll-back-this-commit-in-github-fo]

텍스트 에디터 바꾸기
git config --global core.editor "vim"