# Dockerfile for Microservice B (Industrial Level 3)
FROM node:20-alpine

WORKDIR /app

# Registry Authentication
ARG NODE_AUTH_TOKEN
COPY .npmrc .npmrc
COPY package*.json ./

# Installer dépendances strictement (reproductible)
RUN npm ci --omit=dev
RUN rm -f .npmrc

# Copier tout le code
COPY . .

# Exposer le port du service
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost:3001/health || exit 1

# Lancer le service
CMD ["node", "index.js"]
