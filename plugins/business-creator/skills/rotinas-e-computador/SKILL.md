---
name: rotinas-e-computador
description: Regras para fazer trabalho de verdade no computador da pessoa sem travar, sem errar em silêncio e sem perder o que foi feito. Use sempre que for rodar um comando, um script ou uma rotina; ler, montar ou atualizar uma planilha, um Excel, um CSV ou um relatório tirado de um sistema; ou quando o resultado de uma conta der zero, vazio ou fora do esperado. Vale no Campo 1 e em todo uso depois do Base Camp, no Mac e no Windows.
---

# Rotinas e computador

> Plugin Business Creator 0.2 (30/10/2026). Nasceu da primeira implantação com pessoa real: a montagem funcionou, e o uso real travou em permissão, em ambiente e em rotina que não ficou gravada.

## Linha de chegada (de toda entrega feita no computador)
1. o resultado foi conferido contra a fonte antes de sair (a conta bate, nenhum zero ou vazio sem explicação);
2. a rotina que produziu a entrega está gravada na pasta da pessoa, com a conferência dentro, e a ficha da frente aponta para ela;
3. o arquivo original da pessoa ficou intacto: a versão nova é um arquivo novo, com a data no nome.

## 1. Antes de rodar qualquer coisa: o computador
- Leia `contexto/computador.md`. Ele diz o sistema (Mac ou Windows), se há Python e a biblioteca de planilhas, se há Excel e como o computador escreve número e data.
- **Se o arquivo não existir**, faça o inventário (seção 5) e grave-o antes de seguir. Diga em uma linha o que achou.
- Escolha o caminho pelo que o computador tem, nunca pelo que você supõe.

## 2. Rotina gravada: o que produz uma entrega mora na pasta
- **Toda rotina que produz uma entrega** (montar uma planilha, atualizar um relatório, cruzar duas listas) **é gravada na pasta antes de a conversa acabar**: `frentes/<frente>/rotinas/<nome-curto>.<py|ps1|sh>` (no nível leve, sem pastas de frente: `rotinas/`). Nunca só na pasta temporária da conversa: ela some, e a próxima vez recomeça do zero.
- No topo da rotina, em comentário e em português: o que ela faz, de onde vêm as informações, o que sai e onde, e como conferir.
- **A conferência vai dentro da rotina:** ela imprime o que confere (linhas lidas, totais da fonte e do resultado, quantos itens ficaram de fora e por quê). Se o resultado der zero, vazio ou fora de escala, ela para com uma mensagem clara.
- Grave na ficha da frente (`frentes/<frente>/AGENTS.md`, seção "Rotinas"; no leve, no `AGENTS.md` da raiz) uma linha: o nome, para que serve e o pedido que a chama ("atualizar a planilha com o relatório novo").
- **Na segunda vez, rode a rotina gravada.** Não reescreva do zero. Se precisar mudar, mude o arquivo e diga em meia linha o que mudou.
- Diga à pessoa em meia linha: "guardei o passo a passo desta tarefa; da próxima vez sai mais rápido".

## 3. Conferir antes de entregar
- **Resultado zero, vazio ou fora de escala nunca sai sem conferência.** Antes de mostrar, confira a causa (acento, separador decimal, nome de coluna, filtro). Se não achar, diga que não achou; não entregue o número.
- Confira totais contra a fonte (soma da coluna, número de linhas) e mostre a conta em uma linha.
- Nome parecido não é o mesmo nome: dois nomes internos de cliente ou fornecedor parecidos, confira antes de juntar.
- Palavra que pode enganar ("baixada" não quer dizer "paga"): pergunte ou diga o que você entendeu.

## 4. Os arquivos da pessoa
- **Nunca edite o arquivo original** (a planilha dela, o relatório que veio do sistema). Leia, e grave o resultado num arquivo novo, com a data no nome (`<nome>-AAAA-MM-DD.xlsx`).
- Confira que o arquivo novo abre e que o cabeçalho saiu certo (acentos inclusive) antes de dizer que está pronto.

## 5. O inventário do computador (`contexto/computador.md`)
Rode um comando de cada vez, sem juntar com `;`, `&&` ou `|` (cada um sozinho já está liberado na pasta; juntos, viram pedido de permissão).
- **Mac:** `sw_vers -productVersion`; `xcode-select -p` (se der erro, **não rode `python3`**: no Mac sem as ferramentas de desenvolvedor, ele abre uma janela de instalação; anote "Python: não instalado"); se não deu erro, `python3 --version` e `python3 -m pip show openpyxl`; `ls /Applications` (Excel, Numbers); `defaults read -g AppleLocale` (o idioma e a região, que dizem a vírgula decimal e a data; o `locale` do terminal não serve: devolve "C").
- **Windows (PowerShell):** `Get-Date -Format "dd/MM/yyyy HH:mm"`; `Get-Command python` e `Get-Command py` (se não houver, "Python: não instalado"); se houver, `python --version` e `python -m pip show openpyxl`; `Get-ChildItem "C:\Program Files\Microsoft Office\root\Office16\EXCEL.EXE"`; `Get-Culture` (o separador decimal e o formato da data).
- Grave assim, em até 12 linhas:

```
# O meu computador
> Conferido pelo sistema em <data>. Lido antes de qualquer rotina.
- Sistema: <Mac (macOS 14.5) | Windows (11)>
- Python: <3.12, com a biblioteca de planilhas | 3.12, sem a biblioteca | não instalado>
- Excel: <instalado | não instalado>; Numbers: <só no Mac>
- Número e data: <vírgula decimal, ponto de milhar; dd/mm/aaaa>
- Terminal que o sistema usa: <Bash | PowerShell>
- Pendências da máquina: <ex.: "instalar Python (pedir à TI)" | nenhuma>
```

## 6. Windows
- Script para o PowerShell (`.ps1`) **sai em UTF-8 com BOM**. Sem a marca, o PowerShell 5.1 lê "ã" e "ç" errado, e a conta dá zero sem erro.
- **Comparação de texto nunca depende de acento:** normalize (sem acento, minúsculas, sem espaço sobrando) antes de comparar nomes de coluna ou de item.
- **Número com vírgula decimal:** confira como a fonte escreve ("1.234,56") antes de converter; nunca deixe a vírgula virar separador de milhar.
- **Excel por automação (COM) só com o Excel dela fechado.** Peça para ela salvar e fechar antes. No fim, feche o Excel que você abriu e confira que nenhum ficou aberto escondido. Se der "ocupado" ou "memória insuficiente", pare: não tente de novo em sequência.
- Pastas temporárias e zip em caminho curto (ex.: `C:\temp\<nome>`): caminho longo quebra no Windows.
- **Sem Python:** não improvise com o Excel aberto. Numa máquina da empresa, anote em Pendências "pedir à TI o Python com a biblioteca de planilhas" (é pré-requisito do modo empresa); numa máquina dela, proponha em uma linha instalar, e é ela quem decide. Até lá, só com o Excel fechado e as regras acima.
- A hora: `Get-Date -Format "dd/MM/yyyy HH:mm"` (o `date` não existe ali).

## 7. Mac
- Planilha: leia e grave com Python e a biblioteca de planilhas (`openpyxl`); não automatize o Excel pela tela.
- Sem a biblioteca: instalar baixa da internet, então pede o ok dela (o pedido de permissão vai aparecer). Explique em uma linha antes.
- Arquivo no iCloud Drive pode estar só na nuvem: se o tamanho vier zero ou o arquivo não abrir, peça para ela baixar (no Finder, o ícone de nuvem).
- Caminho com espaço e acento: sempre entre aspas.

## 8. Permissões e travas
- A pasta já libera o que o uso precisa dentro dela: ler e gravar arquivos, rodar as rotinas de `rotinas/` e `frentes/`, e os comandos do inventário. **Apagar, baixar da internet e mandar algo para fora continuam pedindo o ok dela.** Não tente contornar.
- Antes de um comando que vai pedir permissão, diga em uma linha o que é e por quê ("vou baixar a biblioteca de planilhas da internet; o app vai pedir o seu ok").
- **Prefira uma rotina gravada a vários comandos soltos:** um arquivo rodado uma vez pede, no máximo, uma permissão; dez comandos podem pedir dez.
- Se a conversa parar sem resposta depois de um pedido de permissão (o app fechou, a janela sumiu), a pessoa escreve **tente novamente**: retome do último passo, sem refazer o que já foi gravado.
