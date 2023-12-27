## 프로젝트 설명

- 본 프로젝트는 여행 예약 시스템을 구현한 프로젝트이며 Nest.JS와 GraphQL을 사용해서 만들었습니다.
- Rest API 대신 GraphQL을 사용한 이유는 end point의 통합 및 자동으로 API 명세를 만들어 주는 기능을 통해 프론트엔드와 백엔드간의 소통에 대한 부담감을 덜어주며,
- 필요한 데이터만 골라서 요청해서 가져올 수 있는 장점이 있기 때문에 GraphQL을 사용하게 되었습니다.

## 개발 환경

- Runtime environment: Node.JS v16
- Language: TypeScript
- Database: Mysql v5.7
- Cache: Redis
- Web application framework: Nest.JS
- ORM: TypeORM
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

# unit test (각 파일별 테스트) e.g) yarn test tour.service.spec.ts
$ yarn test 파일명

# unit test 커버리지
$ yarn test:cov
```

## ERD

<img width="779" alt="스크린샷 2023-12-10 오후 3 49 57" src="https://github.com/dhyunkim/tour-server/assets/74766032/144be829-ec10-4862-a67c-1f7086502c9e">

## 테스트 커버리지

- service 함수에 유닛테스트들을 작성했고 테스트 커버리지는 100을 만들었습니다.

<img width="563" alt="스크린샷 2023-12-10 오후 3 02 10" src="https://github.com/dhyunkim/tour-server/assets/74766032/8281a2c9-6ca8-4cf5-92a3-c099e52707e7">
