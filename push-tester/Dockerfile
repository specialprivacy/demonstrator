FROM mhart/alpine-node:8

WORKDIR /app
EXPOSE 80
ENV NODE_ENV='development'
CMD ["node", "lib/index.js"]

RUN apk add --no-cache git

COPY package.json /app/package.json

RUN npm install

COPY lib /app/lib
