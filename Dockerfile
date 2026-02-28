FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY server.js package.json ./
RUN npm install --omit=dev
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
