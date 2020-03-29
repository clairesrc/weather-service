FROM node:10
WORKDIR /usr/src/app
RUN npm i -g typescript
COPY package*.json ./
RUN yarn
COPY . .
RUN npm run build
EXPOSE 8080
CMD [ "node", "dist/server.js" ]