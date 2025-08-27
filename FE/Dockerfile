# ---------- Build Stage ----------
  FROM node:20-alpine AS build

  WORKDIR /app
  
  COPY package*.json ./
  RUN npm install --legacy-peer-deps
  
  COPY . .
  
  RUN npm run build
  
  # ---------- Production Stage ----------
  FROM nginx:alpine
  
  # Remove default nginx static config
  RUN rm /etc/nginx/conf.d/default.conf
  
  # Copy build output to Nginx
  COPY --from=build /app/dist /usr/share/nginx/html
  
  # Use custom nginx config (optional: SPA fallback)
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  
  EXPOSE 80
  
  CMD ["nginx", "-g", "daemon off;"]
  