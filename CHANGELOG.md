# Changelog do plugin Business Creator

Cada versão é aprovada pelo Arthur depois de testada numa pasta limpa, fora do OS (decisão 4 da proposta de 29/10/2026).

## 0.2.0 (30/10/2026)
As lições da primeira implantação com pessoa real (avaliação de 30/10/2026, mudanças M1, M2, M3, M5 e M6; decisões 1, 2 e 6 aprovadas pelo Arthur em 30/10). O que travava o uso real depois do Base Camp.
- **Skill nova `rotinas-e-computador`:** antes de rodar algo, o sistema lê a ficha do computador; toda rotina que produz uma entrega fica gravada na pasta, com a conferência dentro; resultado zero, vazio ou fora de escala não sai sem conferência; o arquivo original nunca é editado; regras do Windows (UTF-8 com BOM, acento, vírgula decimal, Excel só fechado, `Get-Date`) e do Mac (Python sem abrir a janela de instalação, iCloud); sem Python numa máquina da empresa, vira pendência para a TI.
- **Montagem 1.7 (roteiro 1.5):** a etapa 6 começa pelo inventário do computador (6.0, sem pergunta) e grava `contexto/computador.md`. O `AGENTS.md` final, gravado na 6.1, leva a seção "Montagem em andamento" até o Fim, para a retomada no meio da etapa 6 funcionar. A primeira tarefa aprovada (6.7) vira arquivo em `modelos/`. A hora pelo `Get-Date` no Windows.
- **Estilo de resposta:** rotina gravada, conferência antes de entregar, o que ela aprova vira arquivo, palavras dela no glossário, nada fica no ar (Pendências).
- **Modelos:** a ficha da frente ganha Palavras minhas, Pendências, Rotinas e Modelos aprovados; o `AGENTS.md` da raiz ganha "O meu computador" e três regras em "Como este sistema cresce"; o guia de bolso e a ajuda ganham Permissões e "tente novamente".
- **Painel:** reconhece a hora no PowerShell e a ficha do computador.
- **Esqueleto da pasta (só para pastas novas):** libera os comandos do inventário e as rotinas de `rotinas/` e `frentes/`, no Bash e no PowerShell; apagar, baixar da internet e mandar para fora continuam pedindo o ok.

## 0.1.1 (29/10/2026)
- A montagem confere, antes de tudo, se o `base-camp.md` está na raiz da pasta aberta; se não estiver, não grava nada e explica como abrir a pasta do computador no app. Correção do atrito 5 do kit (aprovada em 28/10/2026), a primeira que chega pelo plugin, sem zip novo.

## 0.1.0 (29/10/2026)
- Primeira versão: o que já existia no kit de instalação v1.6, empacotado como plugin. A skill da montagem (v1.6), o painel (v0.5.1) e o estilo de resposta.
- O painel passa a ler o roteiro da montagem dentro do plugin (antes, na pasta da pessoa), e a ferramenta do teste da etapa 6 passa a se chamar `mcp__business-creator__teste_do_base_camp`.
- O estilo de resposta entra sozinho quando o plugin está ligado (`force-for-plugin`).
