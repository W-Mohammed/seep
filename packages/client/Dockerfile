FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# PASS ENV VARS AS ARGS TO MAKE THEM AVAILABLE DURING BUILD
ARG NODE_HOST
ENV NODE_HOST=${NODE_HOST}
ARG CLIENT_HOST
ENV CLIENT_HOST=${CLIENT_HOST}
ARG GOOGLE_TAG_ID
ENV GOOGLE_TAG_ID=${GOOGLE_TAG_ID}

RUN npm run build

FROM nginx:alpine

ARG NGINX_CONF
COPY ./nginx/${NGINX_CONF} /etc/nginx/conf.d/default.conf
COPY ./letsencrypt /etc/letsencrypt
COPY --from=builder /app/dist /usr/share/nginx/html


EXPOSE 80
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]