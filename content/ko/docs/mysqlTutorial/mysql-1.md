---
title: "(1) : Install and Start Server"
date: 2021-05-07 00:00:00
#draft: true
categories: [MySQL, DB]
tags: [mysql, db, config]
weight: 1
---

## Installation

설치 환경: Windows 10 64bit

통합 패키지 [wamp](https://bitnami.com/stack/wamp)를 받습니다.(파일명 bitnami-wampstack-8.0.5-0-windows-x64-installer)

Component는 모두 선택합니다.
>php 관련 framework등 지금은 필요없는 구성들이 있지만, 일단은 선택합니다.

**설치경로를 기억**해둡시다. (필자의 경우 `C:\Bitnami\wampstack-8.0.5-0`)

root 어카운트 비밀번호는 아무거나 설정합니다.
>단순 개인 프로젝트라면 111111같은 비번도 괜찮겠지만, **보안이 중요하다면 복잡한 비밀번호로 설정**하세요

cloud는 필요없으니 선택하지 않습니다.

>Mac, Linux 같은 다른 OS의 경우, 혹은 현재 instruction을 따라하기 힘든 경우, 필자가 참고한 생활코딩[^1] 영상이나 다른 정보를 활용하세요.

## Start Server by GUI

설치경로에 **manager-windows.exe** 파일을 클릭해서 실행합니다.
![fig. 1](/images/mysql-1.png) <!--path dependencu-->

Manage Servers 탭에서 MySQL Database를 클릭하고 Start를 클릭합니다. 초록색으로 점등이 되고 Running으로 Status가 바뀌면 서버가 켜진 것입니다.

서버를 끌 때는 Stop을 누르고 빨간색으로 점등이 되는 것을 확인하세요.

## MySQL 실행

서버를 켜고 mysql을 실행해봅시다.

 `{설치경로}\mysql\bin` 에서 터미널 창 오픈해서 `mysql -uroot -p` 커맨드 입력합니다.
>매번 경로를 입력하기 귀찮으면 환경변수 path에 등록해둡시다.

비밀번호를 입력하라고 할 텐데, 설치할 때 정했던 비번입니다. 성공할 시 터미널 출력결과가 다음과 비슷할 것입니다.

```powershell
PS C:\Bitnami\wampstack-8.0.5-0\mysql\bin> mysql -uroot -p
Enter password: ******
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.24 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql>
```

`exit` 커맨드로 mysql을 종료할 수 있습니다.

## Start Server from Terminal[^2]

server가 켜져 있는지 확인해봅니다:

```powershell
PS C:\Bitnami\wampstack-8.0.5-0\mysql\bin> mysql -u root -p
Enter password: ******
ERROR 2003 (HY000): Can't connect to MySQL server on 'localhost:xxxx' (10061)
PS C:\Bitnami\wampstack-8.0.5-0\mysql\bin>
```

서버가 꺼져있습니다. `{설치경로}\mysql\bin`에서 터미널을 켜고 `mysqld` 커맨드를 입력합니다.

```powershell
PS C:\Bitnami\wampstack-8.0.5-0\mysql\bin> mysqld
_
```

서버가 켜진 동안 커맨드가 완료되지 않을 것입니다. 새로운 터미널 창을 열고 mysql을 실행할 수 있습니다.

```powershell
PS C:\Bitnami\wampstack-8.0.5-0\mysql\bin> mysql -u root -p
Enter password: ******
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.24 MySQL Community Server - GPL

Copyright (c) 2000, 2021, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> exit
Bye
```

서버를 종료하기 위해서는 root 권한이 필요합니다. 서버를 종료하기 위해 `mysqladmin -u root -p shutdown`를 입력합니다.

```powershell
PS C:\Bitnami\wampstack-8.0.5-0\mysql\bin> mysqladmin -u root -p shutdown
Enter password: ******
PS C:\Bitnami\wampstack-8.0.5-0\mysql\bin>
```

서버가 종료되면서, 서버를 실행시켰던 터미널에서 커맨드가 완료되었을 것입니다.

## reference

[^1]: [생활코딩](https://opentutorials.org/course/3161). 본격적으로 시작하기 전에 [데이터베이스의 목적](https://opentutorials.org/course/3161/19531) 강의를 보고 오는 것도 좋습니다.

[^2]: [MySQL docs](https://dev.mysql.com/doc/refman/8.0/en/windows-start-command-line.html)
