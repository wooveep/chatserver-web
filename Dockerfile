# build front-end
FROM node:16.20-alpine AS frontend

RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json /app

COPY ./pnpm-lock.yaml /app

RUN pnpm install

COPY . /app

RUN pnpm run build

# service
FROM node:lts-alpine

RUN npm install pnpm -g

WORKDIR /app

RUN pnpm install --production && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*

COPY --from=frontend /app/dist /app/public

EXPOSE 3002

CMD ["pnpm", "run", "prod"]