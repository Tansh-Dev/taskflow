# Use official Nginx lightweight image to serve our HTML
FROM nginx:alpine

# Copy our HTML file into nginx's web root
COPY index.html /usr/share/nginx/html/index.html

# Expose port 80 (standard HTTP)
EXPOSE 80

# Nginx starts automatically — no CMD needed
