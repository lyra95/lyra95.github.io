---
title: "(3) : CRUD commands"
date: date()
#draft: true
categories: [MySQL, DB]
tags: [mysql, db, crud]
weight: 3
---

>본 항목은 [생활코딩](https://opentutorials.org/course/3161/19537)을 참고하였습니다.

CRUD란 Create, Read, Update, Delete의 앞글자만 따온 것으로, 데이터베이스의 기본 기능들입니다. sql이라는 언어가 이런 기능들을 어떤 문법으로 지원하는지 봅시다.

[이전 포스트](/docs/mysqltutorial/mysql-2/)에서 tutorial database에 접속했습니다.<!--path dependency-->

다음과 같은 정보들이 있다고 합시다:

| id| title      | description       | created    | author | profile                   |
|:--|:-----------|:------------------|:-----------|:-------|--------------------------:|
| 1 | MySQL      | MySQL is ...      | 2018-01-10 | egoing | developer                 |
| 2 | ORACLE     | Oracle is ...     | 2018-01-15 | egoing | developer                 |
| 3 | SQL Server | SQL Server is ... | 2018-01-18 | duru   | database administrator    |
| 4 | PostgreSQL | PostgreSQL is ... | 2018-01-20 | taeho  | data scientist, developer |
| 5 | MongoDB    | MongoDB is ...    | 2018-01-30 | egoing | developer                 |

이 정보들을 sql을 통해 데이터베이스에 저장하려고 합니다.

## Create Table

다음 명령어를 통해 topic이라는 이름을 가진 table을 생성합니다.

```sql
mysql> CREATE TABLE topic(
    -> id INT(11) NOT NULL AUTO_INCREMENT,
    -> title VARCHAR(100) NOT NULL,
    -> description TEXT NULL,
    -> created DATETIME NOT NULL,
    -> author VARCHAR(15) NULL,
    -> profile VARCHAR(200) NULL,
    -> PRIMARY KEY(id)
    -> );
```

- id, title, ... 을 attribute(속성)으로 갖는 테이블을 생성하였습니다.
- INT, VARCHAR, TEXT, 등등은 해당 칸에 들어갈 데이터 타입을 의미합니다.
- NOT NULL, NULL 은 해당 칸에 앞으로 들어갈 데이터들이 NULL이 될 수 있는 지 정하는 명령어 입니다. NOT NULL일 경우 NULL 데이터가 올 수 없게 하겠다는 뜻 입니다.
- PRIMARY KEY(id)의 의미는 id attribute를 식별자로 쓰겠다는 의미 입니다. 앞으로 저장될 데이터들은 id 값과 일대일 대응이 됩니다.
- AUTO_INCREMENT 키워드의 의미는, 데이터가 차곡차곡 들어올 때마다 알아서 id 값을 1씩 키워주겠다는 의미입니다.

>각 타입에 대한 자세한 설명은 [MySQL docs](https://dev.mysql.com/doc/refman/8.0/en/data-types.html)을 확인하세요.

> 타입(숫자)에서 보통 숫자는 size를 의미합니다만, INT(11)의 경우에는 의미가 다릅니다: 검색해서 결과를 볼 때 11건까지만 보겠다는 의미입니다.

이만큼의 커맨드로 아래와 같은 테이블을 생성하는 일을 해낸 것 입니다:

| id| title      | description       | created    | author | profile                   |
|:--|:-----------|:------------------|:-----------|:-------|--------------------------:|

`SHOW TABLES;` 커맨드를 입력해 현재 데이터베이스(=tutorial)에 있는 테이블 목록을 볼 수 있습니다.

```sql
mysql> SHOW TABLES;
+--------------------+
| Tables_in_tutorial |
+--------------------+
| topic              |
+--------------------+
1 row in set (0.01 sec)

mysql>
```

## ADD RECORD (1)

다음 한 줄의 데이터를 추가해봅시다.
| 1 | MySQL      | MySQL is ...      | 2018-01-10 | egoing | developer                 |
|:--|:-----------|:------------------|:-----------|:-------|--------------------------:|

>이런 한 줄의 데이터를 **Record**라고 부릅니다.

레코드를 추가하기전에, topic 테이블의 attribute 타입이 어떻게 구성되어 있는 지 확인합시다.

```sql
mysql> DESC topic;
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int          | NO   | PRI | NULL    | auto_increment |
| title       | varchar(100) | NO   |     | NULL    |                |
| description | text         | YES  |     | NULL    |                |
| created     | datetime     | NO   |     | NULL    |                |
| author      | varchar(15)  | YES  |     | NULL    |                |
| profile     | varchar(200) | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
6 rows in set (0.00 sec)
```

>보통의 경우 남이 생성한 테이블에 레코드를 추가할 일이 더 많으므로, 이렇게 타입을 확인하고 레코드를 추가해야합니다.

다음 커맨드로 레코드를 추가할 수 있습니다.

```sql
mysql> INSERT INTO topic (id, title, description, created, author, profile)
    -> VALUES(1, 'MySQL', 'MySQL is ...', '2018-01-10', 'egoing', 'developer');
Query OK, 1 row affected (0.01 sec)
```

>엔터를 입력해서 보기 편하게 여러줄로 입력할 수 있습니다.

제대로 레코드가 추가되었는지 확인해 봅시다.

```sql
mysql> SELECT * FROM topic;
+----+-------+--------------+---------------------+--------+-----------+
| id | title | description  | created             | author | profile   |
+----+-------+--------------+---------------------+--------+-----------+
|  1 | MySQL | MySQL is ... | 2018-01-10 00:00:00 | egoing | developer |
+----+-------+--------------+---------------------+--------+-----------+
1 row in set (0.00 sec)
```

## ADD Record (2)

일부의 attribute만 정해서 레코드를 추가할 수 있습니다.

```sql
mysql> INSERT INTO topic (title, created)
    -> VALUES('ORACLE', NOW());
Query OK, 1 row affected (0.01 sec)
```

나머지 attribute에는 디폴트값으로 정해집니다.

- NOT NULL이면서 NULL이 디폴트값인 attribute는 레코드를 추가할 때 디폴트가 들어가게 하면 안 됩니다.

- id의 경우 AUTO_INCREMENT가 알아서 id값에 2를 부여해주었습니다.
- `NOW()`는 현재 시간으로 정해주는 키워드입니다.

같은 방법으로 나머지 레코드들도 추가합니다.

```sql
mysql> SELECT * FROM topic;
+----+------------+--------------+---------------------+--------+-----------+
| id | title      | description  | created             | author | profile   |
+----+------------+--------------+---------------------+--------+-----------+
|  1 | MySQL      | MySQL is ... | 2018-01-10 00:00:00 | egoing | developer |
|  2 | ORACLE     | NULL         | 2021-05-06 18:17:04 | NULL   | NULL      |
|  3 | SQL Server | NULL         | 2021-05-06 18:27:09 | NULL   | NULL      |
|  4 | PostgreSQL | NULL         | 2021-05-06 18:27:24 | NULL   | NULL      |
|  5 | MongoDB    | NULL         | 2021-05-06 18:27:43 | NULL   | NULL      |
+----+------------+--------------+---------------------+--------+-----------+
5 rows in set (0.00 sec)
```

## Update Table

ORACLE 레코드를 수정합니다.

```sql
mysql> UPDATE topic SET description='Oracle is...',
    -> author='egoing',
    -> profile='developer'
    -> WHERE id=2;
Query OK, 1 row affected (0.01 sec)
Rows matched: 1  Changed: 1  Warnings: 0
```

- `{attribute_name}={value}` 형식입니다.
- `WHERE 조건문`을 통해 수정할 대상을 정할 수 있습니다.

수정이 제대로 됬는지 확인합니다.

```sql
mysql> SELECT * FROM topic WHERE id=2;
+----+--------+--------------+---------------------+--------+-----------+
| id | title  | description  | created             | author | profile   |
+----+--------+--------------+---------------------+--------+-----------+
|  2 | ORACLE | Oracle is... | 2021-05-06 18:17:04 | egoing | developer |
+----+--------+--------------+---------------------+--------+-----------+
1 row in set (0.00 sec)
```

>SELECT의 자세한 설명은 다음 포스트에서 설명합니다.

나머지도 같은 방법으로 수정해 줍니다.
