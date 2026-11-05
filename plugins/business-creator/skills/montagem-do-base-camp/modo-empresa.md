# O modo empresa

> Plugin Business Creator 0.3.1 (05/11/2026). Nasceu da segunda implantação numa empresa: na primeira, a decisão do dono sobre o uso dos dados foi tomada no sistema dele e nunca chegou ao da pessoa, porque o único canal era um texto para colar. Aqui o canal é um arquivo que mora no repositório da área e chega a cada atualização.

## O corte (sim ou não, conferido num arquivo)
**Existe, numa pasta logo abaixo da raiz, o arquivo `<pasta>/contexto/regras-da-empresa.md`?** Procure com a ferramenta de busca de arquivos o padrão `*/contexto/regras-da-empresa.md`.
- **Não:** a pasta é pessoal. Nada deste arquivo se aplica.
- **Sim:** a pasta é de alguém que trabalha numa empresa com o repositório da área dentro dela. Essa `<pasta>` é o **repositório da empresa**. Leia o arquivo de regras inteiro, uma vez, e siga abaixo.
- **Mais de um:** cada um é uma área. Aplique o que segue a cada um, com uma seção por área no `AGENTS.md` da raiz.

## O arquivo de regras (escrito pelo dono da empresa, nunca pela pessoa nem por você)
Linhas fixas, que você lê pelo rótulo em negrito: **Empresa**, **Área**, **Quem autoriza o uso dos dados**, **O que está autorizado**, **Onde fica o trabalho**, **Onde fica o dado bruto**, **O que fica na pasta pessoal**, **Atualizar a base**, **Permissões da área**, **Máquina**. Rótulo ausente: siga sem ele e anote em Pendências da frente de trabalho "o arquivo de regras da empresa não diz <rótulo>", de quem depende "o dono da empresa".
- **`<repositório>` no arquivo** quer dizer o nome da pasta do repositório nesta máquina (a `<pasta>` do corte). Troque por ele ao copiar um comando ou uma permissão; o resto vai palavra por palavra.
- **Você nunca edita esse arquivo** nem copia o texto dele para a pasta. A pasta guarda só o caminho. Assim, quando o dono muda uma regra, a mudança vale na próxima atualização da base, sem ninguém colar nada.
- O que está no arquivo **vale acima das regras da pasta** no assunto de que ele trata (dados da empresa, onde fica o trabalho). Nas outras coisas, valem as regras dela.

## O que muda na montagem e na atualização da pasta
1. **O `AGENTS.md` da raiz ganha a seção "A empresa onde eu trabalho"** (modelo `AGENTS-raiz.md`), com o caminho do arquivo de regras e do `AGENTS.md` do repositório. A regra dos dados da empresa (a 7 da casa) passa a ser: "Dados da empresa: valem as regras de `<repositório>/contexto/regras-da-empresa.md`". Nunca escreva ali o nome de quem autoriza nem o que está autorizado: isso fica no arquivo da empresa.
2. **Cada frente de trabalho da área aponta para o repositório** (toda frente cujo trabalho é da empresa; se forem duas, as duas). Na ficha de cada uma (`frentes/<frente>/AGENTS.md`), logo abaixo de "O que é", a linha: "O trabalho desta frente mora em `<repositório>/` (o que está em **Onde fica o trabalho**). Antes de trabalhar nela, leia `<repositório>/AGENTS.md`: ele manda no trabalho da área. Aqui ficam só os cartões dos workflows, o diário e o que é meu." Os cartões, o diário e o painel continuam na pasta, no formato de sempre.
3. **O `.claude/settings.json` da pasta ganha duas coisas**, numa edição só (o app pede o ok dela uma vez):
   - **as linhas de "Permissões da área"**, acrescentadas em `permissions.allow`, como estão no arquivo, sem tirar nenhuma das que já estão;
   - **a atualização da base ao abrir a conversa:** um gancho `SessionStart` com o comando de "Atualizar a base", no formato `{"hooks": {"SessionStart": [{"hooks": [{"type": "command", "command": "<o comando>", "timeout": 60}]}]}}`, juntado ao que já houver em `hooks`. O comando vem do arquivo, palavra por palavra; você não inventa outro.
   - Se ela recusar o ok, siga e anote em Pendências: "a base da empresa não se atualiza sozinha nesta pasta".
4. **A máquina:** confira no `contexto/computador.md` cada item de **Máquina**. O que faltar vai para as Pendências da frente de trabalho, com "de quem depende: a TI" e a data. Nada se instala por você.
5. **O dado bruto** fica onde o arquivo diz (em geral, uma pasta do repositório que não sobe ao GitHub). Nunca na pasta pessoal. Se houver arquivo da empresa na pasta pessoal, não mova nem abra: anote em Pendências "arquivo da empresa na pasta pessoal: <nome>, vai para <onde o arquivo diz>", para ela mover com o ok do dono.
6. **O que fica na pasta pessoal** segue o arquivo. O retrato continua sem número, sem nome de cliente, de fornecedor ou de colega, como em qualquer pasta.

## O primeiro workflow, no modo empresa
- **Os dados da empresa estão autorizados nos termos do arquivo.** Uma tarefa da área que o repositório já roda (um manual dele, uma rotina dele, uma análise que ele já faz) conta como "ao alcance": pode entrar nas 3 opções, e a rodada 1 roda pelo `AGENTS.md` do repositório, com as ferramentas dele.
- **Continua valendo:** a rodada 1 entrega algo de verdade; nada sai do computador sem o ok dela, a não ser o que o `AGENTS.md` do repositório manda fazer sozinho (salvar o trabalho da área no repositório).
- **A entrega da área fica no repositório**, onde o `AGENTS.md` dele manda; o cartão na pasta aponta para ela pelo caminho.

## O que dizer a ela
Uma linha, na primeira vez, sem jargão: "O seu sistema trabalha junto com a base da <Empresa>: o que é da <Área> fica lá, e as regras da empresa para os dados vêm de lá também, sempre atualizadas."
