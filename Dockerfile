FROM izonder/anny:14
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean
COPY . ./

RUN yarn build

EXPOSE 4000

CMD ["node", "dist/src/main.js"]
