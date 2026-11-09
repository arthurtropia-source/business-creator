# Roteiro: a 0.3.8 (o CAIO) no Windows do Arthur, antes de mandar à Marcelle

> 09/11/2026. A 0.3.8 já está publicada, então o teste usa o plugin de verdade, do GitHub, numa pasta de teste com uma pessoa fictícia (a Júlia, arquiteta, já montada e atualizada na 0.3.3, sem o CAIO). A sua pasta de trabalho do Windows não é tocada. Substitui o roteiro da 0.3.7 (`2026-11-09-roteiro-teste-windows-037.md`).
> **O pacote:** `marca-pessoal/plugin-business-creator/entrega/teste-windows-0.3.8.zip` (fora do git): a pasta `bc-teste\meu-os-teste` e este roteiro.
> **Tempo:** uns 30 minutos. **Custo:** o do seu plano.

## Os passos (um de cada vez; só siga depois que o anterior deu certo)
1. **Leve o zip para o Windows** e use **Extrair tudo** em `C:\`. Tem de aparecer `C:\bc-teste\meu-os-teste`.
2. **Abra o app do Claude, aba Code, e abra a pasta `C:\bc-teste\meu-os-teste`.** Confirme que confia nela.
3. **Confira o plugin:** **+** ao lado da caixa de texto → **Plugins** → o **business-creator** aparece na versão **0.3.8**? Se não aparecer, **Add marketplace** com `arthurtropia-source/business-creator` e instale o **business-creator** **para o projeto (compartilhado)**.
4. **Conversa nova:** escreva `atualizar o meu sistema`. Espere **um** pedido de ok (liberar o CAIO a abrir conversas). Aprove. O fim tem de ser "Abra uma conversa nova nesta pasta e escreva bom dia."
5. **Conversa nova:** escreva `bom dia`. Espere o CAIO se apresentar, dizer que leu a pasta e pedir o que você precisa fazer. **Ele não pode falar de implantação, etapa ou prazo.**
6. **Na mesma conversa**, cole:
   ```
   hoje preciso de 3 coisas: me fala rapidinho quem tá em obra e o que eu tenho que fazer com cada um; escreve um texto de legenda pro post de antes e depois do apartamento da Tijuca, uns 3 parágrafos; e monta uma planilha de cronograma da obra do cliente A em Botafogo, com as etapas de marcenaria, pintura e iluminação nas próximas 6 semanas
   ```
   Espere: a primeira respondida na hora, com a meia linha "Guardei o jeito de fazer isso: da próxima vez, é só escrever ..." (é a 3ª vez que essa pergunta aparece na pasta); e, para as outras duas, **o cartão "Nova sessão / Fazer aqui"** ou a pergunta "posso abrir as conversas direto?". Escolha **Nova sessão** (ou responda "pode").
7. **Veja as conversas novas na lista à esquerda** e deixe rodar. Se uma pedir ok (gravar a planilha), aprove lá dentro.
8. **Volte ao CAIO** quando terminarem. Espere uma linha por tarefa que terminou, sem você perguntar. Depois escreva `o que está rodando?`.
9. **No CAIO:** escreva `chegou cliente nova do Flamengo, pediu orçamento do quarto da filha, pode abrir direto`. Espere a conversa do orçamento aberta **sem cartão**.
10. **No CAIO:** escreva `fecha o dia`. Espere a passagem e a medida (`dia\medida-<data>.md`). Sem Python no seu Windows, a resposta diz "sem Python" e segue: também é resultado.
11. **Me mande** a tabela abaixo preenchida e os prints dos passos 5, 6 e 9.

## O que anotar
| # | O quê | Anote |
|---|---|---|
| 1 | O plugin apareceu na 0.3.8 sozinho (passo 3)? | sim / precisei adicionar |
| 2 | Quantos pedidos de ok apareceram nos passos 4 a 10, e para quê | número e uma linha cada |
| 3 | No bom dia, o CAIO falou de implantação, etapa, prazo ou usou palavra técnica? | não / sim (print) |
| 4 | No passo 6, apareceu o "Guardei o jeito de fazer isso"? | sim / não |
| 5 | No passo 6, apareceu o cartão "Nova sessão / Fazer aqui" ou a pergunta "posso abrir direto"? | cartão / pergunta / nada (fez tudo ali) |
| 6 | As conversas das tarefas apareceram na lista e chegaram ao fim? | sim / em parte / não |
| 7 | O CAIO anotou sozinho o fim de cada tarefa (passo 8)? | sim / só quando perguntei / não |
| 8 | No passo 9, a conversa do orçamento abriu sem cartão? | sim / com cartão / não abriu |
| 9 | A medida saiu no passo 10? Copie a tabela | a tabela, ou "sem Python" |
| 10 | O que mais estranhou | livre |

**Pronto quando:** a tabela está preenchida, com os prints. Com o 5, o 6 e o 7 em "sim", a abertura das conversas está provada no Windows. Com o 5 em "nada", vale a via sem conversas separadas (o CAIO faz ali ou por um ajudante, mais devagar); a Marcelle pode começar assim mesmo.
**Depois:** pode apagar `C:\bc-teste`. O plugin instalado "para o projeto" só vale dentro daquela pasta.
