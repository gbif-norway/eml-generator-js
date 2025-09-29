FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies only when package files change
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm install

# Development image
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

# Production build stage
FROM base AS build
ENV NODE_ENV=development
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Production runtime image
FROM nginx:1.27-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Deployment image for GitHub Pages
FROM base AS deploy
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Install git for gh-pages deployment
RUN apk add --no-cache git
# Configure git for deployment (can be overridden with environment variables)
RUN git config --global user.email "deploy@github.com" && \
    git config --global user.name "GitHub Pages Deploy"
CMD ["npm", "run", "deploy"]
