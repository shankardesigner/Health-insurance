FROM node:14

COPY . ./app

WORKDIR /app


RUN yarn install --frozen-lockfile
RUN yarn build


EXPOSE 3011

CMD ["yarn","start"]