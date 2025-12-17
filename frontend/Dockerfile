# frontend/Dockerfile — РАБОЧИЙ ВАРИАНТ ДЛЯ ТЕБЯ СЕЙЧАС
FROM node:20-alpine

WORKDIR /app

# Копируем ТОЛЬКО то, что лежит в папке frontend (а не frontend/frontend)
COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]