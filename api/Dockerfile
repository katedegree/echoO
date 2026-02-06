FROM php:8.4
WORKDIR /api
# composerをインストール
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1
# パッケージのインストールとキャッシュ削除
RUN apt-get update && \
    apt-get install -y zip unzip git && \
    rm -rf /var/lib/apt/lists/* && \
    docker-php-ext-install pdo_mysql

COPY composer.* ./
RUN composer install --no-scripts

COPY . .
CMD ["php", "artisan", "serve", "--host", "0.0.0.0"]
EXPOSE 8000
