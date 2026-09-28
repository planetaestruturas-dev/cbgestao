# Relatórios e indicadores

## Painel mensal

O painel deve permitir selecionar mês, intervalo, unidade e categoria. Os valores serão calculados a partir de lançamentos conciliados ou confirmados, conforme a métrica.

| Indicador | Cálculo |
| --- | --- |
| Aluguel previsto | Soma do valor devido das cobranças da competência. |
| Aluguel recebido | Soma dos recebimentos vinculados a cobranças, por data de recebimento. |
| Despesas pagas | Soma das despesas pagas, por data de pagamento. |
| Resultado de caixa | Aluguel recebido + outras receitas operacionais − despesas pagas. |
| Inadimplência | Valor vencido ainda em aberto. |
| Taxa de recebimento | Aluguel recebido da competência ÷ aluguel previsto da competência. |
| Ocupação | Unidades ocupadas ÷ 12. |
| Manutenção | Despesas de manutenção no período, por unidade e área comum. |
| Saldo a conciliar | Soma de créditos e débitos bancários ainda pendentes. |

Cauções, transferências entre contas e valores não identificados aparecem em cartões próprios e não compõem o resultado de caixa até sua classificação adequada.

## Relatórios da primeira versão

1. **Resultado mensal:** receitas, despesas, resultado e comparação com mês anterior.
2. **Contas a receber:** cobranças por competência, vencidas, parciais e pagas.
3. **Recebimentos conciliados:** crédito bancário, cobrança vinculada, inquilino, unidade e data de confirmação.
4. **Extrato pendente:** transações sem conciliação ou com divergência.
5. **Despesas por unidade:** manutenção e demais despesas por kitnet, incluindo fornecedor.
6. **Despesas por fornecedor e categoria:** total, frequência e período.
7. **Contratos:** ativos, próximos do vencimento, encerrados e unidades vagas.
8. **Histórico da unidade:** contratos, cobranças, recebimentos, manutenções e despesas de cada kitnet.

## Convenções de período

- Receitas recebidas e despesas pagas usam a data real de caixa.
- Acompanhar aluguel devido usa a competência da cobrança.
- Os relatórios devem mostrar claramente a base utilizada: `competência` ou `caixa`.
- Filtros de intervalo incluem o primeiro e o último dia selecionados.
