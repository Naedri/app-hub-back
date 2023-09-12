<p align="center">
  <a alt="TypeScript Logo" href="https://www.typescriptlang.org/" target="blank">
    <img src="https://static.npmjs.com/255a118f56f5346b97e56325a1217a16.svg" width="60"/>
  </a>
  <a alt="Nest Logo"  href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="60"/>
  </a>
  <a alt="Prisma Logo" href="https://www.prisma.io/" target="blank">
    <img src="https://prismalens.vercel.app/header/logo-dark.svg" width="60"/>
  </a>
</p>

<h2 align="center">
  Backend AppHub build in TypeScript with NestJS and Prisma. 
</h2>

## Description

"app-hub-back" is the back-end component of the App Hub project, developed using NestJS. This repository serves as the engine behind the scenes, handling authentication, data storage, and communication with the front-end. It provides the necessary APIs and services for managing the application catalog, user accounts, and secure connections.

## Installation

```bash
npm install
```

## Configuration

Before running the application, you will have to add, at the root level of the project an _.env_ file from the _.env.example_ file.

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## API documentation

While the application is running, you can see the documentation about the endpoint at the following web page : [Swagger documentation](http://localhost:3000/api).

## Database

![ms-users](README.assets/ms-users.png)

You can see the associated commands at the _prisma\dbml\schema.dbml_ file.

### Seeding the data

After filling the _.env_ file you can fill your database with some mock users and applications (defined in _mock/_ folder). Then to populate this data into your database, you will have to run the following commands : `npx prisma db seed`.

### Editing the data itself

If you want to update the database, you can do it by running `npx prisma db studio`, and then access to the following web page : [Prisma Studio](http://localhost:5555/).

### Editing the data model

If you update the database (by editing the _prisma/schema.prisma_ file) after evaluating its validation with `npx prisma validate`, you have to update the associated compiled files by running `npx prisma generate` and then you may need to update the database with `npx prisma db push`.
You should as well edit the following picture : _README.assets\ms-users.png_, by copy the content from _prisma\dbml\schema.dbml_ to [dbdiagram.io](https://dbdiagram.io/d).

## Architecture of the code

| Folder                   | Purpose                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `app.controller.ts`      | A basic controller with a single route.                                                                             |
| `app.controller.spec.ts` | The unit tests for the controller.                                                                                  |
| `app.module.ts`          | The root module of the application.                                                                                 |
| `app.service.ts`         | A basic service with a single method.                                                                               |
| `main.ts`                | The entry file of the application which uses the core function `NestFactory` to create a Nest application instance. |

For nestJS project, in general :

- **Modules:** used to organize the code and split features into logical reusable units. Grouped TypeScript files are decorated with “@Module” decorator which provides metadata that NestJs makes use of to organize the application structure.
- **Providers:** also called services, which are designed to abstract any form of complexity and logic. Providers can be created and injected into controllers or other providers.
- **Controllers:** responsible for handling incoming requests and returning appropriate responses to the client-side of the application (for example call to the API).

### Dependency Graph

![Dependency Graph](README.assets/deps-graph.png)

To update the above graph, run the following command : `npm run doc:graph`.

### DTO vs Entities

- "Entities" : refer to units of composition of the overall system data. They normally represent business objects like: bank accounts, employees, products, etc. They can be used to persist the state of the system to a database. => _prisma.io_
- "Data transfer objects" : are ephemeral collections of data transferred for a very specific purpose. For example, to display a list of products of a specific kind to an end user. You do not want to send all of the data that represents every product entity to the user, but only what is needed for this purpose. => _example.dto.ts_

[Reference](https://stackoverflow.com/a/65415693)

## Dockerization

- `Dockerfile` - This file will be responsible for importing the Docker images, dividing them into development and production environments, copying all of our files, and installing dependencies.
- `docker-compose.yml` - This file will be responsible for defining our containers, required images for the app other services, storage volumes, environment variables, etc.

### To launch our application in containers

Run the following commands at the root directory :

```bash
docker compose build
docker compose up
```

## References

### NestJS

The backend application has been developped with NestJS. It is a progressive Node.js framework for building efficient, reliable and scalable server-side applications. As this framework supports as well development in TS, we choose these typed language as a safety harness.
Useful documentations are available at the following links :

- [authentication](https://docs.nestjs.com/security/authentication)
- [authorization](https://docs.nestjs.com/security/authorization)
- [configuration](https://docs.nestjs.com/techniques/configuration)
- [prisma-client-in-your-nestjs-services](https://docs.nestjs.com/recipes/prisma#use-prisma-client-in-your-nestjs-services)

#### CLI

NestJs CLI offers a bunch of command to ease developpers' works.
Useful documentations are available at the following links :

- [Introducing CLI Resource Generators](https://trilon.io/blog/introducing-cli-generators-crud-api-in-1-minute#Introduction-to-CLI-Generators)

#### Practical examples

- [Building a REST API with NestJS and Prisma](https://www.notion.so/marcjulian/Building-a-REST-API-with-NestJS-and-Prisma-8296846a0fc54ac0b445ae9364805669)
- [nestjs-prisma-workshop](https://github.com/marcjulian/nestjs-prisma-workshop)

### Token

Authentification of the user is supported by JWON Web Token (JWT).
Useful documentations are available at the following links :

- [JWT ](https://jwt.io/)
- [Learning JWT](https://github.com/dwyl/learn-json-web-tokens)
- [Credentials in JWT](https://stackoverflow.com/questions/42652695/is-it-ok-to-store-user-credentials-in-the-jwt/42652851#42652851)

### Database

The interaction with the database is supported by a TypeScript ORM (Object–relational mapping) : Prisma.
Useful documentations are available at the following links :

- [Prisma schema reference - Naming Convention](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions)
- [SQL Style Guide](https://www.sqlstyle.guide)
- [Table Definition](https://www.dbml.org/docs/#table-definition)
- [dbDiagram Docs](https://dbdiagram.io/docs/)

### Docker

To ease the deployment of our application, it has been drafted docker files. They have not been tested yet due to a lack of CPU ressources of the current developper's computer.
Useful documentations are available at the following links :

- [Containers vs. virtual machines | Atlassian](https://www.atlassian.com/en/continuous-delivery/microservices/containers)
- [Best practices for writing Docker files](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Nodejs Tutorial](https://docs.docker.com/language/nodejs/)
- [Example](https://github.com/notiz-dev/nestjs-prisma/blob/main/schematics/nestjs-prisma/templates/docker/common/Dockerfile)
