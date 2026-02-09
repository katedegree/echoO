FROM dunglas/frankenphp:latest
WORKDIR /api

COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

RUN apt-get update && \
    apt-get install -y zip unzip git && \
    rm -rf /var/lib/apt/lists/* && \
    install-php-extensions pdo_mysql pcntl

# COPY composer.* ./
# RUN composer install --no-scripts

COPY . .
CMD ["php", "artisan", "octane:start", "--host", "0.0.0.0", "--port", "8000", "--watch"]
EXPOSE 8000
