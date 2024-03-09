FROM node:18-alpine As development

WORKDIR /todo-api

COPY --chown=node:node . .

RUN yarn install --frozen-lockfile

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

ARG JWT_SECRET
ARG JWT_EXPIRES
ARG SALT_ROUNDS
ARG API_PORT
ARG DB_HOST
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_NAME
ARG CORS_ORIGINS
ARG BASE_PATH
ARG BUCKET_NAME

ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRES=${JWT_EXPIRES}
ENV SALT_ROUNDS=${SALT_ROUNDS}
ENV API_PORT=${API_PORT}
ENV DB_HOST=${DB_HOST}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_NAME=${DB_NAME}
ENV CORS_ORIGINS=${CORS_ORIGINS}
ENV BASE_PATH=${BASE_PATH}
ENV BUCKET_NAME=${BUCKET_NAME}

CMD [ "node", "dist/main" ]
