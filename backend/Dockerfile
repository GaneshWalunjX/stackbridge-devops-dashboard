FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY src/ ./src/
COPY config/ ./config/
COPY server.js ./

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

RUN rm -f .env

EXPOSE 5000

CMD ["node", "server.js"]

