## Description

본 프로젝트는 Graphql을 사용해서 만들었습니다.

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
# unit tests (전체)
$ yarn run test

# unit test (각 파일별) e.g) yarn test tour.service.ts
$ yarn run test 파일명

# test coverage
$ yarn test:cov
```
