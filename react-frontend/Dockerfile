FROM node:20.11.1

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "start"]