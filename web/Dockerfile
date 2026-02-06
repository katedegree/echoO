FROM node:24
WORKDIR /web
# 依存関係ファイルのみコピーしてキャッシュを効かせる
COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "dev"]
EXPOSE 3000
