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

## Pré-teste da 0.2.17 pelo terminal (02/11/2026, 23:14 a 23:26)
Pasta limpa montada por `montar-pasta.py completo`, fora do OS, com o plugin carregado do disco (`--plugin-dir`) e uma pessoa fictícia (uma consultora de RH com duas frentes). Seis turnos: "oi", o despejo com "terminei", "confirmo", o clique "primeiro workflow: proposta para cliente novo", a conversa com o cliente, "aprovado".
- **O fluxo novo rodou de ponta a ponta.** O retrato saiu sem workflow escolhido, com as candidatas em "O que se repete" e o guia e o resumo já como rascunho. O "confirmo" trouxe as 3 opções gravadas no formato `- <pedido>: <entrega>`. O clique gravou o ponteiro, o `Escolhido:`, o cartão com Pedido, Combinado e Estado, e pediu uma coisa só (a conversa). A conversa devolveu a proposta e o "Base Camp montado, em 7 minutos" numa mensagem só, com as linhas Rodada 1 e Combinado, a montagem concluída, a rodada "a conferir" no cartão, o guia com o pedido e a pergunta do "antes". O "aprovado" marcou "sim" na rodada e o Estado "em andamento (rodada 1 aprovada com 2 pedidos)".
- **A medida:** da abertura ao Base Camp montado, 7 minutos de conversa (sem contar o tempo de quem responde), 5 mensagens da pessoa, nenhuma pergunta de entrevista.
- **Pontos a observar:** (1) a tabela "Workflows" da ficha da frente ficou em "incompleto: rodada 1 em andamento" depois do "aprovado", enquanto o cartão passou a "em andamento" (a skill `campo-1` manda atualizar os dois; conferir no teste do Arthur); (2) no modo sem tela, a pasta nova não passa pela tela de confiança do app e as permissões do `settings.json` são ignoradas: a mesma lista foi passada pela linha de comando; no app isso não acontece.
- **O que este pré-teste não cobre:** o painel (não desenha no modo sem tela; coberto pelos 47 testes do painel) e a rodada 2 numa conversa nova (o teste do Arthur de 03/11, com "fechar o dia").
- **03/11/2026, 11:50, ao montar a revisão para o Arthur** (o painel desenhado pelo harness com os arquivos deste pré-teste, nos quatro momentos): no momento da escolha, o painel mostrava um Continuar azul ao lado do workflow recomendado. Corrigido em `register.tsx` (sem o botão principal enquanto as opções estão na tela), com um teste novo; 47 testes passando.
