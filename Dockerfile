# STEP 1 building your app
FROM node:16-alpine3.16 as builder
RUN apk update && apk add --no-cache make git
# a) Create app directory
WORKDIR /app
# # b) Create app/nginx directory and copy default.conf to it
# WORKDIR /app/nginx
# COPY nginx/default.conf /app/nginx/
# c) Install app dependencies
COPY package.json package-lock.json /app/
RUN cd /app && npm set progress=false && npm install -f
# d) Copy project files into the docker image and build your app
COPY .  /app
RUN cd /app && npm run ng build --prod --output-path=dist
# STEP 2 build a small nginx image
FROM nginx:1.22.1-alpine
# a) Remove default nginx code
RUN rm -rf /usr/share/nginx/html/*
# b) From 'builder' copy your site to default nginx public folder
COPY --from=builder /app/dist/icat.countryportalweb /usr/share/nginx/html
# c) copy your own default nginx configuration to the conf folder
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/nginx/Staticfile /etc/nginx/Staticfile

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]