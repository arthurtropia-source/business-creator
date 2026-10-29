# Plugin Business Creator: AGENTS.md

O marketplace `sem-ia` e o plugin `business-creator`: o método do Business Creator powered by SEM IA™, que chega à pasta de cada cliente e se atualiza sozinho. Caminho B da proposta `laboratorio-os/propostas/2026-10-29-ecossistema-founders.md` (aprovada em 29/10/2026).

## Regras
- **Só método, nunca dado.** Nada de cliente, nada pessoal, nenhum dado de empresa. O repositório é público.
- **Cada versão é aprovada pelo Arthur**, testada numa pasta limpa fora do OS (`montar-pasta.py --saida`), antes de subir. Sem o ok dele, nada vai ao GitHub.
- **Toda mudança no plugin sobe o `version` do `plugins/business-creator/.claude-plugin/plugin.json`** e entra no `CHANGELOG.md`. Sem subir a versão, quem já instalou não recebe.
- **A pasta da pessoa não se mexe por versão.** O que é dela fica nela; o que é do método fica aqui.
- O kit em zip (`../kit-instalacao/`) segue para quem já o recebeu e não se mexe a partir daqui.

## Estrutura
- `.claude-plugin/marketplace.json`: o marketplace `sem-ia`.
- `plugins/business-creator/`: o plugin (a skill da montagem, o painel, o estilo de resposta, os testes do painel).
- `esqueleto/`: a pasta da pessoa, com nomes que não ligam sozinhos; `montar-pasta.py` monta a pasta de verdade.
- `teste/`: o registro de cada teste numa pasta limpa.

## Para publicar uma versão
1. Mudar o arquivo, subir o `version`, anotar no `CHANGELOG.md`.
2. `claude plugin validate .` e, se mexeu no painel, `claude plugin test plugins/business-creator`.
3. Testar numa pasta limpa fora do OS e mostrar ao Arthur.
4. Com o ok dele: commit e push.
