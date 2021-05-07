---
title: "(6) : JOIN, 데이터 중복 최소화"
date: 2021-05-07 00:00:00
#draft: true
categories: [MySQL, DB]
tags: [mysql, db, join]
weight: 6
---

## 데이터 중복 문제

다음과 같이 topic table이 있습니다.

```sql
mysql> select * from topic;
+----+------------+--------------------+---------------------+--------+--------------------------+
| id | title      | description        | created             | author | profile                  |
+----+------------+--------------------+---------------------+--------+--------------------------+
|  1 | MySQL      | MySQL is ...       | 2018-01-10 00:00:00 | egoing | developer                |
|  2 | ORACLE     | Oracle is...       | 2021-05-06 18:17:04 | egoing | developer                |
|  3 | SQL Server | SQL Server is...   | 2021-05-06 20:20:24 | duru   | database administrator   |
|  4 | PostgreSQL | PostgreSQL is  ... | 2021-05-06 18:27:24 | taeho  | data scientist,developer |
|  5 | MongoDB    | MongoDB is  ...    | 2021-05-06 18:27:43 | egoing | developer                |
+----+------------+--------------------+---------------------+--------+--------------------------+
5 rows in set (0.00 sec)
```

(author,profile)을 보면 ('egoing','developer')가 전체 5개 레코드 중 3개의 레코드에서 반복되고 있습니다. 

만일 테이블이 훨씬 더 큰 사이즈여서 몇 만, 십 만 단위의 레코드가 있었더라면 저렇게 특정한 데이터들이 반복되지 않는게 좋습니다. 데이터의 크기가 몇 기가바이트 단위로 커도 역시 반복되지 않는게 좋습니다.

테이블에 반복되는 데이터가 있으면 어떻게 해야할까요?

## 테이블 나누기

topic table을 둘로 나누어 봅시다.

원본을 일단 백업합니다.

```sql
mysql> RENAME TABLE topic TO table_backup;
Query OK, 0 rows affected (0.01 sec)
```

새로 topic, author라는 테이블을 만듭니다.

```sql
mysql> CREATE TABLE topic(
    -> id INT(11) NOT NULL AUTO_INCREMENT,
    -> title VARCHAR(30) NOT NULL,
    -> description TEXT NULL,
    -> created DATETIME NOT NULL,
    -> author_id INT(11) NULL,
    -> PRIMARY KEY(id)
    -> );
Query OK, 0 rows affected, 2 warnings (0.02 sec)
mysql> CREATE TABLE author(
    -> id INT(11) NOT NULL AUTO_INCREMENT,
    -> name VARCHAR(20) NOT NULL,
    -> profile VARCHAR(200) NULL,
    -> PRIMARY KEY(id)
    -> );
Query OK, 0 rows affected, 1 warning (0.02 sec)
```

레코드도 추가해줍니다. author 테이블은 아래와 같습니다.

```sql
mysql> SELECT * FROM author;
+----+--------+---------------------------+
| id | name   | profile                   |
+----+--------+---------------------------+
|  1 | egoing | developer                 |
|  2 | duru   | database administrator    |
|  3 | taeho  | data scientist, developer |
+----+--------+---------------------------+
3 rows in set (0.00 sec)
```

원래의 topic 테이블에서, ('egoing','developer')를 갖던 레코드는 이제 author_id 값으로 1을 갖습니다.

```sql
mysql> SELECT * FROM topic;
+----+------------+------------------+---------------------+-----------+
| id | title      | description      | created             | author_id |
+----+------------+------------------+---------------------+-----------+
|  1 | MySQL      | MySQL is...      | 2021-05-06 23:09:59 |         1 |
|  2 | ORACLE     | ORACLE is...     | 2021-05-06 23:10:21 |         1 |
|  3 | SQL Server | SQL Server is... | 2021-05-06 23:10:55 |         2 |
|  4 | PostgreSQL | PostgreSQL is... | 2021-05-06 23:11:28 |         3 |
|  5 | MongoDB    | MongoDB is...    | 2021-05-06 23:11:53 |         1 |
+----+------------+------------------+---------------------+-----------+
5 rows in set (0.00 sec)
```

이제 ('egoing','developer')이 반복 저장되지않고, 대신 author_id=1 값이 반복 저장됩니다.

>topic 테이블의 author_id 같은 attribute를 외래키(foreign key)라고 부릅니다.

## JOIN으로 합쳐서 보기

다음과 같은 커맨드로 두 테이블을 합쳐서 볼 수 있습니다.

```sql
mysql> SELECT * FROM topic LEFT JOIN author ON topic.author_id = author.id;
+----+------------+------------------+---------------------+-----------+------+--------+---------------------------+
| id | title      | description      | created             | author_id | id   | name   | profile                   |
+----+------------+------------------+---------------------+-----------+------+--------+---------------------------+
|  1 | MySQL      | MySQL is...      | 2021-05-06 23:09:59 |         1 |    1 | egoing | developer                 |
|  2 | ORACLE     | ORACLE is...     | 2021-05-06 23:10:21 |         1 |    1 | egoing | developer                 |
|  3 | SQL Server | SQL Server is... | 2021-05-06 23:10:55 |         2 |    2 | duru   | database administrator    |
|  4 | PostgreSQL | PostgreSQL is... | 2021-05-06 23:11:28 |         3 |    3 | taeho  | data scientist, developer |
|  5 | MongoDB    | MongoDB is...    | 2021-05-06 23:11:53 |         1 |    1 | egoing | developer                 |
+----+------------+------------------+---------------------+-----------+------+--------+---------------------------+
5 rows in set (0.00 sec)
```

author_id와 그 옆의 id attribute를 빼고 보고 싶으면 다음과 같이 하면 됩니다. 합치기 전의 테이블과 똑같이 생겼습니다!

```sql
mysql> SELECT topic.id, title, description, created, name, profile
    -> FROM topic LEFT JOIN author ON topic.author_id = author.id;
+----+------------+------------------+---------------------+--------+---------------------------+
| id | title      | description      | created             | name   | profile                   |
+----+------------+------------------+---------------------+--------+---------------------------+
|  1 | MySQL      | MySQL is...      | 2021-05-06 23:09:59 | egoing | developer                 |
|  2 | ORACLE     | ORACLE is...     | 2021-05-06 23:10:21 | egoing | developer                 |
|  3 | SQL Server | SQL Server is... | 2021-05-06 23:10:55 | duru   | database administrator    |
|  4 | PostgreSQL | PostgreSQL is... | 2021-05-06 23:11:28 | taeho  | data scientist, developer |
|  5 | MongoDB    | MongoDB is...    | 2021-05-06 23:11:53 | egoing | developer                 |
+----+------------+------------------+---------------------+--------+---------------------------+
5 rows in set (0.00 sec)
```

- topic 테이블과 author 테이블 둘 다 id라는 attribute가 있습니다. `{테이블이름}.id`로 둘을 구분할 수 있습니다.

중복되는 데이터는 분리해서 저장하되, JOIN을 통해 다시 원래처럼 합쳐서 볼 수 있습니다.

>JOIN도 더 복잡한 문법들이 있지만, 아이디어만을 보여주기 위해 생략합니다.

튜토리얼 코스는 여기까지 입니다. 정규화, 데이터베이스 모델링, java/c++같은 언어로 데이터베이스와 소통하기 등 많은 것들이 남아있지만 차차 알아봅시다.
