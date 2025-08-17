# Dockerfile para Backend NestJS
FROM node:20-alpine AS builder

# Instalar dependencias del sistema necesarias para Prisma (openssl)
RUN apk add --no-cache openssl python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json tsconfig.json ./
COPY prisma ./prisma

# Instalar dependencias
RUN npm install

# Generar cliente Prisma
RUN npx prisma generate

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Eliminar herramientas de compilación
RUN npm prune --production

# Etapa de producción
FROM node:20-alpine AS production

# Instala openssl en la imagen de producción
RUN apk add --no-cache openssl

WORKDIR /app

# Copiar el script SQL desde el builder
COPY --from=builder /app/src/seeders/seeder-database.sql ./scripts/

# Copiar archivos necesarios desde builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Ejecutar el script al iniciar (modifica el CMD)
CMD ["sh", "-c", "psql postgresql://${DATABASE_URL} -f ./scripts/seeder-database.sql && node dist/main"]

# Exponer puerto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]