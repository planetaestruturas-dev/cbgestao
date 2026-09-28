# Conciliação e importação

## Estratégia inicial para Banco Inter

A primeira versão aceita o CSV exportado pelo usuário a partir da conta do Banco Inter. O formato foi validado com um extrato real que contém linhas iniciais de identificação da conta e, em seguida, o cabeçalho `Data Lançamento`, `Histórico`, `Descrição`, `Valor` e `Saldo`. O importador ignora os metadados iniciais e usa as cinco colunas financeiras. OFX poderá ser incluído em fase posterior.

Não serão armazenadas senha, token, certificado ou credenciais bancárias. A integração direta, se desejada depois, será um projeto separado sujeito à disponibilidade de API, autorização da conta e revisão de segurança.

## Fluxo de importação

1. O gestor seleciona o CSV de extrato da conta.
2. O sistema valida formato, período, colunas e valores.
3. O sistema cria uma prévia: registros novos, possíveis duplicados e linhas com erro.
4. O gestor confirma a importação.
5. As transações entram na fila de conciliação sem alterar automaticamente contratos, cobranças ou despesas.
6. O sistema apresenta sugestões e o gestor confirma, ajusta ou mantém a transação pendente.

## Regras de sugestão de conciliação

As sugestões terão pontuação explicável, considerando:

- crédito com valor igual ou compatível com cobrança em aberto;
- data próxima ao vencimento, com tolerância configurável;
- nome do inquilino, unidade ou referência identificável na descrição do extrato;
- cobrança ainda não totalmente paga;
- existência de uma única candidata forte.

Uma sugestão nunca deve transformar sozinha uma cobrança em paga. A confirmação registra usuário, data, valor conciliado e método.

## Cenários que precisam de suporte

| Cenário | Tratamento |
| --- | --- |
| Pagamento integral | Um crédito conciliado a uma cobrança. |
| Pagamento parcial | Crédito ligado parcialmente; cobrança permanece parcial. |
| Vários Pix para um aluguel | Vários créditos vinculados à mesma cobrança. |
| Pix sem identificação | Mantido como crédito pendente até confirmação. |
| Caução | Classificado como caução e excluído de receita de aluguel. |
| Débito de fornecedor | Conciliado com despesa existente ou convertido em despesa com revisão. |
| Transferência entre contas | Classificada como transferência, fora de receitas e despesas operacionais. |

## Migração da planilha atual

| Aba de origem | Destino | Tratamento |
| --- | --- | --- |
| `Contratos` | Unidades, inquilinos e contratos históricos | Padronizar nomes e converter valores monetários em texto para decimal. |
| `Pagamentos` | Cobranças/recebimentos históricos | Extrair competência da observação quando possível; itens ambíguos entram em fila de revisão. |
| `Relatorio` | Não migrar como fonte de dados | Recriar os indicadores a partir das entidades consolidadas. |

### Exceções já identificadas

- Há valores de aluguel em formato numérico e em texto, como `R$600,00`.
- Há variações de escrita para unidade e inquilino.
- Há entradas de caução junto com pagamentos de aluguel.
- Há pelo menos uma observação de manutenção em um lançamento que se apresenta como pagamento.
- O relatório contém referências de fórmula inválidas. Ele não deve ser usado como fonte para cálculos históricos.

## Arquivo de migração recomendado

Antes de importar dados definitivos, criar uma tabela de revisão com: linha de origem, entidade de destino, valor original, valor normalizado, regra aplicada, status e responsável pela aprovação. Apenas linhas aprovadas serão gravadas como dados financeiros finais.
