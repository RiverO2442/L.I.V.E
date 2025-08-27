# ---- Build stage ----
    FROM node:20-alpine AS build
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npx prisma generate
    
    # ---- Production stage ----
    FROM node:20-alpine
    WORKDIR /app
    COPY --from=build /app ./
    ENV NODE_ENV=production
    EXPOSE 3000
    CMD ["npm", "run", "start"]
    