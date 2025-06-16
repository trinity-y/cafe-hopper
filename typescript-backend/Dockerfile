FROM --platform=linux/arm64 node:20.11.1

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

COPY scripts/docker-scripting.sh ./docker-scripting.sh
RUN chmod +x docker-scripting.sh

ENV PORT 8080
EXPOSE 8080

ENTRYPOINT ["./docker-scripting.sh"]
CMD ["npm", "start"]
