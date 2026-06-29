# syntax=docker/dockerfile:1

FROM node:22-bullseye-slim AS deps
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl libssl1.1 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

FROM deps AS build
WORKDIR /usr/src/app

COPY . .

RUN npx prisma generate
RUN npm run start:build

FROM node:22-bullseye-slim AS runner
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl libssl1.1 \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=3333

COPY package*.json ./
COPY prisma ./prisma/
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/generated ./generated

RUN npm prune --omit=dev

EXPOSE 3333

CMD ["npm", "run", "start"]
