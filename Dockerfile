FROM node:14.16

RUN apt update -y
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY package.json /usr/src/app/
RUN npm install

COPY . /usr/src/app

# replace this with your application's default port
EXPOSE 3000
CMD [ "node", "server.js" ]
