# ---------- Build Stage ----------
    FROM node:20 as build
    WORKDIR /app
    
    COPY package*.json ./
    RUN npm install
    
    COPY . .
    RUN npx prisma generate
    
    # ---------- Production Stage ----------
    FROM node:20-slim
    WORKDIR /app
    
    COPY --from=build /app /app
    RUN npm install -g pm2
    
    # Copy backend .env
    COPY .env /app/.env
    
    ENV NODE_ENV=production
    EXPOSE 3000
    
    CMD ["pm2-runtime", "src/server.js"]
    