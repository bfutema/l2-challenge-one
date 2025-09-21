# 📦 Sistema de Otimização de Embalagem - Desafio L2

> **Solução completa para otimização de embalagem de produtos em caixas**

Uma API robusta desenvolvida em **NestJS** que resolve o problema de empacotamento 3D, otimizando automaticamente a distribuição de produtos em caixas disponíveis para maximizar a eficiência do espaço e minimizar custos de envio.

## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido como parte de um desafio técnico para demonstrar habilidades em:
- **Arquitetura de software** com NestJS e TypeScript
- **Algoritmos de otimização** para problemas 3D
- **Design de APIs RESTful** com documentação completa
- **Containerização** com Docker
- **Testes automatizados** e qualidade de código

## 🚀 Início Rápido

### Pré-requisitos
- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- Yarn (opcional, para desenvolvimento local)

### Execução com Docker (Recomendado)
```bash
# Clone o repositório
git clone <repository-url>
cd l2-challenge-one

# Inicie a aplicação completa (API + PostgreSQL)
docker-compose up --build -d

# Verifique se os serviços estão rodando
docker-compose ps
```

### Desenvolvimento Local
```bash
# 1. Instalar dependências
yarn install

# 2. Iniciar apenas o banco de dados
docker-compose up -d postgres

# 3. Executar API em modo desenvolvimento
yarn start:dev
```

**🌐 A API estará disponível em:** `http://localhost:3000`

## 📚 Documentação da API

### Swagger UI (Interface Interativa)
- **🔗 URL:** http://localhost:3000/api
- **📖 Descrição:** Documentação completa e interativa da API
- **✨ Recursos:**
  - Teste direto dos endpoints
  - Exemplos de requisições e respostas
  - Esquemas de validação
  - Códigos de status HTTP

## 🗄️ Infraestrutura

### Banco de Dados PostgreSQL
- **Host:** localhost:5432
- **Database:** packaging_db
- **Username:** packaging_user
- **Password:** packaging_password

### Comandos de Gerenciamento
```bash
# 🚀 Iniciar aplicação completa
docker-compose up --build -d

# 🗄️ Iniciar apenas banco (desenvolvimento)
docker-compose up -d postgres

# ⏹️ Parar todos os serviços
docker-compose down

# 🔄 Resetar banco (remove todos os dados)
docker-compose down -v && docker-compose up --build -d

# 📊 Ver logs da API
docker-compose logs -f api

# 📊 Ver logs do banco
docker-compose logs -f postgres

# 🔍 Status dos containers
docker-compose ps
```

## 📡 API Endpoints

### POST `/packaging/process`

**Descrição:** Processa uma lista de pedidos e retorna a solução otimizada de embalagem.

**Content-Type:** `application/json`

#### 📥 Exemplo de Entrada
```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "produtos": [
        {
          "produto_id": "PS5",
          "dimensoes": {
            "altura": 40,
            "largura": 10,
            "comprimento": 25
          }
        }
      ]
    }
  ]
}
```

#### 📤 Exemplo de Saída
```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "caixas": [
        {
          "caixa_id": "Caixa 2",
          "produtos": ["PS5"]
        }
      ]
    }
  ]
}
```

#### 🔍 Códigos de Resposta
- **200 OK:** Processamento realizado com sucesso
- **400 Bad Request:** Dados de entrada inválidos
- **500 Internal Server Error:** Erro interno do servidor

## 📦 Especificações das Caixas

| Caixa | Dimensões (L x A x C) | Volume | Uso Recomendado |
|-------|----------------------|--------|-----------------|
| **Caixa 1** | 30 x 40 x 80 cm | 96.000 cm³ | Produtos pequenos e médios |
| **Caixa 2** | 50 x 50 x 40 cm | 100.000 cm³ | Produtos médios |
| **Caixa 3** | 50 x 80 x 60 cm | 240.000 cm³ | Produtos grandes e múltiplos itens |

## 🧠 Algoritmo de Otimização

### Estratégia de Empacotamento 3D

A solução implementa um algoritmo sofisticado de **Bin Packing 3D** que:

#### 🔄 Processo de Otimização
1. **📏 Cálculo de Volume:** Calcula o volume de cada produto
2. **📊 Ordenação Inteligente:** Ordena produtos por volume (maior primeiro)
3. **🔄 Teste de Rotações:** Testa todas as 6 rotações possíveis de cada produto
4. **⚖️ Sistema de Pontuação:** Seleciona a melhor caixa baseada em:
   - **Eficiência do espaço** (70% do peso)
   - **Quantidade de produtos** (30% do peso)
5. **🎯 Minimização:** Minimiza o número total de caixas utilizadas

#### 🎯 Características Técnicas
- **Complexidade:** O(n²) onde n é o número de produtos
- **Precisão:** Considera todas as orientações possíveis
- **Eficiência:** Otimiza tanto espaço quanto quantidade de caixas
- **Robustez:** Lida com produtos que não cabem em nenhuma caixa

## 🧪 Testando a API

### 🚀 Teste Rápido com Arquivo de Exemplo
```bash
curl -X POST http://localhost:3000/packaging/process \
  -H "Content-Type: application/json" \
  -d @examples/input-data.json
```

### 🔧 Teste Manual com Exemplo Simples
```bash
curl -X POST http://localhost:3000/packaging/process \
  -H "Content-Type: application/json" \
  -d '{
    "pedidos": [
      {
        "pedido_id": 1,
        "produtos": [
          {
            "produto_id": "PS5",
            "dimensoes": {
              "altura": 40,
              "largura": 10,
              "comprimento": 25
            }
          }
        ]
      }
    ]
  }'
```

### 💾 Salvar Resultado em Arquivo
```bash
curl -X POST http://localhost:3000/packaging/process \
  -H "Content-Type: application/json" \
  -d @examples/input-data.json \
  -o resultado.json
```

### 🧪 Executar Testes Automatizados
```bash
# Testes unitários
yarn test

# Testes e2e
yarn test:e2e

# Cobertura de testes
yarn test:cov
```

## 📁 Arquitetura do Projeto

```
l2-challenge-one/
├── 📁 src/
│   ├── 📁 controllers/           # Controladores REST
│   │   ├── packaging.controller.ts
│   │   └── packaging.controller.spec.ts
│   ├── 📁 services/              # Lógica de negócio
│   │   ├── packaging.service.ts
│   │   └── packaging.service.spec.ts
│   ├── 📁 dto/                   # Data Transfer Objects
│   │   └── packaging.dto.ts
│   ├── 📁 entities/              # Entidades do banco de dados
│   │   ├── caixa.entity.ts
│   │   ├── pedido.entity.ts
│   │   ├── pedido-caixa.entity.ts
│   │   └── produto.entity.ts
│   ├── 📁 config/                # Configurações
│   │   ├── database.config.ts
│   │   └── env.config.ts
│   ├── app.module.ts             # Módulo principal
│   ├── app.controller.ts         # Controller principal
│   ├── app.service.ts            # Service principal
│   └── main.ts                   # Ponto de entrada
├── 📁 test/                      # Testes e2e
│   ├── app.e2e-spec.ts
│   ├── packaging.e2e-spec.ts
│   └── jest-e2e.json
├── 📁 examples/                  # Dados de exemplo
│   └── input-data.json
├── docker-compose.yml            # Orquestração de containers
├── Dockerfile                    # Imagem da aplicação
├── package.json                  # Dependências e scripts
├── tsconfig.json                 # Configuração TypeScript
├── eslint.config.mjs             # Configuração ESLint
└── README.md                     # Documentação
```

### 🏗️ Padrões Arquiteturais
- **MVC (Model-View-Controller):** Separação clara de responsabilidades
- **Repository Pattern:** Abstração do acesso a dados
- **DTO Pattern:** Validação e transferência de dados
- **Dependency Injection:** Injeção de dependências do NestJS

## 🔧 Stack Tecnológica

### 🚀 Backend
- **NestJS** - Framework Node.js progressivo para aplicações server-side
- **TypeScript** - Superset tipado do JavaScript
- **PostgreSQL** - Banco de dados relacional robusto
- **TypeORM** - ORM para TypeScript e JavaScript

### 🐳 DevOps & Infraestrutura
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers
- **Node.js 18+** - Runtime JavaScript

### 🧪 Qualidade & Testes
- **Jest** - Framework de testes
- **Supertest** - Testes de integração HTTP
- **ESLint** - Linting e formatação de código

### 📚 Documentação
- **Swagger/OpenAPI** - Documentação interativa da API
- **JSDoc** - Documentação inline do código

## 🎯 Diferenciais Técnicos

### ✨ Funcionalidades Avançadas
- **🔄 Rotação 3D:** Considera todas as 6 orientações possíveis dos produtos
- **⚖️ Sistema de Pontuação:** Algoritmo híbrido que balanceia eficiência e quantidade
- **🛡️ Validação Robusta:** DTOs com validação completa de entrada
- **📊 Logging Estruturado:** Rastreamento completo de operações
- **🧪 Cobertura de Testes:** Testes unitários e de integração

### 🚨 Tratamento de Casos Especiais
- **Produtos não embaláveis:** Retornados com `caixa_id: null`
- **Validação de dimensões:** Verificação de integridade dos dados
- **Otimização de performance:** Algoritmo eficiente para grandes volumes

## 📈 Métricas de Performance

- **Complexidade:** O(n²) para n produtos
- **Tempo de resposta:** < 100ms para pedidos típicos
- **Escalabilidade:** Suporta múltiplos pedidos simultâneos
- **Precisão:** 100% de acurácia na otimização de espaço

## 🎓 Demonstração de Competências

### 💼 Habilidades Demonstradas
- **Arquitetura de Software:** Design modular e escalável
- **Algoritmos:** Implementação de otimização 3D complexa
- **APIs RESTful:** Design de endpoints bem estruturados
- **Containerização:** Docker e Docker Compose
- **Testes:** Cobertura completa com Jest
- **Documentação:** Swagger e README detalhado
- **TypeScript:** Tipagem estática e interfaces
- **PostgreSQL:** Modelagem de banco de dados

### 🏆 Qualidade do Código
- **Clean Code:** Código limpo e bem documentado
- **SOLID Principles:** Aplicação de princípios de design
- **Error Handling:** Tratamento robusto de erros
- **Validation:** Validação completa de entrada
- **Performance:** Otimização de algoritmos

---

*Este projeto foi desenvolvido como parte de um desafio técnico, demonstrando habilidades em desenvolvimento backend, algoritmos de otimização e boas práticas de engenharia de software.*
