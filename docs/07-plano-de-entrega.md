# Plano de entrega

## Estado de entrega

- Aplicação publicada com autenticação, perfis e base compartilhada.
- Cadastro de unidades, inquilinos, fornecedores, categorias, contratos, cobranças, despesas, manutenções e distratos.
- Importação CSV do Banco Inter, conciliação assistida e relatórios operacionais.
- Gestão de cauções, liquidação de distrato, backups e pontos de restauração.

## Próximas evoluções recomendadas

1. Criar rotina automática de backup diário e alerta de falha.
2. Adicionar exportação CSV em todos os relatórios e validar com a operação mensal fechada.
3. Evoluir anexos para armazenamento de arquivos dedicado, fora da base SQLite.
4. Adicionar controle de concorrência por versão para edição simultânea do mesmo lançamento.

**Aceite:** backup automatizado testado, relatórios validados e edição concorrente protegida.

## Itens de validação operacional

1. Conferir a migração dos lançamentos antigos de cada navegador para a base compartilhada.
2. Fechar um mês completo comparando relatórios, extrato Banco Inter e documentos de despesa.
3. Registrar e testar uma restauração de backup em ambiente isolado antes de depender dela em produção.
4. Revisar periodicamente os perfis de acesso e desativar usuários que não precisem mais operar o sistema.
