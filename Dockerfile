FROM node:16-alpine as base

WORKDIR /home/node/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install && npm install -g expo-cli serve

RUN npx expo build:web

COPY . .

CMD ["serve", "web-build"]