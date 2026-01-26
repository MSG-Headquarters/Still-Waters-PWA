FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN chmod +x ./node_modules/.bin/*

COPY . .
RUN npx vite build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
