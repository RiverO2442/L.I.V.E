# ---------- Build Stage ----------
    FROM node:20-alpine AS build

    WORKDIR /app
    
    # Install dependencies
    COPY package*.json ./
    RUN npm ci
    
    # Copy source
    COPY . .
    
    # Generate Prisma client & build
    RUN npx prisma generate
    RUN npm run build
    
    # ---------- Production Stage ----------
    FROM node:20-alpine
    
    WORKDIR /app
    
    # Install only production deps
    COPY package*.json ./
    RUN npm ci --only=production && npm install -g pm2
    
    # Copy built app & prisma client
    COPY --from=build /app/dist ./dist
    COPY --from=build /app/prisma ./prisma
    COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
    
    # Environment
    ENV NODE_ENV=production
    EXPOSE 3000
    
    # Run with PM2 (auto-restart if crash)
    CMD ["pm2-runtime", "dist/server.js"]
    