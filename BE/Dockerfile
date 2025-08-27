FROM node:20 as build

WORKDIR /app

# Install OpenSSL (important for Prisma)
RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# (Optional) If you had a build step for TypeScript or bundling
# RUN npm run build

# ---- Production ----
FROM node:20-slim

WORKDIR /app

# Install OpenSSL also in runtime container
RUN apt-get update -y && apt-get install -y openssl

COPY --from=build /app /app

# Install PM2
RUN npm install -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "src/server.js"]
