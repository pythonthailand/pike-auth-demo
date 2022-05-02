
FROM node:16.14.2-alpine

WORKDIR /app

COPY . .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
