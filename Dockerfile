FROM node:18

LABEL author="Thomas Kottke <t.kottke90@gmail.com>"
LABEL org.opencontainers.image.source=https://github.com/tkottke90/daily-report

ARG BRANCH=""
ARG COMMIT=""

ENV GIT_COMMIT=${COMMIT}
ENV GIT_BRANCH=${BRANCH}

WORKDIR /usr/app/

COPY ./dist ./dist/
COPY package*.json ./

RUN npm ci

CMD [ "node", "server/index.js"]

ENV PORT 3000
ENV NODE_ENV production

EXPOSE 3000