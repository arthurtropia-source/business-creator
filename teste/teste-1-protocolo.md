# Teste 1: o mecanismo de atualização (protocolo)

> Etapa 1 da proposta de 29/10/2026, caminho B. Pronto quando uma correção de uma linha, publicada numa versão nova, chegar à pasta instalada sem zip novo e sem tocar em nenhum arquivo da pessoa.

## Já feito (29/10/2026)
- O plugin 0.1.0 montado a partir do kit v1.6, sem mexer no kit. `claude plugin validate .` passou; os 35 testes do painel passam.
- Pré-teste pelo terminal, numa pasta limpa fora do OS, com o plugin carregado do disco: a skill `business-creator:montagem-do-base-camp` e a ferramenta do teste da etapa 6 aparecem. O estilo de resposta forçado pelo plugin não apareceu nessa execução sem tela (a conferir no app).

## Passo a passo (um de cada vez, com o Arthur)
1. **Publicar o repositório** `arthurtropia-source/business-creator`, público, com o ok do Arthur.
2. **A pasta limpa:** `python3 montar-pasta.py completo --saida ~/teste-plugin` (fora do OS). Antes de abrir, guardar a impressão digital de cada arquivo da pasta (`shasum`).
3. **O Arthur, como leigo, no app desktop:** aba Code, abrir `~/teste-plugin/meu-os`, confirmar que confia na pasta, escrever **oi**. Anotar: cada clique e cada pergunta do app (os passos), se o painel abriu, se a montagem começou, onde travou.
4. **A correção de uma linha:** a versão 0.1.1, com a mudança anotada no `CHANGELOG.md`, publicada com o ok do Arthur.
5. **A chegada:** o app atualiza depois da primeira mensagem de uma sessão, num intervalo de até 10 minutos, e carrega a versão nova na sessão seguinte. Conferir: a versão instalada é a 0.1.1, a linha nova está no plugin instalado e as impressões digitais da pasta da pessoa não mudaram.

## O que se anota
- O número de passos da instalação, do zero ao "oi" respondido, e cada pergunta que o app fez.
- Onde travou e o que a pessoa leiga não entenderia.
- O tempo entre o push e a chegada da versão nova.

## Mudança de rota (30/10/2026)
- O passo 3 passa a ser a implantação do Arthur com a 0.2.1 (a 0.2.0 publicada em 30/10, às 20h; a 0.2.1, com o workflow na etapa 5 e o Campo 1, logo depois), numa pasta limpa no Mac (`~/business-creator-arthur/meu-os`, montada com o esqueleto da 0.2), em 31/10 e 01/11. A 0.1.1 entrou dentro da 0.2.0.
- Os passos 4 e 5 (a correção que chega sozinha) passam a ser a primeira versão que sair dos pontos dele (0.2.1), conferida contra as impressões digitais de `~/business-creator-arthur/impressoes-inicio.txt` e as que a pasta tiver no dia.
- Pré-teste da 0.2.0 pelo terminal (30/10): a montagem abre com o texto do roteiro e grava a hora sem pedir nada; a etapa 6.0 conferiu o Mac com seis comandos, nenhum negado. Achado: a leitura do roteiro dentro do plugin pedia permissão (o plugin mora fora da pasta da pessoa); o esqueleto passou a liberar `Read(~/.claude/plugins/**)`. A confirmar no app.
- Pré-teste da 0.2.1 pelo terminal (30/10): a etapa 5 gravou o cartão em `frentes/<frente>/workflows/` e a linha **Primeiro workflow** no `base-camp.md`; "vamos rodar o primeiro workflow" chamou a skill `campo-1`, que abriu com o caminho e foi para o primeiro passo a detalhar. Nenhum pedido de permissão negado.
