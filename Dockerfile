# syntax=docker/dockerfile:1

ARG NODE_VERSION=24
ARG PNPM_VERSION=11.17.0

FROM node:${NODE_VERSION}-alpine

ARG PNPM_VERSION
WORKDIR /usr/src/app

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}
