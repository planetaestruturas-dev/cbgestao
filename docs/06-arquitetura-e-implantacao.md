# Arquitetura e implantação

## Arquitetura proposta

```text
Navegador
    │ HTTPS
Aplicação web
    ├── Autenticação e permissões
    ├── API de contratos, financeiro e manutenção
    ├── Processador de importação e conciliação
    ├── Banco de dados PostgreSQL
    └── Armazenamento privado de anexos
```

## Stack recomendada

| Camada | Proposta | Motivo |
| --- | --- | --- |
| Aplicação | Next.js com TypeScript | Interface e API em um projeto, boa manutenção. |
| Banco de dados | PostgreSQL | Integridade transacional e relatórios financeiros confiáveis. |
| Acesso a dados | Prisma ou Drizzle | Migrações versionadas e tipagem. |
| Autenticação | Auth.js ou provedor compatível | Perfis e sessões seguras. |
| Arquivos | Armazenamento S3 compatível | Contratos e comprovantes privados. |
| Hospedagem | Hostinger com ambiente compatível a Node.js ou VPS | Implantação a validar conforme o plano contratado. |

## Repositório GitHub

Quando iniciar a implementação, criar um repositório privado com:

```text
app/
  src/
  prisma/
  tests/
  docs/
  .github/workflows/
```

O repositório terá proteção na branch principal, revisão de mudanças, variáveis de ambiente fora do código, migrações versionadas e pipeline de testes/lint antes de publicação.

## Implantação Hostinger

A decisão entre hospedagem Node.js gerenciada e VPS deve ocorrer após conferir o plano Hostinger disponível. A implantação precisa garantir:

- domínio com HTTPS;
- banco PostgreSQL gerenciado ou serviço compatível com backup;
- variáveis de ambiente configuradas no painel, nunca no Git;
- execução de migrações controlada;
- armazenamento privado para anexos;
- backups diários e teste de restauração;
- monitoramento de disponibilidade e erros.

## Segurança e LGPD

O sistema armazenará dados pessoais e financeiros. Por isso deverá aplicar mínimo privilégio, HTTPS, senhas com hash, sessão expirada, logs de auditoria, anexos privados e backups protegidos. Dados de extrato devem ser acessíveis apenas a usuários autorizados. Documentos e registros devem ter política de retenção definida antes da entrada em produção.

## Fora do código-fonte

Segredos, arquivos brutos de extrato, documentos pessoais, backups e certificados não entram no GitHub. O repositório conterá somente estrutura, código, migrações, testes e exemplos anonimizados.
