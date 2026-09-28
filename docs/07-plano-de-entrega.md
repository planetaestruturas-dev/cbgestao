# Plano de entrega

## Fase 0 — Definição concluída nesta etapa

- Conceito do produto, regras financeiras e escopo da primeira versão.
- Modelo de dados e fluxo de importação/conciliação.
- Relatórios e arquitetura recomendada.

## Fase 1 — Fundação do projeto

1. Confirmar nome do sistema, domínio e plano Hostinger.
2. Criar repositório privado no GitHub e estrutura inicial.
3. Configurar banco de dados, autenticação, perfis e trilha de auditoria.
4. Cadastrar as 12 unidades e categorias financeiras.

**Aceite:** acesso protegido, cadastro de unidades e ambiente de homologação funcionando.

## Fase 2 — Operação imobiliária

1. Implementar inquilinos, contratos, anexos e histórico de ocupação.
2. Implementar geração de cobranças e visão de contas a receber.
3. Construir importador assistido da planilha com tela de revisão.

**Aceite:** contratos ativos e históricos migrados após aprovação das exceções.

## Fase 3 — Financeiro e conciliação

1. Implementar despesas, fornecedores e manutenções.
2. Implementar importação de extrato com deduplicação.
3. Implementar fila e confirmação de conciliação.

**Aceite:** um período de extrato pode ser importado, conciliado e auditado sem duplicar transações.

## Fase 4 — Painel, relatórios e produção

1. Implementar painel e relatórios mensais.
2. Validar números com um mês fechado da operação.
3. Configurar domínio, backups, monitoramento e publicação na Hostinger.

**Aceite:** resultado mensal bate com a conferência do gestor e a aplicação está publicada com HTTPS e backup configurado.

## Decisões necessárias antes de codificar

- Qual plano/serviço da Hostinger será usado para a aplicação e banco?
- Qual domínio será utilizado?
- O extrato do Banco Inter está disponível em CSV, OFX ou ambos? Um arquivo real, com dados sensíveis ocultados se necessário, definirá o importador.
- Quais regras de multa, juros, reajuste e tolerância de atraso serão aplicadas?
- A despesa de área comum será apenas registrada como custo geral ou rateada entre unidades?
- Quem terá acesso ao sistema além do administrador?
