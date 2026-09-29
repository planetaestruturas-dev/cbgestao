# Requisitos funcionais

## Unidades e inquilinos

- RF-01: cadastrar as 12 kitnets com código único, identificação, status e observações.
- RF-02: permitir status `ocupada`, `vaga`, `em manutenção` e `bloqueada`.
- RF-03: cadastrar inquilino com nome completo, CPF, telefone, e-mail, endereço e documentos anexos.
- RF-04: manter histórico de ocupação da unidade sem sobrescrever contratos anteriores.

## Contratos e cobrança

- RF-05: criar contrato com unidade, inquilino(s), início, fim previsto, valor mensal, dia de vencimento, multa, juros, reajuste, caução e anexos.
- RF-06: impedir dois contratos ativos que se sobreponham para a mesma unidade.
- RF-07: gerar cobranças mensais para cada contrato ativo. Uma cobrança só será criada se seu vencimento calculado estiver dentro do período do contrato; o sistema evita duplicar competência já gerada.
- RF-08: permitir alteração pontual de uma cobrança sem mudar o contrato, com motivo registrado.
- RF-09: mostrar situação da cobrança como `em aberto`, `parcial`, `paga`, `vencida`, `cancelada` ou `renegociada`.
- RF-10: avisar sobre contratos próximos do fim e cobranças vencidas.

## Banco Inter e conciliação

- RF-11: importar arquivo de extrato com conta, período, saldo, data, descrição, valor e identificador bancário quando disponível.
- RF-12: preservar arquivo, linhas originais e resultado da validação da importação.
- RF-13: detectar duplicidade pelo identificador bancário ou por assinatura segura da transação.
- RF-14: sugerir conciliação por valor, data, nome/descrição e referência de cobrança.
- RF-15: exigir confirmação humana para conciliação sugerida, exceto se uma regra futura for explicitamente configurada pelo administrador.
- RF-16: permitir conciliação parcial, vários créditos para uma cobrança e um crédito distribuído entre lançamentos quando justificado.
- RF-17: manter fila de créditos e débitos bancários não conciliados.

## Despesas e manutenção

- RF-18: lançar despesa com data, valor, fornecedor ou beneficiário, descrição, categoria, forma de pagamento e comprovante.
- RF-19: vincular a despesa a uma kitnet, a área comum ou a múltiplas unidades por rateio documentado.
- RF-20: registrar solicitação de manutenção, prioridade, status, responsável, datas e custo estimado/real.
- RF-21: vincular uma ou mais despesas a uma manutenção.
- RF-22: conciliar a despesa com débito do extrato bancário ou marcar outro meio de pagamento.

## Painel e relatórios

- RF-23: exibir no painel mensal receitas recebidas, despesas pagas, resultado de caixa, inadimplência, ocupação e saldo não conciliado.
- RF-24: permitir filtros por período, unidade, categoria e status.
- RF-25: emitir relatórios mensais, por unidade e por fornecedor, com exportação para CSV e PDF em fase posterior.

## Segurança e operação

- RF-26: autenticar usuários e aplicar permissões por perfil.
- RF-27: registrar auditoria de criação, edição, exclusão lógica, importação e conciliação.
- RF-28: anexar documentos em armazenamento privado e limitar seu acesso aos usuários autorizados.
- RF-29: realizar cópia de segurança diária do banco de dados e validar restauração periodicamente.
