# get host image
FROM ubuntu:18.04

# install nginx
RUN apt-get update
RUN apt-get install -y curl build-essential nginx

# install node
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y nodejs

# switch to workdir
WORKDIR /app

# copy project files
COPY . .

# install npm packages
RUN npm install

# build package
RUN npm run build

# setup nginx config
ADD ./nginx.conf /etc/nginx/nginx.conf

# run nginx
CMD ["nginx", "-g", "daemon off;"]