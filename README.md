# CB Gestão de Kitnets

Sistema web privado para administrar contratos, aluguéis, cauções, despesas, manutenções, conciliação do Banco Inter e relatórios de um prédio com 12 kitnets.

## Produção

- Aplicação: https://cbgestao.locup.cloud
- Código e documentação: repositório GitHub `planetaestruturas-dev/cbgestao`
- Base operacional: SQLite persistente na VPS, compartilhada entre todos os usuários autenticados.

Os dados operacionais não usam o navegador como fonte de verdade. O navegador somente apresenta os dados da base compartilhada; existe uma ação administrativa única para migrar dados antigos que tenham sido lançados antes da centralização.

## Segurança e backup

- Login por nome de usuário e PIN numérico de seis dígitos, armazenado somente como hash.
- Sessões HTTP-only, expiração de sessão e bloqueio temporário após tentativas inválidas.
- Perfis de acesso e gravação de auditoria das alterações na base.
- Menu **Backups** para criar pontos de restauração, exportar, importar e restaurar cópias.
- Backup de infraestrutura inclui banco SQLite, dados de autenticação e anexos armazenados na base.

Consulte a documentação funcional e técnica em [docs/README.md](docs/README.md).
