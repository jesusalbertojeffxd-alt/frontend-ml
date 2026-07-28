FROM node:20-alpine AS builder
WORKDIR /app

# 1. Copiar package.json primero (para cachear dependencias)
COPY package*.json ./

# 2. Instalar dependencias
RUN npm install

# 3. Copiar el resto del código
COPY . .

# 4. Construir la aplicación
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]
