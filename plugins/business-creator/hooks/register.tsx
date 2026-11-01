import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderSurface } from 'claude-code'

import type { Bloco, Campo, Festa, Montado, Nivel, Painel, Resumo, Status } from '../types'

// Painel da Montagem do Base Camp (v0.5.1). Veste a montagem com a marca e tira a
// barreira técnica: mostra a subida, de quem é a vez e o que o sistema já sabe,
// dá os botões de aprovar e corrigir e troca as linhas técnicas do app por
// frases simples. Lê os arquivos da pasta da pessoa e não grava nada nela.
// Fora do painel, só faz o que a pessoa ou a montagem pedem: o teste da etapa 6
// (uma pergunta à IA com os arquivos da pasta) e a cópia do resumo para o
// Arthur, no clique dela.

const PANE = 'base-camp'
const TITULO = 'Base Camp'
const TOOL_TESTE = 'mcp__business-creator__teste_do_base_camp'

const painel = atom({ plugin: 'business-creator', key: 'painel' } as const, null)
const pasta = atom({ plugin: 'business-creator', key: 'pasta' } as const, '')
const sessao = atom({ plugin: 'business-creator', key: 'sessao' } as const, '')
const logo = atom({ plugin: 'business-creator', key: 'logo' } as const, '')
const icones = atom({ plugin: 'business-creator', key: 'icones' } as const, {})
// O que um botão acabou de mandar, e a resposta que ele abriu: enquanto a resposta
// não termina, o painel troca os botões por um aviso (a pessoa não clica de novo).
const enviado = atom({ plugin: 'business-creator', key: 'enviado' } as const, null)
const turno = atom({ plugin: 'business-creator', key: 'turno' } as const, null)
// O que a montagem está fazendo agora: para o painel, a faixa e o "pensando…".
const trabalhando = atom({ plugin: 'business-creator', key: 'trabalhando' } as const, false)
const atividade = atom({ plugin: 'business-creator', key: 'atividade' } as const, null)
const palavra = atom({ plugin: 'business-creator', key: 'palavra' } as const, null)
// A resposta terminou pedindo aprovação, e o último arquivo do sistema gravado nela.
const aprovacao = atom({ plugin: 'business-creator', key: 'aprovacao' } as const, null)
const ultimo = atom({ plugin: 'business-creator', key: 'ultimo' } as const, null)
const festa = atom({ plugin: 'business-creator', key: 'festa' } as const, null)
// Quando a última resposta terminou, e se a pessoa está parada há um tempo.
const fim = atom({ plugin: 'business-creator', key: 'fim' } as const, null)
const parado = atom({ plugin: 'business-creator', key: 'parado' } as const, false)
const verArquivo = atom({ plugin: 'business-creator', key: 'verArquivo' } as const, false)
const arquivoTexto = atom({ plugin: 'business-creator', key: 'arquivoTexto' } as const, null)
const doc = atom({ plugin: 'business-creator', key: 'doc' } as const, null)
const docTexto = atom({ plugin: 'business-creator', key: 'docTexto' } as const, null)
const pergunta = atom({ plugin: 'business-creator', key: 'pergunta' } as const, null)

// Identidade SEM IA™ (23 e 24/10/2026): tinta, rocha e papel; o laranja de
// sinal num ponto só, o cume da primeira montanha.
const TINTA = '#1F2C8F'
const ROCHA = '#111111'
const PAPEL = '#F5F1E8'
const CINZA = '#6B675E'
const SINAL = '#FF6F1A'
const TRACO = '#B8B2A3'

// A marca de quem entrega (decisões dele, 26/10/2026): a Business Creator powered
// by SEM IA™, nos dois níveis, já antes de a comunidade abrir, para construir a
// marca. O Base Camp é a etapa: entra como título, nunca no logo.
const ASSINATURA = 'Business Creator powered by SEM IA™'

// O logo do kit da marca (marca/kit/logos/business-creator-claro.png), recortado
// na tinta e com a área livre da regra embaixo: a altura da caixa do IA. Medidas
// em pixels do PNG; na tela, 180 px de largura (o SEM IA™ da assinatura fica com
// 23 px de altura, acima dos 20 da regra).
const LOGO = {
  arquivo: 'business-creator-claro.png',
  png: [694, 372],
  tinta: [26, 25, 643, 322],
  caixa: 82,
  largura: 180,
} as const

const MARCA: Record<Status, string> = {
  aprovado: '✓',
  'em andamento': '●',
  pendente: '○',
  pulado: '–',
}

const ICONES = ['campo-1-rodar', 'campo-2-skill', 'campo-3-agendar']

// Uma linha do que cada etapa entrega, sempre à vista (a pessoa sabe para que responde).
const PARA_QUE: Record<string, string> = {
  D: 'Dois pedidos: o que a IA que você mais usa sabe de você, e você com as suas palavras.',
  '1': 'O sistema monta o seu retrato de uma vez; você só confirma ou corrige.',
  '2': 'O sistema faz a primeira tarefa para você, e combina a próxima.',
}

// Ao fechar uma etapa, o painel celebra a obra, não a pessoa.
const OBRA: Record<string, string> = {
  D: 'Pronto: o sistema já tem a sua história, do seu jeito.',
  '1': 'Retrato confirmado: o sistema já sabe quem você é, o que você toca e como você trabalha.',
  fim: 'Base Camp montado. O seu sistema já trabalha para você.',
}

// O "pensando…" do app, na voz da expedição: uma por resposta.
const PALAVRAS = [
  'Lendo o mapa',
  'Arrumando a mochila',
  'Firmando o passo',
  'Marcando a trilha',
  'Acendendo a lanterna',
  'Conferindo a rota',
  'Montando o acampamento',
  'Abrindo caminho',
]

// O que cada etapa precisa saber, pelos prefixos dos códigos de campos.md.
const PREFIXOS: Record<string, string[]> = {
  '1': ['QUEM', 'DIA', 'FRENTES', 'FRENTE', 'FERRAMENTAS', 'JEITO', 'REGRAS', 'PROC'],
}

// Os campos de campos.md ditos para a pessoa, em "você".
const ROTULOS: Record<string, string> = {
  'QUEM.nome': 'O seu nome',
  'QUEM.lugar': 'A sua cidade',
  'QUEM.trabalho': 'O seu trabalho principal',
  'QUEM.trajetoria': 'As viradas da sua carreira',
  'QUEM.procuram': 'Em que as pessoas te procuram',
  'QUEM.direcao': 'O que muda se der certo',
  'QUEM.interesses': 'O que você gosta fora do trabalho',
  'DIA.rotina': 'Um dia comum seu',
  'DIA.trabalho': 'A sua última semana de trabalho',
  'DIA.perde-tempo': 'Onde o seu tempo escapa',
  'FRENTES.lista': 'As suas frentes',
  'FRENTE.<nome>.pessoas': 'Quem está em cada frente',
  'FRENTE.<nome>.existe': 'O que já existe em cada frente',
  'FRENTE.<nome>.parado': 'O que está parado',
  'FRENTES.prioridade': 'A frente que mais precisa andar',
  'FRENTES.dinheiro': 'A frente que gera ou poupa dinheiro',
  'FERRAMENTAS.lista': 'Os programas que você usa',
  'FERRAMENTAS.dados': 'Onde ficam as suas informações',
  'JEITO.irrita': 'O que estraga uma entrega',
  'JEITO.formato': 'Como você gosta de receber',
  'JEITO.decide': 'Como você decide',
  'JEITO.horarios': 'Quando você trabalha nas frentes',
  'AMBIENTE.computador': 'O seu computador',
  'VOZ.textos': 'Textos seus, para o seu jeito de escrever',
  'REGRAS.lista': 'As regras da casa',
  'REGRAS.sigilo': 'O que não se mistura nem se guarda',
  'PROC.candidatas': 'As tarefas que se repetem',
  'PROC.dinheiro': 'Quais geram ou poupam dinheiro',
  'PROC.escolhido': 'O workflow escolhido',
  'PROC.passos': 'Os passos, do começo à entrega',
  'PROC.entrada': 'De onde vêm as informações',
  'PROC.saida': 'O que sai no fim',
  'PROC.para-quem': 'Para quem vai',
  'PROC.antes': 'Quanto tempo leva hoje',
  'PROC.pronto': 'Como saber que ficou certo',
  'PROC.dependencias': 'O que pode travar',
}

// Os arquivos do sistema, ditos para a pessoa.
const NOMES: Record<string, string> = {
  'contexto/sobre-mim.md': 'a página sobre você',
  'contexto/como-trabalhar-comigo.md': 'a página de como você trabalha',
  'contexto/estilo-de-escrita.md': 'a página do seu jeito de escrever',
  'contexto/computador.md': 'a ficha do seu computador',
  'montagem/mapa-das-frentes.md': 'o mapa das suas frentes',
  'montagem/regras.md': 'as regras da casa',
  'memoria.md': 'o seu caderno de lições',
  'primeiro-processo.md': 'a ficha do primeiro processo',
  'AGENTS.md': 'o arquivo principal do seu sistema',
  'resumo-para-o-arthur.md': 'o resumo para o Arthur',
  'como-usar.md': 'o seu guia de bolso',
}

// ------------------------------------------------------------ leitura dos arquivos

function paraData(texto: string): number | null {
  const m = /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/.exec(texto)
  if (!m) return null
  const [, dia, mes, ano, hora, minuto] = m
  return new Date(Number(ano), Number(mes) - 1, Number(dia), Number(hora), Number(minuto)).getTime()
}

function paraStatus(texto: string): Status {
  const t = texto.trim().toLowerCase()
  if (t === 'aprovado' || t === 'em andamento' || t === 'pulado') return t
  return 'pendente'
}

function secao(texto: string, titulo: string): string {
  const i = texto.indexOf(`## ${titulo}`)
  if (i < 0) return ''
  const resto = texto.slice(i + titulo.length + 3)
  const fim = resto.search(/\n## /)
  return (fim < 0 ? resto : resto.slice(0, fim)).replace(/<!--[\s\S]*?-->/g, '')
}

function lerBaseCamp(texto: string) {
  const nivel: Nivel = /\*\*Nível:\*\*\s*leve/i.test(texto) ? 'leve' : 'completo'
  const blocos: Bloco[] = []
  for (const linha of texto.split('\n')) {
    const m = /^\|\s*([D1-6])\s*·\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|/.exec(linha)
    if (!m) continue
    const [, codigo = '', nome = '', status = '', inicio = '', fim = ''] = m
    const de = paraData(inicio)
    const ate = paraData(fim)
    blocos.push({
      codigo,
      nome,
      status: paraStatus(status),
      minutos: de !== null && ate !== null ? Math.max(1, Math.round((ate - de) / 60000)) : null,
    })
  }
  const concluida =
    /\*\*Montagem:\*\*\s*conclu/i.test(texto) ||
    (blocos.length > 0 && blocos.every(b => b.status === 'aprovado' || b.status === 'pulado'))
  const iniciada = !/\*\*Montagem:\*\*\s*não começou/i.test(texto) || blocos.some(b => b.status !== 'pendente')
  const linhas = secao(texto, 'Primeiras tarefas').split('\n').map(l => l.trim())
  const tarefas = linhas
    .filter(l => /^- \S/.test(l) && !/^- (Feita|Combinado)\b/i.test(l))
    .map(l => l.slice(2).trim())
    .slice(0, 3)
  const feita = linhas.some(l => /^(- )?Feita:/i.test(l))
  const combinado =
    linhas.map(l => /^(?:- )?Combinado:\s*(.+)/i.exec(l)?.[1]?.trim()).find((x): x is string => Boolean(x)) ?? null
  const testeOk = /\*\*Quem sou eu:\*\*\s*passou/i.test(texto)
  const separacaoOk = /\*\*Separação entre frentes:\*\*\s*passou/i.test(texto)
  // A etapa 5 grava aqui onde ficou o cartão do primeiro workflow.
  const workflow = /\*\*Primeiro workflow:\*\*\s*`?([^`\n]+?)`?\s*$/m.exec(texto)?.[1]?.trim() || null
  return { nivel, iniciada, concluida, blocos, tarefas, feita, combinado, testeOk, separacaoOk, workflow }
}

// O resumo do que o sistema já sabe (montagem/resumo.md): cartões por assunto e o que falta (0.2.10).
function lerResumo(texto: string): Resumo | null {
  if (!texto) return null
  const cartoes: Resumo['cartoes'] = []
  const falta: string[] = []
  let secao: 'sei' | 'falta' | null = null
  for (const bruta of texto.split('\n')) {
    const linha = bruta.trim()
    if (/^##\s+J[áa] sei/i.test(linha)) secao = 'sei'
    else if (/^##\s+Falta/i.test(linha)) secao = 'falta'
    else if (/^###\s+/.test(linha) && secao === 'sei') cartoes.push({ titulo: linha.replace(/^###\s+/, ''), linhas: [] })
    else if (/^- \S/.test(linha)) {
      const item = linha.slice(2).trim()
      if (secao === 'falta') falta.push(item)
      else if (secao === 'sei' && cartoes.length) {
        const duvida = /^\(\?\)\s*/.test(item)
        cartoes[cartoes.length - 1]?.linhas.push({ texto: item.replace(/^\(\?\)\s*/, ''), duvida })
      }
    }
  }
  return cartoes.length || falta.length ? { cartoes, falta } : null
}

// A pergunta da vez, tirada da resposta: o que vem depois do último separador, a última frase com "?".
function extrairPergunta(resposta: string): string | null {
  const partes = resposta.split(/\n\s*---+\s*\n/)
  const fim = partes[partes.length - 1] ?? ''
  const linhas = fim
    .replace(/```[\s\S]*?```/g, ' ')
    .split('\n')
    .map(l => l.replace(/[*_`>#]/g, '').trim())
    .filter(l => l.includes('?'))
  const ultima = linhas[linhas.length - 1]
  if (!ultima) return null
  const frases = ultima.split(/(?<=[.!?])\s+/)
  const q = [...frases].reverse().find(f => f.endsWith('?')) ?? ultima
  return q.length <= 90 ? q : `${q.slice(0, 87).replace(/\s+\S*$/, '')}…`
}

function lerProcesso(texto: string): { processo: string | null; antes: string | null } {
  const processo = /\*\*O quê:\*\*\s*(.+)/.exec(texto)?.[1]?.trim() ?? null
  const linhas = texto.split('\n')
  const cabecalho = linhas.findIndex(l => /Quanto tempo leva hoje/i.test(l))
  const dado = cabecalho >= 0 ? linhas[cabecalho + 2] : undefined
  const antes = dado ? (dado.split('|')[1]?.trim() ?? null) : null
  // O tempo entra no meio da frase ("Hoje leva: umas 2 horas"): sem a maiúscula da tabela.
  const meio = antes && /^[A-ZÀ-Ú][a-zà-ú]/.test(antes) ? antes.charAt(0).toLowerCase() + antes.slice(1) : antes
  return {
    processo: processo && !processo.startsWith('<') ? processo : null,
    antes: meio && !meio.startsWith('<') ? meio : null,
  }
}

type Definicao = { codigo: string; leve: boolean; rotulo: string }

function lerDefinicoes(texto: string): Definicao[] {
  const defs: Definicao[] = []
  for (const linha of texto.split('\n')) {
    const m = /^\|\s*`([A-Z]+\.[^`]+)`\s*(\[leve\])?\s*\|\s*([^|]+)\|/.exec(linha)
    if (!m) continue
    const [, codigo = '', leve, descricao = ''] = m
    const curta = descricao.split(/[:(,;]/)[0]?.trim() ?? descricao.trim()
    defs.push({ codigo, leve: Boolean(leve), rotulo: ROTULOS[codigo] ?? curta.charAt(0).toUpperCase() + curta.slice(1) })
  }
  return defs
}

function lerCampos(defs: Definicao[], respostas: string, etapa: string, nivel: Nivel): Campo[] {
  const prefixos = PREFIXOS[etapa]
  if (!prefixos) return []
  const secoes = new Map<string, string>()
  for (const parte of respostas.split(/\n(?=## )/)) {
    const m = /^## ([A-Z]+\.\S+)/.exec(parte.trim())
    if (m?.[1]) secoes.set(m[1], parte)
  }
  return defs
    .filter(d => prefixos.includes(d.codigo.split('.')[0] ?? '') && (nivel === 'completo' || d.leve))
    .map(d => {
      const padrao = new RegExp('^' + d.codigo.replace(/\./g, '\\.').replace('<nome>', '[^.]+') + '$')
      const achados = [...secoes.entries()].filter(([c]) => padrao.test(c)).map(([, t]) => t)
      if (achados.length === 0) return { codigo: d.codigo, rotulo: d.rotulo, estado: 'falta' as const }
      const linhas = achados.join('\n').split('\n').filter(l => /^\s*-\s+\S/.test(l))
      const pulada = linhas.length > 0 && linhas.every(l => /\[pulada\]/i.test(l))
      return { codigo: d.codigo, rotulo: d.rotulo, estado: pulada ? ('pulada' as const) : ('ok' as const) }
    })
}

function relativo(dir: string, caminho: string): string | null {
  if (!dir) return null
  if (caminho.startsWith(dir + '/')) return caminho.slice(dir.length + 1)
  if (!caminho.startsWith('/')) return caminho.replace(/^\.\//, '')
  return null
}

// ------------------------------------------------------------ frases no lugar das linhas técnicas

type Frase = { feito: string; fazendo: string }

function nomeDoArquivo(rel: string): string | null {
  const frente = /^frentes\/([^/]+)\/AGENTS\.md$/.exec(rel)
  if (frente) return `a ficha de ${frente[1]}`
  // O cartão de cada workflow mora na frente (no leve, em workflows/ da raiz).
  const cartao = /^(?:frentes\/[^/]+\/)?workflows\/([^/]+)\.md$/.exec(rel)
  if (cartao) return `o cartão do workflow ${cartao[1]}`
  return NOMES[rel] ?? null
}

function frase(tool: string, entrada: Record<string, unknown>, dir: string): Frase | null {
  if (tool === TOOL_TESTE) return { feito: 'Rodei o teste do Base Camp', fazendo: 'Rodando o teste do Base Camp' }
  if (tool === 'Skill') {
    // No plugin, a skill vem com o nome dele na frente (business-creator:montagem-do-base-camp).
    return typeof entrada.skill === 'string' && /(^|:)montagem-do-base-camp$/.test(entrada.skill)
      ? { feito: 'Abri a montagem do Base Camp', fazendo: 'Abrindo a montagem do Base Camp' }
      : null
  }
  if (tool === 'Bash' || tool === 'PowerShell') {
    // No Windows a hora vem do PowerShell (Get-Date); no Mac, do date.
    const cmd = typeof entrada.command === 'string' ? entrada.command.trim() : ''
    return /^(date|Get-Date)\b/i.test(cmd) ? { feito: 'Marquei a hora', fazendo: 'Marcando a hora' } : null
  }
  if (tool === 'Glob' || tool === 'Grep' || tool === 'LS') {
    return { feito: 'Procurei nos seus arquivos', fazendo: 'Procurando nos seus arquivos' }
  }
  const caminho = typeof entrada.file_path === 'string' ? entrada.file_path : null
  // O roteiro da montagem mora no plugin, fora da pasta da pessoa.
  if (tool === 'Read' && caminho && caminho.includes('/skills/montagem-do-base-camp/')) {
    return { feito: 'Consultei o roteiro da montagem', fazendo: 'Consultando o roteiro da montagem' }
  }
  const rel = caminho ? relativo(dir, caminho) : null
  if (!rel) return null
  if (tool === 'Read') {
    if (rel === 'base-camp.md' || rel === 'montagem/respostas.md') {
      return { feito: 'Conferi onde paramos', fazendo: 'Conferindo onde paramos' }
    }
    const nome = nomeDoArquivo(rel)
    return nome ? { feito: `Reli ${nome}`, fazendo: `Relendo ${nome}` } : { feito: `Li ${rel}`, fazendo: `Lendo ${rel}` }
  }
  if (tool !== 'Write' && tool !== 'Edit' && tool !== 'MultiEdit') return null
  if (rel === 'montagem/respostas.md') return { feito: 'Anotei a sua resposta', fazendo: 'Anotando a sua resposta' }
  if (rel === 'base-camp.md') return { feito: 'Marquei a sua subida', fazendo: 'Marcando a sua subida' }
  const ligacao = /^(?:frentes\/([^/]+)\/)?CLAUDE\.md$/.exec(rel)
  if (ligacao) {
    const quem = ligacao[1] ? `a ficha de ${ligacao[1]}` : 'o seu sistema'
    return { feito: `Liguei ${quem} ao Claude`, fazendo: `Ligando ${quem} ao Claude` }
  }
  const nome = nomeDoArquivo(rel)
  if (!nome) return { feito: `Salvei ${rel}`, fazendo: `Salvando ${rel}` }
  return tool === 'Write'
    ? { feito: `Escrevi ${nome}`, fazendo: `Escrevendo ${nome}` }
    : { feito: `Atualizei ${nome}`, fazendo: `Atualizando ${nome}` }
}

function ehArquivoDoSistema(rel: string): boolean {
  return rel !== 'montagem/respostas.md' && rel !== 'base-camp.md' && !rel.startsWith('.claude/') && rel.endsWith('.md')
}

// ------------------------------------------------------------ desenho: a aproximação até o Base Camp

// As marcas (o começo e as etapas; 6 desde a 0.2.11) levam ao Base Camp, no pé da primeira
// montanha. A rota da montanha, com os três campos, sobe até o cume, o único
// laranja da peça: o que vem depois do Base Camp.
const APROX = [[14, 106], [70, 84], [126, 130], [190, 118]] as const
const marcas = (n: number): number[] => Array.from({ length: n }, (_, i) => 0.06 + (0.84 * i) / Math.max(1, n - 1))
const ROTA = [[198, 114], [254, 108], [288, 36]] as const
const CAMPOS_NA_ROTA = [0.3, 0.55, 0.78]

function ponto(t: number): [number, number] {
  const u = 1 - t
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t]
  let x = 0
  let y = 0
  k.forEach((c, i) => {
    x += c * (APROX[i]?.[0] ?? 0)
    y += c * (APROX[i]?.[1] ?? 0)
  })
  return [x, y]
}

function naRota(t: number): [number, number] {
  const u = 1 - t
  const k = [u * u, 2 * u * t, t * t]
  let x = 0
  let y = 0
  k.forEach((c, i) => {
    x += c * (ROTA[i]?.[0] ?? 0)
    y += c * (ROTA[i]?.[1] ?? 0)
  })
  return [x, y]
}

function progresso(p: Painel): number {
  if (p.concluida) return 1
  if (!p.iniciada) return 0
  const i = p.blocos.findIndex(b => b.status === 'em andamento' || b.status === 'pendente')
  return marcas(p.blocos.length)[Math.max(0, i)] ?? 0
}

function quadrado(x: number, y: number, lado: number, extra: string): string {
  return `<rect x="${(x - lado / 2).toFixed(1)}" y="${(y - lado / 2).toFixed(1)}" width="${lado}" height="${lado}" ${extra}/>`
}

function trilhaSvg(p: Painel, f: Festa | null): string {
  const prog = progresso(p)
  const atual = p.concluida ? -1 : Math.max(0, p.blocos.findIndex(b => b.status === 'em andamento' || b.status === 'pendente'))
  const caminho = `M${APROX[0].join(' ')} C${APROX[1].join(' ')} ${APROX[2].join(' ')} ${APROX[3].join(' ')}`
  const rota = `M${ROTA[0].join(' ')} Q${ROTA[1].join(' ')} ${ROTA[2].join(' ')}`
  const de = f ? (100 - f.anterior * 100).toFixed(1) : '100'
  // Movimento só quando uma etapa fecha (a festa), curto e no máximo 3 vezes; nada
  // se mexe para quem pediu ao computador menos movimento.
  let s =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 132" width="320" height="132">` +
    `<style>@media (prefers-reduced-motion: no-preference){` +
    `.anda{animation:anda 1.4s ease-out both}` +
    `.pulso{transform-box:fill-box;transform-origin:center;animation:pulso 1.6s ease-out 3}` +
    `.flui{animation:flui 1.2s linear 3}.cume{animation:cume 1.6s ease-in-out 3}}` +
    `@keyframes anda{from{stroke-dashoffset:${de}}}` +
    `@keyframes pulso{0%{transform:scale(.7);opacity:.9}100%{transform:scale(2.2);opacity:0}}` +
    `@keyframes flui{to{stroke-dashoffset:-15}}@keyframes cume{50%{opacity:.35}}</style>` +
    `<rect width="320" height="132" fill="${PAPEL}"/>`
  s += `<path d="M6 126 L316 126" stroke="${TINTA}" stroke-opacity=".35" stroke-width="1.6"/>`
  s += `<path d="M198 126 L244 72 L258 82 L288 30 L318 126" fill="${PAPEL}" stroke="${TINTA}" stroke-width="2.2" stroke-linejoin="round"/>`
  const fluir = f && p.concluida ? ' class="flui"' : ''
  s += `<path d="${rota}" fill="none" stroke="${TINTA}" stroke-opacity=".55" stroke-width="1.8" stroke-dasharray="1.5 6" stroke-linecap="round"${fluir}/>`
  for (const t of CAMPOS_NA_ROTA) {
    const [x, y] = naRota(t)
    s += quadrado(x, y, 6, `fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.6"`)
  }
  s += quadrado(288, 34, 12, `fill="${SINAL}"${f && p.concluida ? ' class="cume"' : ''}`)
  s += `<path d="${caminho}" fill="none" stroke="${TINTA}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="1.5 6" stroke-linecap="round"/>`
  if (prog > 0) {
    const fim = (100 - prog * 100).toFixed(1)
    s += `<path d="${caminho}" pathLength="100" fill="none" stroke="${TINTA}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="${fim}"${f ? ' class="anda"' : ''}/>`
  }
  marcas(p.blocos.length).forEach((t, i) => {
    const [x, y] = ponto(t)
    const b = p.blocos[i]
    const feito = p.concluida || (b !== undefined && (b.status === 'aprovado' || b.status === 'pulado'))
    if (i === atual) {
      s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="none" stroke="${TINTA}" stroke-width="1.4" opacity=".25"${f ? ' class="pulso"' : ''}/>`
      s += quadrado(x, y, 10, `fill="${PAPEL}" stroke="${TINTA}" stroke-width="2.4"`)
    } else if (feito) {
      s += quadrado(x, y, 8, `fill="${TINTA}"`)
    } else {
      s += quadrado(x, y, 7, `fill="${PAPEL}" stroke="${TRACO}" stroke-width="1.4"`)
    }
  })
  // O Base Camp: contorno enquanto é montado, cheio quando fica pronto.
  if (p.concluida) {
    s += `<circle cx="190" cy="118" r="10" fill="none" stroke="${TINTA}" stroke-width="1.4" opacity=".25"${f ? ' class="pulso"' : ''}/>`
    s += quadrado(190, 118, 12, `fill="${TINTA}"`)
  } else {
    s += quadrado(190, 118, 12, `fill="${PAPEL}" stroke="${TINTA}" stroke-width="2.2"`)
  }
  return s + '</svg>'
}

// ------------------------------------------------------------ o que roda

async function existe($: EngineInterface, caminho: string): Promise<boolean> {
  try {
    return await $.fs.exists(caminho)
  } catch {
    return false
  }
}

async function lerTexto($: EngineInterface, caminho: string): Promise<string> {
  try {
    return (await existe($, caminho)) ? await $.fs.read(caminho) : ''
  } catch {
    return ''
  }
}

async function carregar($: EngineInterface) {
  const dir = await read($, pasta)
  const texto = await lerTexto($, `${dir}/base-camp.md`)
  let novo: Painel | null = null
  if (texto) {
    const base = lerBaseCamp(texto)
    // Antes da 0.2.1 o primeiro processo ficava na raiz; desde ela, é o cartão do primeiro workflow.
    const cartao = base.workflow ? `${dir}/${base.workflow}` : `${dir}/primeiro-processo.md`
    const proc = lerProcesso(await lerTexto($, cartao))
    const agentes = await lerTexto($, `${dir}/AGENTS.md`)
    const principal = Boolean(agentes) && !/Sistema em montagem/.test(agentes)
    const resumo = await existe($, `${dir}/resumo-para-o-arthur.md`)
    const guia = await existe($, `${dir}/como-usar.md`)
    const montado: Montado[] = [
      { rotulo: 'A página sobre você', ok: await existe($, `${dir}/contexto/sobre-mim.md`) },
      { rotulo: 'O mapa das suas frentes', ok: await existe($, `${dir}/montagem/mapa-das-frentes.md`) },
      { rotulo: 'Como você trabalha', ok: await existe($, `${dir}/contexto/como-trabalhar-comigo.md`) },
      { rotulo: 'O caderno de lições', ok: await existe($, `${dir}/memoria.md`) },
      { rotulo: 'O primeiro workflow', ok: await existe($, cartao) },
      { rotulo: 'O arquivo principal', ok: principal },
      { rotulo: 'O guia de bolso', ok: guia },
    ]
    const atual = base.blocos.find(b => b.status === 'em andamento') ?? base.blocos.find(b => b.status === 'pendente')
    let campos: Campo[] = []
    const ultima = base.blocos[base.blocos.length - 1]?.codigo
    const curto = base.blocos.length === 3
    if (curto && atual?.codigo === '1' && !base.concluida) {
      // O retrato (0.2.12): o painel mostra o que já foi montado e o teste.
      const ok = (x: boolean): Campo['estado'] => (x ? 'ok' : 'falta')
      campos = [
        ...montado.map(m => ({ codigo: `1.${m.rotulo}`, rotulo: m.rotulo, estado: ok(m.ok) })),
        { codigo: '1.computador', rotulo: 'O seu computador, conferido', estado: ok(await existe($, `${dir}/contexto/computador.md`)) },
        { codigo: '1.teste', rotulo: 'O teste: quem sou eu', estado: ok(base.testeOk) },
      ]
    } else if (curto && atual?.codigo === '2' && !base.concluida) {
      const ok = (x: boolean): Campo['estado'] => (x ? 'ok' : 'falta')
      campos = [
        { codigo: '2.tarefa', rotulo: 'A primeira tarefa feita', estado: ok(base.feita) },
        { codigo: '2.combinado', rotulo: 'O combinado', estado: ok(Boolean(base.combinado)) },
      ]
    } else if (atual && atual.codigo === ultima && !base.concluida) {
      // A última etapa não pergunta: entrega. O painel mostra o que falta entregar.
      const ok = (x: boolean): Campo['estado'] => (x ? 'ok' : 'falta')
      const e = atual.codigo
      campos = [
        { codigo: `${e}.1`, rotulo: 'As regras da casa', estado: ok(await existe($, `${dir}/memoria.md`)) },
        { codigo: `${e}.2`, rotulo: 'O arquivo principal', estado: ok(principal) },
        { codigo: `${e}.3`, rotulo: 'O teste: quem sou eu', estado: ok(base.testeOk) },
        ...(base.nivel === 'completo'
          ? [{ codigo: `${e}.4`, rotulo: 'O teste: as frentes não se misturam', estado: ok(base.separacaoOk) }]
          : []),
        { codigo: `${e}.6`, rotulo: 'O resumo para o Arthur', estado: ok(resumo) },
        { codigo: `${e}.7`, rotulo: 'O guia de bolso', estado: ok(guia) },
        { codigo: `${e}.8`, rotulo: 'A primeira tarefa feita', estado: ok(base.feita) },
      ]
    } else if (atual?.codigo === 'D' && !base.concluida) {
      // O começo não tem campos: o painel mostra os 2 pedidos da abertura e a conferência (0.2.7).
      const r = await lerTexto($, `${dir}/montagem/respostas.md`)
      const ok = (x: boolean): Campo['estado'] => (x ? 'ok' : 'falta')
      campos = [
        { codigo: 'D.1', rotulo: 'Pedido 1: o que a outra IA já sabe de você', estado: ok(/\[memória de outra IA/.test(r)) },
        { codigo: 'D.2', rotulo: 'Pedido 2: você, com as suas palavras', estado: ok(/\[despejo\]/.test(r)) },
        { codigo: 'D.3', rotulo: 'Você conferiu o resumo', estado: ok(/confirmado/.test(r)) },
      ]
    } else if (atual && !base.concluida) {
      const defs = lerDefinicoes(await lerTexto($, `${$.plugin.root}/skills/montagem-do-base-camp/campos.md`))
      campos = lerCampos(defs, await lerTexto($, `${dir}/montagem/respostas.md`), atual.codigo, base.nivel)
    }
    const sabido = lerResumo(await lerTexto($, `${dir}/montagem/resumo.md`))
    novo = { ...base, ...proc, campos, montado, resumo: sabido }
  }
  const anterior = await read($, painel)
  if (JSON.stringify(anterior) === JSON.stringify(novo)) return novo
  await update($, painel, () => novo)
  if (anterior && novo) await celebrar($, anterior, novo)
  return novo
}

async function celebrar($: EngineInterface, antes: Painel, depois: Painel) {
  let texto: string | null = null
  if (!antes.concluida && depois.concluida) {
    texto = OBRA.fim ?? null
  } else if (!depois.concluida) {
    const fechou = depois.blocos.find(
      b => b.status === 'aprovado' && antes.blocos.find(a => a.codigo === b.codigo)?.status !== 'aprovado',
    )
    if (fechou) {
      const proxima = depois.blocos.find(b => b.status === 'em andamento' || b.status === 'pendente')
      const obra = OBRA[fechou.codigo] ?? `Etapa ${fechou.codigo} montada.`
      texto = proxima ? `${obra} Agora: ${proxima.nome.toLowerCase()}.` : obra
    }
  }
  if (!texto) return
  $.ui.toast(texto, { timeoutMs: depois.concluida ? 9000 : 6000 })
  await update($, festa, () => ({ texto, anterior: progresso(antes) }))
  $.clock.after(9000, () => void update($, festa, () => null))
}

// Parada há 4 minutos esperando a resposta dela: o painel lembra, sem pressa, do Travei e da voz.
async function vigiar($: EngineInterface) {
  const quando = await read($, fim)
  if (!quando || (await read($, parado)) || (await read($, trabalhando)) || !(await emMontagem($))) return
  if (Date.now() - quando > 240000) await update($, parado, () => true)
}

async function enviar($: EngineInterface, texto: string) {
  if (await read($, enviado)) return
  await update($, enviado, () => texto)
  // Rede de segurança: se a resposta nunca chegar, os botões voltam em 3 minutos.
  $.clock.after(180000, () => void limpar($))
  // asUser: o clique é a pessoa falando; o modelo lê só o texto, sem o aviso técnico do app.
  void $.prompt.submit({ text: texto, asUser: true })
}

async function limpar($: EngineInterface) {
  await update($, enviado, () => null)
  await update($, turno, () => null)
}

async function corrigir($: EngineInterface) {
  await $.prompt.fill({ text: 'quero corrigir: ', mode: 'replace' })
}

async function abrirArquivo($: EngineInterface) {
  const aberto = !(await read($, verArquivo))
  await update($, verArquivo, () => aberto)
  if (!aberto) return
  const alvo = (await read($, aprovacao))?.arquivo
  const texto = alvo ? await lerTexto($, `${await read($, pasta)}/${alvo}`) : ''
  await update($, arquivoTexto, () => (texto ? texto.replace(/<!--[\s\S]*?-->/g, '').slice(0, 8000) : 'Não achei o arquivo.'))
}

async function abrirDoc($: EngineInterface, qual: 'guia' | 'resumo') {
  const aberto = (await read($, doc)) === qual ? null : qual
  await update($, doc, () => aberto)
  if (!aberto) return
  const arquivo = aberto === 'guia' ? 'como-usar.md' : 'resumo-para-o-arthur.md'
  const texto = (await lerTexto($, `${await read($, pasta)}/${arquivo}`)).replace(/<!--[\s\S]*?-->/g, '').trim()
  await update($, docTexto, () => (texto ? texto.slice(0, 8000) : 'Este arquivo ainda não foi escrito.'))
}

async function copiarResumo($: EngineInterface, surface: RenderSurface) {
  const dir = await read($, pasta)
  const texto = (await lerTexto($, `${dir}/resumo-para-o-arthur.md`)).replace(/<!--[\s\S]*?-->/g, '').trim()
  if (!texto) {
    $.ui.toast('O resumo para o Arthur ainda não foi escrito.')
    return
  }
  let copiado = false
  try {
    copiado = (await $.ui.copy({ text: texto, surface })).isCopied
  } catch {
    copiado = false
  }
  if (!copiado && (await $.env.get('OS')) !== 'Windows_NT') {
    // No Mac: o pbcopy, com o idioma dito (sem ele, os acentos chegam trocados).
    try {
      const r = await $.process.run(['pbcopy'], { stdin: texto, env: { LANG: 'en_US.UTF-8' }, timeoutMs: 5000 })
      copiado = r.exitCode === 0
    } catch {
      copiado = false
    }
  }
  if (copiado) {
    $.ui.toast('Resumo copiado. Agora é só colar na conversa com o Arthur.', { timeoutMs: 7000 })
    return
  }
  await update($, doc, () => 'resumo')
  await update($, docTexto, () => texto.slice(0, 8000))
  $.ui.toast('Não deu para copiar sozinho. O resumo está aberto no painel: selecione e copie.', { timeoutMs: 8000 })
}

async function montarContexto($: EngineInterface): Promise<string> {
  const dir = await read($, pasta)
  const principal = await lerTexto($, `${dir}/AGENTS.md`)
  if (!principal) return ''
  const partes = [`=== AGENTS.md ===\n${principal}`]
  const imports = [...principal.matchAll(/@([\w./-]+\.md)/g)].map(m => m[1]).filter((x): x is string => Boolean(x))
  for (const rel of [...new Set(imports)].slice(0, 8)) {
    const t = await lerTexto($, `${dir}/${rel}`)
    if (t) partes.push(`=== ${rel} ===\n${t}`)
  }
  return partes.join('\n\n').slice(0, 60000)
}

async function testar($: EngineInterface, pergunta: string): Promise<string> {
  const contexto = await montarContexto($)
  if (!contexto) return 'O teste não rodou: não achei o AGENTS.md da pasta.'
  const r = await $.model.complete({
    model: 'haiku',
    system:
      'Você é o sistema de trabalho de uma pessoa. Tudo o que você sabe sobre ela está nos arquivos abaixo. ' +
      'Não use nada além deles e não invente. Fale com a pessoa em "você". Siga as regras e o formato que os arquivos pedem. Português do Brasil.',
    prompt: `${contexto}\n\n---\nPedido da pessoa: ${pergunta}`,
    maxTokens: 900,
    timeoutMs: 60000,
  })
  return r.isAnswered ? r.text : `O teste não rodou (${r.reason}). Use a conversa nova, como diz o roteiro.`
}

function sugestao(resposta: string): string | null {
  const t = resposta.toLowerCase()
  if (t.includes('está certo? pode corrigir')) return 'pode, aprovado'
  if (t.includes('seguir agora ou parar')) return 'bora seguir'
  return null
}

async function naPastaDaSessao($: EngineInterface): Promise<boolean> {
  const dir = await read($, pasta)
  return Boolean(dir) && dir === (await read($, sessao))
}

async function emMontagem($: EngineInterface): Promise<boolean> {
  if (!(await naPastaDaSessao($))) return false
  const p = await read($, painel)
  return Boolean(p && !p.concluida)
}

// ------------------------------------------------------------ os ganchos

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'base-camp',
      description: 'Abre o painel do Base Camp (opcional: a pasta do Base Camp)',
      argumentHint: '[pasta]',
    })
    await update($, sessao, () => e.cwd)
    if (!(await read($, pasta))) await update($, pasta, () => e.cwd)
    if (!(await read($, logo))) {
      const { base64 } = await $.fs.read(`${$.plugin.root}/assets/${LOGO.arquivo}`, { as: 'bytes' })
      const [x, y, largura, altura] = LOGO.tinta
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${largura} ${altura + LOGO.caixa}">` +
        `<image href="data:image/png;base64,${base64}" width="${LOGO.png[0]}" height="${LOGO.png[1]}"/></svg>`
      await update($, logo, () => svg)
    }
    if (Object.keys(await read($, icones)).length === 0) {
      const lidos: Record<string, string> = {}
      for (const nome of ICONES) lidos[nome] = await lerTexto($, `${$.plugin.root}/assets/icones/${nome}.svg`)
      await update($, icones, () => lidos)
    }
    await limpar($)
    await update($, trabalhando, () => false)
    await update($, atividade, () => null)
    const dado = await carregar($)
    if (dado) void $.ui.open({ id: PANE, title: TITULO })
    if (await existe($, `${e.cwd}/base-camp.md`)) {
      await $.tool.register({
        name: 'teste_do_base_camp',
        description:
          'Teste do Base Camp: pergunta a uma IA que só conhece os arquivos desta pasta (o AGENTS.md e o que ele carrega) ' +
          'e devolve a resposta, como uma conversa nova responderia. Use nos testes da etapa 6 da montagem.',
        inputSchema: {
          type: 'object',
          properties: { pergunta: { type: 'string', description: 'O pedido, como a pessoa faria numa conversa nova.' } },
          required: ['pergunta'],
        },
        isDeferred: false,
      })
    }
    $.clock.every(4000, () => {
      void carregar($)
      void vigiar($)
    })

    return next(e)
  })

  on('command.run', { command: 'base-camp' }, async ($, e) => {
    const pedida = e.args.trim()
    if (pedida) await update($, pasta, () => pedida)
    const dado = await carregar($)
    if (!dado) {
      return { text: `Não achei o base-camp.md em ${await read($, pasta)}.` }
    }
    await $.ui.open({ id: PANE, title: TITULO })

    return { text: 'Painel do Base Camp aberto.' }
  })

  // A ferramenta do teste da etapa 6 (vem antes do observador abaixo). Se algo
  // falhar, a montagem recebe o aviso e segue pelo caminho da conversa nova.
  on('tool.call', { tool: TOOL_TESTE }, async ($, e) => {
    const entrada = e as unknown as { pergunta?: unknown }
    const pergunta =
      typeof entrada.pergunta === 'string' && entrada.pergunta.trim()
        ? entrada.pergunta.trim()
        : 'quem sou eu e quais são as minhas frentes?'
    await update($, atividade, () => 'Rodando o teste do Base Camp')

    return { result: await testar($, pergunta) }
  }).catch(() => ({ result: 'O teste não rodou. Use a conversa nova, como diz o roteiro.' }))

  // Observa (sem mudar nada) o que a montagem faz, para dizer na tela o que está
  // acontecendo. Se ele falhar, a ferramenta roda do mesmo jeito.
  on('tool.call', async ($, e, next) => {
    if (e.tool === TOOL_TESTE || e.agentId || !(await naPastaDaSessao($))) return next(e)
    const dir = await read($, pasta)
    const entrada = e as unknown as Record<string, unknown>
    const f = frase(String(e.tool), entrada, dir)
    if (f) await update($, atividade, () => f.fazendo)
    const resultado = await next(e)
    const caminho = typeof entrada.file_path === 'string' ? entrada.file_path : null
    if ((e.tool === 'Write' || e.tool === 'Edit') && caminho) {
      const rel = relativo(dir, caminho)
      if (rel && ehArquivoDoSistema(rel)) await update($, ultimo, () => rel)
    }
    return resultado
  }).catch(($, e, next) => next(e))

  on('turn.start', async ($, e, next) => {
    if (e.agentId) return next(e)
    const texto = await read($, enviado)
    if (texto && e.text.includes(texto)) await update($, turno, () => e.turnId)
    if (await naPastaDaSessao($)) {
      await update($, trabalhando, () => true)
      await update($, atividade, () => 'Lendo a sua resposta')
      await update($, palavra, () => PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)] ?? null)
      await update($, aprovacao, () => null)
      await update($, verArquivo, () => false)
      await update($, fim, () => null)
      await update($, parado, () => false)
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const r = await next(e)
    if (e.agentId) return r
    if (e.turnId === (await read($, turno))) await limpar($)
    if (!(await naPastaDaSessao($))) return r
    await update($, trabalhando, () => false)
    await update($, atividade, () => null)
    await update($, fim, () => Date.now())
    await update($, parado, () => false)
    const resposta = e.reason === 'answer' ? e.answer || r.text : ''
    const pede = resposta.toLowerCase().includes('está certo? pode corrigir')
    const arquivo = await read($, ultimo)
    await update($, aprovacao, () => (pede ? { arquivo } : null))
    await update($, ultimo, () => null)
    await carregar($)
    await update($, pergunta, () => (resposta ? extrairPergunta(resposta) : null))
    if (resposta && (await emMontagem($))) {
      const s = sugestao(resposta)
      if (s) $.clock.after(400, () => void $.prompt.suggest({ text: s }))
    }

    return r
  })

  // Durante a montagem, as linhas técnicas viram frases simples (erro e
  // interrupção continuam como o app escreve; a vista completa também).
  on('ui.render', { component: 'ToolUse' }, async ($, e, next) => {
    if (e.props.isExpanded || e.props.isErrored || e.props.isInterrupted || !(await emMontagem($))) return next(e)
    const f = frase(e.props.tool, (e.props.input ?? {}) as Record<string, unknown>, await read($, pasta))
    if (!f) return next(e)
    const { Text } = $.ui.resolve(e)
    return e.props.isRunning ? <Text color={CINZA}>{f.fazendo}…</Text> : <Text color={TINTA}>✓ {f.feito}</Text>
  })

  on('ui.render', { component: 'ToolGroup' }, async ($, e, next) => {
    if (e.props.isExpanded || e.props.isCallsOnly === false || !(await emMontagem($))) return next(e)
    const calls = e.props.calls
    if (calls.length === 0 || calls.some(c => c.isErrored || c.isInterrupted)) return next(e)
    const dir = await read($, pasta)
    const frases = calls.map(c => frase(c.tool, (c.input ?? {}) as Record<string, unknown>, dir))
    if (frases.some(f => f === null)) return next(e)
    const { Text } = $.ui.resolve(e)
    const rodando = calls.findIndex(c => c.isRunning)
    if (rodando >= 0) return <Text color={CINZA}>{frases[rodando]?.fazendo}…</Text>
    const unicas = [...new Set(frases.map(f => f?.feito ?? ''))]
    return <Text color={TINTA}>✓ {unicas.join(' · ')}</Text>
  })

  // O "pensando…" com a voz da expedição, na pasta do Base Camp.
  on('ui.render', { component: 'Spinner' }, async ($, e, next) => {
    if (!(await naPastaDaSessao($))) return next(e)
    const agora = await read($, atividade)
    const word = (await read($, palavra)) ?? 'Montando o acampamento'
    return next({ ...e, props: { ...e.props, word, message: agora ?? e.props.message } })
  })

  // A dica fixa embaixo da caixa de texto, durante a montagem.
  on('ui.render', { component: 'PromptHint' }, async ($, e, next) => {
    if (e.props.isWorking || !(await emMontagem($))) return next(e)
    const windows = (await $.env.get('OS')) === 'Windows_NT'
    const dica = `Responda por voz: ${windows ? 'Windows + H' : 'tecla do microfone ou fn duas vezes'} · Travou? escreva travei`
    if (e.surface === 'terminal') return next({ ...e, props: { ...e.props, tail: dica } })
    return next({ ...e, props: { ...e.props, hint: e.props.hint ? `${e.props.hint} · ${dica}` : dica } })
  })

  // A faixa acima da caixa de texto: a etapa e de quem é a vez.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey || !(await emMontagem($))) return next(e)
    const p = await read($, painel)
    if (!p?.iniciada) return next(e)
    const atual = p.blocos.find(b => b.status === 'em andamento') ?? p.blocos.find(b => b.status === 'pendente')
    if (!atual) return next(e)
    const { Box, Text } = $.ui.resolve(e)
    const total = p.blocos.filter(b => b.codigo !== 'D').length
    const palavra = p.blocos.length === 3 ? 'Passo' : 'Etapa'
    const etapa = atual.codigo === 'D' ? 'Começo' : `${palavra} ${atual.codigo} de ${total} · ${atual.nome}`
    const ocupado = e.props.isWorking || (await read($, trabalhando))
    const vez = ocupado
      ? 'o sistema está escrevendo…'
      : (await read($, aprovacao))
        ? 'sua vez: aprove ou corrija'
        : 'sua vez: responda acima'
    // Com a pergunta da vez, a faixa mostra a própria pergunta, colada onde ela digita (0.2.10).
    const q = ocupado ? null : await read($, pergunta)
    if (q && !(await read($, aprovacao))) {
      return (
        <Box flexDirection="row" gap={1}>
          <Text bold color={TINTA}>Base Camp</Text>
          <Text color={CINZA}>·</Text>
          <Text bold color={TINTA}>Sua vez:</Text>
          <Text color={ROCHA}>{q}</Text>
        </Box>
      )
    }
    return (
      <Box flexDirection="row" gap={1}>
        <Text bold color={TINTA}>Base Camp</Text>
        <Text color={CINZA}>·</Text>
        <Text color={ROCHA}>{etapa}</Text>
        <Text color={CINZA}>·</Text>
        <Text color={ocupado ? CINZA : TINTA} bold={!ocupado}>{vez}</Text>
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const elementos = $.ui.resolve(e)
    const { Box, Text, Button, Markdown } = elementos
    // O terminal não desenha Svg (o app põe uma caixa vazia no lugar): lá, a marca vai em texto.
    const Svg = e.surface !== 'terminal' && 'Svg' in elementos ? elementos.Svg : null
    const figura = (fonte: string, alt: string, largura: number, animado = false) =>
      Svg && fonte ? <Svg source={fonte} alt={alt} width={largura} isInteractive={animado || undefined} /> : null

    const dado = await read($, painel)
    // Em cima, a marca de quem entrega; logo abaixo, o nome da etapa.
    const marca = figura(await read($, logo), ASSINATURA, LOGO.largura) ?? (
      <Box flexDirection="column">
        <Text bold color={ROCHA}>BUSINESS CREATOR</Text>
        <Text color={ROCHA}>powered by SEM IA™</Text>
      </Box>
    )
    const titulo = <Text bold color={TINTA} size="heading">Montagem do Base Camp</Text>
    const rodape = <Text color={CINZA} size="caption">{ASSINATURA} · Um sistema, qualquer IA.</Text>
    const fundo = {
      flexDirection: 'column' as const,
      padding: 1,
      gap: 1,
      backgroundColor: PAPEL,
      minHeight: e.surface === 'terminal' ? undefined : '100%',
    }

    if (!dado) {
      return (
        <Box {...fundo}>
          {marca}
          <Text color={CINZA}>Esta pasta ainda não tem um Base Camp.</Text>
          {rodape}
        </Box>
      )
    }

    const completo = dado.nivel === 'completo'
    const pendente = await read($, enviado)
    const ocupado = await read($, trabalhando)
    const agora = await read($, atividade)
    const aprov = await read($, aprovacao)
    const fest = await read($, festa)
    const ic = await read($, icones)
    const aberto = await read($, doc)
    const textoDoc = await read($, docTexto)
    const trilha = figura(trilhaSvg(dado, fest), 'A sua subida até o Base Camp', 300, Boolean(fest))
    const aviso = <Text color={CINZA} size="caption">Enviado: "{pendente}". Espere a resposta.</Text>
    const comemoracao = fest ? <Text bold color={TINTA}>✓ {fest.texto}</Text> : null

    const vez = ocupado ? (
      <Text color={TINTA}>● {agora ?? 'O sistema está trabalhando'}…</Text>
    ) : aprov ? (
      <Text bold color={TINTA}>Sua vez: aprove ou corrija.</Text>
    ) : (
      <Text bold color={TINTA}>Sua vez: responda na conversa.</Text>
    )

    const atualBloco = dado.blocos.find(b => b.status === 'em andamento') ?? dado.blocos.find(b => b.status === 'pendente')
    const subida = (
      <Box flexDirection="column">
        <Text color={ROCHA}>✓ A base: a pasta aberta e o kit no lugar</Text>
        {dado.blocos.map(b => {
          const atual = !dado.concluida && atualBloco?.codigo === b.codigo
          const tempo = b.minutos !== null ? `${b.minutos} min` : atual && dado.iniciada ? 'agora' : ''
          const rotulo = b.codigo === 'D' ? b.nome : `${b.codigo} · ${b.nome}`
          return (
            <Box key={`etapa-${b.codigo}`} flexDirection="row" justifyContent="space-between" gap={1}>
              <Text color={atual ? TINTA : ROCHA} bold={atual} dimColor={b.status === 'pendente' && !atual}>
                {MARCA[b.status]} {rotulo}
              </Text>
              {completo && <Text color={CINZA} size="caption">{tempo}</Text>}
            </Box>
          )
        })}
      </Box>
    )

    // Em curso, a subida vira uma linha só; o destaque é o andamento da etapa atual (pedido do Arthur, 31/10).
    const progresso = (
      <Text color={CINZA} size="caption">
        {dado.blocos
          .map(b => {
            const atual = !dado.concluida && atualBloco?.codigo === b.codigo
            return `${atual ? '●' : b.status === 'aprovado' || b.status === 'pulado' ? '✓' : '○'} ${b.codigo === 'D' ? 'Começo' : b.codigo}`
          })
          .join('   ')}
      </Text>
    )

    const docAberto =
      aberto && textoDoc ? (
        <Box flexDirection="column" gap={1} borderStyle="round" borderColor={TINTA} padding={1}>
          <Markdown text={textoDoc} />
        </Box>
      ) : null

    // ----- Boas-vindas: a montagem ainda não começou
    if (!dado.iniciada) {
      return (
        <Box {...fundo}>
          {marca}
          {titulo}
          <Text color={CINZA}>Onde todo sistema começa: uma pasta, um arquivo e qualquer IA.</Text>
          {trilha}
          <Text bold color={ROCHA}>{dado.blocos.length === 3 ? '3 passos, uns 30 minutos: você manda, confirma e vê a primeira tarefa feita.' : `${dado.blocos.filter(b => b.codigo !== 'D').length} etapas, uma tarde, com parada no fim de cada uma.`}</Text>
          <Text color={ROCHA}>
            Você responde do seu jeito, até por voz. O sistema escreve cada arquivo e mostra para você aprovar. No fim, ele já faz a primeira tarefa para você.
          </Text>
          {vez}
          {subida}
          {pendente ? aviso : (
            <Box flexDirection="row" gap={1}>
              <Button key="travei" label="Travei" onPress={() => void enviar($, 'travei')} />
            </Box>
          )}
          {rodape}
        </Box>
      )
    }

    // ----- Base Camp montado
    if (dado.concluida) {
      return (
        <Box {...fundo}>
          {marca}
          <Text bold color={TINTA} size="heading">Base Camp montado.</Text>
          <Text color={ROCHA}>O seu sistema já sabe quem você é, o que você toca e como você trabalha.</Text>
          {comemoracao}
          {trilha}
          {dado.testeOk && <Text color={TINTA}>✓ O teste passou: o sistema já sabe quem você é.</Text>}
          {dado.combinado && (
            <Box flexDirection="column">
              <Text color={CINZA} size="caption">O SEU COMBINADO</Text>
              <Text color={ROCHA}>{dado.combinado}</Text>
            </Box>
          )}
          {dado.tarefas.length > 0 && (
            <Box flexDirection="column" gap={1}>
              <Text color={CINZA} size="caption">PEÇA AO SEU SISTEMA</Text>
              {pendente ? aviso : dado.tarefas.map((t, i) => (
                <Button key={`tarefa-${i}`} label={t.length > 70 ? `${t.slice(0, 67)}…` : t} onPress={() => void enviar($, t)} />
              ))}
            </Box>
          )}
          <Box flexDirection="column" gap={1}>
            <Text color={CINZA} size="caption">PARA O ARTHUR</Text>
            <Text color={ROCHA}>
              {completo
                ? 'Mande o resumo do seu Base Camp para o Arthur revisar e dar robustez ao seu sistema.'
                : 'Se quiser que o Arthur dê uma olhada no seu Base Camp, mande o resumo para ele.'}
            </Text>
            <Box flexDirection="row" gap={1}>
              <Button key="copiar-resumo" label="Copiar o resumo" onPress={press => void copiarResumo($, press.surface)} />
              <Button key="ver-resumo" label={aberto === 'resumo' ? 'Fechar' : 'Ver o resumo'} onPress={() => void abrirDoc($, 'resumo')} />
            </Box>
            {aberto === 'resumo' && docAberto}
          </Box>
          <Box flexDirection="column" gap={1} borderStyle="round" borderColor={TINTA} padding={1}>
            <Text color={CINZA} size="caption">O PRÓXIMO PASSO · A MERA, A PRIMEIRA MONTANHA</Text>
            <Text bold color={ROCHA}>Campo 1: detalhar e aprender o seu primeiro workflow, de ponta a ponta.</Text>
            {dado.processo && <Text color={ROCHA}>{dado.processo}{completo && dado.antes ? ` · hoje leva ${dado.antes}` : ''}</Text>}
            {pendente ? aviso : (
              <Button key="rodar-workflow" variant="primary" label="Rodar o meu primeiro workflow" onPress={() => void enviar($, 'vamos rodar o primeiro workflow')} />
            )}
            <Text color={CINZA} size="caption">Depois: Campo 2, sair pronto com um pedido seu · Campo 3, chegar sozinho · Cume, medir as horas que voltaram.</Text>
            {!completo && <Text color={CINZA} size="caption">No programa, o Arthur sobe a Mera com você.</Text>}
          </Box>
          <Button key="guia" label={aberto === 'guia' ? 'Fechar o guia de bolso' : 'Ver o guia de bolso'} onPress={() => void abrirDoc($, 'guia')} />
          {aberto === 'guia' && docAberto}
          {rodape}
        </Box>
      )
    }

    // ----- Em andamento: três zonas (Agora; o que esta etapa já tem e o que o sistema sabe; a subida em uma linha).
    const ver = await read($, verArquivo)
    const textoArquivo = await read($, arquivoTexto)
    const sabidos = dado.campos.filter(c => c.estado === 'ok').length
    const total = dado.blocos.filter(b => b.codigo !== 'D').length
    const ehEntrega = atualBloco !== undefined && atualBloco.codigo === dado.blocos[dado.blocos.length - 1]?.codigo
    const ehComeco = atualBloco?.codigo === 'D'
    const lembrete = (await read($, parado)) && !ocupado
    const nomeAprov = aprov?.arquivo ? nomeDoArquivo(aprov.arquivo) : null
    const perguntaDaVez = ocupado ? null : await read($, pergunta)

    return (
      <Box {...fundo}>
        {marca}
        {titulo}
        {comemoracao}
        <Box flexDirection="column" gap={1} borderStyle="round" borderColor={TINTA} padding={1}>
          <Text color={TINTA} size="caption">
            {atualBloco
              ? atualBloco.codigo === 'D'
                ? 'AGORA · O COMEÇO'
                : `AGORA · ${dado.blocos.length === 3 ? 'PASSO' : 'ETAPA'} ${atualBloco.codigo} DE ${total} · ${atualBloco.nome.toUpperCase()}`
              : 'AGORA'}
          </Text>
          {ocupado ? (
            <Text color={TINTA}>● {agora ?? 'O sistema está trabalhando'}…</Text>
          ) : aprov ? (
            <Text bold color={ROCHA}>Sua vez: aprove ou corrija{nomeAprov ? ` ${nomeAprov}` : ''}.</Text>
          ) : (
            <Text bold color={ROCHA}>{perguntaDaVez ? `Sua vez: ${perguntaDaVez}` : 'Sua vez: responda na conversa.'}</Text>
          )}
          {atualBloco && PARA_QUE[atualBloco.codigo] && !aprov && <Text color={CINZA} size="caption">{PARA_QUE[atualBloco.codigo]}</Text>}
          {pendente ? aviso : !ocupado && (
            <Box flexDirection="row" gap={1}>
              {aprov ? (
                <Button key="aprovar" variant="primary" label="Aprovar" onPress={() => void enviar($, 'pode, aprovado')} />
              ) : !perguntaDaVez && completo ? (
                <Button key="continuar" variant="primary" label="Continuar" onPress={() => void enviar($, 'continuar')} />
              ) : null}
              <Button key="corrigir" label="Quero corrigir" onPress={() => void corrigir($)} />
              <Button key="travei" label="Travei" onPress={() => void enviar($, 'travei')} />
            </Box>
          )}
          {aprov && !ocupado && aprov.arquivo && (
            <Button key="ver" dimColor label={ver ? 'Fechar o arquivo' : 'Ler o arquivo no painel'} onPress={() => void abrirArquivo($)} />
          )}
          {ver && textoArquivo && <Markdown text={textoArquivo} />}
          {lembrete && <Text color={CINZA} size="caption">Sem pressa: responda do seu jeito, até por voz. Se travou, use o Travei.</Text>}
        </Box>
        {dado.campos.length > 0 &&
          (sabidos === dado.campos.length ? (
            <Text color={TINTA}>
              ✓ {ehEntrega ? 'Tudo o que este passo entrega já está pronto.' : ehComeco ? 'O começo está completo.' : dado.blocos.length === 3 ? 'O retrato está montado: é só confirmar.' : 'Tudo o que esta etapa precisa já está anotado.'}
            </Text>
          ) : (
            <Box flexDirection="column">
              <Text color={CINZA} size="caption">
                {ehEntrega ? 'O QUE ESTE PASSO ENTREGA' : ehComeco ? 'O SEU COMEÇO' : dado.blocos.length === 3 ? 'O QUE JÁ ESTÁ MONTADO' : 'O QUE ESTA ETAPA JÁ TEM'} · {sabidos} DE {dado.campos.length}
              </Text>
              {dado.campos.map(c => (
                <Text key={`campo-${c.codigo}`} color={c.estado === 'falta' ? CINZA : ROCHA} dimColor={c.estado === 'falta'}>
                  {c.estado === 'ok' ? '✓' : c.estado === 'pulada' ? '–' : '○'} {c.rotulo}
                  {c.estado === 'pulada' ? ' (pulada, fica para depois)' : ''}
                </Text>
              ))}
            </Box>
          ))}
        {dado.resumo && dado.resumo.cartoes.length > 0 && (
          <Box flexDirection="column" gap={1}>
            <Text color={CINZA} size="caption">O QUE EU JÁ SEI DE VOCÊ</Text>
            {dado.resumo.cartoes.map((c, i) => (
              <Box key={`cartao-${i}`} flexDirection="column" borderStyle="round" borderColor={CINZA} paddingX={1}>
                <Text bold color={ROCHA}>{c.titulo}</Text>
                {c.linhas.map((l, j) => (
                  <Text key={`cartao-${i}-${j}`} color={l.duvida ? SINAL : ROCHA}>
                    {l.duvida ? '? ' : '✓ '}{l.texto}{l.duvida ? ' (ainda vale?)' : ''}
                  </Text>
                ))}
              </Box>
            ))}
            {ehComeco && dado.resumo.falta.length > 0 && (
              <Box flexDirection="column" borderStyle="round" borderColor={CINZA} paddingX={1}>
                <Text bold color={ROCHA}>Falta isto</Text>
                {dado.resumo.falta.map((f, j) => (
                  <Text key={`falta-${j}`} color={CINZA}>○ {f}</Text>
                ))}
              </Box>
            )}
          </Box>
        )}
        {progresso}
        {rodape}
      </Box>
    )
  })
}
