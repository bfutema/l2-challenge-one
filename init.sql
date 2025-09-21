-- Script de inicialização do banco de dados
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Comentário: As tabelas serão criadas automaticamente pelo TypeORM
-- quando a aplicação NestJS for iniciada
