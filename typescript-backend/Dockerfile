FROM node:20.11.1

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY prisma/ ./prisma/

RUN npx prisma generate

COPY . .

RUN npm run build

COPY scripts/docker-scripting.sh ./docker-scripting.sh
RUN chmod +x docker-scripting.sh

EXPOSE 3001

ENTRYPOINT ["./docker-scripting.sh"]
CMD ["npm", "start"]