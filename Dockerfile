FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=backend-build /app/backend ./backend
COPY --from=frontend-build /app/frontend/build ./frontend/build
RUN npm install -g serve
EXPOSE 5000
EXPOSE 3000
CMD ["sh", "-c", "cd backend && node server.js & serve -s frontend/build -l 3000"]
