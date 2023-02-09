# FROM node:12-slim
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install -g @angular/cli
# RUN npm install -f
# COPY . ./
# RUN npm run build


# FROM node AS node
# COPY . ./
# RUN npm install --force
# RUN npm run build
# WORKDIR /src

# FROM node AS node
# RUN mkdir -p /app
# WORKDIR /app
# COPY package.json /app
# RUN npm install -f
# COPY . /app
# RUN npm run build --prod

# # Stage 2
# FROM nginx:1.17.1-alpine
# COPY --from=node /app/docs /usr/share/nginx/html

#stage 1
# FROM node:latest as node
# WORKDIR /app
# RUN npm install -g @angular/cli

# COPY . .
# RUN npm install -f
# RUN npm run build
# #stage 2
# FROM nginx:alpine
# COPY nginx.conf /etc/nginx/nginx.conf
# COPY --from=node /app/dist/icat.countryportalweb /usr/share/nginx/html


FROM node AS builder
COPY package.json package-lock.json ./
RUN npm ci -f && mkdir /app && mv ./node_modules ./app
WORKDIR /app
COPY . .
RUN npm run ng build -- --prod --output-path=dist


# STAGE 2: Deploy

FROM nginx:1.17-alpine

COPY nginx/default.conf.template /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY run.sh /

CMD ["/run.sh"]
