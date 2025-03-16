# Gunakan Node.js untuk build
FROM node:18 AS build

WORKDIR /app

# Copy package.json dan install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy semua source code
COPY . .

# Build React
RUN npm run build

# Gunakan Nginx untuk serve React
FROM nginx:latest

# Copy hasil build ke dalam Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy konfigurasi Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
