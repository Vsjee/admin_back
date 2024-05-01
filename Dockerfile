# Application based in Node.js Version 18
FROM node:20-alpine

COPY package.json ./
COPY pnpm-lock.yaml ./

# Install npm modules
RUN npm install -g pnpm
RUN pnpm install

# Set work dir /coreserver
WORKDIR /coreserver

# Copy files in /coreserver
COPY ./ /coreserver

# Install typescript
RUN npm install typescript -g

# Expose 9000 port
EXPOSE 9000

# Run typescript
RUN tsc

# Run command npm start
CMD ["pnpm", "start"]