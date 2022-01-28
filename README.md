![header](https://capsule-render.vercel.app/api?type=Slice&color=auto&height=350&section=header&text=%20%20ZimSsaZa&fontSize=90&textBg=true)

<br/>
<br/>

# 🔖 프로젝트 소개
<br/>

### ▶︎ 개 요 
이사하려는 사람과 기사님을 중개해주는 "짐싸" 어플리케이션을 모티브로 제작한 개인 NestJS Backend Project입니다.

실재로 이사를 진행하며 해당 어플을 사용하였었고 그 기억이 좋아서 만들어 보았습니다.

세상을 이롭게 만들어주는 어플리케이션을 개발하신 짐싸 관계자 분들께 감사의 마음을 전하고 싶습니다.

알고있는 한도에서 최소한의 것으로 최대한의 활용을 해보는 것을 목표로 진행하였으며, 주니어 개발자가 발악하며 만든 결과물이므로 여러 미흡한 부분에 대해서는 너그러운 마음으로 봐주시기를 바랍니다.

<br/>
<br/>

### ▶︎ 참고 범위
어플리케이션을 통해서는 사용자 입장에서의 과정만을 알 수 있었습니다.

따라서 기사님 측에서 어떠한 방식으로 진행되는지, 매칭이 어떻게 이루어지는지는 __주관적인 구상에 의하여 설계/개발__ 하였으며 전체적인 원본의 맥락과 주요 특징들을 참고하였습니다.

<br/>
<br/>

### ▶︎ 프로젝트 구현 목표 / 특징
우선 해당 어플리케이션의 특징인 __고객님과 기사님이 상호작용하며 생겨나는 흐름과 이 흐름이 만들어내는 하나의 순환__ 을 구현하고자 하였습니다.

전반적인 시나리오는 다음과 같습니다.


이삿짐 생성(고객) → 견적 요청(고객) → 관할구역 견적요청 목록 확인(기사) → 특정 견적요청 상세보기(기사) → 견적서 제출(기사) → 견적서 리스트 확인(고객) → 견적서 선택(고객) → 본인 견적서 선택 확인(기사) → 이사완료 확인(고객/기사)으로 시스템상 종결 처리.

<br/>

그리고 각 단계를 진행하면서 상황에 따른 적절한 리액션이 발동되도록 장치들을 마련해 놓았으며 실재 어플리케이션 이용자들에 의해 발생할 수 있는 다양한 변수에 대응할 수 있도록 디테일한 부분들을 최대한 고려하여 설계하였습니다.

고객이 견적요청을 한 경우를 예로 들어보겠습니다.

요청 후 받은 견적이 총 10건에 도달하는 순간 해당 고객에게 알림메시지를 보내고 요청이 마무리되며, 이미 페이지에 진입하여 견적서를 작성중이던 기사들도 더이상 해당 요청건에 대해서는 견적서 제출을 할 수 없게되고 견적요청 리스트에서도 더이상 검색되지 않게 됩니다.

만약 견적서가 10건이 모이지 않는 경우 요청시간 이후 24시간이 지나면 고객에게 메시지를 발송하여 요청 결과를 확인하도록 알려주며 이 경우에도 더이상 견적요청 리스트에서 검색되지 않습니다.

고객은 동시에 한건 이상 견적요청을 할 수 없으며 기사는 한 건의 견적 요청에 한 건의 견적서만을 제출할 수 있습니다.

<br/>
<br/>

### ▶︎ Modeling
![modeling](https://user-images.githubusercontent.com/89192083/151122389-0a01f28d-ca4b-4fe1-afbc-e7a1fab66a88.png)

<br/>
<br/>

### ▶︎ 개발기간 / 사용기술

- 개발기간: 2022.01.03 ~ 01.22 (20일)

- 사용 기술
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

# 📍 구현 기능
### ▶︎ 회원가입, 로그인
- 회원가입시 민감정보에 대한 보안을 고려하여 단방향 해쉬 알고리즘인 bcrypt를 통해 비밀번호를 암호화/Database에 입력합니다.
- Passport를 이용한 로컬 전략을 사용해 로그인을 구현하였으며, 로그인 성공시 응답으로 양방향 해쉬 알고리즘인 JWT를 사용해서 유저 정보가 담긴 Token을 리턴합니다.

<br/>

### ▶︎ 이사 정보 생성(고객)
- 이사정보와 관련된 5개의 테이블이 있으며 그중 moving_informations테이블은 중심이 되는 테이블로 지역/시간정보를 비롯하여 기사 선택여부, 이사 완료여부와 같은 상호작용과 관련된 정보들이 주로 입력되게 됩니다.
- moving_status테이블은 해당 이사정보가 현재 어느 단계에 진입중인지를 판단할 수 있게 해줍니다.(id 1: STAY, id 2: NEGO, id 3: PICK, id: 4: DONE)
- area_code테이블은 이사할 지역의 번호가 입력되어 차후 기사와의 매칭에서 사용됩니다.
- moving_goods테이블은 '이삿짐' 정보만을 다루고 서비스가 확장된다면 차후 다루는 정보가 변경되어 수정할 가능성이 높다고 생각하여 분리하였습니다.
- Multer를 이용하여 이사와 관련된 사진정보를 포함할 수 있도록 하였으며 하나의 이사 정보에 여러개의 이미지가 포함될 수 있기 때문에 load_images테이블을 분리하였습니다.
- 이미 생성된 이사정보가 있고 moving_status가 완료(DONE)가 아니라면 더이상 생성하지 못합니다.

<br/>

### ▶︎ 견적 요청(고객)
- 견적을 받기위해 요청하는 경우 moving_information테이블의 MovingStatusId FK가 견적 요청중(NEGO)으로 업데이트되고 negotiation테이블에 해당 이사정보 테이블의 PK를 가진 row가 생성됩니다.
- MovingStatusId가 이미 견적 요청중(NEGO)이거나 이사중(PICK)인 이사정보가 있는 경우 더이상 견적요청을 할 수 없도록 처리하여 악의적 견적요청 등을 방지하였습니다.
- 총 10건의 견적서를 받게되거나 요청일로부터 24시간이 경과하는 경우 negotiation테이블의 timeout컬럼이 true가 되어 기사님들에게 검색되지 않고 따라서 견적서를 받지 않게 됩니다.

<br/>

### ▶︎ 본인 관할 견적요청 목록 / 상세 조회(기사)
- 견적요청 목록을 조회하면 area_codes테이블에 입력되어있는 본인이 선택한 관할지역에 해당하는 요청들만 조회된 결과들만 반환받으며 Pagenation을 적용하여 요청하는 갯수의 리스트만 리턴해 줍니다.
- 24시간이 경과되었거나 이미 10건의 견적서를 받은 요청은 포함되지 않습니다.
- 상세보기를 요청하면 당시를 기준으로 해당 이사정보의 moving_status를 확인하고 NEGO인 상태인 경우가 아니면 요청중이 아님을 반환합니다.

<br/>

### ▶︎ 견적서 제출(기사)
- 견적 금액을 적어 제출하면 동일한 기사가 같은 견적요청에 대해 응답한적이 있는지 확인합니다.
- 이후 해당 이사정보에 대한 견적서가 10건 이상 제출되었는지 확인하고 10건 이하인 경우에만 견적서를 제출할 수 있습니다.
- 만약 해당 견적서가 10번째 견적서인 경우 견적요청을 한 유저에게 메시지를 발송하고 해당 견적 요청의 timeout컬럼을 true로 업데이트하여 더이상 견적요청 목록에 나타나지 않도록 합니다.

<br/>

### ▶︎ 견적서 목록 확인 / 선택(고객)
- 받은 견적서 목록를 확인하면 가격이 낮은 순서로 최대 5개의 결과만 가져오며 견적금액과 함께 기사님들의 정보(리뷰, 평균별점 등 포함)를 반환해 줍니다.
- 계약할 견적서를 선택(계약)하면 이사정보의 moving_status는 PICK으로 변경되며 선택된 기사님의 id가 picked_business_person컬럼에 입력됩니다.
- 이 때 선택된 기사님에게는 본인의 견적서가 선택되었다는 메시지가 전송됩니다.

<br/>

### ▶︎ 계약된 이사정보 조회(고객, 기사)
- 기사가 아직 완료되지 않은 스케쥴을 조회하면 moving_informations테이블의 picked_business_person컬럼과 moving_status컬럼을 통해 식별된 데이터를 반환받을 수 있습니다.
- 유저와 기사는 계약 이후부터 서로의 연락처 및 해당 계약과 관련된 견적금액, 이사정보를 함께 상세조회할 수 있게 됩니다.

<br/>

### ▶︎ 이사 완료(고객, 기사)
- 고객이나 기사의 이사 완료 요청이 오면 요청자에 따라 moving_informations테이블의 user_done나 business_person_done컬럼이 true로 업데이트되고 둘 중 한명만 체크한 경우 상대방에게 이사완료 요청 메시지가 발송됩니다.
- 두명 모두 이사완료 확인을 한 경우 business_persons테이블의 finish_count가 +1이 되며 기사의 이사완료 건수가 올라가고 moving_informations테이블의 moving_status가 DONE이 되면서 해당 건의 이사는 최종 종결됩니다.
- 리뷰는 이사가 완료된 조건에서만 작성할 수 있습니다.

<br/>

### ▶︎ 데이터 컨트롤 스케쥴링
- 견적요청 후 24시간 경과시 더이상 견적을 받을 수 없다는 규칙을 구현하기 위해 Cron 라이브러리를 이용하여 일정 간격으로 견적이 요청된 시간을 체크하고 자동으로 특정 로직을 동작하도록 하였습니다.
- 로직이 수행되면 대상자에게 메시지를 발송하고 negotiations테이블의 timeout컬럼이 true가 되어 더이상 기사님들의 견적요청 리스트 조회에 해당 데이터가 검색되지 않습니다.

<br/>

### ▶︎ 읽지 않은 메시지 체크
- 본 프로젝트는 특정 조건이 만족되는 경우 메시지를 발송하는 기능이 있습니다.
- 사용자가 메시지를 확인하는 router를 실행시키면 system_messages테이블에서 가장 최근 메시지의 updatedAt을 router 실행시간으로 업데이트 합니다.
- 접수한 메시지의 createdAt이 위에서 업데이트한 시간보다 큰 경우만 true가 되어 확인하지 않은 메시지를 카운팅할 수 있도록 하였습니다.
- Pagenation을 적용하였고 만약 확인하는 페이지가 1페이지가 아니라면 updatedAt을 갱신하지 않게 하였는데, 사용자가 2페이지 이상을 체크하고 있다는 것은 1페이지의 내용을 확인하지 않았다는 의미이기 때문입니다.

<br/>

### ▶︎ 실시간 견적요청서 접수 알림
- 웹소켓을 이용해 견적서가 접수될 때마다 실시간 알림을 받도록 설정하였습니다.
- 해당 프로젝트에 존재하는 메시지 기능으로도 대체하여도 되지만 개인적인 학습을 위해 포함하였으며 room 기능을 사용해보고 싶어서 FE에서 socketId를 받는 방식이 아닌 room 접속 기능으로 구현해 보았습니다.
- 프론트에서 고객이 접속하여 emaile로 room을 만들어놓았다는 가정 하에 기사가 견적서를 제출하면서 고객 이메일로 동일한 room에 입장하여 메시지를 날리고 바로 room에서 logout하는 방식입니다.

<br/>
<br/>
<br/>

# 🔌 설치 및 실행

#### 🤗 로컬 테스트를 기준으로 작성하였습니다!

<br/>
<br/>

### 1. Create Database

```bash
# MySQL이 설치되어 있고 접속해 있다는 가정 하에 다음 명령어를 입력합니다.

#  해당 프로젝트와 연동할 Database를 생성합니다.
mysql> create database ZimSsaZa character set utf8mb4 collate utf8mb4_general_ci;
```

<br/>

### 2. Get Project

```bash
# github에서 프로젝트를 clone합니다.
$ git clone https://github.com/chrisYang256/ZimSsaZa.git

# 프로젝트 폴더로 이동합니다.
$ cd ZimSsaZa
```

<br/>

### 3. Installation

```bash
# 프로젝트에서 사용되는 npm package들을 설치합니다.
$ npm install
```

### 4. Configuration

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

### 5. Insert Mock data

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

### 6. Running the app

```bash
# watch mode로 프로젝트를 실행합니다.
$ npm run start:dev
```

<br/>

### 7. Running the Swagger

```bash
# 웹브라우저의 주소 입력란에 swagger 접속 주소를 입력합니다.
# 프로젝트의 기본 port는 3000이며 변경 시 주소에서도 똑같이 변경해 주셔야합니다.
http://localhost:3000/api/
```

<br/>
<br/>
<br/>

# ⚙️ api 테스트

테스트를 직접 해보시려면 위에서 제시한 설치/실행에서 5번 항목의 'Insert Mock data'를 꼭 완료하셔야 합니다.

<br/>

특정 조건이 만족되어야 하는 단계가 있기 때문에 테스트 설명을 두개로 나누었습니다.

<br/>

http://localhost:3000/api/ 로 Swagger 문서에 접속하셔서 다음 과정을 참고해 주시기 바랍니다.

<br/>
<br/>

### 🧳 고객 견적요청 테스트 준비하기

Mock data로 상호작용 위주의 테스트 기반을 만들어둔 상태이기 때문에 이전 단계인 '견적요청'까지는 별도의 과정으로 분리해 두었습니다.

Swagger문서의 Users api에서 다음과 같은 과정으로 회원가입 / 로그인을 한 후 '이삿짐 생성' / '이삿짐 삭제', '견적요청' api를 테스트하시면 됩니다.

<br/>

#### ✔️ 회원 가입

<img width="1422" alt="2222 11" src="https://user-images.githubusercontent.com/89192083/151519610-c84fcf17-7e4a-4e47-b27e-9c631ca32a2e.png">

'회원가입' api를 클릭하고 'Try it out' 버튼을 클릭합니다.

<br/>

<img width="1422" alt="29393" src="https://user-images.githubusercontent.com/89192083/151519886-afcb528c-3d5c-4ef4-8034-c06b5ee2802c.png">
'email' 부분을 원하는 이메일로 바꿔줍니다.

다른 데이터들은 원하신다면 선택적으로 바꿔주시면 됩니다.
그리고 'Execute'버튼을 클릭합니다.

<br/>

<img width="1422" alt="399393" src="https://user-images.githubusercontent.com/89192083/151520530-6ee0ccc1-b193-4b10-a0cd-3cb91194f2c4.png">

정상적으로 회원가입이 된 경우 위와 같은 화면이 출력됩니다.

<br/>
<br/>

#### ✔️ 로그인 / Token 발급과 적용
<img width="1422" alt="3243534345" src="https://user-images.githubusercontent.com/89192083/151521501-3701205b-8f94-49fc-9fbf-47af108a6e19.png">

로그인 api에서 회원가입시 본인이 입력한 email과 password로 수정한 후 'Execute' 버튼을 클릭합니다.

<br/>

<img width="1422" alt="333336666" src="https://user-images.githubusercontent.com/89192083/151521888-d127cc2a-a9d9-42d1-a0bb-6052a52db489.png">
로그인에 성공하면 하단에 위와 같이 'access_token'이 받아지며 따옴료("")를 제외한 부분을 복사합니다.

(Token이 없으면 대부분의 api들을 사용할 수 없습니다.)

<br/>

<img width="1422" alt="45435436" src="https://user-images.githubusercontent.com/89192083/151522405-5067f1ac-4885-489f-9fe7-ebe3c0b405da.png">
이용하려는 api의 오른쪽 끝에 있는 열린 모양의 회색 자물쇠를 클릭합니다.

<br/>

<img width="677" alt="00928371" src="https://user-images.githubusercontent.com/89192083/151522708-83995027-3c58-43e2-a6e8-7fb34ce626fc.png">
'Value'의 박스 안에 위에서 복사한 Token을 붙여넣고 'Authorize'버튼을 클릭한 후 close 버튼을 클릭합니다.

<br/>

<img width="1418" alt="82356666" src="https://user-images.githubusercontent.com/89192083/151523213-d16fd40c-cec2-4148-ac7e-73bd68a6d549.png">
위와 같이 자물쇠가 잠긴 모양이 되고 까맣게 변했다면 성공하셨습니다!

이제부터 까만색으로 변한 api들을 테스트해 보실 수 있습니다^^


<br/>
<br/>
<br/>

### 🚚 고객-기사 상호작용 테스트 준비하기

Mock data에 고객이 견적을 요청한 후 9건의 견적서가 받아진 상태를 만들어 두었습니다.

입력해야 할 Param이나 Query는 Swagger에 예시로 표시되는 값 그대로 사용하는 경우 요청성공으로 진행되도록 세팅해 놓았습니다.

다음과 같이 Swagger의 샘플 데이터 그대로 로그인하여 Token을 입력하였다면 Tasks api 목록 중 '견적을 받기 위한 이사정보 제출'을 제외하고 위에서 아래로 순서대로 진행하시면 고객과 기사가 주고받는 내용을 테스트하실 수 있습니다.


<br/>


<img width="1411" alt="sdsd" src="https://user-images.githubusercontent.com/89192083/151191722-95df25a9-d935-4123-b514-b887f45800f3.png">

'Try it out' 버튼을 클릭합니다.

<br/>

<img width="1411" alt="12 17 33" src="https://user-images.githubusercontent.com/89192083/151192629-32bae4e5-382f-444f-b035-5a0ecf3c164a.png">

입력된 상태 그대로 'Execute' 버튼을 클릭합니다.

<br/>

<img width="1411" alt="dsdsds" src="https://user-images.githubusercontent.com/89192083/151192824-64fcd51a-3ca9-4deb-826e-b5e1ece43131.png">

따옴표("")를 제외한 내용(Token)을 복사합니다.

<br/>

<img width="1411" alt="17" src="https://user-images.githubusercontent.com/89192083/151193356-c43bb1a5-fa59-4a26-98ef-ac558a42eb37.png">

api 오른쪽 끝에 회색 자물쇠 아이콘을 클릭합니다.

<br/>

<img width="740" alt="11 00" src="https://user-images.githubusercontent.com/89192083/151193753-df26a747-1f40-41fb-b8a1-910942d57749.png">

복사한 내용을 'Value 박스'안에 붙여넣고 'Authorize' 버튼을 클릭한 후 'Close'버튼을 클릭하여 창을 종료합니다.

<br/>

<img width="1422" alt="11112 34 37" src="https://user-images.githubusercontent.com/89192083/151194474-ff62b818-de13-4200-94b2-d8029cdeb602.png">

자물쇠 모양이 까맣게 변하고 잠긴 모양이 되었다면 성공입니다!

'User'와 'Business person' 각각 다른 Token으로 인증해야 하기 때문에 동일한 방식으로 진행해 주시면 됩니다.

<br/>

이제 Tasks api들을 테스트해 보시기 바랍니다.

<img width="1422" alt="4534543" src="https://user-images.githubusercontent.com/89192083/151223045-7bb1d3d7-04d8-4eef-b121-2f53d575999e.png">