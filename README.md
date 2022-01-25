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

## ▶︎ 개발기간 / 사용기술
<br/>

#### - 개발기간: 2022.01.03 ~ 01.22 (20일)
<br/>

### - 사용 기술
<div align="center">
<img src="https://img.shields.io/badge/NestJs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/TypeORM-18A497?style=for-the-badge&logo=기술스택아이콘&logoColor=white">
<img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white">
<img src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<img src="https://img.shields.io/badge/cron-945DD6?style=for-the-badge&logo=기술스택아이콘&logoColor=white">
<img src="https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white">
<!-- <img src="https://img.shields.io/badge/jest-C21325?style=for-the-badge&logo=jest&logoColor=white"> -->
</div>

<br/>
<br/>

## ▶︎ 기 타
어플리케이션을 통해서는 사용자 입장에서의 과정만을 알 수 있습니다.

따라서 기사님 측에서 어떠한 방식으로 진행되는지, 매칭이 어떻게 이루어지는지는 __개인적인 구상에 의하여 설계하고 제작__ 하였습니다.

<br/>
<br/>
<br/>

# 🔌 설치 및 실행
<br/>

### 🤗 로컬환경을 기준으로 작성하였습니다!

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


# 🎬 시나리오