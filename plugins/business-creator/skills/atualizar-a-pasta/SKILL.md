---
name: atualizar-a-pasta
description: Leva para a versão atual do método uma pasta que já tinha o Base Camp montado numa versão anterior (o kit em zip, ou o plugin até a 0.3.9), sem apagar nada do que é da pessoa - as permissões que param de pedir ok a cada comando, a ficha do computador, o modelo em um dia (o dia pelo CAIO, que guarda no lugar certo o que ela ensina) e as seções novas da ficha da frente, do AGENTS.md e do guia de bolso. Use quando a pessoa escrever "atualizar o meu sistema", "atualizar a pasta" ou "atualizar para o plugin", quando o base-camp.md estiver concluído e a pasta não tiver o contexto/computador.md (há um primeiro-processo.md, ou a tabela da montagem tem as etapas 1 a 6), ou quando o AGENTS.md da raiz ainda tem a linha "Tarefa que se repete sem cartão".
---

# Atualizar a pasta para a versão atual

> Plugin Business Creator 0.4.0 (11/11/2026): o passo 5d (o modelo em um dia), e a atualização não cria mais cartão de workflow (o `primeiro-processo.md` fica onde está).
> Antes: 0.2.18 (03/11/2026); o modo empresa (passo 5b) na 0.3.1; o CAIO (passo 5c) na 0.3.7. Nasceu da primeira cliente, que montou o Base Camp com o kit em zip (v1.6) e passa para o plugin sem refazer a montagem (decisão do Arthur, 03/11/2026: atualizar a pasta dela sem zerar; os arquivos dela continuam valendo).

A pessoa já tem o sistema montado. Ela não refaz nada: o que ela escreveu e aprovou continua valendo. Esta skill só acrescenta o que as versões novas do método trazem e tira da pasta as cópias antigas do kit, que agora chegam pelo plugin.

## Linha de chegada
A atualização está pronta quando:
1. o `.claude/settings.json` da pasta tem as permissões de `permissoes.json` (desta skill), o marketplace `sem-ia` com a atualização ligada e o plugin ligado, e não tem mais a linha `outputStyle`; o resto do que estava nele continua;
2. as cópias antigas do kit (`.claude/skills/montagem-do-base-camp/`, `.claude/skills/base-camp/`, `.claude/output-styles/`) saíram de `.claude/` e estão em `montagem/kit-anterior/`, com o `LEIA.md`;
3. existe o `contexto/computador.md`;
4. a ficha da frente, o `AGENTS.md` da raiz e o `como-usar.md` têm as seções novas, com o que já se sabe dela;
5. o `base-camp.md` tem a linha **Atualizada:** e a nota em "Pedidos sobre o kit".
6. **no modo empresa** (existe `*/contexto/regras-da-empresa.md`; skill `montagem-do-base-camp`, `modo-empresa.md`): o `AGENTS.md` da raiz tem a seção "A empresa onde eu trabalho", a ficha da frente de trabalho aponta para o repositório, e o `.claude/settings.json` tem as permissões da área e a atualização da base.
7. **o CAIO** (0.3.7): o `AGENTS.md` da raiz tem a seção "O meu dia", o `como-usar.md` começa o dia pelo **bom dia**, e o `.claude/settings.json` libera as ferramentas de abrir e acompanhar conversas (as linhas de `permissoes.json` que começam por `mcp__ccd_`);
8. **o modelo em um dia** (0.4.0): o `AGENTS.md` da raiz não tem mais a linha que começa por "**Tarefa que se repete sem cartão:**" (passo 5d), e os cartões que existiam estão como estavam.
Se a pasta já tem a linha **Atualizada:** no `base-camp.md`, nada disso se faz, **a não ser os itens 6, 7 e 8**: se o arquivo de regras da empresa existe e o `AGENTS.md` da raiz ainda não tem a seção "A empresa onde eu trabalho", faça o passo 5b; se o `AGENTS.md` da raiz ainda não tem a seção "O meu dia", faça o passo 5c; se o `AGENTS.md` da raiz ainda tem a linha que começa por "**Tarefa que se repete sem cartão:**", faça o passo 5d; depois, a mensagem do passo 7, com a linha **Atualizada:** reescrita para a versão de agora (se o passo 5d rodou, a mensagem é a dele). Se os três já estão lá, diga em uma linha que ela já está na versão nova e responda ao que ela pediu.

## Regras que não se negociam
- **Nada da pessoa se apaga, se move ou se reescreve.** Os arquivos dela (o retrato, as fichas, a memória, as planilhas, os modelos) só ganham seções; o texto dela fica como está. As únicas coisas que mudam de lugar são as 3 cópias do kit, e vão para `montagem/kit-anterior/`, nunca para a lixeira.
- **Dado da empresa fica onde está.** Se houver arquivo da empresa na pasta, não mova, não copie e não abra além do nome. Se não houver regra de quem autoriza o uso, isso vira pendência, não decisão sua.
- **O `settings.local.json` não se toca.** É dela e do app.
- **Só as ferramentas de arquivo para ler e gravar.** Os comandos desta skill são: a hora, os do inventário (skill `rotinas-e-computador`, seção 5) e um só para mudar as cópias do kit de lugar. Cada comando sozinho, sem `;`, `&&` ou `|`.
- **Duas permissões, ditas antes:** a mudança do `settings.json` e a mudança de lugar das cópias pedem o ok dela no app. Avise uma vez, no começo, e diga o que cada uma é quando for pedir.
- **Sem jargão** e no formato de mensagem do Base Camp: uma linha do que fez, `---`, o pedido da vez em negrito.

## O passo a passo (uma conversa, uns 10 minutos)

### 1. Conferir e avisar
- Leia o `base-camp.md`. Sem ele na raiz da pasta aberta, pare e diga como abrir a pasta do computador dela no app. Com a montagem por concluir, esta skill não se aplica: siga a `montagem-do-base-camp`.
- Pegue a hora (`Get-Date -Format "dd/MM/yyyy HH:mm"` no Windows; `date "+%d/%m/%Y %H:%M"` no Mac).
- Leia, uma vez, o `AGENTS.md` da raiz, a ficha da frente prioritária, o `como-usar.md`, o `primeiro-processo.md` (se houver) e o `.claude/settings.json`.
- Diga, numa mensagem só, e siga sem esperar resposta:
> "Vou atualizar o seu sistema para a versão nova do método. Nada do que é seu se apaga. O app vai pedir o seu ok duas vezes: uma para mudar as permissões da pasta (é o que faz ele parar de pedir ok a cada passo) e uma para guardar a versão antiga do kit numa pasta de arquivo. Leva uns 10 minutos."

### 2. As permissões (`.claude/settings.json`)
- Leia `permissoes.json`, nesta pasta da skill. Reescreva o `.claude/settings.json` dela juntando: o que já estava nele (idioma, frases de espera, aviso do topo e qualquer outra chave), **trocando** o bloco `permissions` pelo de `permissoes.json`, **acrescentando** `extraKnownMarketplaces` e `enabledPlugins` como estão lá e **tirando** a linha `outputStyle` (o jeito de responder agora vem do plugin). Se o aviso do topo (`companyAnnouncements`) tiver `{{marca}}`, troque por "Business Creator powered by SEM IA™".
- Antes de gravar, uma linha: "Agora o app vai pedir o seu ok para mudar as permissões da pasta. Pode aprovar." Se ela recusar, siga com o resto e anote em "Pedidos sobre o kit": "permissões não atualizadas".

### 3. As cópias antigas do kit
- Veja com a ferramenta de busca de arquivos quais destas existem: `.claude/skills/montagem-do-base-camp/`, `.claude/skills/base-camp/`, `.claude/output-styles/`. Se nenhuma, pule para o passo 4.
- Grave `montagem/kit-anterior/LEIA.md` (a ferramenta de gravar cria a pasta):
```
# A versão anterior do kit
> Guardada em <data> pela atualização para o plugin Business Creator <versão>.
Estas pastas eram a montagem, o painel e o jeito de responder do kit em zip. Agora chegam pelo plugin, que se atualiza sozinho. Ficam aqui só como registro; o sistema não lê esta pasta.
```
- Uma linha antes: "Agora o app vai pedir o seu ok para guardar a versão antiga do kit na pasta de arquivo. Pode aprovar." Então **um comando só**, com as que existem:
  - Windows (PowerShell): `Move-Item -Path .claude\skills\montagem-do-base-camp, .claude\skills\base-camp, .claude\output-styles -Destination montagem\kit-anterior`
  - Mac (Bash): `mv .claude/skills/montagem-do-base-camp .claude/skills/base-camp .claude/output-styles montagem/kit-anterior/`
- Se der erro, não tente de novo em sequência: anote em "Pedidos sobre o kit" o erro em uma linha e siga. As cópias antigas na pasta não estragam nada até a próxima conversa; só duplicam o painel.

### 4. O computador
Se não existir `contexto/computador.md`, faça o inventário pela skill `rotinas-e-computador` (seção 5) e grave. Numa máquina da empresa sem Python, a pendência "pedir à TI o Python com a biblioteca de planilhas" vai para as Pendências da ficha da frente de trabalho.

### 5. Os cartões
- **Se já existe um cartão em `workflows/`**, não toque nele.
- **Não crie cartão.** O `primeiro-processo.md`, se existir, fica onde está.

### 5b. A empresa (só se existir `*/contexto/regras-da-empresa.md`)
- Leia o `modo-empresa.md` da skill `montagem-do-base-camp` e aplique os itens 1 a 5 de "O que muda na montagem e na atualização da pasta".
- Nas Pendências da ficha, se houver a pergunta de quem autoriza o uso dos dados da empresa neste sistema, ela sai, com "resolvida pelo arquivo de regras da empresa em <data>". Os cartões não se tocam.
- Na mensagem final, a linha: "o seu sistema passou a trabalhar junto com a base da <Empresa>: as regras dos dados vêm de lá, sempre atualizadas".

### 5c. O CAIO (0.3.7)
- **`AGENTS.md` da raiz:** acrescente a seção "O meu dia" do modelo `AGENTS-raiz.md` da skill `montagem-do-base-camp`, logo antes de "Como este sistema cresce", como está no modelo (só o nome dela muda). Nada mais muda no arquivo.
- **`como-usar.md`:** troque o passo 1 de "Todo dia, em 3 passos" pelo do modelo `como-usar.md` (o **bom dia** numa conversa nova) e a seção "O seu dia por aqui" pela do modelo. O resto do guia fica.
- **`.claude/settings.json`:** acrescente em `permissions.allow` as linhas de `permissoes.json` que começam por `mcp__ccd_` e ainda não estão lá, sem tirar nenhuma. Uma linha antes: "Agora o app vai pedir o seu ok para liberar o CAIO a abrir as conversas das tarefas. Pode aprovar." Se ela recusar, siga e anote em "Pedidos sobre o kit": "CAIO sem a liberação de abrir conversas".
- Não crie a pasta `dia/`: o CAIO cria no primeiro **bom dia**.

### 5d. O modelo em um dia (0.4.0)
**O corte:** o `AGENTS.md` da raiz tem a linha que começa por "**Tarefa que se repete sem cartão:**"? Se não tem, este passo já foi feito ou não se aplica.
1. **Cópia de segurança, antes de qualquer troca:** leia o `AGENTS.md` da raiz e o `como-usar.md` e grave cópias iguais em `montagem/antes-da-0.4.0/`, com a ferramenta de gravar. Os cartões não entram na cópia porque não são tocados.
2. **`AGENTS.md` da raiz, duas trocas e mais nada:**
   - a seção "O meu dia" inteira pela do modelo `AGENTS-raiz.md`;
   - em "Como este sistema cresce", a linha "**Tarefa que se repete sem cartão:**" pela linha "**O que se repete fica anotado**" do modelo.
   As linhas "Cada frente é um conjunto de workflows" e "Um workflow por conversa" **ficam**, se a pasta tem cartão: descrevem os cartões dela. A linha "A primeira montanha" fica como está. As regras que ela escreveu não se tocam.
3. **`como-usar.md`, uma troca e um acréscimo:** a seção "O seu dia por aqui" pela do modelo; e, logo depois dela, a seção "O que o sistema anota e para quê" do modelo, se ainda não existir. A seção "O seu primeiro workflow" fica: o pedido é dela.
4. **`dia/pedidos-sobre-o-kit.md`:** se não existe, crie pelo modelo do `registro.md`, com as linhas de "Pedidos sobre o kit" do `base-camp.md` (copiadas; as do `base-camp.md` ficam).
5. **Nada mais se mexe:** os cartões, a tabela "Workflows" das fichas, as habilidades em `.claude/skills/`, o caderno do dia, a fila, "Os marcos" do `base-camp.md` e o `resumo-para-o-arthur.md` ficam como estão. Nenhuma permissão nova.
6. No `base-camp.md`: a linha **Atualizada:** com a versão e a hora de agora, e em "Pedidos sobre o kit": "veio do plugin <versão>; modelo em um dia desde <data>; <n> cartões mantidos".
7. A mensagem:
> "Atualizei o seu sistema. Nada do que é seu mudou. O que muda no dia a dia:
> - eu paro de criar workflows sozinho. Os seus <n> continuam aqui e rodam quando você pedir pelo nome: **<os pedidos, separados por vírgula>**;
> - tudo o que você me disser sobre você e sobre o seu trabalho eu guardo no lugar certo, e não pergunto de novo;
> - o painel continua mostrando os seus workflows, como antes.
> ---
> **Me diga o que você precisa fazer hoje.**"

Se a atualização foi pedida por "atualizar o meu sistema", fora do CAIO, o fim é o de sempre: "Abra uma conversa nova nesta pasta e escreva bom dia."

### 6. As seções novas
Acrescente só o que falta, pelo modelo atual da skill `montagem-do-base-camp`, no lugar que o modelo indica, com o que já se sabe dela (o que não se sabe fica "Nenhuma ainda"):
- **Ficha da frente prioritária** (`frentes/<frente>/AGENTS.md`): Palavras minhas, Pendências (com as da máquina e as perguntas que o `resumo-para-o-arthur.md` deixou abertas), Rotinas (o que já existir em `rotinas/` da frente; senão, "Nenhuma ainda") e Modelos aprovados. Crie as pastas `rotinas/` e `modelos/` da frente só quando houver o que gravar nelas.
- **`AGENTS.md` da raiz:** O meu computador; O meu dia (passo 5c); e, em "Como este sistema cresce", as linhas do modelo que faltam (pelo uso; o que se repete fica anotado; rotina não se perde; o que eu aprovo vira arquivo; nada fica no ar; toda tarefa tem linha de chegada). As regras dela ficam como estão; se uma linha nova repete uma dela, fique com a dela.
- **`como-usar.md`:** "Permissões: quando o app pede o seu ok" e, em "Se travar", a linha do **tente novamente**.
- **`resumo-para-o-arthur.md`:** uma seção "Atualização para o plugin (<data>)", em até 5 linhas: de que versão veio, o que entrou e o que ficou pendente. Sem dado da empresa.

### 7. Fechar
- No `base-camp.md`: `- **Atualizada:** plugin <versão>, em <data hora>` logo abaixo de **Concluída em:**, e em "Pedidos sobre o kit": "veio de <o kit em zip vX.Y | o plugin X.Y>; atualizada em <data>".
- A mensagem, depois de tudo gravado:
> "Atualizei o seu sistema. Nada do que era seu mudou; entrou o que a versão nova traz:
> - a pasta já não pede o seu ok a cada passo (apagar, baixar da internet e mandar algo para fora continuam pedindo);
> - o sistema conhece o seu computador (`contexto/computador.md`);
> - o seu dia passa a começar por uma conversa só: você diz o que precisa fazer, do seu jeito, e eu faço ou abro uma conversa para cada tarefa, anoto tudo e só te chamo para decidir;
> - <o que ficou pendente, em uma linha, se houver; ex.: "falta registrar quem autoriza os dados da empresa: o sistema pergunta na primeira rodada">.
> ---
> **Abra uma conversa nova nesta pasta e escreva bom dia. Depois, me diga o que você precisa fazer hoje.**"
- Numa pasta que já estava atualizada (só os passos 5b, 5c e 5d), a mensagem tem só as linhas do que entrou agora, e o mesmo fim; se o passo 5d rodou, a mensagem é a dele.
- A conversa nova é necessária: as permissões, o painel e o jeito de responder novos só valem a partir dela.
