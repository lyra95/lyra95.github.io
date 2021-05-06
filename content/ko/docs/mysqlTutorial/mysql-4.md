---
title: "(4) : CRUD commands, SELECT"
date: date()
#draft: true
categories: [MySQL, DB]
tags: [mysql, db, crud]
weight: 4
---

>본 항목은 [생활코딩](https://opentutorials.org/course/3161/19537)을 참고하였습니다.

[이전 포스트](/docs/mysqltutorial/mysql-3/)에서 topic 테이블을 생성하고 레코드들을 추가했습니다.<!--path dependency-->

```sql
mysql> SELECT * FROM topic;
+----+------------+--------------------+---------------------+--------+--------------------------+
| id | title      | description        | created             | author | profile                  |
+----+------------+--------------------+---------------------+--------+--------------------------+
|  1 | MySQL      | MySQL is ...       | 2018-01-10 00:00:00 | egoing | developer                |
|  2 | ORACLE     | Oracle is...       | 2021-05-06 18:17:04 | egoing | developer                |
|  3 | SQL Server | SQL Server is...   | 2021-05-06 18:27:09 | duru   | database administrator   |
|  4 | PostgreSQL | PostgreSQL is  ... | 2021-05-06 18:27:24 | taeho  | data scientist,developer |
|  5 | MongoDB    | MongoDB is  ...    | 2021-05-06 18:27:43 | egoing | developer                |
+----+------------+--------------------+---------------------+--------+--------------------------+
5 rows in set (0.00 sec)
```