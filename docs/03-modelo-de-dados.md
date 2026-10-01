# Modelo de dados

## Relacionamentos principais

```text
Unidade 1 ── N Contrato N ── N Inquilino
Contrato 1 ── N Cobranca 1 ── N Recebimento
ImportacaoExtrato 1 ── N TransacaoBancaria
TransacaoBancaria N ── N Cobranca/Despesa via Conciliacao
Unidade 1 ── N Manutencao 1 ── N Despesa
Fornecedor 1 ── N Despesa
```

## Entidades

### Unidade

`id`, `codigo`, `nome`, `status`, `observacoes`, `criado_em`, `atualizado_em`.

O código será imutável, por exemplo `KN-01` a `KN-12`. O nome de exibição pode ser `Kitnet 01`.

### Inquilino

`id`, `nome_completo`, `cpf`, `telefone`, `email`, `endereco`, `ativo`, `observacoes`.

### Contrato

`id`, `numero`, `unidade_id`, `inicio`, `fim_previsto`, `valor_aluguel`, `dia_vencimento`, `multiplicador_multa_rescisoria`, `multa_percentual`, `juros_percentual_mes`, `indice_reajuste`, `status`, `observacoes`.

Uma tabela associativa `contrato_inquilino` permite mais de um inquilino e define quem é o titular da cobrança.

### Distrato

`id`, `contrato_id`, `data_distrato`, `fim_previsto_original`, `dias_totais`, `dias_restantes`, `multiplicador_multa`, `multa_calculada`, `multa_final`, `aluguel_proporcional`, `vencimento_proporcional`, `tratamento_caucao`, `valor_devolvido_caucao`, `data_devolucao_caucao`, `motivo`, `criado_em`.

O valor final pode ser ajustado pelo administrador, preservando o cálculo original para auditoria. O distrato gera cobranças de multa e aluguel proporcional, cancela somente parcelas futuras de aluguel em aberto e registra a devolução ou compensação da caução quando aplicável.

### Anexo de contrato

`id`, `contrato_id`, `nome_original`, `chave_armazenamento_privado`, `mime_type`, `tamanho_bytes`, `enviado_em`, `enviado_por`.

### Cobrança

`id`, `contrato_id`, `competencia`, `vencimento`, `valor_original`, `desconto`, `multa`, `juros`, `valor_devido`, `status`, `observacoes`.

A competência representa o mês do aluguel. A data do crédito no banco não substitui a competência.

### Recebimento e caução

`recebimento`: `id`, `cobranca_id`, `data_recebimento`, `valor`, `meio`, `observacoes`.

`caucao`: `id`, `contrato_id`, `data`, `valor`, `status`, `valor_devolvido`, `data_movimentacao`, `transacao_bancaria_id`, `observacoes`.

### Importação e transação bancária

`importacao_extrato`: `id`, `conta_mascarada`, `arquivo_nome`, `hash_arquivo`, `periodo_inicio`, `periodo_fim`, `importado_por`, `importado_em`, `status`.

`transacao_bancaria`: `id`, `importacao_id`, `identificador_externo`, `data`, `tipo`, `valor`, `descricao_original`, `saldo_apos`, `assinatura_deduplicacao`, `estado_conciliacao`.

### Despesa, fornecedor e manutenção

`fornecedor`: `id`, `nome`, `cpf_cnpj`, `telefone`, `email`, `tipo`.

`despesa`: `id`, `data_pagamento`, `competencia`, `valor`, `categoria`, `descricao`, `fornecedor_id`, `unidade_id` opcional, `meio_pagamento`, `status`, `comprovante_url`.

`manutencao`: `id`, `unidade_id` opcional, `titulo`, `descricao`, `categoria`, `prioridade`, `status`, `aberta_em`, `concluida_em`, `custo_estimado`, `custo_real`.

### Conciliação e auditoria

`conciliacao`: `id`, `transacao_bancaria_id`, `tipo_destino`, `destino_id`, `valor_conciliado`, `metodo`, `confianca`, `confirmada_por`, `confirmada_em`, `observacoes`.

`auditoria`: `id`, `usuario_id`, `acao`, `entidade`, `entidade_id`, `antes`, `depois`, `ocorreu_em`.

## Regras de integridade

1. Valores financeiros usam decimal com duas casas. Nunca texto formatado como moeda.
2. Datas de contrato, competência e vencimento são campos independentes.
3. Registros financeiros confirmados não são apagados fisicamente. Correções geram estorno, cancelamento ou ajuste auditável.
4. Uma transação bancária não pode ser importada duas vezes.
5. A soma das conciliações de uma transação não pode ultrapassar seu valor absoluto.
6. A base operacional é única e persistente na VPS; o navegador não é fonte de verdade para cadastros ou lançamentos.
