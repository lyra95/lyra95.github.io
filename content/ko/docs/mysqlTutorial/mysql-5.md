---
title: "(5) : CRUD commands, DELETE"
date: date()
#draft: true
categories: [MySQL, DB]
tags: [mysql, db, crud]
weight: 5
---

DELETE는 어렵지 않습니다.

id값이 3인 레코드를 지워봅시다.

```sql
mysql> DELETE FROM topic WHERE id=3;
Query OK, 1 row affected (0.00 sec)
```

> **CAUTION : WHERE을 깜빡하면 모든 레코드가 지워집니다!**

SELECT로 테이블을 확인해봅시다.

```sql
mysql> SELECT * FROM topic;
+----+------------+--------------------+---------------------+--------+--------------------------+
| id | title      | description        | created             | author | profile                  |
+----+------------+--------------------+---------------------+--------+--------------------------+
|  1 | MySQL      | MySQL is ...       | 2018-01-10 00:00:00 | egoing | developer                |
|  2 | ORACLE     | Oracle is...       | 2021-05-06 18:17:04 | egoing | developer                |
|  4 | PostgreSQL | PostgreSQL is  ... | 2021-05-06 18:27:24 | taeho  | data scientist,developer |
|  5 | MongoDB    | MongoDB is  ...    | 2021-05-06 18:27:43 | egoing | developer                |
+----+------------+--------------------+---------------------+--------+--------------------------+
4 rows in set (0.00 sec)
```

복습할 겸 이후에 레코드를 추가하면 어떻게 되나 봅시다.
>AUTO_INCREMENT가 어떻게 적용되나 봅시다.

```sql
mysql> INSERT INTO topic (title,created) VALUES('JO',NOW());
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM topic;
+----+------------+--------------------+---------------------+--------+--------------------------+
| id | title      | description        | created             | author | profile                  |
+----+------------+--------------------+---------------------+--------+--------------------------+
|  1 | MySQL      | MySQL is ...       | 2018-01-10 00:00:00 | egoing | developer                |
|  2 | ORACLE     | Oracle is...       | 2021-05-06 18:17:04 | egoing | developer                |
|  4 | PostgreSQL | PostgreSQL is  ... | 2021-05-06 18:27:24 | taeho  | data scientist,developer |
|  5 | MongoDB    | MongoDB is  ...    | 2021-05-06 18:27:43 | egoing | developer                |
|  6 | JO         | NULL               | 2021-05-06 20:14:49 | NULL   | NULL                     |
+----+------------+--------------------+---------------------+--------+--------------------------+
5 rows in set (0.00 sec)
```

3을 건너뛰고 6이 되었습니다. id attribute의 역할은 레코드와 일대일 대응이 되는 식별자입니다. 중복이 없는 한 비어있는 건 괜찮습니다.

## 마치며

여기까지해서 MySQL의 문법을 대체적으로 알아보았습니다. 사실 터미널이 아닌 GUI로 MySQL을 사용할 수 있습니다. (무료 라이센스 프로그램으로 MySQL Workbench가 있습니다.)
하지만 기본적인 기능에 집중하기 위해 터미널에서 커맨드를 통해 mysql을 다루는 방법을 알아보았습니다.
