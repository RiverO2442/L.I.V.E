# ---------- Build Stage ----------
    FROM node:20-alpine AS build

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci --legacy-peer-deps
    
    COPY . .
    
    # Generate Prisma client
    RUN npx prisma generate || true
    
    # ---------- Production Stage ----------
    FROM node:20-alpine
    
    WORKDIR /app
    
    # Install PM2 globally
    RUN npm install -g pm2
    
    COPY --from=build /app /app
    
    EXPOSE 3000
    
    CMD ["pm2-runtime", "src/server.js"]