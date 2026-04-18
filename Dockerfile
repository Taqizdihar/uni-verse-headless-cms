FROM node:18
WORKDIR /app
# Copy backend files into the root of the container
COPY backend/package*.json ./
RUN npm install --legacy-peer-deps
COPY backend/ .
EXPOSE 8080
CMD ["node", "server.js"]
