FROM node:10.16.0-alpine

WORKDIR /opt/app

COPY package*.json ./

RUN npm install --silent

COPY ./ ./

EXPOSE 8080

CMD npm start
