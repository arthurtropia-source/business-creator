# Plugin Business Creator: AGENTS.md

O marketplace `sem-ia` e o plugin `business-creator`: o método do Business Creator powered by SEM IA™, que chega à pasta de cada cliente e se atualiza sozinho. Caminho B da proposta `laboratorio-os/propostas/2026-10-29-ecossistema-founders.md` (aprovada em 29/10/2026).

## Regras
- **Só método, nunca dado.** Nada de cliente, nada pessoal, nenhum dado de empresa. O repositório é público.
- **Cada versão é aprovada pelo Arthur**, testada numa pasta limpa fora do OS (`montar-pasta.py --saida`), antes de subir. Sem o ok dele, nada vai ao GitHub.
- **Toda mudança no plugin sobe o `version` do `plugins/business-creator/.claude-plugin/plugin.json`** e entra no `CHANGELOG.md`. Sem subir a versão, quem já instalou não recebe.
- **A pasta da pessoa não se mexe por versão.** O que é dela fica nela; o que é do método fica aqui.
- O kit em zip (`../kit-instalacao/`) segue para quem já o recebeu e não se mexe a partir daqui. Quem o recebeu passa para o plugin pela skill `atualizar-a-pasta`.
- **O painel lê; grava só o diário** (0.3.0): a linha de cada conversa de trabalho em `frentes/<frente>/diario/AAAA-MM.md` da pasta da pessoa. Nenhuma outra escrita do painel na pasta dela.
- **Anotar nunca usa modelo:** o diário é escrito pelo painel a cada resposta, sem custo de tokens. Nada de gancho `Stop` com prompt nem de modelo a cada turno.
- **Pasta nova não vê a palavra "workflow"** (0.4.0): nas mensagens do sistema, no painel, no guia de bolso e no `AGENTS.md` que a montagem escreve. O pré-teste conta as ocorrências, e o alvo é zero. A palavra só aparece para quem já tem cartão.
- **As permissões vivem em dois lugares:** `esqueleto/settings.json` (pastas novas) e `plugins/business-creator/skills/atualizar-a-pasta/permissoes.json` (pastas que se atualizam). Mudou uma, mude a outra; o pré-teste confere.

## Estrutura
- `.claude-plugin/marketplace.json`: o marketplace `sem-ia`.
- `plugins/business-creator/`: o plugin (a skill da montagem, o painel, o estilo de resposta, os testes do painel).
- `esqueleto/`: a pasta da pessoa, com nomes que não ligam sozinhos; `montar-pasta.py` monta a pasta de verdade.
- `teste/`: o registro de cada teste numa pasta limpa.

## Para publicar uma versão
1. Mudar o arquivo, subir o `version`, anotar no `CHANGELOG.md`.
2. `claude plugin validate .` e, se mexeu no painel, `claude plugin test plugins/business-creator`.
3. Testar numa pasta limpa fora do OS e mostrar ao Arthur.
   - **Mudança no painel:** o desenho que ele aprova sai da árvore que o código do painel devolve (um teste monta o painel com uma pasta de teste e imprime a árvore; o desenho a lê com o visual nativo do app), não de um HTML livre. O que o app não permite (botões nativos, moldura tracejada) fica escrito no desenho. Correção do Arthur, 06/11/2026: "está parecido, mas não está igual".
4. Com o ok dele: commit e push.
