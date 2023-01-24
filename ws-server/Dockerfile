FROM node:14.18.0
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 4000
EXPOSE 8080

CMD ["node", "server.js"]
