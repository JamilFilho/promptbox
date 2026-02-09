# Configuração do Prisma com PostgreSQL

## Instalação

As dependências já foram instaladas:
- `@prisma/client` - Cliente Prisma
- `prisma` - CLI do Prisma
- `bcrypt` - Para criptografia de senhas

## Configuração do Banco de Dados

1. **Criar arquivo `.env.local`** (já criado):
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/promptbox"
   ```
   Substitua `user`, `password` e a porta conforme sua configuração PostgreSQL.

2. **Estrutura do Schema**:
   - Arquivo: `prisma/schema.prisma`
   - Tabela: `users` com campos:
     - `id` (UUID primária)
     - `nome` (String)
     - `email` (String única)
     - `password` (String com hash bcrypt)
     - `createdAt` (DateTime)
     - `updatedAt` (DateTime)

## Criptografia de Senhas

A criptografia é feita usando **bcrypt** com 12 salt rounds (padrão atual de segurança).

Funções disponíveis em `lib/auth.ts`:
- `hashPassword(password)` - Criptografa uma senha
- `verifyPassword(password, hash)` - Verifica se uma senha corresponde ao hash

## Scripts Disponíveis

```bash
# Executar migrações em desenvolvimento
npm run prisma:migrate

# Deploy de migrações em produção
npm run prisma:migrate:deploy

# Abrir Prisma Studio (interface gráfica)
npm run prisma:studio
```

## Próximos Passos

1. Configure o banco de dados PostgreSQL
2. Atualize o `DATABASE_URL` no `.env.local`
3. Execute `npm run prisma:migrate` para criar as tabelas
4. Use `lib/prisma.ts` para acessar a instância do Prisma Client
5. Use `lib/auth.ts` para hash/verificação de senhas

## Exemplo de Uso

```typescript
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

// Criar um usuário
const user = await prisma.user.create({
  data: {
    nome: "João Silva",
    email: "joao@example.com",
    password: await hashPassword("senha123"),
  },
});

// Buscar usuário por email
const foundUser = await prisma.user.findUnique({
  where: { email: "joao@example.com" },
});
```

## Segurança

- As senhas são sempre armazenadas como hashes SHA-512 + bcrypt
- Nunca armazene senhas em texto plano
- Use `verifyPassword()` ao fazer login para comparar senhas
