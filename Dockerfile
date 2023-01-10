FROM node:16-alpine as base

WORKDIR /home/node/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install && npm install -g serve

COPY . .

RUN npx expo export:web

CMD ["serve", "web-build"]