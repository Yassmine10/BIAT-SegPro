FROM node:22-alpine

WORKDIR /workspace

COPY package*.json ./

# Install packages
RUN npm install

# Copy source
COPY . .

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "dev"]
