# Dockerfile per EportsTech Portal
# Multi-stage build per optimitzar la mida de la imatge

# ============================================
# STAGE 1: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar fitxers de dependències
COPY package*.json ./

# Instal·lar totes les dependències (incloent dev)
RUN npm ci

# Copiar codi font
COPY . .

# Build del frontend
RUN npm run build

# ============================================
# STAGE 2: Runner (Producció)
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Crear usuari no-root per seguretat
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copiar només el necessari del builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/package*.json ./

# Instal·lar només dependències de producció
RUN npm ci --only=production && npm cache clean --force

# Canviar a usuari no-root
USER nodejs

# Exposar port
EXPOSE 3000

# Variables d'entorn per defecte
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:3000/api/health || exit 1

# Iniciar servidor
CMD ["node", "server/index.js"]
