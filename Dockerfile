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
FROM nginx:alpine

WORKDIR /app

COPY ./nginx.template /etc/nginx/conf.d

# 将 shell copy 到 workdir 目录，此处为 /opt
# COPY ./main.sh /opt

COPY --from=builder /app/dist /app

VOLUME ["/app/head_photo","/app/certificate"]

EXPOSE 80 
EXPOSE 443 
WORKDIR /etc/nginx/conf.d
ENTRYPOINT envsubst '$WEB_URL $Back_IP'  < nginx.template > default.conf && cat default.conf && nginx -g 'daemon off;'
