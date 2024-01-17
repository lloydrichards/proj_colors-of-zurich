FROM node:18-alpine

WORKDIR /app/next-app

COPY . .

RUN yarn install

CMD yarn storybook