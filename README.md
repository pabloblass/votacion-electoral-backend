## Descripcion

Backend del sistema de registro de actas de votación desarrollado en [Nest](https://github.com/nestjs/nest).

## Pasos para levantar la aplicación

#### Paso 1.- Clonar el repositorio

#### Paso 2.- Crear una base de datos vacía en postgres

#### Paso 3.- Crear una carpeta fuera del proyecto para guardar las imagenes

#### Paso 4.- Crear una copia del archivo .env.example y renombrarlo a .env

#### Paso 5.- Editar las variables de entorno en el archivo .env

#### Paso 6.- Instalar dependencias

```bash
$ npm install
```

#### Paso 7.- Crear las tablas de la base de datos

```bash
$ npx prisma db push
```

#### Paso 8.- Sembrar los datos con el script que se encuentra en src/seeders/seeder-database.sql

#### Paso 9.- Compilar y ejecutar el proyecto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Contacto

- Autor - [Juan Pablo Bascope](https://twitter.com/kammysliwiec)
- Email - djpabloblass@gmail.com

## Licencia

[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
