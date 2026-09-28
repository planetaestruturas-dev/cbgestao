# Visão do produto

## Problema

A operação das kitnets depende hoje de planilhas para contratos, aluguéis e acompanhamento financeiro. Isso dificulta identificar atrasos, distinguir aluguel de caução, associar despesas a cada unidade e conferir se cada entrada no Banco Inter corresponde a uma cobrança.

## Proposta

O **Gestão de Kitnets CB** será uma aplicação web privada para administrar um prédio de 12 unidades. O sistema exibirá a situação de ocupação, contratos ativos, aluguéis em aberto, recebimentos conciliados, despesas de manutenção e resultado financeiro por mês.

## Perfis de acesso

| Perfil | Permissões na primeira versão |
| --- | --- |
| Administrador | Acesso completo, configurações, usuários, importações e exclusões lógicas. |
| Gestor | Opera contratos, cobranças, despesas, manutenção, conciliação e relatórios. |
| Consulta | Visualiza painel e relatórios, sem alterar dados. |

## Jornada operacional mensal

1. O gestor confere contratos, valores e dia de vencimento.
2. O sistema gera as cobranças do mês para os contratos ativos.
3. O gestor importa o extrato do Banco Inter.
4. O sistema sugere vínculos entre créditos bancários e cobranças. O gestor confirma ou corrige as sugestões.
5. O gestor registra despesas e manutenções, anexando comprovantes quando disponíveis.
6. O painel atualiza o total recebido, o total pago, os valores pendentes e o resultado do mês.

## Limites da primeira versão

- Não haverá pagamento de boleto ou Pix iniciado dentro do sistema.
- A integração bancária inicial será por arquivo de extrato exportado pelo usuário. Uma integração direta com API do banco só será considerada depois de validar acesso, escopo e autorização da conta.
- Não haverá portal do inquilino na primeira versão. O sistema registrará cobranças e pagamentos administrativamente.

## Conceitos financeiros

| Conceito | Definição no sistema |
| --- | --- |
| Cobrança | Valor esperado de um contrato para uma competência e vencimento. |
| Recebimento | Valor efetivamente vinculado a uma cobrança. Pode ser parcial ou total. |
| Transação bancária | Linha importada do extrato do Banco Inter. Não é alterada após a importação. |
| Conciliação | Ligação confirmada entre transação bancária e recebimento, despesa ou outro lançamento. |
| Caução | Valor recebido como garantia. Não entra na receita de aluguel nem no resultado mensal. |
| Despesa | Saída de caixa classificada, opcionalmente vinculada a unidade ou área comum. |
| Resultado de caixa | Recebimentos de aluguel e outras receitas menos despesas pagas no período, excluindo cauções. |
