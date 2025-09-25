# Usamos una imagen base de Node.js
FROM node:18-slim

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiar archivos para instalar dependencias
COPY package*.json ./

# Instalamos todas las dependencias (producción + desarrollo)
RUN npm install

# Copiamos el resto de los archivos
COPY . .

# Construimos la aplicación Next.js
RUN npm run build

# Exponemos el puerto para la aplicación
EXPOSE 3000

# Comando por defecto para iniciar la aplicación
CMD ["npm", "start"]
