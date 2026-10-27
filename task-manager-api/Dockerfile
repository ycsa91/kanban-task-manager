# 1. Imagen base: PHP 8.2 en su versión CLI sobre Alpine Linux (muy ligera)
FROM php:8.2-cli-alpine

# 2. Instalar dependencias del sistema y extensiones de PHP necesarias para Laravel y MySQL
RUN apk add --no-cache \
    libzip-dev \
    zip \
    unzip \
    oniguruma-dev \
    && docker-php-ext-install \
    pdo \
    pdo_mysql \
    mbstring \
    bcmath \
    zip

# 3. Traer Composer desde su imagen oficial (Multi-stage copy)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Definir el directorio de trabajo dentro del contenedor
WORKDIR /var/www/html

# 5. Copiar primero composer.json y composer.lock para aprovechar la caché de Docker
COPY composer.json composer.lock ./

# 6. Instalar las dependencias de PHP sin paquetes de desarrollo innecesarios ni scripts aún
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# 7. Copiar el resto del código del proyecto Laravel al contenedor
COPY . .

# 8. Generar el autoloader optimizado de Composer y dar permisos a las carpetas de Laravel
RUN composer dump-autoload --optimize \
    && chmod -R 775 storage bootstrap/cache

# 9. Documentar que el contenedor escuchará en el puerto 8000
EXPOSE 8000

# 10. Comando por defecto al arrancar el contenedor
# --host=0.0.0.0 es clave en Docker para permitir conexiones desde fuera del contenedor
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
