# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:latest

# Remove default config to avoid conflicts
RUN rm /etc/nginx/conf.d/default.conf

# Inject custom config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

