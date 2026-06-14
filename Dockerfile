FROM nginx:1.27-alpine

COPY frontend/nospill/index.html /usr/share/nginx/html/index.html
COPY frontend/nospill/app.css /usr/share/nginx/html/static/nospill/app.css
COPY frontend/nospill/app.js /usr/share/nginx/html/static/nospill/app.js
COPY frontend/nospill/assets /usr/share/nginx/html/static/nospill/assets

COPY nginx.conf /etc/nginx/conf.d/default.conf
