FROM node:18
WORKDIR /usr/library/clean-node-arch
COPY ./package.json .
RUN npm install --only=prod