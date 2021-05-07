---
title: "(4) : CRUD commands, SELECT"
date: 2021-05-07 00:00:00
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

아마 대부분의 경우, 데이터베이스/테이블을 생성하거나 레코드를 추가하거나 하는 일은 많이 없습니다. 하지만 SELECT를 적절히 활용해 원하는 데이터를 찾아야할 일은 많이 있을 겁니다.

[MySQL doc](https://dev.mysql.com/doc/refman/8.0/en/select.html)을 참고하면, SELECT의 정확한 문법은 다음과 같습니다.

```sql
SELECT
    [ALL | DISTINCT | DISTINCTROW ]
    [HIGH_PRIORITY]
    [STRAIGHT_JOIN]
    [SQL_SMALL_RESULT] [SQL_BIG_RESULT] [SQL_BUFFER_RESULT]
    [SQL_NO_CACHE] [SQL_CALC_FOUND_ROWS]
    select_expr [, select_expr] ...
    [into_option]
    [FROM table_references
      [PARTITION partition_list]]
    [WHERE where_condition]
    [GROUP BY {col_name | expr | position}, ... [WITH ROLLUP]]
    [HAVING where_condition]
    [WINDOW window_name AS (window_spec)
        [, window_name AS (window_spec)] ...]
    [ORDER BY {col_name | expr | position}
      [ASC | DESC], ... [WITH ROLLUP]]
    [LIMIT {[offset,] row_count | row_count OFFSET offset}]
    [into_option]
    [FOR {UPDATE | SHARE}
        [OF tbl_name [, tbl_name] ...]
        [NOWAIT | SKIP LOCKED]
      | LOCK IN SHARE MODE]
    [into_option]

into_option: {
    INTO OUTFILE 'file_name'
        [CHARACTER SET charset_name]
        export_options
  | INTO DUMPFILE 'file_name'
  | INTO var_name [, var_name] ...
}
```

- `[ ]` 은 생략가능한 키워드들 입니다.
- `|`은 여러개의 키워드 중에 하나를 고를 수 있다는 것입니다. `[ALL | DISTINCT | DISTINCTROW ]`에서 다 생략하거나, 셋 중 하나를 고를 수 있습니다.

>이전의 CREATE, INSERT 커맨드도 한 번 doc을 찾아보세요.

본 항목에서는 몇가지 경우만 시도해 봅시다.

## 특정 attribute들만 보기

예를 들어 title, author, profile만 보고 싶다면 다음과 같이 SELECT를 활용합니다.

```sql
mysql> SELECT title,author,profile FROM topic;
+------------+--------+--------------------------+
| title      | author | profile                  |
+------------+--------+--------------------------+
| MySQL      | egoing | developer                |
| ORACLE     | egoing | developer                |
| SQL Server | duru   | database administrator   |
| PostgreSQL | taeho  | data scientist,developer |
| MongoDB    | egoing | developer                |
+------------+--------+--------------------------+
5 rows in set (0.00 sec)
```

*를 활용하면 모든 attribute를 볼 수 있습니다.

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

## ORDER : 순서대로 보기

예를 들어 author값의 내림차순으로 보고 싶다면 다음과 같이 커맨드를 입력합니다.

```sql
mysql> SELECT id,title,author,profile FROM topic ORDER BY author;
+----+------------+--------+--------------------------+
| id | title      | author | profile                  |
+----+------------+--------+--------------------------+
|  3 | SQL Server | duru   | database administrator   |
|  1 | MySQL      | egoing | developer                |
|  2 | ORACLE     | egoing | developer                |
|  5 | MongoDB    | egoing | developer                |
|  4 | PostgreSQL | taeho  | data scientist,developer |
+----+------------+--------+--------------------------+
5 rows in set (0.00 sec)
```

오름차순으로 보고 싶다면 author 뒤에 DESC를 추가합니다.

```sql
mysql> SELECT id,title,author,profile FROM topic ORDER BY author DESC;
+----+------------+--------+--------------------------+
| id | title      | author | profile                  |
+----+------------+--------+--------------------------+
|  4 | PostgreSQL | taeho  | data scientist,developer |
|  1 | MySQL      | egoing | developer                |
|  2 | ORACLE     | egoing | developer                |
|  5 | MongoDB    | egoing | developer                |
|  3 | SQL Server | duru   | database administrator   |
+----+------------+--------+--------------------------+
5 rows in set (0.00 sec)
```

약간의 응용을 해서, **author를 기준으로 내림차순**하면서, 같은 author의 경우 **id를 기준으로 오름차순**하려면 다음과 같이 하면 됩니다.

```sql
mysql> SELECT id,title,author,profile FROM topic ORDER BY author, id DESC;
+----+------------+--------+--------------------------+
| id | title      | author | profile                  |
+----+------------+--------+--------------------------+
|  3 | SQL Server | duru   | database administrator   |
|  5 | MongoDB    | egoing | developer                |
|  2 | ORACLE     | egoing | developer                |
|  1 | MySQL      | egoing | developer                |
|  4 | PostgreSQL | taeho  | data scientist,developer |
+----+------------+--------+--------------------------+
5 rows in set (0.00 sec)
```

## WHERE : 조건에 해당하는 것만 보기

author가 egoing인 것만 보려면 `WHERE author='egoing'`을 추가하면 됩니다.

```sql
mysql> SELECT id,title,author,profile FROM topic WHERE author='egoing';
+----+---------+--------+-----------+
| id | title   | author | profile   |
+----+---------+--------+-----------+
|  1 | MySQL   | egoing | developer |
|  2 | ORACLE  | egoing | developer |
|  5 | MongoDB | egoing | developer |
+----+---------+--------+-----------+
3 rows in set (0.00 sec)
```

id 내림차순으로 보려면 ORDER를 WHERE 다음에 추가해야합니다.

```sql
mysql> SELECT id,title,author,profile FROM topic WHERE author='egoing' ORDER BY id DESC;
+----+---------+--------+-----------+
| id | title   | author | profile   |
+----+---------+--------+-----------+
|  5 | MongoDB | egoing | developer |
|  2 | ORACLE  | egoing | developer |
|  1 | MySQL   | egoing | developer |
+----+---------+--------+-----------+
3 rows in set (0.00 sec)
```

`WHERE {조건문}`으로 다양한 조건을 걸 수 있습니다.

```sql
mysql> SELECT * FROM topic WHERE created > '2020-01-01';
+----+------------+--------------------+---------------------+--------+--------------------------+
| id | title      | description        | created             | author | profile                  |
+----+------------+--------------------+---------------------+--------+--------------------------+
|  2 | ORACLE     | Oracle is...       | 2021-05-06 18:17:04 | egoing | developer                |
|  3 | SQL Server | SQL Server is...   | 2021-05-06 18:27:09 | duru   | database administrator   |
|  4 | PostgreSQL | PostgreSQL is  ... | 2021-05-06 18:27:24 | taeho  | data scientist,developer |
|  5 | MongoDB    | MongoDB is  ...    | 2021-05-06 18:27:43 | egoing | developer                |
+----+------------+--------------------+---------------------+--------+--------------------------+
4 rows in set (0.00 sec)
```

## LIMIT : 몇개만 보여주기

예제와는 달리 실제에서는 데이터베이스 테이블에 몇 만, 몇 십만개의 레코드가 있을 수도 있습니다. 조건에 맞는 레코드만 출력하더라도 개수가 많고 오래걸릴 수 있습니다.

몇 개만 찾고 끝내고 싶다면 `LIMIT {숫자}` 키워드를 이용하세요.

```sql
mysql> SELECT * FROM topic WHERE created > '2020-01-01' LIMIT 2;
+----+------------+------------------+---------------------+--------+------------------------+
| id | title      | description      | created             | author | profile                |
+----+------------+------------------+---------------------+--------+------------------------+
|  2 | ORACLE     | Oracle is...     | 2021-05-06 18:17:04 | egoing | developer              |
|  3 | SQL Server | SQL Server is... | 2021-05-06 18:27:09 | duru   | database administrator |
+----+------------+------------------+---------------------+--------+------------------------+
2 rows in set (0.00 sec)
```

## FROM 생략가능

doc을 보면 FROM이 생략가능하다고 나옵니다.

```sql
mysql> SELECT 1+1, 'Hi, ...';
+-----+---------+
| 1+1 | Hi, ... |
+-----+---------+
|   2 | Hi, ... |
+-----+---------+
1 row in set (0.00 sec)
```

>별 의미 없는 부분입니다. 이렇게 되구나 하고 넘어가세요.

다음에는 DELETE에 대해 알아보겠습니다.
