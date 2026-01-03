FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

# RUN BUAT FASE DEVELOPMENT
CMD ["npm", "run", "dev"]
# RUN BUAT FASE PRODUCTION
# CMD ["npm", "start"]
