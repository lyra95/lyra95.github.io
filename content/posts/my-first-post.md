---
title: "MINGW64 설치오류 the file has been downloaded incorrectly"
date: 2021-04-24T13:51:22+09:00
categories: [Setting]
tags: [mingw, windows, setting]
draft: false
---


## Error Description

mingw-w64-install.exe를 실행했을때, 설치가 완료되지 못 함. 다음과 같은 에러메세지 출력됨.

>the file has been downloaded incorrectly

## To Reproduce the error

__windows 10 pro 64bit__

__mingw-w64-install.exe__ 실행
(https://sourceforge.net/projects/mingw-w64/)

설치경로 __C:\\__

| Option        | Selected     |
|:--------------|:------------:|
| version       | 8.1.0        |
| Architecture  |  x86_64      |
| Thread        | posix        |
| Exception     | seh          |
| Build revision| 0            |


## Solution
**x86_64-win32-seh** zip 파일 다운로드
>https://sourceforge.net/projects/mingw-w64/files/mingw-w64/mingw-w64-release/

설치하려던 경로에 압축풀기 후, 환경변수 PATH에 **설치경로/mingw64/bin** 등록

## 부연설명

왜 win32버전으로 까는가?
: 필자는 간단하게 코테 문제들 풀려고 gcc 컴파일러를 쓰기 위해 mingw까는 중이다. 별 상관없이 잘 돌아간다.