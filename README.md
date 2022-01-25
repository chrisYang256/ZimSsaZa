![header](https://capsule-render.vercel.app/api?type=Slice&color=auto&height=350&section=header&text=%20%20ZimSsaZa&fontSize=90&textBg=true)

<br/>
<br/>

# 🔖 프로젝트 소개
<br/>

## ▶︎ 개 요 
이사하려는 사람과 기사님을 중개해주는 "짐싸" 어플리케이션을 모티브로 제작한 개인 NestJS Backend Project입니다.

실재로 이사를 진행하며 해당 어플을 사용하였었고 그 기억이 좋아서 만들어 보았습니다.

세상을 이롭게 만들어주는 어플리케이션을 개발해 주셔서 감사드리는 마음을 짐싸 관계자 분들께 전하고 싶습니다.

<br/>
<br/>

## ▶︎ 참고 범위
어플리케이션을 통해서는 사용자 입장에서의 과정만을 알 수 있었습니다.

따라서 기사님 측에서 어떠한 방식으로 진행되는지, 매칭이 어떻게 이루어지는지는 __주관적인 구상에 의하여 설계 / 제작__ 하였습니다.

<br/>
<br/>

## ▶︎ 개발 목표 / 핵심 기능
일반적인 커머스 앱과는 조금 다른, 해당 어플리케이션의 특징인 __고객님과 기사님이 상호작용하며 생겨나는 흐름과 이 흐름이 만들어내는 하나의 순환__ 을 구현하고자 하였습니다.

<br/>

이삿짐 생성(고객) → 견적 신청(고객) → 관할구역 견적요청 확인(기사) → 견적서 제출(기사) → 견적서 리스트 확인(고객) → 견적(기사) 선택 → 본인 견적서 선택 확인(기사) → 고객님 / 기사님 각각 이사완료 확인으로 시스템상 종결 처리.

몇 가지 생략된 부분이 있지만 위와 같은 싸이클을 거치며 진행 상황에 따라 특정 데이터들을 변경시키면서 정확히 구분된 절차를 진행합니다.

그리고 순환 과정에서 발생하는 각종 이벤트들을 체크하여 메시지 발송 등의 적절한 대응을 합니다.

디테일한 과정은 하단에서 설명과 함께 풀어가며 보여드리겠습니다.

<br/>

최소한의 것으로 최대한의 활용을 해보자는 슬로건을 품고 진행하였으며, 주니어 개발자가 발악하며 만든 결과물이므로 여러 미흡한 부분에 대해서 너그러운 마음으로 이해해주셨으면 합니다.

<br/>
<br/>

## ▶︎ 개발기간 / 사용기술
<br/>

### - 개발기간: 2022.01.03 ~ 01.22 (20일)
<br/>

### - 사용 기술
<div align="center">
<img src="https://img.shields.io/badge/NestJs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/TypeORM-18A497?style=for-the-badge&logo=기술스택아이콘&logoColor=white">
<!-- <img src="https://img.shields.io/badge/jest-C21325?style=for-the-badge&logo=jest&logoColor=white"> -->
<img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white">
<img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<img src="https://img.shields.io/badge/cron-945DD6?style=for-the-badge&logo=기술스택아이콘&logoColor=white">
<img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
</div>

<br/>
<br/>
<br/>

# 🔌 설치 및 실행
<br/>

### 🤗 로컬 테스트를 기준으로 작성하였습니다!

<br/>
<br/>

## 1. Create Database

```bash
# MySQL이 설치되어 있고 접속해 있다는 가정 하에 다음 명령어를 입력합니다.

#  해당 프로젝트와 연동할 Database를 생성합니다.
mysql> create database ZimSsaZa character set utf8mb4 collate utf8mb4_general_ci;
```

<br/>

## 2. Get Project

```bash
# github에서 프로젝트를 clone합니다.
$ git clone https://github.com/chrisYang256/ZimSsaZa.git

# 프로젝트 폴더로 이동합니다.
$ cd ZimSsaZa
```

<br/>

## 3. Installation

```bash
# 프로젝트에서 사용되는 npm package들을 설치합니다.
$ npm install
```

## 4. Configuration

```bash
# 프로젝트 root(최상위)경로에서 dotenv 파일을 생성합니다.
$ touch .env

# .env파일을 열고 아래 내용을 입력/저장합니다.
# DB_PASSWORD와 BD_USERNAME는 <>까지 삭제하시고 본인의 것을 사용하시면 됩니다.
# DB_DATABASE는 1번에서 안내한대로 작성하지 않으셨다면 본인이 설정하신 이름으로 바꾸시면 됩니다.
DB_HOST=localhost
DB_PORT=3306
DB_PASSWORD=<본인의 database 비밀번호>
DB_DATABASE=ZimSsaZa
BD_USERNAME=<본인의 database 유저 이름>

JWT_SECRET=holla
JWT_EXPIRESIN=365d
```

<br/>

## 5. Insert Mock data

```bash
# !주의사항: 프로젝트 실행 중에 다음 명령어들을 입력하면 오작동의 원인이 됩니다.

# 프로젝트 Database를 sync합니다.
$ npm run schema:sync

# 설정해둔 Mock data를 Database에 자동으로 입력합니다.
$ npm run seed:run

# 필요한 경우 Table들을 제거합니다.
$ npm run schema:drop
```

<br/>

## 6. Running the app

```bash
# watch mode로 프로젝트를 실행합니다.
$ npm run start:dev
```

<br/>

## 7. Running the Swagger

```bash
# 웹브라우저의 주소 입력란에 swagger 접속 주소를 입력합니다.
# 프로젝트의 기본 port는 3000이며 변경 시 주소에서도 똑같이 변경해 주셔야합니다.
http://localhost:3000/api/
```

<br/>
<br/>
<br/>

# 📍 프로젝트 구성

### ▶︎ ERD


<br/>
<br/>

### ▶︎ Module


<br/>
<br/>
<br/>

# ⚙️ api 테스트

본 프로젝트를 처음으로 접하고 테스트를 경험하는 입장에서 테스트 과정을 설명해 보려 합니다.

<br/>

어떤 단계에서는 특정 조건이 만족되어야 하는 시스템이기 때문에 테스트하는 입장에서 일일이 10명의 기사님 계정을 만들어서 회원가입/로그인을 하고 또 10건의 견적서를 내는 등의 번거로움을 드리는 것은 아니다 싶었습니다.

그래서 테스트를 2단계로 나누었습니다.

<br/>

'이사준비 테스트'에서는 유저님과 기사님이 만나기 전 까지의 과정을 다루었습니다.

'상호작용 테스트'에서는 상호작용하는 과정을 다루었습니다.

<br/>

! 상호작용 테스트를 직접 해보시려면 꼭 위에서 제시한 설치/실행에서 5번 항목의 'Insert Mock data'를 완료하셔야 합니다.

<br/>
<br/>

## 🧳 이사준비 테스트

회원가입에서 견적서 제출하기(고객님),  관할구역 견적서 보기(기사님) 까지의 과정입니다.

<br/>

### ▶︎ 고객님 이사준비

## ...작성 중

<br/>
<br/>

### ▶︎ 기사님 업무준비

<br/>

기사 등록 후 첫 번째 이사를 잘 마쳐보자 퀘스트


<br/>
<br/>
<br/>


## 🚚 상호작용 테스트

고객님이 견적서를 선택하고 이사가 종료될 때 까지의 과정입니다.

