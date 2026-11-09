# Roteiro: a 0.3.7 (o CAIO) no Windows do Arthur, antes de publicar

> **Não usado (09/11/2026):** o Arthur publicou a 0.3.7 e decidiu testar direto com a Marcelle ("vamos fazer o teste direto com a Marcelle"). O que este roteiro provaria passou para "O que o Arthur confere depois" em `laboratorio-os/2026-11-09-roteiro-marcelle-conversa-do-dia.md`. Fica como roteiro de teste de uma versão futura.

> 09/11/2026. O que o Mac não provou (`teste/2026-11-09-preteste-037.md`): a conversa da tarefa aberta pelo app, o cartão "Nova sessão / Fazer aqui", o aviso de volta e as permissões novas, no app do Windows, no plano Team. Nada é publicado: o plugin vai num zip, como um marketplace local com outro nome (`sem-ia-teste`), numa pasta de teste com uma pessoa fictícia. A sua pasta de trabalho do Windows não é tocada.
> **O pacote:** `marca-pessoal/plugin-business-creator/entrega/teste-0.3.7.zip` (fora do git). Dentro: `marketplace/` (o plugin 0.3.7) e `meu-os-teste/` (a Júlia, arquiteta fictícia, já montada e atualizada na 0.3.3, sem a conversa do dia).
> **Tempo:** uns 30 minutos. **Custo:** o do seu plano (uma conversa do dia e duas ou três conversas de tarefa).

## Os passos (um de cada vez; só siga depois que o anterior deu certo)
1. **Leve o zip para o Windows** (Drive, e-mail para você ou pendrive) e use **Extrair tudo** para `C:\bc-teste`. Devem aparecer `C:\bc-teste\marketplace` e `C:\bc-teste\meu-os-teste`.
2. **Abra o app do Claude, aba Code, e abra a pasta `C:\bc-teste\meu-os-teste`.** Confirme que confia nela.
3. **Adicione o marketplace local:** **+** ao lado da caixa de texto → **Plugins** → **Add marketplace** → escreva `C:\bc-teste\marketplace` e confirme. Se o app não aceitar um caminho do computador (só GitHub), **pare aqui e me mande um print**: aí o teste precisa de um ramo de teste no GitHub (decisão sua).
4. **Instale o `business-creator` do `sem-ia-teste`**, **para o projeto (compartilhado)**. Confira que a versão é **0.3.7**.
5. **Conversa nova:** escreva `atualizar o meu sistema`. Espere **um** pedido de ok (liberar a conversa do dia a abrir conversas). Aprove. O fim tem de ser "Abra uma conversa nova nesta pasta e escreva bom dia."
6. **Conversa nova:** escreva `bom dia`. Espere uma resposta curta, com a pendência da Bia e o orçamento, e "Me diga o que você precisa fazer hoje".
7. **Na mesma conversa**, cole:
   ```
   hoje preciso de 3 coisas: me fala rapidinho quais clientes estão em obra e a próxima ação de cada; escreve um texto de legenda pro post de antes e depois do apartamento da Tijuca, uns 3 parágrafos; e monta uma planilha de cronograma da obra do cliente A em Botafogo, com as etapas de marcenaria, pintura e iluminação nas próximas 6 semanas
   ```
   Espere: a resposta da primeira na hora e, para as maiores, o **cartão "Nova sessão / Fazer aqui"** (ou uma pergunta "posso abrir as conversas direto?"). Escolha **Nova sessão** (ou responda "pode").
8. **Veja as conversas novas aparecerem na lista à esquerda** e deixe rodar. Se uma pedir ok (gravar a planilha), aprove lá dentro.
9. **Volte à conversa do dia** quando as tarefas terminarem. Espere uma linha por tarefa que terminou ("Feito: ..." ou "Esperando você: ..."), sem você perguntar. Depois escreva `o que está rodando?`.
10. **Na conversa do dia:** escreva `chegou cliente nova do Flamengo, pediu orçamento do quarto da filha, pode abrir direto`. Espere a conversa do workflow de orçamento aberta **sem cartão**, com "montar o orçamento" como primeira mensagem.
11. **Na conversa do dia:** escreva `fecha o dia`. Espere a passagem e a medida (`dia\medida-<data>.md`). Se o seu Windows não tiver Python, a resposta diz "sem Python" e segue: isso também é resultado.
12. **Me mande** a tabela abaixo preenchida e os prints dos passos 3, 7 e 10.

## O que anotar
| # | O quê | Anote |
|---|---|---|
| 1 | O app aceitou o marketplace por caminho (passo 3)? | sim / não (print) |
| 2 | Quantos pedidos de ok apareceram nos passos 5 a 11, e para quê | número e uma linha cada |
| 3 | No passo 7, apareceu o cartão "Nova sessão / Fazer aqui" ou a pergunta "posso abrir direto"? | cartão / pergunta / nada (o sistema fez tudo ali ou por "ajudante") |
| 4 | As conversas das tarefas apareceram na lista e chegaram ao fim? | sim / em parte / não |
| 5 | A conversa do dia anotou sozinha o fim de cada tarefa (passo 9)? | sim / só quando perguntei / não |
| 6 | No passo 10, a conversa do orçamento abriu sem cartão? | sim / com cartão / não abriu |
| 7 | A medida saiu no passo 11? Copie a tabela | a tabela, ou "sem Python" |
| 8 | Alguma mensagem com palavra técnica (sessão, skill, comando, workflow sem ela ter usado)? | quantas, e um print |
| 9 | O que mais estranhou | livre |

**Pronto quando:** a tabela está preenchida, com os prints. Com o 3, o 4 e o 5 em "sim", a via com sessões está provada no Windows e a 0.3.7 pode ir para a publicação. Com o 3 em "nada", a via sem sessões é a que vale no Windows, e a Marcelle trabalha com ela (funciona, mais lenta).
