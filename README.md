## 프로젝트 설명

- 본 프로젝트는 Nest.JS와 GraphQL을 사용해서 만들었습니다.
- Rest API 대신 GraphQL을 사용한 이유는 end point의 통합 및 자동으로 API 명세를 만들어 주는 기능을 통해 프론트엔드와 백엔드간의 소통에 대한 부담감을 덜어주며,
- 필요한 데이터만 골라서 요청해서 가져올 수 있는 장점이 있기 때문에 GraphQL을 사용하게 되었습니다.

## 개발 환경

- Runtime environment: Node.JS v16
- Language: TypeScript
- Database: Mysql v5.7
- Cache: Redis
- Web application framework: Nest.JS
- GraphQL

## NPM 설치

```bash
$ yarn install
```

## 서버 설정 방법

- `/config/local.sample.js` -> `/config/local.js`로 복사 후 설정 값 수정. 기본 local 세팅이라 로컬에서 설정을 안 바꿨다면 그대로 써도 무방합니다.

  ```json
  {
    "redis": {
      "host": "local에서 접속할 host",
      "port": "local에서 접속할 port"
    }
  }
  ```

- `ormconfig.sample.json` -> `ormconfig.json`으로 복사 후 설정 값 수정. 기본 local 세팅이라 로컬에서 설정을 안 바꿨다면 database를 tour로 만들면 사용가능합니다.

  ```json
  {
    "type": "mysql",
    "host": "local에서 접속할 host",
    "port": 3306,
    "username": "local에서 접속할 username",
    "password": "local에서 접속할 mysql password",
    "database": "local에서 접속할 mysql database"
  }
  ```

## 서버 실행

```bash
$ yarn start
```

## 테스팅 방법

```bash
# unit tests (전체 테스트)
$ yarn test

# unit test (각 파일별 테스트) e.g) yarn test tour.service.ts
$ yarn test 파일명

# unit test 커버리지
$ yarn test:cov
```

## ERD

<img width="779" alt="스크린샷 2023-12-10 오후 3 49 57" src="https://github.com/dhyunkim/tour-server/assets/74766032/38e5e393-085e-4762-afc5-70c58dba6fa5">

## 테스트 커버리지

- service 함수에 유닛테스트들을 작성했고 테스트 커버리지는 100을 만들었습니다.

<img width="563" alt="스크린샷 2023-12-10 오후 3 02 10" src="https://github.com/dhyunkim/tour-server/assets/74766032/13371987-2158-428e-b198-691eea5e3b67">

## API 테스트 방법

- 본 프로젝트는 GraphQL을 이용해서 만들었기 때문에 테스트를 하려면 localhost:3000/graphql 로 접속하신다음, playground를 사용해서 API 테스트를 하시면 됩니다.
- 또한, JWT 가드를 사용했기 때문에 API 테스트를 하시려면 회원가입을 통해 JWT를 발급받으셔서 사용하셔야 합니다.
- 회원가입은 간단한 email 회원가입으로 만들었으며 비밀번호는 8자 이상으로 입력하시면 됩니다.
- 그리고 발급받으신 JWT를 아래 이미지와 같이 playground에서 넣어서 사용하시면 됩니다.

<img width="677" alt="스크린샷 2023-12-10 오후 3 58 20" src="https://github.com/dhyunkim/tour-server/assets/74766032/e462dfc5-b5c0-4414-8819-afdbfbe62595">

- playground에서 조회를 할 때는 query를 사용하며 아래 이미지와 같이 사용합니다.

<img width="1441" alt="스크린샷 2023-12-10 오후 4 25 02" src="https://github.com/dhyunkim/tour-server/assets/74766032/85b0aa26-3a81-4d15-b43f-955bfdec37e3">

- playground에서 추가, 수정, 삭제를 할 때는 mutation을 사용하며 아래 이미지와 같이 사용합니다.

<img width="1377" alt="스크린샷 2023-12-10 오후 4 24 43" src="https://github.com/dhyunkim/tour-server/assets/74766032/d8d4662d-8850-4f63-8013-f2603470ce56">

## 추가 구현 사항

- 제가 생각했을 때 투어를 예약할 때 JWT 인증 시스템이 필요하다고 생각했고 이를 위해 JWT를 이용한 회원가입, 로그인 기능과 투어를 추가, 수정, 삭제할 수 있는 기능을 추가로 구현했습니다.
- 해당 API 이름은 signup, signin, addTour, updateTour, removeTour 입니다.
- 또한, JWT 가드를 전역으로 설정했으며 REST API와 GraphQL 모두 사용할 수 있는 JWT 인증 시스템을 만들었습니다.
