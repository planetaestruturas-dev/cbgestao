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
8. **Recebimentos por unidade:** valores efetivamente recebidos, incluindo multa e juros discriminados.
9. **Despesas por unidade e fornecedor:** quantidade de lançamentos e total financeiro para identificar unidades e prestadores mais onerosos.
10. **Manutenções por unidade:** total de chamados, concluídos, pendentes e custo calculado pelas despesas vinculadas; cada manutenção possui relatório detalhado de suas despesas.
11. **Cauções em posse:** cauções a receber, recebidas sob guarda, devolvidas, utilizadas em reparos ou compensadas com débitos, por unidade e inquilino.
12. **Liquidação de distrato:** multa rescisória, aluguel proporcional, parcelas canceladas e tratamento registrado para a caução.

Relatórios recomendados para a próxima etapa: inadimplência por faixa de atraso, previsão de caixa por vencimento, contratos a vencer, rentabilidade por unidade e comparação entre custo estimado e custo real de manutenção.
8. **Histórico da unidade:** contratos, cobranças, recebimentos, manutenções e despesas de cada kitnet.

## Convenções de período

- Receitas recebidas e despesas pagas usam a data real de caixa.
- Acompanhar aluguel devido usa a competência da cobrança.
- Os relatórios devem mostrar claramente a base utilizada: `competência` ou `caixa`.
- Filtros de intervalo incluem o primeiro e o último dia selecionados.
