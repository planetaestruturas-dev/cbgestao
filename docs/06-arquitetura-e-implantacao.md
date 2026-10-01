# Arquitetura e implantação

## Arquitetura implantada

```text
Navegador
    │ HTTPS
Nginx (container web)
    ├── React/Vite (interface)
    └── API Node.js (container privado)
          ├── Autenticação, perfis e sessões
          ├── Base SQLite persistente compartilhada
          ├── Trilha de auditoria por alteração de conjunto de dados
          └── Dados e anexos armazenados no volume protegido da VPS
```

## Stack em produção

| Camada | Proposta | Motivo |
| --- | --- | --- |
| Interface | React + Vite | Aplicação responsiva entregue como arquivos estáticos. |
| API | Node.js 22 | Autenticação, perfis e persistência de dados. |
| Banco de dados | SQLite em volume persistente da VPS | Base única, transações, WAL e verificação de integridade. |
| Autenticação | PIN com hash scrypt e cookie HTTP-only | Sessões com expiração e bloqueio após tentativas inválidas. |
| Hospedagem | Hostinger VPS com Docker Compose e Nginx | HTTPS e implantação por releases com symlink `current`. |

## Repositório GitHub

O repositório GitHub já está ativo e contém:

```text
src/                 interface
server/              API, autenticação e base compartilhada
docs/                documentação funcional e técnica
```

Dados operacionais, documentos pessoais, exportações de extrato, backups e segredos permanecem fora do GitHub.

## Implantação Hostinger

Implantação atual na VPS:

- domínio com HTTPS;
- volume persistente `/srv/cbgestao/auth-data` para autenticação e base SQLite;
- releases em `/srv/cbgestao/releases` e ativação por `/srv/cbgestao/current`;
- diretório de backups com permissões restritas em `/srv/cbgestao/backups`;
- cópia consistente SQLite via `VACUUM INTO`, acompanhada do arquivo de autenticação;
- validação de integridade SQLite após reinício;
- monitoramento de disponibilidade e erros.

## Segurança e LGPD

O sistema armazena dados pessoais e financeiros. Aplica HTTPS, mínimo privilégio por perfil, PIN com hash, sessão expirada, bloqueio temporário de tentativas inválidas, cookies HTTP-only, logs de auditoria e backups protegidos. Dados de extrato e documentos devem ser acessíveis apenas a usuários autorizados.

## Fora do código-fonte

Segredos, arquivos brutos de extrato, documentos pessoais, backups e certificados não entram no GitHub. O repositório conterá somente estrutura, código, migrações, testes e exemplos anonimizados.
