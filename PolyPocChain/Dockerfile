FROM alpine:3.14

RUN set -x \
  && apk add --update --no-cache \
  ca-certificates \
  && rm -rf /var/cache/apk/*

COPY polygon-sdk /usr/local/bin/

WORKDIR /home
RUN mkdir /home/chainData

EXPOSE 8545 9632 1478

CMD "/bin/sh"