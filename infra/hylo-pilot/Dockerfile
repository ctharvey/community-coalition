FROM node:24-bookworm
WORKDIR /opt/hylo
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare yarn@4.9.2 --activate
COPY . .
RUN yarn workspaces focus backend web root-workspace-0b6124
RUN yarn build-packages
