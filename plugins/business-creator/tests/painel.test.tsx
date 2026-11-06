import { expect, mock, test } from 'claude-code/testing'

// Uma pasta de Base Camp no meio da montagem: o começo e a etapa 1 aprovados, a
// etapa 2 em andamento. Nada aqui lê o disco: os hooks abaixo fazem as vezes do
// engine e respondem às leituras de arquivo e às chamadas do mod.
const BASE_CAMP = `# Base Camp: o estado da montagem

- **Nível:** NIVEL
- **Montagem:** em andamento
- **Tempo total:**

| Etapa | Status | Início | Fim |
|---|---|---|---|
| D · O começo | aprovado | 23/10/2026 17:24 | 23/10/2026 17:36 |
| 1 · O retrato | em andamento | 23/10/2026 17:36 | |
| 2 · O primeiro workflow | pendente | | |

## Testes
- **Quem sou eu:** não feito
- **Separação entre frentes:** não feito

## O primeiro workflow
<!-- comentário do modelo -->

## Em aberto
`

// As 3 opções do passo 2 (0.2.17): "- <pedido>: <a primeira entrega>", a recomendada primeiro, o pedido em minúsculas.
const OPCOES = [
  '- mensagem de retorno: a resposta ao cliente pronta, no seu jeito, para você só revisar e mandar',
  '- lista do fechamento: a lista do que conferir no fechamento do mês, pronta para marcar',
  '- o que está parado: o resumo do que está parado nas suas frentes, uma linha por item',
].join('\n')
const ESCOLHIDO = '**Escolhido:** mensagem de retorno · em 23/10/2026 17:45'
const RODADA_1 = '**Rodada 1:** a resposta ao cliente, no jeito dela · em 23/10/2026 17:52; 2 pedidos até a entrega'
const COMBINADO = '**Combinado:** amanhã, às 8h, antes dos e-mails, abrir esta pasta e escrever mensagem de retorno.'

const CONCLUIDA = BASE_CAMP.replace('em andamento |', 'aprovado |')
  .replace(/pendente/g, 'aprovado')
  .replace('**Montagem:** em andamento', '**Montagem:** concluída')
  .replace('**Tempo total:**', '**Tempo total:** 27 min (do começo ao fim)')
  .replace('**Quem sou eu:** não feito', '**Quem sou eu:** passou')
  .replace('<!-- comentário do modelo -->', [OPCOES, ESCOLHIDO, RODADA_1, COMBINADO].join('\n'))

// O cartão de antes da 0.2.1, na raiz: só o "o quê" e o "antes".
const PROCESSO = `# O meu primeiro processo

## O processo
- **O quê:** A proposta da consultoria

## O antes (o número de partida)
| Quanto tempo leva hoje | Vezes por mês | Horas por mês | Quando | Como foi medido |
|---|---|---|---|---|
| 3 horas | 4 | 12 horas | 21/10/2026 | lembrança da última vez |
`

// O cartão do workflow no modelo da 0.2.17: o nome no título, o pedido, o combinado, o estado, os passos
// (2 dos 4 com o sistema) e uma rodada aprovada com um pedido só. A linha "- pedido sem prazo…" em
// "O que o sistema aprendeu" não pode ser lida como a linha Pedido.
const CARTAO = `# Workflow: Mensagem de retorno

> Um workflow é o caminho de uma tarefa, do ponto de partida até a entrega. Escolhido em 23/10/2026, no fim do Base Camp.

## Do começo à entrega
- **O quê:** A resposta ao cliente que pediu um orçamento, no jeito dela
- **Frente:** consultoria
- **Pedido:** mensagem de retorno
- **Combinado:** quando chegar um pedido de orçamento, abra esta pasta e escreva **mensagem de retorno**
- **Começa quando (o ponto de partida):** chega o pedido de orçamento de um cliente
- **Termina com (a entrega):** a mensagem pronta, para ela revisar e mandar
- **Estado:** em andamento

## Os passos
| # | Passo | Quem faz | Com quê | Situação |
|---|---|---|---|---|
| 1 | Ler o pedido do cliente | o sistema | o e-mail colado na conversa | o sistema fez |
| 2 | Conferir o que já foi combinado | ela | a planilha de clientes | ficou com ela |
| 3 | Escrever a resposta | o sistema | o modelo de retorno | o sistema fez |
| 4 | Revisar e mandar | ela | o e-mail | ficou com ela |

## O que o sistema aprendeu
- pedido sem prazo entra com "a combinar", nunca com data (23/10)

## As rodadas
| Data | Do começo à entrega em | Pedidos dela até a entrega | Entrega aprovada? | Observação |
|---|---|---|---|---|
| 23/10/2026 | 7 min | 1 | sim | saiu com um pedido só |

## O antes (o número de partida)
| Quanto tempo leva hoje | Vezes por mês | Horas por mês | Quando | Como foi medido |
|---|---|---|---|---|
| 3 horas | 4 | 12 horas | 21/10/2026 | lembrança da última vez |
`

// A pasta de antes da 0.2.17 (como a do Arthur): "Primeiras tarefas" com uma tarefa, "Feita:", o combinado do
// monitor, e um cartão sem a linha Pedido, com o pedido em negrito no "Começa quando" e uma rodada em
// andamento, sem aprovação.
const ANTIGO = `# Base Camp: o estado da montagem

- **Nível:** completo
- **Montagem:** concluída
- **Tempo total:** 374 min pelo relógio
- **Primeiro workflow:** \`frentes/projetos/workflows/fechar-o-dia.md\`

| Etapa | Status | Início | Fim |
|---|---|---|---|
| D · O começo | aprovado | 01/11/2026 10:00 | 01/11/2026 10:20 |
| 1 · O retrato | aprovado | 01/11/2026 10:20 | 01/11/2026 11:00 |
| 2 · A primeira tarefa | aprovado | 01/11/2026 11:00 | 01/11/2026 16:14 |

## Testes
- **Quem sou eu:** passou
- **Separação entre frentes:** passou

## Primeiras tarefas
- Fechar o dia, com o quadro dos projetos atualizado e a lista de amanhã
**Feita:** fechar o dia · em 01/11/2026 16:10; o quadro atualizado e a lista de amanhã
**Combinado:** todo dia, às 8h, abrir esta pasta e escrever monitor de preço de ontem.

## Em aberto
`

const CARTAO_ANTIGO = `# Workflow: Fechar o dia

## Do começo à entrega
- **O quê:** O quadro dos projetos atualizado com o que andou hoje e a lista de amanhã
- **Frente:** projetos
- **Começa quando (o ponto de partida):** eu termino o dia, abro esta pasta e escrevo **fechar o dia**
- **Termina com (a entrega):** o quadro atualizado e a lista de amanhã, para mim
- **Estado:** em andamento

## Os passos
| # | Passo | Quem faz | Com quê | Situação |
|---|---|---|---|---|
| 1 | Contar o dia | ela | a conversa | como é hoje |
| 2 | Atualizar o quadro | o sistema | o arquivo dos projetos | o sistema faz |
| 3 | Montar a lista de amanhã | o sistema | o quadro | o sistema faz |

## As rodadas
| Data | Do começo à entrega em | Pedidos dela até a entrega | Entrega aprovada? | Observação |
|---|---|---|---|---|
| 02/11/2026 | em andamento: começou às 19:19 | | | |

## O antes (o número de partida)
| Quanto tempo leva hoje | Vezes por mês | Horas por mês | Quando | Como foi medido |
|---|---|---|---|---|
| 40 min | 22 | 15 horas | 01/11/2026 | estimativa |
`

// A abertura do roteiro, no formato de lá (com as marcas de citação): o botão "Copiar o pedido 1" lê a caixa (0.3.2).
const ROTEIRO = '## Abertura\n\n> **Pedido 1.** Copie o texto abaixo.\n>\n> ```text\n> Estou montando um sistema de trabalho com IA e quero que ele me conheça.\n>\n> Entregue tudo num bloco e termine com a linha FIM DO RETRATO.\n> ```\n>\n> **Pedido 2.** Me conte.\n'

const CAMPOS = `# Mapa de campos
| Código | O que é | Preenchido quando | Vem de |
|---|---|---|---|
| \`FRENTES.lista\` [leve] | todas as frentes | há a lista | D, 2.1 |
| \`FRENTE.<nome>.pessoas\` [leve] | quem mais está | há o papel | D, 2.2 |
| \`FRENTE.<nome>.parado\` | o que está parado | há um item | 2.2 |
| \`FERRAMENTAS.lista\` [leve] | os programas | há 2 | 2.5 |
`

const RESPOSTAS = `# As suas respostas

## FRENTES.lista
- consultoria e restaurante [despejo]

## FRENTE.consultoria.pessoas
- [pulada]
`

const RESUMO = '# Resumo para o Arthur\n\n<!-- instrução -->\nA Ana toca duas frentes.'

// O retrato confirmado e o passo 2 em andamento, com as 3 opções de primeiro workflow (0.2.17) e nada escolhido.
const PASSO_2 = BASE_CAMP.replace('NIVEL', 'completo')
  .replace('| 1 · O retrato | em andamento | 23/10/2026 17:36 | |', '| 1 · O retrato | aprovado | 23/10/2026 17:36 | 23/10/2026 17:41 |')
  .replace('| 2 · O primeiro workflow | pendente | | |', '| 2 · O primeiro workflow | em andamento | 23/10/2026 17:41 | |')
  .replace('**Quem sou eu:** não feito', '**Quem sou eu:** passou')
  .replace('<!-- comentário do modelo -->', OPCOES)

// O que o sistema já sabe, com o nome dela no cartão "Quem você é" e nada em "Falta isto".
const SABIDO = '# O que o sistema já sabe\n\n## Já sei isto\n### Quem você é\n- Ana Souza, de Recife, consultora de RH\n### O que você toca\n- A consultoria de RH, sozinha\n\n## Falta isto\n'

// Onde o base-camp.md concluído aponta o cartão do primeiro workflow (desde a 0.2.1, na frente).
const CAMINHO_DO_CARTAO = 'frentes/consultoria/workflows/mensagem-de-retorno.md'
const COM_CARTAO = (nivel: string) =>
  CONCLUIDA.replace('NIVEL', nivel).replace('**Montagem:** concluída', `**Montagem:** concluída\n- **Primeiro workflow:** \`${CAMINHO_DO_CARTAO}\``)

const PANE = {
  plugin: 'business-creator',
  component: 'Pane',
  requestId: 'base-camp',
  props: {
    title: 'Base Camp',
    isFocused: false,
    bodyColumns: 44,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 60 },
    view: {},
  },
} as const

type On = Parameters<Parameters<typeof test>[1]>[1]

function pasta(on: On, arquivos: Record<string, string>, enviados: string[], resposta = '') {
  on('command.register', () => ({ value: { command: 'base-camp' } }))
  on('tool.register', (_, e) => ({ value: { tool: `mcp__business-creator__${e.name}` } }))
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('ui.toast', (_, e) => {
    enviados.push(`[aviso] ${e.text}`)
    return { value: undefined }
  })
  on('ui.copy', (_, e) => {
    enviados.push(`[copiado] ${e.text}`)
    return { value: { isCopied: true } }
  })
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('env.get', () => ({ value: undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  // Uma pasta existe quando algum arquivo mora nela; a lista dá os filhos diretos (0.2.19, o painel de trabalho).
  const ehPasta = (p: string) => Object.keys(arquivos).some(a => a.startsWith(`${p}/`))
  on('fs.exists', (_, e) => ({ value: e.path in arquivos || ehPasta(e.path) || e.path.endsWith('.png') || e.path.endsWith('/skills/montagem-do-base-camp/campos.md') || e.path.endsWith('/skills/montagem-do-base-camp/roteiro.md') }))
  on('fs.list', (_, e) => {
    const filhos = new Map<string, 'file' | 'dir'>()
    for (const a of Object.keys(arquivos)) {
      if (!a.startsWith(`${e.path}/`)) continue
      const [nome = '', ...resto] = a.slice(e.path.length + 1).split('/')
      filhos.set(nome, resto.length > 0 ? 'dir' : 'file')
    }
    return { value: [...filhos].map(([name, kind]) => ({ name, kind, size: 0, mtimeMs: 0, isLink: false })) }
  })
  on('fs.read', (_, e) => ({ value: e.as === 'bytes' ? { base64: 'AAAA' } : (arquivos[e.path] ?? (e.path.endsWith('/skills/montagem-do-base-camp/campos.md') ? CAMPOS : e.path.endsWith('/skills/montagem-do-base-camp/roteiro.md') ? ROTEIRO : '')) }))
  on('prompt.submit', (_, e) => {
    enviados.push(e.text)
    return { text: e.text }
  })
  on('prompt.fill', (_, e) => {
    enviados.push(`[caixa] ${e.text}`)
    return { isFilled: true }
  })
  on('prompt.suggest', () => ({ isShown: true }))
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: resposta }))
  on('model.complete', () => ({
    value: {
      isAnswered: true,
      text: 'Você é a Ana, de Recife, e toca a consultoria e o restaurante.',
      usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
    },
  }))
  on('tool.call', () => ({ result: 'ok' }))
  // O diário (0.3.0): o painel grava a linha da conversa; aqui, na mesma pasta de mentira.
  on('fs.write', (_, e) => {
    if (e.path.includes('/frentes/bloqueada/')) throw new Error('sem permissão')
    arquivos[e.path] = e.text
    return { value: undefined }
  })
  on('session.id', () => ({ value: 'sessao-c7f2' }))
}

const MEIO = (nivel: string) => ({
  '/os/base-camp.md': BASE_CAMP.replace('NIVEL', nivel),
  '/os/primeiro-processo.md': PROCESSO,
  '/os/montagem/respostas.md': RESPOSTAS,
  '/os/contexto/sobre-mim.md': '# Sobre mim',
})

// A trilha desenhada (fora do terminal, que não desenha Svg).
const TRILHA = 'A sua subida até o Base Camp'

for (const surface of ['desktop', 'terminal', 'vscode', 'mobile'] as const) {
  test(`completo, no meio da montagem (${surface})`, async ($, on) => {
    const enviados: string[] = []
    pasta(on, MEIO('completo'), enviados)
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    // Em cima, a marca de quem entrega (a mesma nos dois níveis); logo abaixo, a
    // etapa; o rodapé assina igual. O Base Camp nunca entra no logo.
    if (surface === 'terminal') expect((await ui.find({ type: 'Text', text: /^BUSINESS CREATOR$/ }))?.props.bold).toBe(true)
    else expect((await ui.findAll({ type: 'Svg' })).map(s => s.props.alt)).toContain('Business Creator powered by SEM IA™')
    expect(await ui.find({ type: 'Text', text: /^Montagem do Base Camp$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^Business Creator powered by SEM IA™ · Um sistema, qualquer IA\.$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /Base Camp by/ })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /PASSO 2 DE 3 · O RETRATO/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /você só confirma ou corrige/ })).toBeDefined()
    // Em curso, a subida é uma linha só; o destaque é o andamento da etapa (0.2.7). A base, a pasta
    // aberta e o kit no lugar, é o primeiro ponto, já feito (0.2.16): ninguém começa do zero.
    expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).toContain('● O retrato')
    expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).toContain('✓ Base   ✓ Começo')
    // Antes do Base Camp, a linha não chega ao Campo 1 (0.2.17).
    expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).not.toContain('Campo 1')
    // O retrato: o painel mostra o que já foi montado (a página sobre você existe no fixture) e o teste.
    expect(await ui.find({ type: 'Text', text: /O QUE JÁ ESTÁ MONTADO · 2 DE 9/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /A página sobre você/ }))?.text).toContain('✓')
    expect((await ui.find({ type: 'Text', text: /O teste: quem sou eu/ }))?.text).toContain('○')
    // O cartão Agora (0.2.11): Continuar, Quero corrigir e Travei; nada de ler em voz alta.
    expect(await ui.findAll({ type: 'Button' })).toHaveLength(3)
    expect((await ui.find({ type: 'Button', key: 'continuar' }))?.props.label).toBe('Continuar')
    expect(await ui.find({ type: 'Button', key: 'voz' })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /AGORA · PASSO 2 DE 3 · O RETRATO/ })).toBeDefined()
    // Sem parada e sem ação feita, nem o Tente novamente nem a linha da última ação (0.2.16).
    expect(await ui.find({ type: 'Button', key: 'tentar-novamente' })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /Última ação/ })).toBeUndefined()
    // O bloco das alternativas de workflow do passo 1 saiu (0.2.17).
    expect(await ui.find({ type: 'Text', text: /PREFERE OUTRO PRIMEIRO WORKFLOW/ })).toBeUndefined()

    await ui.press({ key: 'travei' })
    expect(enviados).toContain('travei')
    await ui.unmount()
  })

  test(`dois cliques mandam uma mensagem só, e o painel avisa (${surface})`, async ($, on) => {
    const enviados: string[] = []
    pasta(on, MEIO('completo'), enviados)
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    await ui.press({ key: 'continuar' })
    // Enquanto a resposta não vem, só o Quero corrigir fica (0.2.16): ele não envia nada, só preenche a caixa.
    expect(await ui.findAll({ type: 'Button' })).toHaveLength(1)
    expect(await ui.find({ type: 'Button', key: 'corrigir' })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /Espere a resposta/ }))?.text).toContain('continuar')
    expect(enviados).toEqual(['continuar'])
    await ui.unmount()
  })

  test(`no começo, o painel mostra os 2 pedidos e a conferência (${surface})`, async ($, on) => {
    const comeco = BASE_CAMP.replace('NIVEL', 'completo')
      .replace('| D · O começo | aprovado | 23/10/2026 17:24 | 23/10/2026 17:36 |', '| D · O começo | em andamento | 23/10/2026 17:24 | |')
      .replace('| 1 · O retrato | em andamento | 23/10/2026 17:36 | |', '| 1 · O retrato | pendente | | |')
    const resumo = '# O que o sistema já sabe\n\n## Já sei isto\n### O que você toca\n- A consultoria de RH, sozinha\n- (?) Uma loja online parada · da outra IA, sem data\n\n## Falta isto\n- A sua última semana, na prática\n'
    pasta(on, { '/os/base-camp.md': comeco, '/os/montagem/respostas.md': RESPOSTAS, '/os/montagem/resumo.md': resumo }, [])
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    // O começo desenhado (0.3.2): o mapa dos 3 passos e os 2 pedidos com o estado, no cartão Agora; a lista sai.
    expect(await ui.find({ type: 'Text', text: /O SEU COMEÇO/ })).toBeUndefined()
    expect((await ui.find({ type: 'Text', text: /1 · Você manda/ }))?.text).toBe('● 1 · Você manda')
    expect(await ui.find({ type: 'Text', text: /^3 · O primeiro workflow roda$/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /Pedido 2 · você, por voz/ }))?.text).toContain('✓')
    expect((await ui.find({ type: 'Text', text: /Pedido 1 · a outra IA/ }))?.text).toContain('○')
    // Com o pedido 2 na pasta, o copiar e o "Não uso outra IA" saem: o primário é montar o retrato.
    expect(await ui.find({ type: 'Button', key: 'copiar-pedido-1' })).toBeUndefined()
    expect(await ui.find({ type: 'Button', key: 'sem-outra-ia' })).toBeUndefined()
    expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).toContain('● Começo')
    // O que o sistema já sabe vai para o painel, em cartões (0.2.10).
    expect(await ui.find({ type: 'Text', text: /O QUE EU JÁ SEI DE VOCÊ/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /A consultoria de RH/ }))?.text).toContain('✓')
    expect((await ui.find({ type: 'Text', text: /Uma loja online parada/ }))?.text).toContain('ainda vale?')
    expect((await ui.find({ type: 'Text', text: /A sua última semana/ }))?.text).toContain('○')
    expect(await ui.find({ type: 'Button', key: 'corrigir' })).toBeDefined()
    // O botão diz o resultado (0.2.16): com as palavras dela já na pasta, o Continuar vira "Montar o meu retrato".
    expect((await ui.find({ type: 'Button', key: 'continuar' }))?.props.label).toBe('Montar o meu retrato')
    expect(await ui.find({ type: 'Text', text: /^Montagem do Base Camp$/ })).toBeDefined()
    await ui.unmount()
  })

  test(`leve, no meio da montagem (${surface})`, async ($, on) => {
    pasta(on, MEIO('leve'), [])
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    if (surface === 'terminal') expect(await ui.find({ type: 'Text', text: /^BUSINESS CREATOR$/ })).toBeDefined()
    else expect((await ui.findAll({ type: 'Svg' })).map(s => s.props.alt)).toContain('Business Creator powered by SEM IA™')
    expect(await ui.find({ type: 'Text', text: /^Montagem do Base Camp$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^Business Creator powered by SEM IA™ · Um sistema, qualquer IA\.$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /12 min/ })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /O que está parado/ })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /O QUE JÁ ESTÁ MONTADO · 2 DE 9/ })).toBeDefined()
    expect(await ui.findAll({ type: 'Button' })).toHaveLength(2)
    await ui.unmount()
  })

  test(`a resposta pede aprovação: os botões aparecem e respondem (${surface})`, async ($, on) => {
    const enviados: string[] = []
    pasta(on, MEIO('completo'), enviados, 'Escrevi a página.\n\nEstá certo? Pode corrigir, tirar ou acrescentar o que quiser.')
    await $.session.start({ cwd: '/os', surface, isInteractive: true })
    await $.turn.start({ text: 'oi', turnId: 't1' })
    await $.turn.complete({
      answer: 'Escrevi a página.\n\nEstá certo? Pode corrigir, tirar ou acrescentar o que quiser.',
      durationMs: 1000,
      isAborted: false,
      turnId: 't1',
      reason: 'answer',
    })

    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /Sua vez: aprove ou corrija/ })).toBeDefined()
    // No passo do retrato, o botão principal diz o resultado (0.2.16) e manda a mesma frase de sempre.
    expect((await ui.find({ type: 'Button', key: 'aprovar' }))?.props.label).toBe('Confirmar o retrato')
    await ui.press({ key: 'corrigir' })
    expect(enviados).toContain('[caixa] quero corrigir: ')
    await ui.press({ key: 'aprovar' })
    expect(enviados).toContain('pode, aprovado')
    await ui.unmount()
  })

  test(`completo, montagem concluída: o cartão Agora é o do primeiro workflow (${surface})`, async ($, on) => {
    const enviados: string[] = []
    pasta(on, {
      '/os/base-camp.md': COM_CARTAO('completo'),
      [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO,
      '/os/resumo-para-o-arthur.md': RESUMO,
    }, enviados)
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    // O painel de trabalho cortado (0.3.0): o cartão Agora com o nome, os passos em quadrados com a conta, o
    // combinado e um botão só, Rodar. O título do painel é o sistema dela (sem o nome no resumo, "O seu sistema").
    expect(await ui.find({ type: 'Text', text: /^AGORA$/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /^Mensagem de retorno$/ }))?.props.bold).toBe(true)
    expect(await ui.find({ type: 'Text', text: /^o sistema faz 2 de 4 passos$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^Combinado: quando chegar um pedido de orçamento, abra esta pasta e escreva mensagem de retorno$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^O seu sistema$/ })).toBeDefined()
    const botoes = await ui.findAll({ type: 'Button' })
    expect(botoes.filter(b => b.props.variant === 'primary').map(b => b.props.label)).toEqual(['Rodar mensagem de retorno'])
    // O que saiu do painel (0.3.0): aprovar, corrigir, a descrição repetida, os três pontos de controle, a linha do
    // "Depois" e o bloco do que ficou pronto.
    for (const k of ['aprovar-entrega', 'corrigir', 'copiar-resumo', 'guia']) expect(await ui.find({ type: 'Button', key: k })).toBeUndefined()
    for (const t of [/A resposta ao cliente que pediu/, /Campo 1 [○✓]/, /Depois: Campo 2/, /O QUE FICOU PRONTO/, /UM POR CONVERSA/, /sugestão do sistema/]) {
      expect(await ui.find({ type: 'Text', text: t })).toBeUndefined()
    }
    // "ver os passos": a lista na vertical, com quem faz.
    expect(await ui.find({ type: 'Text', text: /^■ 1\. Ler o pedido do cliente · o sistema faz$/ })).toBeUndefined()
    await ui.press({ key: 'ver-agora' })
    expect(await ui.find({ type: 'Text', text: /^■ 1\. Ler o pedido do cliente · o sistema faz$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^□ 2\. Conferir o que já foi combinado · fica com você$/ })).toBeDefined()
    expect((await ui.find({ type: 'Button', key: 'ver-agora' }))?.props.label).toBe('fechar os passos')
    // As opções não escolhidas, recolhidas em "A começar"; os marcos numa linha; o Base Camp numa linha.
    expect((await ui.find({ type: 'Button', key: 'fila' }))?.props.label).toBe('A começar: 2')
    // A subida desenhada no lugar da linha dos marcos (0.3.2), com a legenda do resultado e o "i" num toque.
    if (surface === 'terminal') expect(await ui.find({ type: 'Text', text: /^Mera ○ · Island ○ · Lobuche East ○$/ })).toBeDefined()
    else expect((await ui.findAll({ type: 'Svg' })).some(s => /^A subida/.test(String(s.props.alt)) && /você está aqui/.test(String(s.props.source)))).toBe(true)
    expect(await ui.find({ type: 'Text', text: /^Mera \(1º workflow\) · Island \(a frente\) · Lobuche East \(2ª frente\)$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^Mera: o primeiro workflow/ })).toBeUndefined()
    await ui.press({ key: 'i-marcos' })
    expect(await ui.find({ type: 'Text', text: /^Lobuche East: um workflow completo/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^Mera: o primeiro workflow/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^Base Camp montado em 27 min$/ })).toBeDefined()
    // A trilha e a subida ficam dentro do "Ver o resumo" (decisão 2, 04/11).
    expect(await ui.find({ type: 'Text', text: /Começo/ })).toBeUndefined()
    await ui.press({ key: 'ver-resumo' })
    expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).toBe('✓ Base   ✓ Começo   ✓ O retrato   ✓ O primeiro workflow   ● Campo 1')
    if (surface !== 'terminal') {
      const desenho = (await ui.findAll({ type: 'Svg' })).find(s => s.props.alt === TRILHA)?.props.source ?? ''
      expect(desenho).toMatch(/x="225\.6" y="100\.[45]" width="8" height="8" fill="#F5F1E8" stroke="#1F2C8F" stroke-width="2\.2"/)
    }
    expect(await ui.find({ type: 'Button', key: 'copiar-resumo' })).toBeDefined()
    await ui.press({ key: 'rodar-workflow' })
    expect(enviados).toContain('mensagem de retorno')
    await ui.unmount()
  })

  test(`o resumo para o Arthur é copiado no clique (${surface})`, async ($, on) => {
    const enviados: string[] = []
    pasta(on, {
      '/os/base-camp.md': CONCLUIDA.replace('NIVEL', 'leve'),
      '/os/resumo-para-o-arthur.md': RESUMO,
    }, enviados)
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    // Sem o cartão do workflow: o nome genérico, "ainda não rodou" e o botão de sempre (0.2.17).
    expect((await ui.find({ type: 'Text', text: /^O seu primeiro workflow$/ }))?.props.bold).toBe(true)
    expect(await ui.find({ type: 'Text', text: /^Ainda não rodou\.$/ })).toBeDefined()
    expect((await ui.find({ type: 'Button', key: 'rodar-workflow' }))?.props.label).toBe('Rodar o meu primeiro workflow')
    // O resumo, a cópia e o recado do programa ficam dentro do "Ver o resumo" (0.3.0).
    expect(await ui.find({ type: 'Text', text: /o Arthur sobe a Mera com você/ })).toBeUndefined()
    await ui.press({ key: 'ver-resumo' })
    expect(await ui.find({ type: 'Markdown', text: /A Ana toca duas frentes/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /o Arthur sobe a Mera com você/ })).toBeDefined()
    await ui.press({ key: 'copiar-resumo' })
    expect(enviados.some(t => t.startsWith('[aviso] Resumo copiado'))).toBe(true)
    await ui.press({ key: 'ver-resumo' })
    expect(await ui.find({ type: 'Markdown', text: /A Ana toca duas frentes/ })).toBeUndefined()
    await ui.unmount()
  })

  test(`pasta sem Base Camp (${surface})`, async ($, on) => {
    pasta(on, {}, [])
    await $.session.start({ cwd: '/outra', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    expect(await ui.find({ type: 'Text', text: /ainda não tem um Base Camp/ })).toBeDefined()
    await ui.unmount()
  })

  test(`as linhas técnicas viram frases durante a montagem (${surface})`, async ($, on) => {
    pasta(on, MEIO('completo'), [])
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({
      plugin: 'business-creator',
      surface,
      component: 'ToolUse',
      requestId: 'u1',
      props: {
        tool_use_id: 'u1',
        tool: 'Write',
        input: { file_path: '/os/contexto/sobre-mim.md', content: '# Sobre mim' },
        isRunning: false,
        isErrored: false,
        isInterrupted: false,
      },
    })
    expect(await ui.find({ type: 'Text', text: /Escrevi a página sobre você/ })).toBeDefined()
    await ui.unmount()

    // No Windows, a hora vem do PowerShell.
    const hora = await $.ui.mount({
      plugin: 'business-creator',
      surface,
      component: 'ToolUse',
      requestId: 'u2',
      props: {
        tool_use_id: 'u2',
        tool: 'PowerShell',
        input: { command: 'Get-Date -Format "dd/MM/yyyy HH:mm"' },
        isRunning: false,
        isErrored: false,
        isInterrupted: false,
      },
    })
    expect(await hora.find({ type: 'Text', text: /Marquei a hora/ })).toBeDefined()
    await hora.unmount()
  })
}

for (const surface of ['desktop', 'terminal'] as const) {
  test(`a faixa acima da caixa diz a etapa e de quem é a vez (${surface})`, async ($, on) => {
    pasta(on, MEIO('completo'), [])
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({
      plugin: 'business-creator',
      surface,
      component: 'AbovePrompt',
      props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {} },
    })
    expect(await ui.find({ type: 'Text', text: /Passo 2 de 3 · O retrato/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /sua vez: responda acima/ })).toBeDefined()
    await ui.unmount()
  })
}

// ----- 0.2.16: a revisão pelos vídeos de 02/11 (os estados ruins, nunca do zero, os botões com o resultado,
// a última ação, o nome dela, o estado final no cartão Agora).

test('parada de 4 minutos: o aviso em laranja e o Tente novamente ao lado do Travei', async ($, on) => {
  const enviados: string[] = []
  // O relógio do app, que só anda quando o teste manda: a vigia de 4 segundos roda nele.
  const relogio = mock.clock(on, { now: 1_762_100_000_000 })
  const resposta = 'Anotado.\n\n---\n**Como foi a sua última semana?**'
  pasta(on, MEIO('completo'), enviados, resposta)
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })
  await $.turn.start({ text: 'oi', turnId: 't1' })
  await $.turn.complete({ answer: resposta, durationMs: 1000, isAborted: false, turnId: 't1', reason: 'answer' })

  const antes = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await antes.find({ type: 'Button', key: 'tentar-novamente' })).toBeUndefined()
  await antes.unmount()

  await relogio.advance(250_000)
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /^Parado há 4 min\? Pode ser o app\.$/ }))?.props.color).toBe('#FF6F1A')
  expect(await ui.find({ type: 'Button', key: 'travei' })).toBeDefined()
  await ui.press({ key: 'tentar-novamente' })
  expect(enviados).toContain('tente novamente')
  await ui.unmount()
})

test('o teste que não passou aparece com o motivo e o botão de repetir', async ($, on) => {
  const enviados: string[] = []
  pasta(on, {
    ...MEIO('completo'),
    '/os/base-camp.md': BASE_CAMP.replace('NIVEL', 'completo').replace('**Quem sou eu:** não feito', '**Quem sou eu:** não passou: inventou uma frente'),
  }, enviados)
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  const linha = await ui.find({ type: 'Text', text: /O teste: quem sou eu não passou: inventou uma frente/ })
  expect(linha?.text).toContain('✕')
  expect(linha?.props.color).toBe('#FF6F1A')
  expect(await ui.find({ type: 'Text', text: /O QUE JÁ ESTÁ MONTADO · 2 DE 9/ })).toBeDefined()
  await ui.press({ key: 'testar-de-novo' })
  expect(enviados).toContain('corrigir e testar de novo')
  await ui.unmount()
})

test('a última ação feita fica no cartão Agora, com a hora', async ($, on) => {
  pasta(on, MEIO('completo'), [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })
  await $.tool.call({ tool: 'Write', file_path: '/os/montagem/respostas.md', content: '## QUEM.nome\n- Ana [despejo]' })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /^Última ação: Anotei a sua resposta · \d{2}:\d{2}$/ })).toBeDefined()
  await ui.unmount()
})

// ----- 0.2.17: um workflow, uma escolha, uma frase (o passo 2 oferece os 3 primeiros workflows; depois do
// Base Camp, o cartão Agora é o do workflow).

for (const surface of ['desktop', 'terminal'] as const) {
  test(`depois do retrato confirmado, o painel leva o nome dela e oferece os 3 primeiros workflows (${surface})`, async ($, on) => {
    const enviados: string[] = []
    pasta(on, { '/os/base-camp.md': PASSO_2, '/os/montagem/respostas.md': RESPOSTAS, '/os/montagem/resumo.md': SABIDO }, enviados)
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    expect((await ui.find({ type: 'Text', text: /^O sistema de Ana$/ }))?.props.bold).toBe(true)
    expect(await ui.find({ type: 'Text', text: /^Montagem do Base Camp$/ })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /AGORA · PASSO 3 DE 3 · O PRIMEIRO WORKFLOW/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /^Sua vez: escolha o seu primeiro workflow\.$/ }))?.props.bold).toBe(true)
    expect(await ui.find({ type: 'Text', text: /Sua vez: responda na conversa/ })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /roda a primeira vez e combina a próxima/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /O SEU PRIMEIRO WORKFLOW · ESCOLHA UM \(O PRIMEIRO É O RECOMENDADO\)/ })).toBeDefined()
    // Cada opção: a entrega como legenda e o botão com o pedido, a primeira letra em maiúscula; só o primeiro é primary.
    // Na escolha, só os botões das opções levam adiante: nenhum Continuar azul ao lado do recomendado.
    expect(await ui.find({ type: 'Button', key: 'continuar' })).toBeUndefined()
    const primeiro = await ui.find({ type: 'Button', key: 'escolha-0' })
    expect(primeiro?.props.label).toBe('Mensagem de retorno')
    expect(primeiro?.props.variant).toBe('primary')
    const segundo = await ui.find({ type: 'Button', key: 'escolha-1' })
    expect(segundo?.props.label).toBe('Lista do fechamento')
    expect(segundo?.props.variant).toBeUndefined()
    expect((await ui.find({ type: 'Button', key: 'escolha-2' }))?.props.label).toBe('O que está parado')
    expect((await ui.find({ type: 'Text', text: /^a lista do que conferir no fechamento do mês, pronta para marcar$/ }))?.props.size).toBe('caption')
    expect(await ui.find({ type: 'Text', text: /Fazer:/ })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /A PRIMEIRA TAREFA/ })).toBeUndefined()
    // O que este passo entrega, ainda por fazer.
    expect(await ui.find({ type: 'Text', text: /O QUE ESTE PASSO ENTREGA · 0 DE 3/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /O seu primeiro workflow, escolhido/ }))?.text).toContain('○')
    expect((await ui.find({ type: 'Text', text: /A primeira rodada entregue/ }))?.text).toContain('○')
    // "Falta isto" vazio não some: o painel diz que nada falta (0.2.16).
    expect(await ui.find({ type: 'Text', text: /^Nada falta: o retrato está completo com o que você mandou\.$/ })).toBeDefined()
    // O clique manda "primeiro workflow: <pedido>", com o pedido como está na linha.
    await ui.press({ key: 'escolha-1' })
    expect(enviados).toContain('primeiro workflow: lista do fechamento')
    expect(enviados.some(t => t.startsWith('primeira tarefa:'))).toBe(false)
    await ui.unmount()
  })
}

test('com o workflow escolhido e a rodada 1 entregue, o botão principal fecha o Base Camp e manda a frase de sempre', async ($, on) => {
  const enviados: string[] = []
  const escolhido = PASSO_2.replace(OPCOES, [OPCOES, ESCOLHIDO, RODADA_1].join('\n'))
  const arquivos: Record<string, string> = { '/os/base-camp.md': escolhido, '/os/montagem/respostas.md': RESPOSTAS }
  pasta(on, arquivos, enviados)
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  // Sem o combinado ainda: o passo mostra o que já tem, com o workflow escolhido pelo pedido, e já oferece o Fechar.
  const antes = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await antes.find({ type: 'Text', text: /O QUE ESTE PASSO ENTREGA · 2 DE 3/ })).toBeDefined()
  expect((await antes.find({ type: 'Text', text: /O seu primeiro workflow: Mensagem de retorno/ }))?.text).toContain('✓')
  expect((await antes.find({ type: 'Text', text: /A primeira rodada entregue/ }))?.text).toContain('✓')
  expect((await antes.find({ type: 'Text', text: /O combinado/ }))?.text).toContain('○')
  expect(await antes.find({ type: 'Button', key: 'escolha-0' })).toBeUndefined()
  expect(await antes.find({ type: 'Text', text: /Sua vez: escolha o seu primeiro workflow/ })).toBeUndefined()
  expect((await antes.find({ type: 'Button', key: 'aprovar' }))?.props.label).toBe('Fechar o Base Camp')
  await antes.unmount()

  // Com o combinado gravado, tudo o que o passo entrega está pronto; o Fechar manda o "pode, aprovado" de sempre
  // (a rede de segurança: na 0.2.17 o roteiro conclui sozinho na mesma mensagem da entrega).
  arquivos['/os/base-camp.md'] = PASSO_2.replace(OPCOES, [OPCOES, ESCOLHIDO, RODADA_1, COMBINADO].join('\n'))
  await $.turn.start({ text: 'oi', turnId: 't1' })
  await $.turn.complete({ answer: 'Combinado.', durationMs: 1000, isAborted: false, turnId: 't1', reason: 'answer' })
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /Tudo o que este passo entrega já está pronto/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^O seu sistema$/ })).toBeDefined()
  expect((await ui.find({ type: 'Button', key: 'aprovar' }))?.props.label).toBe('Fechar o Base Camp')
  expect(await ui.find({ type: 'Button', key: 'escolha-0' })).toBeUndefined()
  await ui.press({ key: 'aprovar' })
  expect(enviados).toContain('pode, aprovado')
  await ui.unmount()
})

test('o teste do Base Camp responde só com os arquivos da pasta', async ($, on) => {
  pasta(on, { ...MEIO('completo'), '/os/AGENTS.md': '# Ana\n@contexto/sobre-mim.md' }, [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  const r = await $.tool.call({ tool: 'mcp__business-creator__teste_do_base_camp', pergunta: 'quem sou eu?' })
  expect(JSON.stringify(r)).toContain('Você é a Ana')
})

test('a pasta de antes da 0.2.17 continua lendo: a tarefa feita, o pedido do "Começa quando" e a rodada em andamento', async ($, on) => {
  const enviados: string[] = []
  const arquivos: Record<string, string> = {
    '/os/base-camp.md': ANTIGO,
    '/os/frentes/projetos/workflows/fechar-o-dia.md': CARTAO_ANTIGO,
    '/os/resumo-para-o-arthur.md': RESUMO,
  }
  pasta(on, arquivos, enviados)
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  // A rodada em andamento espera por ela no chat: o cartão diz onde está e não tem botão (0.3.0).
  expect(await ui.find({ type: 'Text', text: /^AGORA · ESPERANDO VOCÊ NO CHAT$/ })).toBeDefined()
  expect((await ui.find({ type: 'Text', text: /^Fechar o dia$/ }))?.props.bold).toBe(true)
  expect(await ui.find({ type: 'Text', text: /^A rodada está em andamento no chat\.$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^o sistema faz 2 de 3 passos$/ })).toBeDefined()
  expect(await ui.find({ type: 'Button', key: 'rodar-workflow' })).toBeUndefined()
  expect(await ui.find({ type: 'Button', key: 'aprovar-entrega' })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: /^Base Camp montado em 374 min pelo relógio$/ })).toBeDefined()
  expect(await ui.find({ type: 'Button', key: 'fila' })).toBeUndefined()
  await ui.unmount()

  // Com a rodada aprovada no chat, o botão volta: o pedido, lido do "Começa quando" do cartão antigo.
  arquivos['/os/frentes/projetos/workflows/fechar-o-dia.md'] = CARTAO_ANTIGO.replace(
    '| 02/11/2026 | em andamento: começou às 19:19 | | | |',
    '| 02/11/2026 | 12 min | 3 | sim | a data da lista saiu errada |',
  )
  await $.turn.start({ text: 'pode, aprovado', turnId: 't1' })
  await $.turn.complete({ answer: 'Aprovado.', durationMs: 1000, isAborted: false, turnId: 't1', reason: 'answer' })
  const depois = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await depois.find({ type: 'Text', text: /^AGORA$/ })).toBeDefined()
  expect(await depois.find({ type: 'Text', text: /^Combinado: .*monitor de preço de ontem/ })).toBeDefined()
  expect((await depois.find({ type: 'Button', key: 'rodar-workflow' }))?.props.label).toBe('Rodar fechar o dia')
  await depois.press({ key: 'rodar-workflow' })
  expect(enviados).toContain('fechar o dia')
  await depois.unmount()
})

test('o começo sem nada ainda: o primário copia o pedido 1, e "Não uso outra IA" manda a frase', async ($, on) => {
  const enviados: string[] = []
  const comeco = BASE_CAMP.replace('NIVEL', 'completo')
    .replace('| D · O começo | aprovado | 23/10/2026 17:24 | 23/10/2026 17:36 |', '| D · O começo | em andamento | 23/10/2026 17:24 | |')
    .replace('| 1 · O retrato | em andamento | 23/10/2026 17:36 | |', '| 1 · O retrato | pendente | | |')
  pasta(on, { '/os/base-camp.md': comeco, '/os/montagem/respostas.md': '' }, enviados)
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  const primarios = (await ui.findAll({ type: 'Button' })).filter(b => b.props.variant === 'primary').map(b => b.props.label)
  expect(primarios).toEqual(['Copiar o pedido 1'])
  expect(await ui.find({ type: 'Text', text: /^Fale pelo microfone do Claude/ })).toBeDefined()
  await ui.press({ key: 'copiar-pedido-1' })
  expect(enviados.some(t => t.startsWith('[copiado] Estou montando um sistema de trabalho com IA'))).toBe(true)
  expect(enviados.some(t => t.startsWith('[copiado]') && /FIM DO RETRATO/.test(t) && !/^\[copiado\] >/m.test(t))).toBe(true)
  await ui.press({ key: 'sem-outra-ia' })
  expect(enviados).toContain('não uso outra IA')
  await ui.unmount()
})

test('o retrato na tela mostra "Confirmar o retrato" mesmo com um campo faltando', async ($, on) => {
  const resumo = '# O que o sistema já sabe\n\n## Já sei isto\n### Quem você é\n- Ana, consultora de RH\n\n## Falta isto\n- A sua última semana\n'
  pasta(on, { '/os/base-camp.md': BASE_CAMP.replace('NIVEL', 'completo'), '/os/montagem/respostas.md': '', '/os/montagem/resumo.md': resumo }, [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect((await ui.find({ type: 'Button', key: 'aprovar' }))?.props.label).toBe('Confirmar o retrato')
  await ui.unmount()
})

test('o workflow completo no cartão: o ✓ no nome, a Mera fechada e o próximo ponto de controle', async ($, on) => {
  pasta(on, {
    '/os/base-camp.md': COM_CARTAO('completo'),
    [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO.replace('**Estado:** em andamento', '**Estado:** completo, em 05/11/2026'),
    '/os/resumo-para-o-arthur.md': RESUMO,
  }, [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect((await ui.find({ type: 'Text', text: /^Mensagem de retorno ✓$/ }))?.props.bold).toBe(true)
  // O próximo ponto de controle é a skill, na trilha ao lado dos quadrados (0.3.2): nenhuma rodada sem correção ainda.
  expect(await ui.find({ type: 'Text', text: /^⚙ próximo: skill$/ })).toBeDefined()
  expect((await ui.find({ type: 'Button', key: 'rodar-workflow' }))?.props.label).toBe('Rodar mensagem de retorno')
  // Os marcos: a Mera fechada; a Island conta os workflows da frente (um só, ainda não fecha).
  expect(await ui.find({ type: 'Text', text: /^Mera \(1º workflow\) ✓ · Island \(a frente\) 1 de 1 · Lobuche East \(2ª frente\)$/ })).toBeDefined()
  // Na subida (dentro do "Ver o resumo"), o Campo 1 fica feito: na linha e na trilha (o quadrado cheio, em tinta).
  await ui.press({ key: 'ver-resumo' })
  expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).toBe('✓ Base   ✓ Começo   ✓ O retrato   ✓ O primeiro workflow   ✓ Campo 1')
  const desenho = (await ui.findAll({ type: 'Svg' })).find(s => s.props.alt === TRILHA)?.props.source ?? ''
  expect(desenho).toMatch(/x="225\.6" y="100\.[45]" width="8" height="8" fill="#1F2C8F"/)
  await ui.unmount()
})

// O painel de trabalho (0.2.19): dois cartões em frentes diferentes, um deles com a rodada a conferir, um terceiro
// fora do formato, e dois na fila (um deles repete o que já tem cartão e não entra).
const CARTAO_LOJA = `# Workflow: Pedido da semana
- **O quê:** O pedido de reposição da loja, pronto para mandar
- **Frente:** loja
- **Pedido:** pedido da semana
- **Estado:** em andamento

## Os passos
| # | Passo | Quem faz | Com quê | Situação |
|---|---|---|---|---|
| 1 | Ler o estoque | o sistema | a skill estoque | o sistema fez |
| 2 | Somar a venda | o sistema | a planilha | o sistema fez |
| 3 | Puxar o preço do fornecedor | ela | o portal | ainda não dá: o portal não exporta |
| 4 | Mandar o pedido | ela | o e-mail | ficou com ela |

## As rodadas
| Data | Do começo à entrega em | Pedidos dela até a entrega | Entrega aprovada? | Observação |
|---|---|---|---|---|
| 01/11/2026 | 20 min | 2 | sim | |
| 03/11/2026 | 9 min | 1 | a conferir | |

## Os próximos (para depois deste)
| Workflow | Pedido | A primeira entrega |
|---|---|---|
| Conferir a nota | conferir a nota | a nota batida com o pedido |
| Mensagem de retorno | mensagem de retorno | já tem cartão |
`

test('o painel de trabalho: o Agora sem botão enquanto a entrega espera, a lista com o mesmo botão e "A começar"', async ($, on) => {
  const enviados: string[] = []
  pasta(on, {
    '/os/base-camp.md': COM_CARTAO('completo'),
    [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO,
    '/os/frentes/loja/workflows/pedido-da-semana.md': CARTAO_LOJA,
    '/os/frentes/loja/workflows/fechar-o-caixa.md': '# Workflow: Fechar o caixa\n- **O quê:** o caixa do dia\n',
    '/os/frentes/loja/workflows/quebrado.md': 'umas anotações soltas\n',
    '/os/resumo-para-o-arthur.md': RESUMO,
  }, enviados)
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  // O Agora é o que espera por ela no chat: nenhum botão (aprovar e corrigir são respostas no chat).
  expect(await ui.find({ type: 'Text', text: /^AGORA · ESPERANDO VOCÊ NO CHAT$/ })).toBeDefined()
  expect((await ui.find({ type: 'Text', text: /^Pedido da semana$/ }))?.props.bold).toBe(true)
  expect(await ui.find({ type: 'Text', text: /^o sistema faz 2 de 4 passos$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^A entrega está no chat para você conferir\.$/ })).toBeDefined()
  expect((await ui.findAll({ type: 'Button' })).filter(b => b.props.variant === 'primary')).toEqual([])
  expect(await ui.find({ type: 'Button', key: 'rodar-workflow' })).toBeUndefined()
  // Os passos do Agora na vertical, com o motivo do que ainda não dá.
  await ui.press({ key: 'ver-agora' })
  expect(await ui.find({ type: 'Text', text: /^✕ 3\. Puxar o preço do fornecedor · ainda não dá: o portal não exporta$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^□ 4\. Mandar o pedido · fica com você$/ })).toBeDefined()
  // A lista: o que já rodou, uma linha com a conta e o mesmo botão; o cartão que não se lê, "precisa de ajuste".
  expect(await ui.find({ type: 'Text', text: /^OS SEUS WORKFLOWS$/ })).toBeDefined()
  // Cada workflow num cartão (0.3.2): o nome, a frente, o estado e, embaixo, a conta e a trilha da skill.
  expect((await ui.find({ type: 'Text', text: /^Mensagem de retorno$/ }))?.props.bold).toBe(true)
  expect(await ui.find({ type: 'Text', text: /^o sistema faz 2 de 4$/ })).toBeDefined()
  // O Agora é da loja, que usa a skill estoque: a trilha acesa; o da lista ainda não tem skill.
  expect(await ui.find({ type: 'Text', text: /^⚙ skill pronta$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^· Loja$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^Quebrado · precisa de ajuste$/ })).toBeDefined()
  const novas = (await ui.findAll({ type: 'Button' })).filter(b => String(b.props.key).startsWith('nova-'))
  expect(new Set(novas.map(b => b.props.label))).toEqual(new Set(['Rodar']))
  // "A começar": o cartão que nunca rodou e a fila (as opções não escolhidas e "Conferir a nota"), sem repetir
  // o que já tem cartão; recolhido até o toque.
  expect((await ui.find({ type: 'Button', key: 'fila' }))?.props.label).toBe('A começar: 4')
  expect(await ui.find({ type: 'Text', text: /^Fechar o caixa$/ })).toBeUndefined()
  await ui.press({ key: 'fila' })
  expect(await ui.find({ type: 'Text', text: /^Fechar o caixa$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^Conferir a nota$/ })).toBeDefined()
  // O botão da lista pede a conversa nova; os botões somem até a resposta.
  await ui.press({ key: 'nova-wf-0' })
  expect(enviados).toContain('abrir o workflow Mensagem de retorno numa conversa nova')
  expect((await ui.findAll({ type: 'Button' })).filter(b => String(b.props.key).startsWith('nova-'))).toEqual([])
  await ui.unmount()
})

test('a frente dita no nome do próximo vale para ele: a linha mostra a frente e a Island não o conta', async ($, on) => {
  const loja = CARTAO_LOJA.replace('a conferir', 'sim').replace('**Estado:** em andamento', '**Estado:** completo, em 05/11/2026')
    .replace('| Conferir a nota | conferir a nota | a nota batida com o pedido |', '| Conferir a nota | conferir a nota | a nota batida |\n| Fechar o dia (frente Casa) | fechar o dia | o dia fechado |')
  pasta(on, {
    '/os/base-camp.md': COM_CARTAO('completo'),
    [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO,
    '/os/frentes/loja/workflows/pedido-da-semana.md': loja,
    '/os/resumo-para-o-arthur.md': RESUMO,
  }, [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  // A Mera é da loja; a Island conta o cartão da loja e o "Conferir a nota", não o "Fechar o dia", que é da Casa.
  expect(await ui.find({ type: 'Text', text: /Island \(a frente\) 1 de 2/ })).toBeDefined()
  await ui.press({ key: 'fila' })
  expect(await ui.find({ type: 'Text', text: /^Fechar o dia$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^· Casa$/ })).toBeDefined()
  expect((await ui.findAll({ type: 'Button' })).filter(b => String(b.props.key).startsWith('nova-comecar')).every(b => b.props.label === 'Rodar')).toBe(true)
  await ui.unmount()
})

test('a conversa nova que não abriu: o painel copia o pedido; a que abriu, não copia nada', async ($, on) => {
  const enviados: string[] = []
  const falhou = 'Não consegui abrir a conversa nova. Copiei o pedido: abra uma conversa nova e cole.'
  pasta(on, {
    '/os/base-camp.md': COM_CARTAO('completo'),
    [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO,
    '/os/frentes/loja/workflows/pedido-da-semana.md': CARTAO_LOJA.replace('a conferir', 'sim'),
    '/os/resumo-para-o-arthur.md': RESUMO,
  }, enviados)
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  // A que abriu: a resposta não traz a frase, e nada é copiado.
  let ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  await ui.press({ key: 'nova-wf-0' })
  await ui.unmount()
  await $.turn.start({ text: 'abrir o workflow Mensagem de retorno numa conversa nova', turnId: 'n1' })
  await $.turn.complete({ answer: 'Abri a conversa nova; é só aprovar no cartão.', durationMs: 1000, isAborted: false, turnId: 'n1', reason: 'answer' })
  expect(enviados.some(t => t.startsWith('[copiado]'))).toBe(false)

  // A que não abriu: a frase fixa da campo-1, e o pedido vai para a área de transferência.
  ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  await ui.press({ key: 'nova-wf-0' })
  await ui.unmount()
  await $.turn.start({ text: 'abrir o workflow Mensagem de retorno numa conversa nova', turnId: 'n2' })
  await $.turn.complete({ answer: falhou, durationMs: 1000, isAborted: false, turnId: 'n2', reason: 'answer' })
  expect(enviados).toContain('[copiado] mensagem de retorno')
  expect(enviados).toContain('[aviso] Copiei o pedido. Abra uma conversa nova e cole.')

  // Sem o botão (ela pediu o segundo workflow escrevendo): o pedido vem em negrito no fim da frase.
  await $.turn.start({ text: 'proposta', turnId: 'n3' })
  await $.turn.complete({ answer: `${falhou} O pedido: **proposta**.`, durationMs: 1000, isAborted: false, turnId: 'n3', reason: 'answer' })
  expect(enviados).toContain('[copiado] proposta')
})

test('os marcos: a Island fecha com a frente inteira, a Lobuche East com outra frente, e o fecho só com fatos', async ($, on) => {
  const enviados: string[] = []
  const completo = (texto: string, data: string) => texto.replace(/\*\*Estado:\*\* em andamento/, `**Estado:** completo, em ${data}`)
  const arquivos: Record<string, string> = {
    '/os/base-camp.md': COM_CARTAO('completo'),
    [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO,
    '/os/frentes/consultoria/workflows/proposta.md': CARTAO.replace('# Workflow: Mensagem de retorno', '# Workflow: Proposta')
      .replace('**Pedido:** mensagem de retorno', '**Pedido:** proposta'),
    '/os/frentes/loja/workflows/pedido-da-semana.md': CARTAO_LOJA.replace('a conferir', 'sim').replace(/\n## Os próximos[\s\S]*$/, '\n'),
    '/os/resumo-para-o-arthur.md': RESUMO,
  }
  pasta(on, arquivos, enviados)
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })
  let ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /^Mera \(1º workflow\) · Island/ })).toBeDefined()
  await ui.unmount()

  // O primeiro completo fecha a Mera, com o fecho em fatos: o antes do cartão e o tempo da última vez.
  arquivos[`/os/${CAMINHO_DO_CARTAO}`] = completo(CARTAO, '05/11/2026')
  await $.turn.start({ text: 'aprovado', turnId: 'm1' })
  await $.turn.complete({ answer: 'Completo.', durationMs: 1000, isAborted: false, turnId: 'm1', reason: 'answer' })
  expect(enviados).toContain('[aviso] Mera: Mensagem de retorno sai pronto com um pedido seu, desde 05/11/2026. Antes, 3 horas; na última vez, 7 min.')
  ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /^Mera \(1º workflow\) ✓ · Island \(a frente\) 1 de 2 · Lobuche East \(2ª frente\)$/ })).toBeDefined()
  await ui.unmount()

  // O segundo da mesma frente fecha a Island; um completo noutra frente fecha a Lobuche East.
  arquivos['/os/frentes/consultoria/workflows/proposta.md'] = completo(arquivos['/os/frentes/consultoria/workflows/proposta.md'] ?? '', '06/11/2026')
  arquivos['/os/frentes/loja/workflows/pedido-da-semana.md'] = completo(arquivos['/os/frentes/loja/workflows/pedido-da-semana.md'] ?? '', '07/11/2026')
  await $.turn.start({ text: 'aprovado', turnId: 'm2' })
  await $.turn.complete({ answer: 'Completo.', durationMs: 1000, isAborted: false, turnId: 'm2', reason: 'answer' })
  ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /^Mera \(1º workflow\) ✓ · Island \(a frente\) ✓ · Lobuche East \(2ª frente\) ✓$/ })).toBeDefined()
  // No fim, o "você está aqui" no cume da Lobuche East, sem sair do desenho.
  const fim = (await ui.findAll({ type: 'Svg' })).find(s => /^A subida/.test(String(s.props.alt)))?.props.source ?? ''
  expect(fim).toContain('<circle cx="225.0" cy="40.0" r="5" fill="#FF6F1A"/>')
  await ui.unmount()
  expect(enviados.some(t => /confete|parabéns|🎉/i.test(t))).toBe(false)
})

test('o diário: uma linha por conversa, reescrita a cada resposta, com o pedido cortado e sem números longos', async ($, on) => {
  mock.clock(on, { now: new Date(2026, 10, 4, 14, 20).getTime() })
  const arquivos: Record<string, string> = {
    '/os/base-camp.md': COM_CARTAO('completo'),
    [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO,
    '/os/resumo-para-o-arthur.md': RESUMO,
  }
  pasta(on, arquivos, [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  const pedido = `monta o relatório de vendas da loja 1234567 ${'com todas as lojas '.repeat(8)}`
  await $.turn.start({ text: pedido, turnId: 'd1' })
  await $.tool.call({ tool: 'Read', file_path: '/os/frentes/loja/vendas.csv' })
  await $.tool.call({ tool: 'Read', file_path: '/os/AGENTS.md' })
  await $.tool.call({ tool: 'Bash', command: 'python3 frentes/loja/rotinas/relatorio.py' })
  await $.tool.call({ tool: 'Write', file_path: '/os/frentes/loja/relatorio-semana.xlsx', content: 'x' })
  await $.turn.complete({ answer: 'Pronto.', durationMs: 120000, isAborted: false, turnId: 'd1', reason: 'answer' })

  const diario = arquivos['/os/frentes/loja/diario/2026-11.md'] ?? ''
  expect(diario.startsWith('# Diário: loja · novembro de 2026\n')).toBe(true)
  expect(diario).toContain('Pode apagar quando quiser.\n\n- 04/11')
  let linhas = diario.split('\n').filter(l => l.startsWith('- '))
  expect(linhas.length).toBe(1)
  const linha = linhas[0] ?? ''
  expect(linha.startsWith('- 04/11 14:20 · ')).toBe(true)
  expect(linha).toContain('(o sistema: 2)')
  expect(linha).toContain('1 pedido ·')
  expect(linha).toContain('"monta o relatório de vendas da loja # com todas')
  expect(linha).not.toContain('1234567')
  expect((/"([^"]*)"/.exec(linha)?.[1] ?? '').length).toBeLessThanOrEqual(100)
  expect(linha).toContain('gravou: relatorio-semana.xlsx')
  expect(linha).toContain('leu: vendas.csv ·')
  expect(linha).toContain('rodou: relatorio.py')
  expect(linha).not.toContain('AGENTS.md')
  expect(linha).toContain('passos: Li vendas.csv › Salvei relatorio-semana.xlsx')
  expect(linha.endsWith(' · c7f2')).toBe(true)

  // A segunda resposta da mesma conversa reescreve a mesma linha, mesmo com o painel recarregado no meio.
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })
  await $.turn.start({ text: 'agora some por loja', turnId: 'd2' })
  await $.turn.complete({ answer: 'Somei.', durationMs: 60000, isAborted: false, turnId: 'd2', reason: 'answer' })
  linhas = (arquivos['/os/frentes/loja/diario/2026-11.md'] ?? '').split('\n').filter(l => l.startsWith('- '))
  expect(linhas.length).toBe(1)
  expect(linhas[0]).toContain('2 pedidos')
  expect(linhas[0]).toContain('(o sistema: 3)')
})

test('o diário não anota a montagem nem a atualização da pasta', async ($, on) => {
  const arquivos: Record<string, string> = {
    '/os/base-camp.md': COM_CARTAO('completo'),
    [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO,
    '/os/resumo-para-o-arthur.md': RESUMO,
  }
  pasta(on, arquivos, [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })
  await $.turn.start({ text: 'atualizar a pasta', turnId: 's1' })
  await $.tool.call({ tool: 'Skill', skill: 'business-creator:atualizar-a-pasta' })
  await $.tool.call({ tool: 'Write', file_path: '/os/frentes/loja/notas.md', content: 'x' })
  await $.turn.complete({ answer: 'Atualizada.', durationMs: 1000, isAborted: false, turnId: 's1', reason: 'answer' })
  expect(Object.keys(arquivos).some(a => a.includes('/diario/'))).toBe(false)
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /O diário não está gravando/ })).toBeUndefined()
  await ui.unmount()
})

test('a gravação do diário que falha aparece numa linha do painel, e nada mais para', async ($, on) => {
  const arquivos: Record<string, string> = {
    '/os/base-camp.md': COM_CARTAO('completo'),
    [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO,
    '/os/resumo-para-o-arthur.md': RESUMO,
  }
  pasta(on, arquivos, [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })
  // A pasta da frente não aceita a gravação.
  await $.turn.start({ text: 'confere o estoque', turnId: 's2' })
  await $.tool.call({ tool: 'Write', file_path: '/os/frentes/bloqueada/estoque.md', content: 'x' })
  await $.turn.complete({ answer: 'Conferido.', durationMs: 1000, isAborted: false, turnId: 's2', reason: 'answer' })
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /^O diário não está gravando\. Escreva travei\.$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /^AGORA$/ })).toBeDefined()
  await ui.unmount()
})
