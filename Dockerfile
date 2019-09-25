FROM node:10 as BUILD
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
ARG GMAP_API_KEY=YOU_NEED_A_KEY
ENV GMAP_API_KEY=$GMAP_API_KEY
RUN npm run build 

FROM nginx:alpine
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=BUILD /usr/src/app/dist /usr/share/nginx/html/