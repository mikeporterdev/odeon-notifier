FROM node:10 AS base
WORKDIR /usr/src/app

RUN npm install typescript -g
COPY package.json package-lock.json ./
RUN npm install
COPY src src
COPY tsconfig*.json ./
RUN npm run build


CMD ["node", "build/src/main.js"]
