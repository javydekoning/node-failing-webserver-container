FROM node:stretch-slim
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/
COPY ./*.json ./*.ts /usr/src/
RUN npm i && npm i -g typescript ts-node
EXPOSE 9091
CMD ["/usr/local/bin/ts-node" ,"server.ts"]