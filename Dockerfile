FROM node:18
WORKDIR /usr/library/clean-node-arch
COPY ./package.json .
RUN npm install
COPY ./dist ./dist
EXPOSE 5050
CMD npm run start