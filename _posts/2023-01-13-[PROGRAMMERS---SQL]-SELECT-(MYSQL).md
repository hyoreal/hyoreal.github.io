---

layout: post

title: "[PROGRAMMERS - SQL ] SELECT  (MYSQL)"

comments: true

categories: [Database, SQL]

tags: [SQL, Database]

---

### **Level 1**

> 🔗 프로그래머스 SQL 평균 일일 대여 요금 구하기 https://school.programmers.co.kr/learn/courses/30/lessons/151136

**문제**

CAR_RENTAL_COMPANY_CAR 테이블에서 자동차 종류가 'SUV'인 자동차들의 평균 일일 대여 요금을 출력하는 SQL문을 작성해주세요. 이때 평균 일일 대여 요금은 소수 첫 번째 자리에서 반올림하고, 컬럼명은 AVERAGE_FEE 로 지정해주세요.



**풀이**

sql문법에서 평균을 구하는 함수는 **AVG()** **함수**이고, 반올림 함수는 **ROUND() 함수**

결과값을 컬럼에 별칭으로 주는 키워드는 **AS 컬럼명** 이다.



```sql
SELECT ROUND(AVG(DAILY_FEE)) AS AVERAGE_FEE
FROM CAR_RENTAL_COMPANY_CAR 
WHERE CAR_TYPE = "SUV";
```

------

> 🔗 프로그래머스 SQL 흉부외과 또는 일반외과 의사 목록 출력하기 https://school.programmers.co.kr/learn/courses/30/lessons/132203

**문제**

DOCTOR 테이블에서 진료과가 흉부외과(CS)이거나 일반외과(GS)인 의사의 이름, 의사ID, 진료과, 고용일자를 조회하는 SQL문을 작성해주세요. 이때 결과는 고용일자를 기준으로 내림차순 정렬하고, 고용일자가 같다면 이름을 기준으로 오름차순 정렬해주세요.



**풀이**

WHERE, ORDER BY를 활용하여 쉽게 구성했으나 HIRE_YMD의 날짜 포맷이 달랐다.

요구하는 포맷은 **"YYYY-MM-DD"** 였지만 나는 **"YYYY-MM-DD h : m : s"** 포맷으로 나와버렸다.

날짜 포맷을 원하는 형식으로 지정하는 함수는 **DATE_FORMAT(컬럼명, "구분기호")** 였고 이를 활용했다.



구분기호

| 구분기호 | 역할                       | 구분기호 | 역할                                          |
| -------- | -------------------------- | -------- | --------------------------------------------- |
| %Y       | 4자리 연도                 | %k       | 24시간 표기법 0 ~ 23                          |
| %y       | 2자리 연도                 | %l       | 12시간 표기법 1 ~ 12                          |
| %M       | 영문 월(ex. July)          | %p       | AM/PM 표시                                    |
| %m       | 숫자 월(ex. 07)            | %r       | hh:mm:ss AM/PM 형식                           |
| %D       | 영문 일자(ex. 1st)         | %S       | 초 00 ~ 59                                    |
| %d       | 숫자 일자(ex. 01)          | %s       | 초 00 ~ 59                                    |
| %a       | 요일 명을 Sun to Sat       | %T       | 24시간 표기법 hh:mm:ss                        |
| %b       | 월을 Jan to Dec            | %U       | 일요일이 첫째날인 주 (00 ~ 53)                |
| %c       | 월을 0 ~ 12                | %u       | 월요일이 첫째날인 주 (00 ~ 53)                |
| %e       | 일자를 0 ~ 31              | %V       | 일요일이 첫째날인 주 (01 ~ 53) %X와 함께 사용 |
| %f       | 마이크로초 000000 ~ 999999 | %v       | 월요일이 첫째날인 주 (01 ~ 53) %x와 함께 사용 |
| %H       | 시간을 00 ~ 23             | %W       | 요일을 풀네임으로                             |
| %h       | 시간을 00 ~ 12             | %w       | 일요일 = 0 ~ 토요일 = 6                       |
| %I       | 시간을 00 ~ 12             | %X       | 일주일의 시작을 일요일로                      |
| %i       | 분 00 ~ 59                 | %x       | 일주일의 시작을 월요일로                      |
| %j       | 날짜(연 기준) 001 ~ 366    | %Y       | 년도 4자리 표현                               |
|          |                            | %y       | 년도 2자리 표현                               |



```sql
SELECT DR_NAME, 
       DR_ID, 
       MCDP_CD, 
       DATE_FORMAT(HIRE_YMD, "%Y-%M-%d")
FROM DOCTOR
WHERE MCDP_CD = "CS" OR MCDP_CD = "GS"
ORDER BY HIRE_YMD DESC, DR_NAME ASC;
```

------

> 🔗 프로그래머스 SQL 조건에 맞는 도서리스트 출력하기 https://school.programmers.co.kr/learn/courses/30/lessons/144853?language=mysql

**문제**

BOOK 테이블에서 2021년에 출판된 '인문' 카테고리에 속하는 도서 리스트를 찾아서 도서 ID(BOOK_ID), 출판일 (PUBLISHED_DATE)을 출력하는 SQL문을 작성해주세요.
결과는 출판일을 기준으로 오름차순 정렬해주세요.



**풀이**

DATE_FORMAT을 잘 이용하면 되는 문제였다.



```sql
SELECT BOOK_ID, DATE_FORMAT(PUBLISHED_DATE, "%Y-%m-%d")
FROM BOOK
WHERE DATE_FORMAT(PUBLISHED_DATE, "%Y") = "2021"
AND CATEGORY = "인문"
ORDER BY PUBLISHED_DATE;
```

------

> 🔗 프로그래머스 SQL 인기있는 아이스크림 https://school.programmers.co.kr/learn/courses/30/lessons/133024

**문제**

상반기에 판매된 아이스크림의 맛을 총주문량을 기준으로 내림차순 정렬하고 총주문량이 같다면 출하 번호를 기준으로 오름차순 정렬하여 조회하는 SQL 문을 작성해주세요.



**풀이**

정말 기본중의 기본인 문제기에 설명할게 없다..



```sql
SELECT FLAVOR 
FROM FIRST_HALF 
ORDER BY TOTAL_ORDER DESC , SHIPMENT_ID ;
```

------

> 🔗 프로그래머스 SQL 강원도에 위치한 생산공장 목록 출력하기 https://school.programmers.co.kr/learn/courses/30/lessons/131112

**문제**

FOOD_FACTORY 테이블에서 강원도에 위치한 식품공장의 공장 ID, 공장 이름, 주소를 조회하는 SQL문을 작성해주세요. 이때 결과는 공장 ID를 기준으로 오름차순 정렬해주세요.



**풀이**

강원도 라는 문자열만 출력해야했는데 mysql에서 문자열 추출 함수가 **SUBSTR(), SUBSTRING()** 두가지가 있었다.

나는 SUBSTR()을 사용했다.

SUBSTR(컬럼명, 시작지점, 길이)

SUBSTRING(컬럼명, 시작지점, 길이)

길이를 입력하지 않으면 끝까지 추출한다. 



```sql
SELECT FACTORY_ID, 
       FACTORY_NAME, 
       ADDRESS 
FROM FOOD_FACTORY 
WHERE SUBSTR(ADDRESS, 1, 3) = "강원도";
```

------

> 🔗 프로그래머스 SQL 12세 이하인 여자 환자 목록 출력하기 https://school.programmers.co.kr/learn/courses/30/lessons/132201

**문제**

PATIENT 테이블에서 12세 이하인 여자환자의 환자이름, 환자번호, 성별코드, 나이, 전화번호를 조회하는 SQL문을 작성해주세요. 이때 전화번호가 없는 경우, 'NONE'으로 출력시켜 주시고 결과는 나이를 기준으로 내림차순 정렬하고, 나이 같다면 환자이름을 기준으로 오름차순 정렬해주세요.



**풀이**

sql에서 if null을 확인하는 함수는 **IFNULL(컬럼명, null일때 변환할 문자)** 이다.



```sql
SELECT PT_NAME,
       PT_NO, 
       GEND_CD, 
       AGE, IFNULL(TLNO, "NONE") 
FROM PATIENT
WHERE GEND_CD = "W" AND AGE <= 12
ORDER BY AGE DESC, PT_NAME ASC;
```

------

> 🔗 프로그래머스 SQL 과일로 만든 아이스크림 고르기 https://school.programmers.co.kr/learn/courses/30/lessons/133025

**문제**

상반기 아이스크림 총주문량이 3,000보다 높으면서 아이스크림의 주 성분이 과일인 아이스크림의 맛을 총주문량이 큰 순서대로 조회하는 SQL 문을 작성해주세요.



**풀이**

두 테이블을 같이 비교해야했다.

그래도 굉장히 기본적인 문제여서 어려운건 없었다.



```sql
SELECT FIRST_HALF.FLAVOR
FROM FIRST_HALF, ICECREAM_INFO
WHERE FIRST_HALF.FLAVOR = ICECREAM_INFO.FLAVOR 
AND FIRST_HALF.TOTAL_ORDER > 3000 
AND ICECREAM_INFO.INGREDIENT_TYPE = 'fruit_based'
ORDER BY TOTAL_ORDER DESC
```

------

> 🔗 프로그래머스 SQL 모든 레코드 조회하기 https://school.programmers.co.kr/learn/courses/30/lessons/59034

**문제**

동물 보호소에 들어온 모든 동물의 정보를 ANIMAL_ID순으로 조회하는 SQL문을 작성해주세요. SQL을 실행하면 다음과 같이 출력되어야 합니다.



**풀이**

풀이가 필요할까..? 모든 레코드를 조회할때는 *****를 사용한다.



```sql
SELECT * FROM ANIMAL_INS;
```

------

> 🔗 프로그래머스 SQL 역순 정렬하기 https://school.programmers.co.kr/learn/courses/30/lessons/59035

**문제**

동물 보호소에 들어온 모든 동물의 이름과 보호 시작일을 조회하는 SQL문을 작성해주세요. 이때 결과는 ANIMAL_ID 역순으로 보여주세요. SQL을 실행하면 다음과 같이 출력되어야 합니다.



**풀이**

역순은 **ORDER BY** 를 사용하여 **DESC**와 함께 적어주면 된다.



```sql
SELECT NAME, DATETIME
FROM ANIMAL_INS 
ORDER BY ANIMAL_ID DESC;
```

------

> 🔗 프로그래머스 SQL 아픈 동물 찾기 https://school.programmers.co.kr/learn/courses/30/lessons/59036

**문제**

동물 보호소에 들어온 동물 중 아픈 동물의 아이디와 이름을 조회하는 SQL 문을 작성해주세요. 이때 결과는 아이디 순으로 조회해주세요.



**풀이**

**WHERE**을 사용하여 조건을 붙일 수 있다.



```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE INTAKE_CONDITION = "Sick";
```

------

> 🔗 프로그래머스 SQL 어린 동물 찾기 https://school.programmers.co.kr/learn/courses/30/lessons/59037

**문제**

동물 보호소에 들어온 동물 중 젊은 동물의 아이디와 이름을 조회하는 SQL 문을 작성해주세요. 이때 결과는 아이디 순으로 조회해주세요.



**풀이**

ㅎㅎ.. 풀이가 필요할까?



```sql
SELECT ANIMAL_ID, NAME
FROM ANIMAL_INS
WHERE INTAKE_CONDITION != "Aged";
```

------

> 🔗 프로그래머스 SQL 동물의 아이디와 이름 https://school.programmers.co.kr/learn/courses/30/lessons/59403

**문제**

동물 보호소에 들어온 모든 동물의 아이디와 이름을 ANIMAL_ID순으로 조회하는 SQL문을 작성해주세요. SQL을 실행하면 다음과 같이 출력되어야 합니다.



**풀이**

생략..



```sql
SELECT ANIMAL_ID, NAME FROM ANIMAL_INS;
```

------

> 🔗 프로그래머스 SQL 여러 기준으로 정렬하기 https://school.programmers.co.kr/learn/courses/30/lessons/59404

**문제**

동물 보호소에 들어온 모든 동물의 아이디와 이름, 보호 시작일을 이름 순으로 조회하는 SQL문을 작성해주세요. 단, 이름이 같은 동물 중에서는 보호를 나중에 시작한 동물을 먼저 보여줘야 합니다.



**풀이**

**ORDER BY 첫번째기준, 두번째기준** 으로 작성하면 된다.



```sql
SELECT ANIMAL_ID, NAME, DATETIME
FROM ANIMAL_INS
ORDER BY NAME, DATETIME DESC;
```

------

> 🔗 프로그래머스 SQL 상위 n개 레코드 https://school.programmers.co.kr/learn/courses/30/lessons/59405

**문제**

동물 보호소에 가장 먼저 들어온 동물의 이름을 조회하는 SQL 문을 작성해주세요.



**풀이**

**Limit 구**를 사용하여 상위 n개의 컬럼을 조회할 수 있다.



```sql
SELECT NAME
FROM ANIMAL_INS 
ORDER BY DATETIME
LIMIT 1;
```

------

> 🔗 프로그래머스 SQL 조건에 맞는 회원 수 구하기 https://school.programmers.co.kr/learn/courses/30/lessons/131535

**문제**

USER_INFO 테이블에서 2021년에 가입한 회원 중 나이가 20세 이상 29세 이하인 회원이 몇 명인지 출력하는 SQL문을 작성해주세요.



**풀이**

**COUNT** 함수를 사용하여 개수를 셀 수 있다.

이번엔 **SUBSTRING**을 사용해보겠다.



```sql
SELECT COUNT(*)
FROM USER_INFO
WHERE SUBSTRING(JOINED, 1, 4)='2021' 
AND AGE >= 20 
AND AGE <= 29;
```

------

### **Level 2**

> 🔗 프로그래머스 SQL 3월에 태어난 여성 회원 목록 출력하기 https://school.programmers.co.kr/learn/courses/30/lessons/131120

**문제**

MEMBER_PROFILE 테이블에서 생일이 3월인 여성 회원의 ID, 이름, 성별, 생년월일을 조회하는 SQL문을 작성해주세요. 이때 전화번호가 NULL인 경우는 출력대상에서 제외시켜 주시고, 결과는 회원ID를 기준으로 오름차순 정렬해주세요.



**풀이**

**DATE_FORMAT** 과 **IS NOT NULL / IS NULL** 을 활용하였다.



```sql
SELECT MEMBER_ID, 
       MEMBER_NAME, 
       GENDER,
       DATE_FORMAT(DATE_OF_BIRTH, "%Y-%m-%d")
FROM MEMBER_PROFILE
WHERE DATE_FORMAT(DATE_OF_BIRTH, "%m") = "03"
AND GENDER = "W"
AND TLNO IS NOT NULL;
```

------

> 🔗 프로그래머스 SQL 재구매가 일어난 상품과 회원 리스트 구하기 https://school.programmers.co.kr/learn/courses/30/lessons/131536

**문제**

ONLINE_SALE 테이블에서 동일한 회원이 동일한 상품을 재구매한 데이터를 구하여, 재구매한 회원 ID와 재구매한 상품 ID를 출력하는 SQL문을 작성해주세요. 결과는 회원 ID를 기준으로 오름차순 정렬해주시고 회원 ID가 같다면 상품 ID를 기준으로 내림차순 정렬해주세요.



**풀이**

**GROUP BY**를 하여 동일한 회원이 구매한 데이터를 찾고, **COUNT(\*)**를 사용하여 2 이상인(재구매) 컬럼만 가져온다.



```sql
SELECT USER_ID, PRODUCT_ID
FROM ONLINE_SALE
GROUP BY USER_ID, PRODUCT_ID
HAVING COUNT(*) >= 2
ORDER BY USER_ID, PRODUCT_ID DESC;
```

------

### **Level 4**

> 🔗 오프라인/온라인 판매 데이터 통합하기 https://school.programmers.co.kr/learn/courses/30/lessons/131537

**문제**

ONLINE_SALE 테이블과 OFFLINE_SALE 테이블에서 2022년 3월의 오프라인/온라인 상품 판매 데이터의 판매 날짜, 상품ID, 유저ID, 판매량을 출력하는 SQL문을 작성해주세요. OFFLINE_SALE 테이블의 판매 데이터의 USER_ID 값은 NULL 로 표시해주세요. 결과는 판매일을 기준으로 오름차순 정렬해주시고 판매일이 같다면 상품 ID를 기준으로 오름차순, 상품ID까지 같다면 유저 ID를 기준으로 오름차순 정렬해주세요.



**풀이**

역시 레벨4라 그런지 확실히 어려웠다.

일단 **WITH 가상테이블명 AS**절을 사용하여 ONLINE_SALE 테이블과 OFFLINE_SALE테이블을 묶은 가상의 테이블을 만들어주었다.

ONLINE_SALE과 OFFLINE_SALE테이블은 **UNION ALL** 연산자를 사용하여 중복되는 레코드까지 합쳐주었다.
여기서 그냥 **UNION**을 사용할 경우 중복 레코드는 제거되니 꼭 **ALL** 을 사용하여야한다.

그리고 **BETWEEN**을 사용하여 2022년 3월 1일부터 3월 31일 사이에 있는 레코드만 불러왔다.



```sql
WITH ALL_SALES AS (
    SELECT SALES_DATE,
           PRODUCT_ID,
           USER_ID,
           SALES_AMOUNT
    FROM ONLINE_SALE
    UNION ALL
    SELECT SALES_DATE,
           PRODUCT_ID,
           NULL AS USER_ID,
           SALES_AMOUNT
    FROM OFFLINE_SALE
)

SELECT DATE_FORMAT(SALES_DATE, "%Y-%m-%d") AS SALES_DATE,
       PRODUCT_ID,
       USER_ID,
       SALES_AMOUNT
FROM ALL_SALES
WHERE SALES_DATE 
BETWEEN "2022-03-01" AND "2022-03-31"
ORDER BY SALES_DATE, PRODUCT_ID, USER_ID;
```

------

> 🔗 서울에 위치한 식당 목록 출력하기 https://school.programmers.co.kr/learn/courses/30/lessons/131118

**문제**

REST_INFO와 REST_REVIEW 테이블에서 서울에 위치한 식당들의 식당 ID, 식당 이름, 음식 종류, 즐겨찾기수, 주소, 리뷰 평균 점수를 조회하는 SQL문을 작성해주세요. 이때 리뷰 평균점수는 소수점 세 번째 자리에서 반올림 해주시고 결과는 평균점수를 기준으로 내림차순 정렬해주시고, 평균점수가 같다면 즐겨찾기수를 기준으로 내림차순 정렬해주세요.



**풀이**

**AVG** 로 평균을 구한 후 **ROUND()**를 통해 반올림을 시켜주었다.

**JOIN**으로 양 쪽 테이블에 해당값이 존재할때 **GROUP BY**로 묶어주었고 **WHERE** 조건을 붙여준 후 **ORDER BY**로 정렬해주었다.

```sql
SELECT R.REST_ID, 
       I.REST_NAME, 
       I.FOOD_TYPE, 
       I.FAVORITES, 
       I.ADDRESS, 
       ROUND(AVG(R.REVIEW_SCORE),2) AS SCORE
FROM REST_REVIEW R
JOIN REST_INFO I 
ON R.REST_ID = I.REST_ID
GROUP BY R.REST_ID
WHERE I.ADDRESS LIKE '서울%'
ORDER BY SCORE DESC, I.FAVORITES DESC
```