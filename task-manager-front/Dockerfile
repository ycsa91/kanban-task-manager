# ==========================================
# ETAPA 1: Construcción (Build Stage)
# ==========================================
FROM node:22-alpine AS build

WORKDIR /app

# 1. Copiar archivos de definición de dependencias para aprovechar la caché de capas
COPY package.json package-lock.json ./

# 2. Instalar dependencias exactas del package-lock.json (más rápido y reproducible que npm install)
RUN npm ci

# 3. Copiar el resto del código fuente del frontend
COPY . .

# 4. Variable de entorno en tiempo de compilación (Vite reemplaza import.meta.env en el build)
ARG VITE_API_BASE_URL=http://localhost:8000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# 5. Compilar TypeScript y empaquetar para producción (genera la carpeta /app/dist)
RUN npm run build

# ==========================================
# ETAPA 2: Servidor Web Ligero (Production Stage)
# ==========================================
FROM nginx:alpine

# 6. Copiar ÚNICAMENTE los archivos estáticos compilados desde la Etapa 1 (build)
COPY --from=build /app/dist /usr/share/nginx/html

# 7. Documentar que Nginx escucha en el puerto 80
EXPOSE 80

# 8. Iniciar Nginx en primer plano para que el contenedor se mantenga activo
CMD ["nginx", "-g", "daemon off;"]
