FROM node:16-alpine as base

WORKDIR /home/node/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . ./

RUN npx expo export:web --dev

FROM nginx

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
RUN rm /etc/nginx/conf.d/default.conf
COPY ng.conf /etc/nginx/conf.d/
COPY --from=base /home/node/app/web-build .
CMD ["nginx", "-g", "daemon off;"]