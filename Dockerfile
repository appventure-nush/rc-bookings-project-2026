# ---------- Build frontend ----------
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

COPY src/frontend/package*.json ./
RUN npm ci

COPY src/frontend/ ./
RUN npm run build


# ---------- Production image ----------
FROM node:22-alpine

RUN apk add --no-cache nginx supervisor

# Backend
WORKDIR /app

COPY src/backend/package*.json ./
RUN npm ci --omit=dev

COPY src/backend/ ./

# Frontend
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# nginx + supervisor configuration
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisord.conf"]