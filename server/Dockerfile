FROM node:10.16.0

WORKDIR /opt/app

COPY package*.json ./

RUN npm install --silent

COPY ./ ./

CMD npm start
