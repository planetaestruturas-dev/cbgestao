# Gestão de Kitnets CB

Documentação funcional e técnica do sistema em produção para gestão das 12 kitnets.

## Objetivo

Centralizar contratos, cobrança, recebimentos, conciliação do Banco Inter, despesas de manutenção e resultado financeiro mensal em uma única aplicação web.

## Escopo da primeira versão

- Cadastro das 12 unidades e seus status.
- Cadastro de inquilinos e contratos, incluindo documentos e histórico.
- Geração e acompanhamento de cobranças mensais de aluguel.
- Importação de extratos do Banco Inter e conciliação assistida.
- Lançamento de despesas e manutenções por unidade ou área comum.
- Painel financeiro e relatórios mensais de recebimentos, pagamentos e resultado.
- Importação assistida dos dados da planilha atual.
- Base única SQLite compartilhada entre usuários autenticados.
- Backups gerais, pontos de restauração e recuperação por importação.

## Documentos

| Documento | Conteúdo |
| --- | --- |
| [01-visao-do-produto.md](01-visao-do-produto.md) | Conceito, perfis e regras de negócio. |
| [02-requisitos-funcionais.md](02-requisitos-funcionais.md) | Requisitos e critérios da primeira versão. |
| [03-modelo-de-dados.md](03-modelo-de-dados.md) | Entidades, relacionamentos e campos principais. |
| [04-conciliacao-e-importacao.md](04-conciliacao-e-importacao.md) | Importação da planilha e conciliação bancária. |
| [05-relatorios-e-indicadores.md](05-relatorios-e-indicadores.md) | Painel e relatórios financeiros. |
| [06-arquitetura-e-implantacao.md](06-arquitetura-e-implantacao.md) | Arquitetura e implantação atuais na VPS. |
| [07-plano-de-entrega.md](07-plano-de-entrega.md) | Estado de entrega e próximas evoluções. |
| [08-backup-e-recuperacao.md](08-backup-e-recuperacao.md) | Procedimento de backup, validação e recuperação. |

## Princípios do sistema

1. Um lançamento financeiro possui origem, categoria, comprovante e trilha de auditoria.
2. Aluguel previsto, pagamento recebido e crédito bancário são registros diferentes, ligados por conciliação.
3. Caução não é receita de aluguel. Ela fica registrada separadamente como valor sob responsabilidade.
4. Despesas podem ser atribuídas a uma kitnet específica ou a áreas comuns do prédio.
5. Nenhuma importação altera dados financeiros sem revisão e confirmação do usuário.

## Base analisada

A planilha de referência contém as abas `Contratos`, `Pagamentos` e `Relatorio`. Foram identificados 12 nomes de unidades, 33 registros de contratos e 43 registros de pagamentos com data entre maio e setembro de 2026. Ela será usada como fonte de migração, não como regra de negócio do novo sistema.

O relatório atual possui fórmulas com referências inválidas, e há valores monetários registrados tanto como número quanto como texto. A importação deverá normalizar esses dados e apresentar exceções para conferência.
