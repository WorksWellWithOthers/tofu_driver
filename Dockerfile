FROM nginx:1.27-alpine

COPY frontend/nospill/index.html /usr/share/nginx/html/index.html
COPY frontend/nospill/app.css /usr/share/nginx/html/static/nospill/app.css
COPY frontend/nospill/app.js /usr/share/nginx/html/static/nospill/app.js
COPY frontend/nospill/runtime-config.js /usr/share/nginx/html/static/nospill/runtime-config.js
COPY frontend/nospill/assets /usr/share/nginx/html/static/nospill/assets

COPY docker-entrypoint.d/40-tofu-runtime-config.sh /docker-entrypoint.d/40-tofu-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-tofu-runtime-config.sh

COPY nginx.conf /etc/nginx/conf.d/default.conf
