FROM node:stretch-slim
WORKDIR /usr/src/
COPY ./*.json /usr/src/
COPY ./*.ts /usr/src/
RUN npm i && npm i -g typescript ts-node
EXPOSE 9091
CMD ["/usr/local/bin/ts-node" ,"server.ts"]