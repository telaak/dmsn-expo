FROM node:20-bookworm-slim as base

WORKDIR /home/node/app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY . ./

RUN npx expo export -p web

FROM nginx

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
RUN rm /etc/nginx/conf.d/default.conf
COPY ng.conf /etc/nginx/conf.d/
COPY --from=base /home/node/app/dist .
CMD ["nginx", "-g", "daemon off;"]