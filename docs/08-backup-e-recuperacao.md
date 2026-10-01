# Backup e recuperação

## Escopo da cópia

O backup de infraestrutura inclui:

- `cbgestao.sqlite`: base compartilhada com unidades, contratos, cobranças, recebimentos, despesas, manutenções, distratos, cauções, pontos de restauração e anexos atualmente armazenados pela aplicação;
- `auth.json`: usuários, perfis, hashes de PIN e sessões;
- arquivo compactado com as duas cópias e checksum SHA-256.

Os arquivos são armazenados na VPS com permissões `600` e diretório com permissões `700`.

## Backup pela aplicação

No menu **Backups**, o Administrador Geral pode:

1. Criar um ponto de restauração compartilhado antes de uma alteração sensível.
2. Exportar um backup geral em JSON para guarda externa.
3. Importar um JSON de backup para recuperar os dados cadastrados.
4. Restaurar um ponto já registrado.

Restaurar ou importar substitui os dados operacionais atuais. Antes dessas ações, exporte um backup geral e crie um ponto de restauração.

## Backup de infraestrutura

A cópia consistente do SQLite deve ser criada com `VACUUM INTO`, e não por cópia simples do arquivo em uso. O arquivo de autenticação deve ser copiado no mesmo procedimento. O pacote resultante precisa ter seu checksum registrado e sua integridade SQLite validada antes de ser considerado recuperável.

## Recuperação

1. Colocar a aplicação em manutenção ou impedir novos lançamentos.
2. Criar uma cópia de segurança do estado atual.
3. Validar o checksum do pacote escolhido.
4. Restaurar `cbgestao.sqlite` e `auth.json` no volume persistente, preservando permissões restritas.
5. Reiniciar os containers.
6. Consultar o endpoint de saúde e executar `PRAGMA integrity_check` no SQLite.
7. Entrar com uma conta administrativa, validar relatórios e somente então liberar os demais usuários.

## Responsabilidade operacional

Backups devem ser copiados periodicamente para local externo à VPS. A existência de uma cópia apenas no mesmo servidor não protege contra perda total da infraestrutura.
