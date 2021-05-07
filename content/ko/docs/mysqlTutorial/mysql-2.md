---
title: "(2) : Tutorial"
date: 2021-05-07 00:00:00
#draft: true
categories: [MySQL, DB]
tags: [mysql, db, tutorial]
weight: 2
---

[이전 포스트](/docs/mysqltutorial/mysql-1/)를 참고하여 mysql을 실행합니다.<!--path dependencu-->

[생활코딩](https://opentutorials.org/course/3161/19533)에서 MySQL의 전체적인 구조를 보고오면 이해에 도움이 될 것 입니다.

## Database 목록 보기

현재 database 목록을 보기 위해 `SHOW DATABASES;` 커맨드를 입력합니다.

```sql
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)

mysql>
```

- mysql 명령문은 case sensetive하지 않습니다. `show databases;`를 입력하더라도 같은 결과를 보여줄 것입니다. 하지만 convention에 따라, 사용자가 지정한 이름은 소문자로, 그외는 대문자로 써서 알아보기 편하게 합시다.

- sql 명령문의 마지막은 ;로 끝납니다. ;로 끝내기 전에 enter를 입력해서, 명령문을 여러줄 입력할 수 있습니다.

## Create Database

`CREATE DATABASE {database_name};` 커맨드를 입력해 database를 생성합니다.

```sql
mysql> CREATE DATABASE tutorial;
Query OK, 1 row affected (0.01 sec)

mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| tutorial           |
+--------------------+
5 rows in set (0.00 sec)

mysql>
```

>tutorial은 사용자가 지정한 이름이므로 convention에 따라 소문자로 입력했습니다.

tutorial이라는 이름의 database를 생성했습니다.

## Delete Database

`DROP DATABASE {database_name};` 커맨드를 입력해 database를 삭제할 수 있습니다.

```sql
mysql> DROP DATABASE tutorial;
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)

mysql>
```

## tutorial database로 접속

tutorial database를 다시 생성합니다.

 `USE {database_name};` 커맨드를 입력하여 tutorial database로 접속할 수 있습니다.

```sql
mysql> CREATE DATABASE tutorial;
Query OK, 1 row affected (0.01 sec)

mysql> USE tutorial;
Database changed
mysql>
```
