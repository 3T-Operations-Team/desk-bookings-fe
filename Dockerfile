FROM node:20-alpine as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:alpine

WORKDIR /app

COPY --from=build /app/nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["sh","-c", "envsubst '${BACKEND_ADDRESS}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf ; nginx -g 'daemon off;'"]
