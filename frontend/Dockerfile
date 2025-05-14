FROM node:20

# Ustaw katalog roboczy
WORKDIR /app

# Skopiuj package.json i package-lock.json i zainstaluj zależności
COPY package*.json ./
RUN npm install

# Skopiuj resztę plików
COPY . .

# Eksponuj port 3000 (domyślny dla react-scripts start)
EXPOSE 3000

# Uruchom aplikację developerską
CMD ["npm", "start"]
