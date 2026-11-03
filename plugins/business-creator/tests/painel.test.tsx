import { expect, mock, test } from 'claude-code/testing'

// Uma pasta de Base Camp no meio da montagem: o começo e a etapa 1 aprovados, a
// etapa 2 em andamento. Nada aqui lê o disco: os hooks abaixo fazem as vezes do
// engine e respondem às leituras de arquivo e às chamadas do mod.
const BASE_CAMP = `# Base Camp: o estado da montagem

- **Nível:** NIVEL
- **Montagem:** em andamento

| Etapa | Status | Início | Fim |
|---|---|---|---|
| D · O começo | aprovado | 23/10/2026 17:24 | 23/10/2026 17:36 |
| 1 · O retrato | em andamento | 23/10/2026 17:36 | |
| 2 · A primeira tarefa | pendente | | |

## Testes
- **Quem sou eu:** não feito
- **Separação entre frentes:** não feito

## Primeiras tarefas
<!-- comentário do modelo -->

## Em aberto
`

const CONCLUIDA = BASE_CAMP.replace('em andamento |', 'aprovado |')
  .replace(/pendente/g, 'aprovado')
  .replace('**Montagem:** em andamento', '**Montagem:** concluída')
  .replace('**Quem sou eu:** não feito', '**Quem sou eu:** passou')
  .replace(
    '<!-- comentário do modelo -->',
    [
      '- Escreva a mensagem de retorno para o cliente, no meu jeito',
      '- Monte a lista do que conferir no fechamento',
      '- Resuma o que está parado nas minhas frentes',
      '**Feita:** a mensagem de retorno · ela gostou',
      '**Combinado:** amanhã, às 8h, antes dos e-mails, abrir esta pasta e pedir a lista do fechamento.',
    ].join('\n'),
  )

const PROCESSO = `# O meu primeiro processo

## O processo
- **O quê:** A proposta da consultoria

## O antes (o número de partida)
| Quanto tempo leva hoje | Vezes por mês | Horas por mês | Quando | Como foi medido |
|---|---|---|---|---|
| 3 horas | 4 | 12 horas | 21/10/2026 | lembrança da última vez |
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

// O retrato confirmado e o passo 2 em andamento, com as 3 tarefas propostas (0.2.14) e ainda nenhuma feita.
const PASSO_2 = BASE_CAMP.replace('NIVEL', 'completo')
  .replace('| 1 · O retrato | em andamento | 23/10/2026 17:36 | |', '| 1 · O retrato | aprovado | 23/10/2026 17:36 | 23/10/2026 17:41 |')
  .replace('| 2 · A primeira tarefa | pendente | | |', '| 2 · A primeira tarefa | em andamento | 23/10/2026 17:41 | |')
  .replace('**Quem sou eu:** não feito', '**Quem sou eu:** passou')
  .replace(
    '<!-- comentário do modelo -->',
    [
      '- Escreva a mensagem de retorno para o cliente, no meu jeito',
      '- Monte a lista do que conferir no fechamento',
      '- Resuma o que está parado nas minhas frentes',
    ].join('\n'),
  )

// O que o sistema já sabe, com o nome dela no cartão "Quem você é" e nada em "Falta isto".
const SABIDO = '# O que o sistema já sabe\n\n## Já sei isto\n### Quem você é\n- Ana Souza, de Recife, consultora de RH\n### O que você toca\n- A consultoria de RH, sozinha\n\n## Falta isto\n'

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

  test(`completo, montagem concluída (${surface})`, async ($, on) => {
    const enviados: string[] = []
    pasta(on, {
      // Desde a 0.2.1, o primeiro workflow mora na frente e o base-camp.md diz onde.
      '/os/base-camp.md': CONCLUIDA.replace('NIVEL', 'completo').replace(
        '**Montagem:** concluída',
        '**Montagem:** concluída\n- **Primeiro workflow:** `frentes/consultoria/workflows/proposta.md`',
      ),
      '/os/frentes/consultoria/workflows/proposta.md': PROCESSO,
      '/os/resumo-para-o-arthur.md': RESUMO,
    }, enviados)
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    // O estado final mora no mesmo cartão Agora (0.2.16): a etiqueta, o título, um botão principal e o
    // Quero corrigir. O título do painel é o sistema dela (sem o nome no resumo, "O seu sistema").
    expect(await ui.find({ type: 'Text', text: /AGORA · BASE CAMP MONTADO/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /^O seu Base Camp está montado\.$/ }))?.props.bold).toBe(true)
    expect(await ui.find({ type: 'Text', text: /^O seu sistema$/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /^Montagem do Base Camp$/ })).toBeUndefined()
    expect(await ui.find({ type: 'Button', key: 'corrigir' })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /O teste passou/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /amanhã, às 8h/ })).toBeDefined()
    expect(await ui.find({ type: 'Text', text: /Campo 1/ })).toBeDefined()
    expect((await ui.find({ type: 'Button', key: 'rodar-workflow' }))?.props.variant).toBe('primary')
    expect(await ui.find({ type: 'Text', text: /A proposta da consultoria/ })).toBeDefined()
    expect((await ui.find({ type: 'Text', text: /Começo/ }))?.text).toContain('✓ Base   ✓ Começo   ✓ O retrato   ✓ A primeira tarefa')
    // A tarefa feita (a mensagem de retorno) sai de "Peça ao seu sistema": sobram as outras duas (0.2.16).
    expect((await ui.find({ type: 'Button', key: 'tarefa-0' }))?.props.label).toBe('Monte a lista do que conferir no fechamento')
    expect(await ui.find({ type: 'Button', key: 'tarefa-1' })).toBeDefined()
    expect(await ui.find({ type: 'Button', key: 'tarefa-2' })).toBeUndefined()
    await ui.press({ key: 'tarefa-0' })
    expect(enviados).toContain('Monte a lista do que conferir no fechamento')
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

for (const surface of ['desktop', 'terminal'] as const) {
  test(`depois do retrato confirmado, o painel leva o nome dela e as tarefas dizem "Fazer:" (${surface})`, async ($, on) => {
    const enviados: string[] = []
    pasta(on, { '/os/base-camp.md': PASSO_2, '/os/montagem/respostas.md': RESPOSTAS, '/os/montagem/resumo.md': SABIDO }, enviados)
    await $.session.start({ cwd: '/os', surface, isInteractive: true })

    const ui = await $.ui.mount({ ...PANE, surface })
    expect((await ui.find({ type: 'Text', text: /^O sistema de Ana$/ }))?.props.bold).toBe(true)
    expect(await ui.find({ type: 'Text', text: /^Montagem do Base Camp$/ })).toBeUndefined()
    expect((await ui.find({ type: 'Button', key: 'escolha-0' }))?.props.label).toBe('Fazer: Escreva a mensagem de retorno para o cliente, no meu jeito')
    // "Falta isto" vazio não some: o painel diz que nada falta (0.2.16).
    expect(await ui.find({ type: 'Text', text: /^Nada falta: o retrato está completo com o que você mandou\.$/ })).toBeDefined()
    await ui.press({ key: 'escolha-1' })
    expect(enviados).toContain('primeira tarefa: Monte a lista do que conferir no fechamento')
    await ui.unmount()
  })
}

test('com a tarefa feita, o botão principal fecha o Base Camp e manda a frase de sempre', async ($, on) => {
  const enviados: string[] = []
  const feita = PASSO_2.replace(
    '- Resuma o que está parado nas minhas frentes',
    '- Resuma o que está parado nas minhas frentes\n**Feita:** a mensagem de retorno · ela gostou\n**Combinado:** amanhã, às 8h, abrir esta pasta e pedir a lista.',
  )
  pasta(on, { '/os/base-camp.md': feita, '/os/montagem/respostas.md': RESPOSTAS }, enviados)
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

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

test('no fim, com uma tarefa só e feita, "Peça ao seu sistema" some', async ($, on) => {
  const umaSo = CONCLUIDA
    .replace('- Monte a lista do que conferir no fechamento\n', '')
    .replace('- Resuma o que está parado nas minhas frentes\n', '')
  pasta(on, {
    '/os/base-camp.md': umaSo.replace('NIVEL', 'completo').replace(
      '**Montagem:** concluída',
      '**Montagem:** concluída\n- **Primeiro workflow:** `frentes/consultoria/workflows/proposta.md`',
    ),
    '/os/frentes/consultoria/workflows/proposta.md': PROCESSO,
    '/os/resumo-para-o-arthur.md': RESUMO,
  }, [])
  await $.session.start({ cwd: '/os', surface: 'desktop', isInteractive: true })

  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' })
  expect(await ui.find({ type: 'Text', text: /AGORA · BASE CAMP MONTADO/ })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: /Peça ao seu sistema/ })).toBeUndefined()
  expect(await ui.find({ type: 'Button', key: 'tarefa-0' })).toBeUndefined()
  await ui.unmount()
})
