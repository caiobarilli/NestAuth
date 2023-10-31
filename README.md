<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# NestJS Authentication Application with JWT

| app         | host      | port |
| ----------- | --------- | ---- |
| **nestjs** | localhost | 5000 |
| **postgress** | localhost | 5432 |
| **adminer** | localhost | 8080 |


### Pré-requisitos

#

Para começar, certifique-se de ter o [Docker](https://docs.docker.com/), [Docker Compose](https://docs.docker.com/compose/install/), [Node.js](https://nodejs.org/) e o [NPM](https://www.npmjs.com/) instalados.

### Download

#

Faça o download do projeto com o comando:

```sh
git clone git@github.com:caiobarilli/NestAuth.git
```

### Postgres

#

Crie um arquivo .env com base no .env.example:

```shell
cp .env.example .env
```

Suba o postgres com o comando:

```shell
sh ./postgres up
```

### NestJS

#


```shell
yarn start:dev
```
