FROM node:18-alpine As development

WORKDIR /todo-api

COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .
COPY --chown=node:node .env.development ./.env

USER node

FROM node:18-alpine As build

WORKDIR /todo-api

COPY --chown=node:node package*.json ./
COPY --chown=node:node yarn.lock ./

COPY --chown=node:node --from=development /todo-api/node_modules ./node_modules

COPY --chown=node:node . .

RUN yarn run build

ENV NODE_ENV production

RUN yarn install --frozen-lockfile && yarn cache clean --force

USER node

FROM node:18-alpine As production

COPY --chown=node:node --from=build /todo-api/node_modules ./node_modules
COPY --chown=node:node --from=build /todo-api/dist ./dist
COPY --chown=node:node .env.production ./.env

CMD [ "node", "dist/main" ]