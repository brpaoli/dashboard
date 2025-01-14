# Use a imagem base do Node.js
FROM node:18-alpine

# Instale as dependências do sistema necessárias para o node-gyp
RUN apk add --no-cache python3 make g++ bash

# Define o diretório de trabalho no container
WORKDIR /src

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código do projeto para o container
COPY . .

# Expõe a porta que o servidor utilizará
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
