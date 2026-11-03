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
  on('ui.copy', () => ({ value: { isCopied: true } }))
  on('store.get', () => ({ value: undefined }))
  on('store.set', () => ({ value: undefined }))
  on('env.get', () => ({ value: undefined }))
  on('session.start', (_, e) => ({ cwd: e.cwd }))
  on('fs.exists', (_, e) => ({ value: e.path in arquivos || e.path.endsWith('.png') || e.path.endsWith('/skills/montagem-do-base-camp/campos.md') }))
  on('fs.read', (_, e) => ({ value: e.as === 'bytes' ? { base64: 'AAAA' } : (arquivos[e.path] ?? (e.path.endsWith('/skills/montagem-do-base-camp/campos.md') ? CAMPOS : '')) }))
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
    expect(await ui.find({ type: 'Text', text: /O SEU COMEÇO · 1 DE 3/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /Pedido 2: você, com as suas palavras/ }))?.text).toContain('✓')
    expect((await ui.find({ type: 'Text', text: /Pedido 1: o que a outra IA/ }))?.text).toContain('○')
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
    // Depois do Base Camp, o cartão Agora é o do workflow (0.2.17): o nome do cartão, o "o quê", as rodadas lidas
    // da tabela e o estado. O título do painel é o sistema dela (sem o nome no resumo, "O seu sistema").
    expect(await ui.find({ type: 'Text', text: /AGORA · O SEU PRIMEIRO WORKFLOW/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /BASE CAMP MONTADO/ })).toBeUndefined()
    expect((await ui.find({ type: 'Text', text: /^Mensagem de retorno$/ }))?.props.bold).toBe(true)
    expect(await ui.find({ type: 'Text', text: /A resposta ao cliente que pediu um orçamento/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^Rodou 1 vez\. A última em 23\/10\/2026: 1 pedido até a entrega, entrega aprovada\.$/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /O sistema já faz 2 de 4 passos\./ }))?.text).toContain('Completo quando sair pronto com um pedido só seu.')
    expect(await ui.find({ type: 'Text', text: /^O seu sistema$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^Montagem do Base Camp$/ })).toBeUndefined()
    expect(await ui.find({ type: 'Button', key: 'corrigir' })).toBeDefined()
    // O botão principal leva o pedido, com a primeira letra em maiúscula, e manda o pedido como está no cartão.
    const rodar = await ui.find({ type: 'Button', key: 'rodar-workflow' })
    expect(rodar?.props.variant).toBe('primary')
    expect(rodar?.props.label).toBe('Mensagem de retorno')
    expect(await ui.find({ type: 'Button', key: 'aprovar-entrega' })).toBeUndefined()
    // O que ficou pronto: o tempo da montagem, o teste, o combinado do cartão (não o do base-camp.md) e os
    // próximos workflows. "Peça ao seu sistema" saiu.
    expect(await ui.find({ type: 'Text', text: /^✓ Base Camp montado em 27 min$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /O teste passou/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /O combinado:/ }))?.text).toContain('quando chegar um pedido de orçamento, abra esta pasta e escreva mensagem de retorno')
    expect(await ui.find({ type: 'Text', text: /amanhã, às 8h/ })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /^Os próximos workflows: lista do fechamento · o que está parado$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /Peça ao seu sistema/ })).toBeUndefined()
    expect(await ui.find({ type: 'Button', key: 'tarefa-0' })).toBeUndefined()
    expect(await ui.find({ type: 'Text', text: /Depois: Campo 2/ })).toBeDefined()
    // A subida segue até o Campo 1, o ponto atual (0.2.17): na linha e na trilha (contorno, borda 2.2).
    expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).toBe('✓ Base   ✓ Começo   ✓ O retrato   ✓ O primeiro workflow   ● Campo 1')
    if (surface !== 'terminal') {
      const desenho = (await ui.findAll({ type: 'Svg' })).find(s => s.props.alt === TRILHA)?.props.source ?? ''
      expect(desenho).toMatch(/x="225\.6" y="100\.[45]" width="8" height="8" fill="#F5F1E8" stroke="#1F2C8F" stroke-width="2\.2"/)
    }
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
    expect(await ui.find({ type: 'Text', text: /o Arthur sobe a Mera com você/ })).toBeDefined()
    // Sem o cartão do workflow: o nome genérico, "ainda não rodou" e o botão de sempre (0.2.17).
    expect((await ui.find({ type: 'Text', text: /^O seu primeiro workflow$/ }))?.props.bold).toBe(true)
    expect(await ui.find({ type: 'Text', text: /^Ainda não rodou\. Quando chegar a hora, clique no botão ou escreva o pedido do seu guia de bolso\.$/ })).toBeDefined()
    expect((await ui.find({ type: 'Button', key: 'rodar-workflow' }))?.props.label).toBe('Rodar o meu primeiro workflow')
    await ui.press({ key: 'copiar-resumo' })
    expect(enviados.some(t => t.startsWith('[aviso] Resumo copiado'))).toBe(true)
    await ui.press({ key: 'ver-resumo' })
    expect(await ui.find({ type: 'Markdown', text: /A Ana toca duas frentes/ })).toBeDefined()
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
  expect(await ui.find({ type: 'Text', text: /AGORA · O SEU PRIMEIRO WORKFLOW/ })).toBeDefined()
  expect((await ui.find({ type: 'Text', text: /^Fechar o dia$/ }))?.props.bold).toBe(true)
  expect(await ui.find({ type: 'Text', text: /^Rodada 1 em andamento \(começou às 19:19\)\.$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /O sistema já faz 2 de 3 passos\./ })).toBeDefined()
  // A última rodada ainda espera a aprovação dela: o botão principal aprova a entrega, não roda de novo.
  const aprovar = await ui.find({ type: 'Button', key: 'aprovar-entrega' })
  expect(aprovar?.props.variant).toBe('primary')
  expect(aprovar?.props.label).toBe('Aprovar a entrega')
  expect(await ui.find({ type: 'Button', key: 'rodar-workflow' })).toBeUndefined()
  // Nada de "Peça ao seu sistema"; o combinado mostrado é o do base-camp.md (o cartão não tem); com uma tarefa só,
  // nenhum próximo workflow.
  expect(await ui.find({ type: 'Text', text: /Peça ao seu sistema/ })).toBeUndefined()
  expect(await ui.find({ type: 'Button', key: 'tarefa-0' })).toBeUndefined()
  expect((await ui.find({ type: 'Text', text: /O combinado:/ }))?.text).toContain('monitor de preço de ontem')
  expect(await ui.find({ type: 'Text', text: /^✓ Base Camp montado em 374 min pelo relógio$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Os próximos workflows/ })).toBeUndefined()
  expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).toContain('✓ A primeira tarefa   ● Campo 1')
  await ui.press({ key: 'aprovar-entrega' })
  expect(enviados).toContain('pode, aprovado')
  await ui.unmount()

  // Com a rodada aprovada, o botão principal volta a ser o pedido, lido do "Começa quando" do cartão antigo.
  arquivos['/os/frentes/projetos/workflows/fechar-o-dia.md'] = CARTAO_ANTIGO.replace(
    '| 02/11/2026 | em andamento: começou às 19:19 | | | |',
    '| 02/11/2026 | 12 min | 3 | sim | a data da lista saiu errada |',
  )
  await $.turn.start({ text: 'pode, aprovado', turnId: 't1' })
  await $.turn.complete({ answer: 'Aprovado.', durationMs: 1000, isAborted: false, turnId: 't1', reason: 'answer' })
  const depois = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await depois.find({ type: 'Text', text: /^Rodou 1 vez\. A última em 02\/11\/2026: 3 pedidos até a entrega, entrega aprovada\.$/ })).toBeDefined()
  expect(await depois.find({ type: 'Button', key: 'aprovar-entrega' })).toBeUndefined()
  expect((await depois.find({ type: 'Button', key: 'rodar-workflow' }))?.props.label).toBe('Fechar o dia')
  await depois.press({ key: 'rodar-workflow' })
  expect(enviados).toContain('fechar o dia')
  await depois.unmount()
})

test('o workflow completo no cartão: a linha do completo e o Campo 1 feito na subida', async ($, on) => {
  pasta(on, {
    '/os/base-camp.md': COM_CARTAO('completo'),
    [`/os/${CAMINHO_DO_CARTAO}`]: CARTAO.replace('**Estado:** em andamento', '**Estado:** completo, em 05/11/2026'),
    '/os/resumo-para-o-arthur.md': RESUMO,
  }, [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /^✓ Completo desde 05\/11\/2026: sai pronto com um pedido seu\.$/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Completo quando sair pronto/ })).toBeUndefined()
  expect(await ui.find({ type: 'Text', text: /O sistema já faz/ })).toBeUndefined()
  expect((await ui.find({ type: 'Button', key: 'rodar-workflow' }))?.props.label).toBe('Mensagem de retorno')
  // Na subida, o Campo 1 fica feito: na linha e na trilha (o quadrado cheio, em tinta).
  expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).toBe('✓ Base   ✓ Começo   ✓ O retrato   ✓ O primeiro workflow   ✓ Campo 1')
  const desenho = (await ui.findAll({ type: 'Svg' })).find(s => s.props.alt === TRILHA)?.props.source ?? ''
  expect(desenho).toMatch(/x="225\.6" y="100\.[45]" width="8" height="8" fill="#1F2C8F"/)
  expect(desenho).not.toMatch(/x="225\.6" y="100\.[45]" width="8" height="8" fill="#F5F1E8"/)
  await ui.unmount()
})
