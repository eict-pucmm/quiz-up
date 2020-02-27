FROM node:10.16.0

WORKDIR /usr/brainstorm

COPY package*.json ./

RUN npm install --silent

COPY ./ ./

EXPOSE 3000

CMD [ "npm", "start"]
