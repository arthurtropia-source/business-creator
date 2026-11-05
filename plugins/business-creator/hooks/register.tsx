import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderSurface } from 'claude-code'

import type { Bloco, Campo, Conversa, Festa, Furo, Marcos, Montado, NaFila, Nivel, Opcao, Painel, Passo, Quadro, Resumo, Rodada, Status, Workflow } from '../types'

// Painel da Montagem do Base Camp (v0.9, plugin 0.3.0). Veste a montagem com a marca e tira a
// barreira técnica: mostra a subida, de quem é a vez e o que o sistema já sabe,
// dá os botões de aprovar e corrigir e troca as linhas técnicas do app por
// frases simples. Lê os arquivos da pasta da pessoa; grava só o diário (0.3.0).
// Depois do Base Camp montado, é o painel de trabalho cortado (0.3.0): um cartão Agora só, com o
// workflow da vez e um botão só, Rodar (aprovar e corrigir são respostas no chat); os outros
// workflows, uma linha cada, com o mesmo botão, que abre uma conversa nova; os que não rodaram,
// recolhidos em "A começar"; os passos de cada um, na vertical, num toque; e os marcos das montanhas.
// O diário: uma linha por conversa de trabalho, em frentes/<frente>/diario/AAAA-MM.md, sem modelo.
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
// A última coisa que a montagem fez, com a hora: a pessoa sabe o que acabou de acontecer (0.2.16).
const ultimaAcao = atom({ plugin: 'business-creator', key: 'ultimaAcao' } as const, null)
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
// A fila do painel de trabalho, recolhida até ela clicar (0.2.19).
const filaAberta = atom({ plugin: 'business-creator', key: 'filaAberta' } as const, false)
// Os workflows com os passos abertos na vertical (0.3.0), pelo caminho do cartão.
const passosAbertos = atom({ plugin: 'business-creator', key: 'passosAbertos' } as const, [])
// O marco da subida com a explicação aberta (0.3.2): o "i" da legenda abre num toque.
const marcoAberto = atom({ plugin: 'business-creator', key: 'marcoAberto' } as const, null)
// O pedido do workflow que um botão mandou abrir numa conversa nova: se a conversa nova não abrir, o painel
// copia este pedido para ela colar (0.3.0).
const aAbrir = atom({ plugin: 'business-creator', key: 'aAbrir' } as const, null)
// A conversa de agora, para a linha do diário, e se a gravação falhou (0.3.0).
const conversa = atom({ plugin: 'business-creator', key: 'conversa' } as const, null)
const diarioFalhou = atom({ plugin: 'business-creator', key: 'diarioFalhou' } as const, false)

// A frase fixa da campo-1 quando a conversa nova não abre (0.3.0): o painel a reconhece e copia o pedido.
const NAO_ABRIU = 'Não consegui abrir a conversa nova'

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
  '2': 'Você escolhe o seu primeiro workflow; o sistema roda a primeira vez e combina a próxima.',
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
  // A seção do passo 2: "O primeiro workflow" desde a 0.2.17; "Primeiras tarefas" nas pastas de antes.
  const linhas = (secao(texto, 'O primeiro workflow') || secao(texto, 'Primeiras tarefas')).split('\n').map(l => l.trim())
  // As 3 opções (0.2.17): "- <pedido>: <a primeira entrega>", a recomendada primeiro. Linha sem ": " é o formato
  // antigo: a tarefa inteira vira o pedido, sem entrega. O negrito é tolerado e sai.
  const opcoes: Opcao[] = linhas
    .filter(l => /^- \S/.test(l) && !/^- \**(Feita|Combinado|Escolhido|Rodada|Tempo total|Primeiro workflow)\b/i.test(l))
    .map(l => {
      const limpa = l.slice(2).replace(/\*\*/g, '').trim()
      const corte = limpa.indexOf(': ')
      return corte < 0 ? { pedido: limpa, entrega: '' } : { pedido: limpa.slice(0, corte).trim(), entrega: limpa.slice(corte + 2).trim() }
    })
    .filter(o => o.pedido.length > 0)
    .slice(0, 3)
  // A primeira entrega aconteceu: "Rodada 1:" (0.2.17) ou "Feita:" (formato antigo), em negrito ou não.
  const feita = linhas.some(l => /^(?:- )?\**(?:Rodada\s*\d+|Feita)\b:?\**:?/i.test(l))
  const igual = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()
  // "Escolhido:" (0.2.17): o pedido antes de " · ", casado com as opções sem diferenciar maiúsculas; sem casar, o texto como está.
  const linhaEscolhido = linhas
    .map(l => /^(?:- )?\**Escolhido:?\**:?\s*(.+)/i.exec(l)?.[1]?.trim().replace(/^\*+|\*+$/g, ''))
    .find((x): x is string => Boolean(x)) ?? null
  let escolhido: string | null = null
  if (linhaEscolhido) {
    const inteiro = linhaEscolhido.split(' · ')[0]?.trim() ?? linhaEscolhido
    const curto = inteiro.split(/ em \d|;|\(/)[0]?.trim() ?? inteiro
    escolhido = opcoes.find(o => igual(o.pedido, inteiro))?.pedido ?? opcoes.find(o => igual(o.pedido, curto))?.pedido ?? inteiro
  } else if (feita) {
    // Formato antigo (0.2.16), sem "Escolhido:": a linha "Feita:" começa pelo texto da tarefa; a opção que casa é a escolhida.
    const linhaFeita = linhas
      .map(l => /^(?:- )?\**Feita:?\**:?\s*(.+)/i.exec(l)?.[1]?.toLowerCase() ?? '')
      .find(Boolean) ?? ''
    const chaveFeita = linhaFeita.split(/ · | em \d|;|\(/)[0]?.trim() ?? ''
    escolhido =
      opcoes.find(o => {
        const tarefa = o.pedido.toLowerCase()
        return (chaveFeita.length >= 8 && tarefa.includes(chaveFeita)) || linhaFeita.includes(tarefa.slice(0, 25))
      })?.pedido ?? null
  }
  // Os próximos workflows: as opções não escolhidas, só quando há uma escolhida e mais de uma opção.
  const proximos = escolhido && opcoes.length > 1 ? opcoes.filter(o => o.pedido !== escolhido).map(o => o.pedido) : []
  const combinado =
    linhas
      .map(l => /^(?:- )?\**Combinado:?\**:?\s*(.+)/i.exec(l)?.[1]?.trim().replace(/^\*+|\*+$/g, ''))
      .find((x): x is string => Boolean(x)) ?? null
  // O tempo da montagem (0.2.17): o texto até o primeiro " (" ("27 min"; "374 min pelo relógio").
  const tempoTotal = /\*\*Tempo total:\*\*[ \t]*(.*)/i.exec(texto)?.[1]?.split(' (')[0]?.trim() || null
  const testeOk = /\*\*Quem sou eu:\*\*\s*passou/i.test(texto)
  // O teste que não passou: o roteiro grava "não passou: <o motivo>" (0.2.16); sem o motivo, fica só "não passou".
  const falha = /\*\*Quem sou eu:\*\*\s*n[ãa]o passou:?[ \t]*(.*)/i.exec(texto)
  const testeFalhou = falha ? (falha[1] ?? '').trim() : null
  const separacaoOk = /\*\*Separação entre frentes:\*\*\s*passou/i.test(texto)
  // A etapa 5 grava aqui onde ficou o cartão do primeiro workflow.
  const workflow = /\*\*Primeiro workflow:\*\*\s*`?([^`\n]+?)`?\s*$/m.exec(texto)?.[1]?.trim() || null
  return { nivel, iniciada, concluida, blocos, opcoes, escolhido, proximos, tempoTotal, feita, combinado, testeOk, testeFalhou, separacaoOk, workflow }
}

// O pedido fica em minúsculas no arquivo, como ela vai escrever; no botão e no rótulo, a primeira letra sobe (0.2.17).
function maiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// Um rótulo de botão cabe em 70 caracteres.
function rotuloCurto(texto: string): string {
  return texto.length > 70 ? `${texto.slice(0, 67)}…` : texto
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

// O primeiro nome da pessoa, pela primeira linha do cartão "Quem você é" do resumo (0.2.16): o que vem
// antes da vírgula, sem o "você é a" que a frase pode trazer, só a primeira palavra. Se não parecer um
// nome (minúscula, uma letra), o painel diz "O seu sistema".
function primeiroNome(r: Resumo | null): string | null {
  const linha = r?.cartoes.find(c => /quem voc[êe] [ée]/i.test(c.titulo))?.linhas[0]?.texto ?? ''
  const antes = linha.split(/[,;:·(]/)[0] ?? ''
  const nome = antes.replace(/^(voc[êe] [ée]|eu sou|sou)\s+(a|o)?\s*/i, '').trim().split(/\s+/)[0] ?? ''
  return /^[A-ZÀ-Ý][A-Za-zÀ-ÿ'-]+$/.test(nome) ? nome : null
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

type Cartao = Pick<
  Painel,
  'processo' | 'antes' | 'workflowNome' | 'pedido' | 'combinadoCartao' | 'estado' | 'estadoTexto' | 'passos' | 'passosSistema' | 'rodadas'
>

// As células de uma linha de tabela em markdown, sem as bordas.
function celulas(linha: string): string[] {
  const partes = linha.trim().split('|').map(c => c.trim())
  partes.shift()
  if (partes.length > 0 && partes[partes.length - 1] === '') partes.pop()
  return partes
}

// O que o painel de trabalho lê a mais de cada cartão (0.2.19).
type Detalhe = Cartao & {
  frente: string | null
  quadros: Quadro[]
  lista: Passo[]
  furos: Furo[]
  skill: boolean
  sozinho: boolean
  proximos: NaFila[]
}

// O cartão do workflow (0.2.17): o nome, o pedido, o combinado, o estado, os passos e as rodadas, além do
// "o quê" e do "antes" de sempre. Toda linha tolera o "- " no começo e o negrito; o que o modelo deixa
// entre <> (instrução ainda não preenchida) conta como vazio.
function lerProcesso(texto: string): Cartao {
  const { processo, antes, workflowNome, pedido, combinadoCartao, estado, estadoTexto, passos, passosSistema, rodadas } = lerCartao(texto)
  return { processo, antes, workflowNome, pedido, combinadoCartao, estado, estadoTexto, passos, passosSistema, rodadas }
}

function lerCartao(texto: string): Detalhe {
  const linha = (rotulo: string): string | null => {
    const m = new RegExp(`^(?:- )?\\**${rotulo}(?::\\**|\\**:)[ \\t]*(.+)$`, 'm').exec(texto)
    const t = m?.[1]?.replace(/\*\*/g, '').trim() ?? ''
    return t && !t.startsWith('<') ? t : null
  }
  const processo = linha('O quê')
  const h1 = /^#\s*Workflow:\s*(.+)$/m.exec(texto)?.[1]?.replace(/\*\*/g, '').trim() ?? ''
  const workflowNome = h1 && !h1.startsWith('<') ? h1 : null
  // O pedido: a linha "Pedido", sem aspas. Cartão de antes da 0.2.17: o primeiro negrito depois de "escrev" na linha
  // "Começa quando" ("abro esta pasta e escrevo **fechar o dia**").
  const comeca = texto.split('\n').find(l => /^(?:- )?\**Começa quando/i.test(l.trim())) ?? ''
  const pedidoAntigo = /escrev\w*\s+\*\*([^*]+)\*\*/i.exec(comeca)?.[1]?.trim() || null
  const pedido = linha('Pedido')?.replace(/^["“”'`]+|["“”'`]+$/g, '').trim() || pedidoAntigo
  const combinadoCartao = linha('Combinado')
  const estadoTexto = linha('Estado')
  const estado: Painel['estado'] = !estadoTexto
    ? 'incompleto'
    : /^completo/i.test(estadoTexto)
      ? 'completo'
      : /em andamento/i.test(estadoTexto)
        ? 'em andamento'
        : 'incompleto'
  // A tabela "Os passos": as linhas com número. Desde a 0.2.19 o painel conta pela Situação, o que de fato
  // aconteceu ("o sistema fez"; "o sistema faz" nos cartões de antes), não pela coluna Quem faz.
  const quadros: Quadro[] = []
  const lista: Passo[] = []
  const furos: Furo[] = []
  let skill = false
  for (const l of secao(texto, 'Os passos').split('\n')) {
    if (!/^\|\s*\d+\s*\|/.test(l.trim())) continue
    const [, passo = '', , comQue = '', situacao = ''] = celulas(l)
    if (passo.startsWith('<')) continue
    if (/skill|\.claude\/skills\//i.test(comQue)) skill = true
    if (/^o sistema f(ez|az)\b/i.test(situacao)) {
      quadros.push('sistema')
      lista.push({ nome: passo, quadro: 'sistema', motivo: '' })
    } else if (/^ainda n[ãa]o d[áa]/i.test(situacao)) {
      quadros.push('nao')
      const corte = situacao.indexOf(':')
      const motivo = corte < 0 ? '' : situacao.slice(corte + 1).trim()
      furos.push({ passo, motivo })
      lista.push({ nome: passo, quadro: 'nao', motivo })
    } else {
      quadros.push('ela')
      lista.push({ nome: passo, quadro: 'ela', motivo: '' })
    }
  }
  const passos = quadros.length
  const passosSistema = quadros.filter(q => q === 'sistema').length
  // A tabela "Os próximos": o nome (coluna Workflow) e o pedido, sem as linhas de modelo.
  const proximos: NaFila[] = []
  for (const l of secao(texto, 'Os próximos').split('\n')) {
    const t = l.trim()
    if (!t.startsWith('|') || /^\|\s*:?-+/.test(t)) continue
    const [nome = '', pedidoDaFila = ''] = celulas(t).map(c => c.replace(/\*\*/g, '').trim())
    if (!nome || nome.startsWith('<') || /^workflow$/i.test(nome)) continue
    proximos.push({ nome, pedido: pedidoDaFila && !pedidoDaFila.startsWith('<') ? pedidoDaFila.replace(/^["“”'`]+|["“”'`]+$/g, '') : null })
  }
  // A tabela "As rodadas": uma linha por rodada, fora o cabeçalho, o separador e as linhas de modelo.
  const rodadas: Rodada[] = []
  let cabecalhoLido = false
  for (const l of secao(texto, 'As rodadas').split('\n')) {
    const t = l.trim()
    if (!t.startsWith('|')) continue
    if (/^\|\s*:?-+/.test(t)) continue
    if (!cabecalhoLido) {
      cabecalhoLido = true
      continue
    }
    const [data = '', tempo = '', pedidosTexto = '', aprovadaTexto = '', obs = ''] = celulas(t)
    if (data.startsWith('<') || /^data$/i.test(data) || (!data && !tempo && !pedidosTexto && !aprovadaTexto && !obs)) continue
    const numero = /\d+/.exec(pedidosTexto)?.[0]
    rodadas.push({
      data,
      tempo,
      pedidos: numero ? Number(numero) : null,
      aprovada: /^sim/i.test(aprovadaTexto) ? 'sim' : /^n[ãa]o/i.test(aprovadaTexto) ? 'nao' : 'pendente',
      obs,
    })
  }
  const linhas = texto.split('\n')
  const cabecalho = linhas.findIndex(l => /Quanto tempo leva hoje/i.test(l))
  const dado = cabecalho >= 0 ? linhas[cabecalho + 2] : undefined
  const antes = dado ? (dado.split('|')[1]?.trim() ?? null) : null
  // O tempo entra no meio da frase ("Hoje leva: umas 2 horas"): sem a maiúscula da tabela.
  const meio = antes && /^[A-ZÀ-Ú][a-zà-ú]/.test(antes) ? antes.charAt(0).toLowerCase() + antes.slice(1) : antes
  return {
    processo,
    // "não medido" e "a medir" (0.3.2: o antes não se pergunta mais) não são tempo: ficam de fora da frase.
    antes: meio && !meio.startsWith('<') && !/^(não medido|a medir)/i.test(meio) ? meio : null,
    workflowNome,
    pedido,
    combinadoCartao,
    estado,
    estadoTexto,
    passos,
    passosSistema,
    rodadas,
    frente: linha('Frente'),
    quadros,
    lista,
    furos,
    skill,
    sozinho: /^sim\b/i.test(linha('Chega sozinho') ?? ''),
    proximos,
  }
}

// O dia de uma rodada, para saber qual workflow rodou por último: a data da coluna e, se houver, a hora
// ("começou às 19:19"). Sem data, 0.
function quandoRodou(r: Rodada | undefined): number {
  if (!r) return 0
  const d = /(\d{2})\/(\d{2})\/(\d{4})/.exec(r.data)
  if (!d) return 0
  const h = /(\d{1,2}):(\d{2})/.exec(r.data.replace(/\d{2}\/\d{2}\/\d{4}/, '')) ?? /às\s*(\d{1,2}):(\d{2})/.exec(r.tempo)
  return new Date(Number(d[3]), Number(d[2]) - 1, Number(d[1]), Number(h?.[1] ?? 0), Number(h?.[2] ?? 0)).getTime()
}

// A última rodada espera a aprovação dela (a conferir, ou ainda em andamento).
function aConferir(w: Workflow): boolean {
  return w.rodadas[w.rodadas.length - 1]?.aprovada === 'pendente'
}

const mesmo = (a: string | null | undefined, b: string | null | undefined) =>
  Boolean(a && b && a.trim().toLowerCase() === b.trim().toLowerCase())

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

// A trilha conta a base (a pasta aberta e o kit no lugar) como o primeiro ponto, já feito (0.2.16):
// ninguém começa do zero. Os passos vêm depois dela.
function progresso(p: Painel): number {
  if (p.concluida) return 1
  const pontos = marcas(p.blocos.length + 1)
  if (!p.iniciada) return pontos[0] ?? 0
  const i = p.blocos.findIndex(b => b.status === 'em andamento' || b.status === 'pendente')
  return pontos[Math.max(0, i) + 1] ?? 0
}

// O Campo 1 da primeira montanha está feito quando algum workflow está completo (0.2.19: com vários abertos,
// o primeiro que fechar, não só o da linha Primeiro workflow).
function campo1Feito(p: Painel): boolean {
  return p.estado === 'completo' || p.workflows.some(w => w.estado === 'completo')
}

function quadrado(x: number, y: number, lado: number, extra: string): string {
  return `<rect x="${(x - lado / 2).toFixed(1)}" y="${(y - lado / 2).toFixed(1)}" width="${lado}" height="${lado}" ${extra}/>`
}

function trilhaSvg(p: Painel, f: Festa | null): string {
  const prog = progresso(p)
  // O ponto 0 é a base; o passo i da tabela é o ponto i + 1.
  const atual = p.concluida ? -1 : Math.max(0, p.blocos.findIndex(b => b.status === 'em andamento' || b.status === 'pendente')) + 1
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
  CAMPOS_NA_ROTA.forEach((t, i) => {
    const [x, y] = naRota(t)
    if (i === 0 && p.concluida) {
      // Depois do Base Camp, o Campo 1 é o ponto atual (0.2.17): contorno enquanto o workflow não está
      // completo, com o anel (que pulsa na festa); cheio em tinta quando está.
      if (campo1Feito(p)) {
        s += quadrado(x, y, 8, `fill="${TINTA}"`)
      } else {
        s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="none" stroke="${TINTA}" stroke-width="1.4" opacity=".25"${f ? ' class="pulso"' : ''}/>`
        s += quadrado(x, y, 8, `fill="${PAPEL}" stroke="${TINTA}" stroke-width="2.2"`)
      }
      return
    }
    s += quadrado(x, y, 6, `fill="${PAPEL}" stroke="${TINTA}" stroke-width="1.6"`)
  })
  s += quadrado(288, 34, 12, `fill="${SINAL}"${f && p.concluida ? ' class="cume"' : ''}`)
  s += `<path d="${caminho}" fill="none" stroke="${TINTA}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="1.5 6" stroke-linecap="round"/>`
  if (prog > 0) {
    const fim = (100 - prog * 100).toFixed(1)
    s += `<path d="${caminho}" pathLength="100" fill="none" stroke="${TINTA}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="100" stroke-dashoffset="${fim}"${f ? ' class="anda"' : ''}/>`
  }
  marcas(p.blocos.length + 1).forEach((t, i) => {
    const [x, y] = ponto(t)
    const b = i === 0 ? undefined : p.blocos[i - 1]
    const feito = i === 0 || p.concluida || (b !== undefined && (b.status === 'aprovado' || b.status === 'pulado'))
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

// A linha das rodadas do cartão Agora, depois do Base Camp (0.2.17): o que o workflow já rodou.
function linhaDasRodadas(p: { rodadas: Rodada[]; pedido: string | null }): string {
  const n = p.rodadas.length
  const ultima = p.rodadas[n - 1]
  if (!ultima) {
    return `Ainda não rodou. Quando chegar a hora, clique no botão ou escreva ${p.pedido ?? 'o pedido do seu guia de bolso'}.`
  }
  if (/^em andamento/i.test(ultima.tempo)) {
    const desde = ultima.tempo.replace(/^em andamento:?\s*/i, '').trim()
    return `Rodada ${n} em andamento${desde ? ` (${desde})` : ''}.`
  }
  const entrega = ultima.aprovada === 'sim' ? 'entrega aprovada' : ultima.aprovada === 'nao' ? 'entrega não aprovada' : 'entrega a conferir'
  const pedidos = ultima.pedidos === null ? '' : `${ultima.pedidos} pedido${ultima.pedidos === 1 ? '' : 's'} até a entrega, `
  return `Rodou ${n} vez${n === 1 ? '' : 'es'}. A última em ${ultima.data}: ${pedidos}${entrega}.`
}

// A data do "completo, em <data>" do Estado; sem ela, o texto cru.
function desdeQuando(estadoTexto: string | null): string {
  const t = (estadoTexto ?? '').trim().replace(/\.$/, '')
  return /^completo,?\s*em\s+(.+)$/i.exec(t)?.[1]?.trim() ?? t
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

async function listar($: EngineInterface, caminho: string): Promise<{ name: string; kind: string; mtimeMs: number }[]> {
  try {
    return (await existe($, caminho)) ? await $.fs.list(caminho) : []
  } catch {
    return []
  }
}

// Os cartões de workflow da pasta (0.2.19): frentes/*/workflows/*.md e, no leve, workflows/*.md. O cartão que o
// base-camp.md aponta (ou o primeiro-processo.md de antes da 0.2.1) entra sempre, mesmo fora dessas pastas.
async function lerWorkflows($: EngineInterface, dir: string, base: string): Promise<{ workflows: Workflow[]; proximos: NaFila[] }> {
  const achados: { rel: string; mtime: number }[] = []
  const cartoesEm = async (pastaRel: string) => {
    for (const f of await listar($, `${dir}/${pastaRel}`)) {
      if (f.kind === 'file' && f.name.endsWith('.md') && !/^(readme|_)/i.test(f.name)) achados.push({ rel: `${pastaRel}/${f.name}`, mtime: f.mtimeMs })
    }
  }
  for (const frente of await listar($, `${dir}/frentes`)) {
    if (frente.kind === 'dir') await cartoesEm(`frentes/${frente.name}/workflows`)
  }
  await cartoesEm('workflows')
  if (!achados.some(a => a.rel === base) && (await existe($, `${dir}/${base}`))) achados.unshift({ rel: base, mtime: 0 })
  const workflows: Workflow[] = []
  const proximos: NaFila[] = []
  for (const { rel, mtime } of achados) {
    const c = lerCartao(await lerTexto($, `${dir}/${rel}`))
    const pastaDaFrente = /^frentes\/([^/]+)\//.exec(rel)?.[1] ?? null
    const arquivo = rel.split('/').pop()?.replace(/\.md$/, '').replace(/-/g, ' ') ?? rel
    workflows.push({
      arquivo: rel,
      frente: c.frente ?? pastaDaFrente,
      nome: c.workflowNome ?? (c.pedido ? maiuscula(c.pedido) : maiuscula(arquivo)),
      pedido: c.pedido,
      processo: c.processo,
      combinado: c.combinadoCartao,
      estado: c.estado,
      estadoTexto: c.estadoTexto,
      quadros: c.quadros,
      lista: c.lista,
      passos: c.passos,
      passosSistema: c.passosSistema,
      furos: c.furos,
      antes: c.antes,
      ilegivel: !c.workflowNome && !c.pedido && c.passos === 0,
      skill: c.skill,
      sozinho: c.sozinho,
      rodadas: c.rodadas,
      quando: quandoRodou(c.rodadas[c.rodadas.length - 1]),
      mtime,
    })
    proximos.push(...c.proximos.map(p => ({ ...p, frente: c.frente ?? pastaDaFrente })))
  }
  return { workflows, proximos }
}

// O workflow da vez (0.2.19): o que tem a última rodada a conferir; senão, o último que rodou; senão, o
// primeiro workflow. Só cartões com a linha Pedido (os outros aparecem com o aviso).
function escolherDaVez(workflows: Workflow[], base: string): Workflow | null {
  const recente = (a: Workflow, b: Workflow) => b.quando - a.quando || b.mtime - a.mtime
  const validos = workflows.filter(w => w.pedido)
  return (
    [...validos].filter(aConferir).sort(recente)[0] ??
    [...validos].filter(w => w.rodadas.length > 0).sort(recente)[0] ??
    workflows.find(w => w.arquivo === base) ??
    validos[0] ??
    null
  )
}

// A fila: as linhas "Os próximos" de todos os cartões e as opções não escolhidas no passo 2, sem repetir e
// sem as que já têm cartão.
function montarFila(candidatos: NaFila[], workflows: Workflow[]): NaFila[] {
  const fila: NaFila[] = []
  for (const c of candidatos) {
    const temCartao = workflows.some(w => mesmo(w.nome, c.nome) || mesmo(w.pedido, c.nome) || mesmo(w.pedido, c.pedido))
    const repetido = fila.some(f => mesmo(f.nome, c.nome) || mesmo(f.pedido, c.nome) || mesmo(f.nome, c.pedido) || mesmo(f.pedido, c.pedido))
    if (!temCartao && !repetido) fila.push(c)
  }
  return fila
}

// ------------------------------------------------------------ os marcos das montanhas (0.3.0)

// A data do "completo, em <data>" do cartão, para saber qual completou primeiro; sem data, o fim da fila.
function dataDoCompleto(w: Workflow): { ms: number; texto: string | null } {
  const d = /(\d{2})\/(\d{2})\/(\d{4})/.exec(w.estadoTexto ?? '')
  if (!d) return { ms: Number.MAX_SAFE_INTEGER, texto: null }
  return { ms: new Date(Number(d[3]), Number(d[2]) - 1, Number(d[1])).getTime(), texto: d[0] }
}

const frenteDe = (w: { frente?: string | null }) => (w.frente ?? '').trim().toLowerCase()

// Mera: o primeiro cartão completo. Island: todos os workflows da frente da Mera completos, no mínimo 2, contando os
// que ainda estão em "Os próximos" dos cartões dela. Lobuche East: um cartão completo noutra frente.
function calcularMarcos(workflows: Workflow[], fila: NaFila[]): Marcos {
  const completos = workflows
    .filter(w => w.estado === 'completo')
    .map(w => ({ w, ...dataDoCompleto(w) }))
    .sort((a, b) => a.ms - b.ms)
  const primeiro = completos[0]
  const vazio = { fechado: false, workflow: null, data: null }
  if (!primeiro) return { mera: vazio, island: { ...vazio, feitos: 0, total: 0 }, lobuche: vazio }
  const frente = frenteDe(primeiro.w)
  const daFrente = workflows.filter(w => frenteDe(w) === frente)
  const feitos = daFrente.filter(w => w.estado === 'completo').length
  const total = daFrente.length + fila.filter(f => f.frente !== undefined && f.frente !== null && frenteDe(f) === frente).length
  const ultimoDaFrente = completos.filter(c => frenteDe(c.w) === frente).at(-1)
  const outra = completos.find(c => frenteDe(c.w) !== frente)
  return {
    mera: { fechado: true, workflow: primeiro.w.nome, data: primeiro.texto },
    island: {
      fechado: total >= 2 && feitos === total,
      workflow: ultimoDaFrente?.w.nome ?? null,
      data: ultimoDaFrente?.texto ?? null,
      feitos,
      total,
    },
    lobuche: outra ? { fechado: true, workflow: outra.w.nome, data: outra.texto } : vazio,
  }
}

function linhaDosMarcos(m: Marcos): string {
  const island = m.island.fechado ? 'Island ✓' : m.mera.fechado ? `Island: ${m.island.feitos} de ${m.island.total} completos` : 'Island ○'
  return [`Mera ${m.mera.fechado ? '✓' : '○'}`, island, `Lobuche East ${m.lobuche.fechado ? '✓' : '○'}`].join(' · ')
}

// A subida desenhada (0.3.2, pedido do Arthur na rodada (a) de 05/11): o Base Camp no início, as três montanhas com
// o nome, o Everest esmaecido no fim, o caminho feito em tinta até a bola laranja e, acima dela, um boneco caminhando
// com "você está aqui". Toma o lugar da linha dos marcos; o traço anda só quando um marco fecha (a festa).
const SUBIDA = [[14, 104], [70, 66], [110, 86], [150, 52], [188, 72], [225, 40], [290, 22]] as const

function ondeEsta(m: Marcos): { ponto: [number, number]; ate: number } {
  // "ate" é quantos vértices da SUBIDA ficam antes do ponto, no caminho feito.
  const entre = (a: readonly number[], b: readonly number[], t: number): [number, number] => [
    (a[0] ?? 0) + ((b[0] ?? 0) - (a[0] ?? 0)) * t,
    (a[1] ?? 0) + ((b[1] ?? 0) - (a[1] ?? 0)) * t,
  ]
  if (!m.mera.fechado) return { ponto: entre(SUBIDA[0], SUBIDA[1], 0.55), ate: 1 }
  if (!m.island.fechado && !m.lobuche.fechado) return { ponto: entre(SUBIDA[2], SUBIDA[3], 0.55), ate: 3 }
  if (!m.lobuche.fechado || !m.island.fechado) return { ponto: entre(SUBIDA[4], SUBIDA[5], 0.55), ate: 5 }
  return { ponto: [SUBIDA[5][0], SUBIDA[5][1]], ate: 6 }
}

function subidaSvg(m: Marcos, anima: boolean): string {
  const { ponto, ate } = ondeEsta(m)
  const [ax, ay] = ponto
  const pts = (n: number) => SUBIDA.slice(0, n).map(p => p.join(' ')).join(' L')
  const feito = `M${pts(ate)} L${ax.toFixed(1)} ${ay.toFixed(1)}`
  const tudo = `M${pts(SUBIDA.length)}`
  const monte = (x: number, y: number, meia: number, extra: string) =>
    `<polygon points="${x - meia},104 ${x},${y} ${x + meia},104" ${extra}/>`
  const marcoFeito = [m.mera.fechado, m.island.fechado, m.lobuche.fechado]
  const picos: [number, number, string][] = [
    [70, 66, 'Mera'],
    [150, 52, 'Island'],
    [225, 40, 'Lobuche East'],
  ]
  // O topo do desenho sobe quando o "você está aqui" passaria da borda (perto do cume da Lobuche East).
  const topo = Math.min(14, Math.floor(ay - 48))
  const alto = 120 - topo
  let s =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${topo} 320 ${alto}" width="300" height="${Math.round((alto * 300) / 320)}">` +
    `<style>@media (prefers-reduced-motion: no-preference){.anda{animation:anda 1.6s ease-out both}}` +
    `@keyframes anda{from{stroke-dashoffset:100}}text{font-family:Inter,-apple-system,sans-serif}</style>` +
    `<rect x="0" y="${topo}" width="320" height="${alto}" fill="${PAPEL}"/>`
  s += monte(290, 22, 40, `fill="${TRACO}" fill-opacity=".35"`)
  picos.forEach(([x, y], i) => {
    s += monte(x, y, 52 + i * 3, `fill="#FFFFFF" stroke="${TRACO}" stroke-width="1.2"`)
  })
  s += `<path d="${tudo}" fill="none" stroke="${TRACO}" stroke-width="1.8" stroke-dasharray="4 4"/>`
  s += `<path d="${feito}" pathLength="100" stroke-dasharray="100" fill="none" stroke="${TINTA}" stroke-width="2.6" stroke-linecap="round"${anima ? ' class="anda"' : ''}/>`
  s += `<rect x="9" y="99" width="10" height="10" fill="${TINTA}"/>`
  picos.forEach(([x, y, nome], i) => {
    s += marcoFeito[i]
      ? `<circle cx="${x}" cy="${y}" r="4" fill="${TINTA}"/>`
      : `<circle cx="${x}" cy="${y}" r="3.5" fill="#FFFFFF" stroke="${TRACO}" stroke-width="1.4"/>`
    s += `<text x="${x}" y="100" text-anchor="middle" font-size="9" fill="${CINZA}">${nome}</text>`
  })
  s += `<text x="290" y="100" text-anchor="middle" font-size="9" fill="${CINZA}" fill-opacity=".7">Everest</text>`
  // A bola laranja, o boneco caminhando acima dela e o "você está aqui" acima do boneco: fora das montanhas.
  const x = ax.toFixed(1)
  s += `<circle cx="${x}" cy="${ay.toFixed(1)}" r="5" fill="${SINAL}"/>`
  // O montanhista em silhueta (mochila e bastão), com os pés logo acima da bola.
  s +=
    `<g transform="translate(${(ax - 9.5).toFixed(1)} ${(ay - 32).toFixed(1)}) scale(.95)" fill="${ROCHA}" stroke="${ROCHA}" stroke-linecap="round" stroke-linejoin="round">` +
    `<circle cx="10" cy="3.4" r="3.1" stroke="none"/><rect x="3.6" y="7.6" width="5.4" height="8.4" rx="1.8" stroke="none" opacity=".75"/>` +
    `<path d="M8.2 7.4 L12.6 7.6 L12 16.4 L8.4 16.4 Z" stroke-width="1"/><path d="M12.2 9 L15.6 12.6" fill="none" stroke-width="2"/>` +
    `<path d="M16.6 6 L17.6 27.5" fill="none" stroke-width="1.3"/><path d="M9.4 16 L7.4 21.6 L5.2 27.4" fill="none" stroke-width="2.4"/>` +
    `<path d="M11.4 16 L13.2 21.4 L15 27.4" fill="none" stroke-width="2.4"/></g>`
  s += `<text x="${x}" y="${(ay - 37).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="600" fill="${ROCHA}">você está aqui</text>`
  s += `<text x="4" y="117" font-size="9" fill="${CINZA}">início</text><text x="290" y="117" text-anchor="middle" font-size="9" fill="${CINZA}">fim</text>`
  return s + '</svg>'
}

// A legenda de cada marco: o resultado antes do nome da montanha (o nome sozinho não diz nada a quem usa).
const MARCOS_LEGENDA: { chave: 'mera' | 'island' | 'lobuche'; nome: string; resultado: string; explica: string }[] = [
  { chave: 'mera', nome: 'Mera', resultado: 'o 1º workflow completo', explica: 'Mera: o primeiro workflow que sai pronto com um pedido só seu, aprovado.' },
  { chave: 'island', nome: 'Island', resultado: 'a frente inteira', explica: 'Island: todos os workflows da frente da Mera completos, no mínimo 2.' },
  { chave: 'lobuche', nome: 'Lobuche East', resultado: 'a 2ª frente', explica: 'Lobuche East: um workflow completo numa segunda frente.' },
]

// O fecho de um marco, só com fatos (sem confete): o workflow, desde quando, e o antes e a última vez, se houver.
function fechoDoMarco(nome: string, w: Workflow | undefined, data: string | null): string {
  const base = `${nome}: ${w?.nome ?? 'o workflow'} sai pronto com um pedido seu${data ? `, desde ${data}` : ''}.`
  const ultima = w?.rodadas.at(-1)?.tempo
  return w?.antes && ultima ? `${base} Antes, ${w.antes}; na última vez, ${ultima}.` : base
}

// ------------------------------------------------------------ o diário (0.3.0)

// Os arquivos que são do sistema, não do trabalho dela: não marcam a frente nem entram em "leu" e "gravou".
function doSistema(rel: string): boolean {
  return (
    /^(contexto|montagem|diario|\.claude)\//.test(rel) ||
    /^frentes\/[^/]+\/(diario\/|AGENTS\.md$|CLAUDE\.md$)/.test(rel) ||
    ['AGENTS.md', 'CLAUDE.md', 'base-camp.md', 'memoria.md', 'como-usar.md', 'resumo-para-o-arthur.md', 'primeiro-processo.md'].includes(rel)
  )
}

// O pedido entra cortado em 100 caracteres, numa linha só, e sem números longos (5 dígitos ou mais viram #).
function pedidoDoDiario(texto: string): string {
  const limpo = texto.replace(/\s+/g, ' ').replace(/"/g, "'").replace(/\d{5,}/g, '#').trim()
  return limpo.length > 100 ? `${limpo.slice(0, 99).trimEnd()}…` : limpo
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const dois = (n: number) => String(n).padStart(2, '0')

function linhaDoDiario(c: Conversa, agora: number): string {
  const d = new Date(c.inicio)
  const minutos = Math.max(1, Math.round((agora - c.inicio) / 60000))
  const doSistemaMin = Math.round(c.sistemaMs / 60000)
  const lista = (rotulo: string, itens: string[]) => (itens.length > 0 ? `${rotulo}: ${itens.slice(0, 6).join(', ')}` : null)
  return [
    `- ${dois(d.getDate())}/${dois(d.getMonth() + 1)} ${dois(d.getHours())}:${dois(d.getMinutes())}`,
    `${minutos} min (o sistema: ${doSistemaMin})`,
    `${c.pedidos} pedido${c.pedidos === 1 ? '' : 's'}`,
    `"${c.pedido}"`,
    `workflow: ${c.workflow ?? 'nenhum'}`,
    lista('gravou', c.gravou),
    lista('leu', c.leu),
    lista('rodou', c.rodou),
    c.gravou.length + c.leu.length + c.rodou.length === 0 ? 'consulta' : null,
    c.passos.length > 0 ? `passos: ${c.passos.slice(0, 8).join(' › ')}` : null,
    c.id,
  ]
    .filter(Boolean)
    .join(' · ')
}

// Reescreve a linha da conversa (pelo código no fim) ou acrescenta; o arquivo nasce com o cabeçalho.
async function gravarDiario($: EngineInterface) {
  const c = await read($, conversa)
  if (!c || c.deSistema || !c.pedido) return
  const dir = await read($, pasta)
  const agora = await agoraMs($)
  const d = new Date(c.inicio)
  const rel = `${c.frente ? `frentes/${c.frente}/` : ''}diario/${d.getFullYear()}-${dois(d.getMonth() + 1)}.md`
  const linha = linhaDoDiario(c, agora)
  try {
    const atual = await lerTexto($, `${dir}/${rel}`)
    const cabecalho =
      `# Diário: ${c.frente ?? 'geral'} · ${MESES[d.getMonth()]} de ${d.getFullYear()}\n` +
      '> Anotado pelo sistema a cada conversa. Só o que ajuda a achar o que se repete. Pode apagar quando quiser.\n\n'
    const linhas = atual ? atual.split('\n') : []
    const i = linhas.findIndex(l => l.endsWith(` · ${c.id}`))
    if (i >= 0) linhas[i] = linha
    else {
      while (linhas.length > 0 && linhas[linhas.length - 1] === '') linhas.pop()
      linhas.push(linha)
    }
    await $.fs.write(`${dir}/${rel}`, `${atual ? '' : cabecalho}${linhas.join('\n')}\n`)
    await update($, diarioFalhou, () => false)
  } catch {
    await update($, diarioFalhou, () => true)
  }
}

// O que a conversa fez, a cada ferramenta: os arquivos dela (só o nome), a rotina, a frase e o cartão que rodou.
function anotar(c: Conversa, tool: string, entrada: Record<string, unknown>, dir: string, f: Frase | null): Conversa {
  const novo = { ...c, gravou: [...c.gravou], leu: [...c.leu], rodou: [...c.rodou], passos: [...c.passos] }
  if (tool === 'Skill' && typeof entrada.skill === 'string' && /(^|:)(montagem-do-base-camp|atualizar-a-pasta)$/.test(entrada.skill)) {
    novo.deSistema = true
  }
  const cmd = typeof entrada.command === 'string' ? entrada.command : ''
  const rotina = /rotinas[\\/]([^\s"'\\/]+)/.exec(cmd)?.[1]
  if ((tool === 'Bash' || tool === 'PowerShell') && rotina && !novo.rodou.includes(rotina)) novo.rodou.push(rotina)
  const caminho = typeof entrada.file_path === 'string' ? entrada.file_path : null
  const rel = caminho ? relativo(dir, caminho.replace(/\\/g, '/')) : null
  if (rel) {
    const cartao = /^(?:frentes\/[^/]+\/)?workflows\/([^/]+)\.md$/.exec(rel)
    if (cartao?.[1]) novo.workflow = cartao[1].replace(/-/g, ' ')
    const frente = /^frentes\/([^/]+)\//.exec(rel)?.[1]
    if (frente && !doSistema(rel) && !novo.frente) novo.frente = frente
    if (!doSistema(rel) && !cartao) {
      const nome = rel.split('/').pop() ?? rel
      const alvo = tool === 'Read' ? novo.leu : tool === 'Write' || tool === 'Edit' || tool === 'MultiEdit' ? novo.gravou : null
      if (alvo && !alvo.includes(nome)) alvo.push(nome)
    }
  }
  const doTrabalho = !rel || !doSistema(rel)
  if (f && doTrabalho && !/^(Marquei a hora|Conferi onde paramos|Procurei nos seus arquivos)/.test(f.feito) && novo.passos.at(-1) !== f.feito) {
    novo.passos.push(f.feito.replace(/(?:[A-Za-z]:)?(?:[^\s/\\]+[/\\])+([^\s/\\]+)/g, '$1'))
  }
  return novo
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
    const ok = (x: boolean): Campo['estado'] => (x ? 'ok' : 'falta')
    // O teste "quem sou eu": passou, falta, ou não passou com o motivo (0.2.16).
    const teste = (codigo: string): Campo =>
      base.testeFalhou !== null
        ? { codigo, rotulo: 'O teste: quem sou eu', estado: 'falhou', motivo: base.testeFalhou }
        : { codigo, rotulo: 'O teste: quem sou eu', estado: ok(base.testeOk) }
    if (curto && atual?.codigo === '1' && !base.concluida) {
      // O retrato (0.2.12): o painel mostra o que já foi montado e o teste.
      campos = [
        ...montado.map(m => ({ codigo: `1.${m.rotulo}`, rotulo: m.rotulo, estado: ok(m.ok) })),
        { codigo: '1.computador', rotulo: 'O seu computador, conferido', estado: ok(await existe($, `${dir}/contexto/computador.md`)) },
        teste('1.teste'),
      ]
    } else if (curto && atual?.codigo === '2' && !base.concluida) {
      // O primeiro workflow (0.2.17): a escolha dela, a primeira rodada entregue e o combinado.
      campos = [
        base.escolhido
          ? { codigo: '2.escolha', rotulo: `O seu primeiro workflow: ${maiuscula(base.escolhido)}`, estado: 'ok' }
          : { codigo: '2.escolha', rotulo: 'O seu primeiro workflow, escolhido', estado: 'falta' },
        { codigo: '2.rodada', rotulo: 'A primeira rodada entregue', estado: ok(base.feita) },
        { codigo: '2.combinado', rotulo: 'O combinado', estado: ok(Boolean(base.combinado)) },
      ]
    } else if (atual && atual.codigo === ultima && !base.concluida) {
      // A última etapa não pergunta: entrega. O painel mostra o que falta entregar.
      const e = atual.codigo
      campos = [
        { codigo: `${e}.1`, rotulo: 'As regras da casa', estado: ok(await existe($, `${dir}/memoria.md`)) },
        { codigo: `${e}.2`, rotulo: 'O arquivo principal', estado: ok(principal) },
        teste(`${e}.3`),
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
    // O painel de trabalho só existe depois do Base Camp montado: antes, nada de listar a pasta.
    const relDoCartao = base.workflow ?? 'primeiro-processo.md'
    const trabalho = base.concluida ? await lerWorkflows($, dir, relDoCartao) : { workflows: [], proximos: [] }
    const daVez = escolherDaVez(trabalho.workflows, relDoCartao)
    const fila = montarFila([...trabalho.proximos, ...base.proximos.map(p => ({ nome: p, pedido: p }))], trabalho.workflows)
    novo = {
      ...base,
      ...proc,
      workflows: trabalho.workflows,
      daVez: daVez?.arquivo ?? null,
      fila,
      campos,
      montado,
      resumo: sabido,
      nome: primeiroNome(sabido),
    }
  }
  const anterior = await read($, painel)
  if (JSON.stringify(anterior) === JSON.stringify(novo)) return novo
  await update($, painel, () => novo)
  if (anterior && novo) await celebrar($, anterior, novo)
  return novo
}

async function celebrar($: EngineInterface, antes: Painel, depois: Painel) {
  let texto: string | null = null
  if (antes.concluida && depois.concluida) {
    // Depois do Base Camp, o que se celebra é um marco que fechou (0.3.0), com fatos.
    const m0 = calcularMarcos(antes.workflows, antes.fila)
    const m1 = calcularMarcos(depois.workflows, depois.fila)
    const achar = (nome: string | null) => depois.workflows.find(w => w.nome === nome)
    if (!m0.lobuche.fechado && m1.lobuche.fechado) texto = fechoDoMarco('Lobuche East', achar(m1.lobuche.workflow), m1.lobuche.data)
    else if (!m0.island.fechado && m1.island.fechado) texto = fechoDoMarco('Island', achar(m1.island.workflow), m1.island.data)
    else if (!m0.mera.fechado && m1.mera.fechado) texto = fechoDoMarco('Mera', achar(m1.mera.workflow), m1.mera.data)
    if (!texto) return
    $.ui.toast(texto, { timeoutMs: 9000 })
    await update($, festa, () => ({ texto, anterior: progresso(antes) }))
    $.clock.after(9000, () => void update($, festa, () => null))
    return
  }
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

// A hora pelo relógio do app (nos testes, um relógio que o teste move); se ele não responder, a do sistema.
async function agoraMs($: EngineInterface): Promise<number> {
  try {
    const t = await $.clock.now()
    return typeof t === 'number' && Number.isFinite(t) && t > 0 ? t : Date.now()
  } catch {
    return Date.now()
  }
}

function horaLocal(ms: number): string {
  const d = new Date(ms)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// Parada há 4 minutos esperando a resposta dela: pode ser o app que travou. O painel avisa e dá o
// Tente novamente ao lado do Travei (0.2.16).
async function vigiar($: EngineInterface) {
  const quando = await read($, fim)
  if (!quando || (await read($, parado)) || (await read($, trabalhando)) || !(await emMontagem($))) return
  if ((await agoraMs($)) - quando > 240000) await update($, parado, () => true)
}

async function enviar($: EngineInterface, texto: string) {
  if (await read($, enviado)) return
  await update($, enviado, () => texto)
  // Rede de segurança: se a resposta nunca chegar, os botões voltam em 3 minutos.
  $.clock.after(180000, () => void limpar($))
  // asUser: o clique é a pessoa falando; o modelo lê só o texto, sem o aviso técnico do app.
  void $.prompt.submit({ text: texto, asUser: true })
}

// Um workflow da lista abre numa conversa nova (0.3.0): o botão pede, e a campo-1 abre a conversa com o
// pedido dele (o cartão do app, para ela aprovar). O pedido fica guardado para a reserva do copiar e colar.
async function abrirNova($: EngineInterface, nome: string, pedido: string | null) {
  if (await read($, enviado)) return
  await update($, aAbrir, () => pedido ?? `rodar o workflow ${nome}`)
  await enviar($, `abrir o workflow ${nome} numa conversa nova`)
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

// Copia um texto: pelo app; no Mac, se o app não copiar, pelo pbcopy. Diz se copiou.
async function copiar($: EngineInterface, texto: string, surface?: RenderSurface): Promise<boolean> {
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
  return copiado
}

// O texto do pedido 1 (0.3.2): a caixa da abertura do roteiro, sem as marcas de citação. O botão do painel copia este texto.
async function copiarPedido1($: EngineInterface, surface: RenderSurface) {
  const roteiro = await lerTexto($, `${$.plugin.root}/skills/montagem-do-base-camp/roteiro.md`)
  const caixa = /```text\n([\s\S]*?)\n>?\s*```/.exec(roteiro)?.[1] ?? ''
  const texto = caixa
    .split('\n')
    .map(l => l.replace(/^>\s?/, ''))
    .join('\n')
    .trim()
  if (texto && (await copiar($, texto, surface))) {
    $.ui.toast('Pedido 1 copiado. Cole na IA que você mais usa e traga a resposta para cá.', { timeoutMs: 7000 })
    return
  }
  $.ui.toast('Não deu para copiar daqui: use o botão de copiar da caixa na conversa.', { timeoutMs: 8000 })
}

async function copiarResumo($: EngineInterface, surface: RenderSurface) {
  const dir = await read($, pasta)
  const texto = (await lerTexto($, `${dir}/resumo-para-o-arthur.md`)).replace(/<!--[\s\S]*?-->/g, '').trim()
  if (!texto) {
    $.ui.toast('O resumo para o Arthur ainda não foi escrito.')
    return
  }
  if (await copiar($, texto, surface)) {
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
    await update($, ultimaAcao, () => null)
    // O diário (0.3.0): quando o painel recarrega no meio da mesma conversa, a linha dela continua; numa
    // conversa nova, começa outra.
    const anterior = await read($, conversa)
    let estaSessao = ''
    try {
      estaSessao = (await $.session.id()).replace(/[^a-z0-9]/gi, '').slice(-4)
    } catch {
      estaSessao = ''
    }
    if (!anterior || !estaSessao || anterior.id !== estaSessao) await update($, conversa, () => null)
    await update($, aAbrir, () => null)
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
    const resultado = await testar($, pergunta)
    const hora = horaLocal(await agoraMs($))
    await update($, ultimaAcao, () => ({ texto: 'Rodei o teste do Base Camp', hora }))

    return { result: resultado }
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
    // O diário (0.3.0): o que esta conversa de trabalho fez.
    const c = await read($, conversa)
    if (c) await update($, conversa, () => anotar(c, String(e.tool), entrada, dir, f))
    if (f) {
      // O que acabou de acontecer, para o cartão Agora (0.2.16).
      const hora = horaLocal(await agoraMs($))
      await update($, ultimaAcao, () => ({ texto: f.feito, hora }))
    }
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
      // O diário (0.3.0): só depois do Base Camp montado; o primeiro pedido abre a linha da conversa.
      const texto = e.text.trim()
      if ((await read($, painel))?.concluida && texto) {
        const atual = await read($, conversa)
        if (atual) await update($, conversa, () => ({ ...atual, pedidos: atual.pedidos + 1 }))
        else {
          let id = ''
          try {
            id = (await $.session.id()).replace(/[^a-z0-9]/gi, '').slice(-4)
          } catch {
            id = ''
          }
          const inicio = await agoraMs($)
          const nova: Conversa = {
            id: id || Math.random().toString(16).slice(2, 6),
            inicio,
            pedido: pedidoDoDiario(texto),
            pedidos: 1,
            sistemaMs: 0,
            frente: null,
            workflow: null,
            gravou: [],
            leu: [],
            rodou: [],
            passos: [],
            deSistema: /^abrir o workflow .+ numa conversa nova$/i.test(texto),
          }
          await update($, conversa, () => nova)
        }
      }
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
    const terminou = await agoraMs($)
    await update($, fim, () => terminou)
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
    // A reserva do botão de conversa nova (0.3.0): só quando a campo-1 diz que não abriu. O pedido é o do botão
    // ou, quando ela pediu escrevendo, o que a frase traz em negrito no fim.
    const doBotao = await read($, aAbrir)
    const naFrase = /\*\*([^*]+)\*\*\.?\s*$/.exec(resposta)?.[1]?.trim() ?? null
    const pedidoNovo = doBotao ?? (resposta.includes(NAO_ABRIU) ? naFrase : null)
    if (pedidoNovo && resposta) {
      await update($, aAbrir, () => null)
      if (resposta.includes(NAO_ABRIU)) {
        const copiou = await copiar($, pedidoNovo)
        $.ui.toast(
          copiou ? 'Copiei o pedido. Abra uma conversa nova e cole.' : `Abra uma conversa nova e escreva: ${pedidoNovo}`,
          { timeoutMs: 9000 },
        )
      }
    }
    // O diário (0.3.0): a linha desta conversa, reescrita a cada resposta.
    const c = await read($, conversa)
    if (c) {
      await update($, conversa, () => ({ ...c, sistemaMs: c.sistemaMs + (e.durationMs || 0) }))
      await gravarDiario($)
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
    // A voz é o microfone do próprio Claude, igual no Mac e no Windows (0.3.2); no terminal não há microfone.
    if (e.surface === 'terminal') return next({ ...e, props: { ...e.props, tail: 'Travou? escreva travei' } })
    const dica = 'Responda pelo microfone do Claude · Travou? escreva travei'
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
    const curto = p.blocos.length === 3
    const total = curto ? 3 : p.blocos.filter(b => b.codigo !== 'D').length
    const numero = curto ? p.blocos.findIndex(b => b.codigo === atual.codigo) + 1 : atual.codigo
    const etapa = atual.codigo === 'D' && !curto ? 'Começo' : `${curto ? 'Passo' : 'Etapa'} ${numero} de ${total} · ${atual.nome}`
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
    // Dois tamanhos só (0.2.16): a etiqueta e o texto. O título fica no tamanho do texto, em peso forte e na
    // tinta. Depois do retrato confirmado, o painel passa a ser o sistema dela, pelo nome.
    const retratoConfirmado = dado?.blocos.some(b => b.codigo === '1' && b.status === 'aprovado') ?? false
    const nomeDoPainel = retratoConfirmado ? (dado?.nome ? `O sistema de ${dado.nome}` : 'O seu sistema') : 'Montagem do Base Camp'
    const titulo = <Text bold color={TINTA}>{nomeDoPainel}</Text>
    const rodape = <Text color={CINZA} size="caption">{ASSINATURA} · Um sistema, qualquer IA.</Text>
    // Espaço por relação (0.2.16): dentro de um cartão as linhas ficam coladas (sem gap); entre os itens de
    // uma zona, 1; entre as zonas do painel, o dobro.
    const ENTRE_ZONAS = 2
    const fundo = {
      flexDirection: 'column' as const,
      padding: 1,
      gap: ENTRE_ZONAS,
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
    const acao = await read($, ultimaAcao)
    const aberto = await read($, doc)
    const textoDoc = await read($, docTexto)
    const trilha = figura(trilhaSvg(dado, fest), 'A sua subida até o Base Camp', 300, Boolean(fest))
    const aviso = <Text color={CINZA} size="caption">Enviado: "{pendente}". Espere a resposta.</Text>
    const comemoracao = fest ? <Text bold color={TINTA}>✓ {fest.texto}</Text> : null
    // Em cima, a marca de quem entrega e, colado, o título; a comemoração de uma etapa, quando há.
    const cabecalho = (
      <Box flexDirection="column">
        {marca}
        {titulo}
        {comemoracao}
      </Box>
    )
    // O que acabou de acontecer, com a hora (0.2.16).
    const ultima = acao ? <Text color={CINZA} size="caption">Última ação: {acao.texto} · {acao.hora}</Text> : null
    // O "Quero corrigir" fica em todos os estados do cartão Agora (0.2.16): só põe a frase na caixa, nunca envia.
    const corrigirBotao = <Button key="corrigir" label="Quero corrigir" onPress={() => void corrigir($)} />

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

    // A subida em uma linha (pedido do Arthur, 31/10), com a base como o primeiro ponto já feito (0.2.16).
    // Depois do Base Camp, a linha segue até o Campo 1 (0.2.17): o ponto atual, feito quando o workflow está completo.
    const progresso = (
      <Text color={CINZA} size="caption">
        {[
          '✓ Base',
          ...dado.blocos.map(b => {
            const atual = !dado.concluida && atualBloco?.codigo === b.codigo
            return `${atual ? '●' : b.status === 'aprovado' || b.status === 'pulado' ? '✓' : '○'} ${b.codigo === 'D' ? 'Começo' : dado.blocos.length === 3 ? b.nome : b.codigo}`
          }),
          ...(dado.concluida ? [campo1Feito(dado) ? '✓ Campo 1' : '● Campo 1'] : []),
        ].join('   ')}
      </Text>
    )

    const docAberto =
      aberto && textoDoc ? (
        <Box flexDirection="column" borderStyle="round" borderColor={TINTA} padding={1}>
          <Markdown text={textoDoc} />
        </Box>
      ) : null

    // ----- Boas-vindas: a montagem ainda não começou
    if (!dado.iniciada) {
      return (
        <Box {...fundo}>
          {cabecalho}
          <Box flexDirection="column">
            <Text color={CINZA}>Onde todo sistema começa: uma pasta, um arquivo e qualquer IA.</Text>
            {trilha}
            <Text bold color={ROCHA}>{dado.blocos.length === 3 ? '3 passos, uns 30 minutos: você manda, confirma e escolhe o seu primeiro workflow, que já roda.' : `${dado.blocos.filter(b => b.codigo !== 'D').length} etapas, uma tarde, com parada no fim de cada uma.`}</Text>
            <Text color={ROCHA}>
              Você responde do seu jeito, até por voz. O sistema escreve cada arquivo e mostra para você aprovar. No fim, ele já roda o seu primeiro workflow para você.
            </Text>
          </Box>
          <Box flexDirection="column">
            {vez}
            {subida}
            {pendente ? aviso : (
              <Box flexDirection="row" gap={1}>
                <Button key="travei" label="Travei" onPress={() => void enviar($, 'travei')} />
              </Box>
            )}
          </Box>
          {rodape}
        </Box>
      )
    }

    // ----- Base Camp montado: o painel de trabalho cortado (0.3.0). Um cartão Agora só, com o workflow da vez
    // e um botão só, Rodar, nesta conversa; enquanto a entrega espera, nenhum botão: aprovar e corrigir são
    // respostas no chat. Os outros workflows, uma linha cada, com o mesmo botão, que abre uma conversa nova; os
    // que nunca rodaram, recolhidos em "A começar"; os marcos das montanhas numa linha; o Base Camp, recolhido.
    if (dado.concluida) {
      const daVez = dado.workflows.find(w => w.arquivo === dado.daVez) ?? null
      const pedido = daVez ? daVez.pedido : dado.pedido
      const rodadas = daVez ? daVez.rodadas : dado.rodadas
      const aguardaAprovacao = rodadas[rodadas.length - 1]?.aprovada === 'pendente'
      const estado = daVez ? daVez.estado : dado.estado
      const ehOPrimeiro = !daVez || daVez.arquivo === (dado.workflow ?? 'primeiro-processo.md')
      const abertos = await read($, passosAbertos)
      const aComecarAberto = await read($, filaAberta)
      const marcos = calcularMarcos(dado.workflows, dado.fila)
      const marcoAbertoAgora = await read($, marcoAberto)
      const falhou = await read($, diarioFalhou)
      const zonaDoBaseCamp = aberto === 'resumo' || aberto === 'guia'
      // Um quadrado por passo, na cor da Situação: o sistema faz (cheio, em tinta), fica com ela (contorno),
      // ainda não dá (✕). A forma também muda, para quem não distingue a cor.
      const fileira = (w: Workflow, k: string) =>
        w.quadros.length > 0 ? (
          <Box key={k} flexDirection="row">
            {w.quadros.map((q, i) => (
              <Text key={`${k}-${i}`} color={q === 'sistema' ? TINTA : q === 'nao' ? SINAL : ROCHA}>
                {q === 'sistema' ? '■' : q === 'nao' ? '✕' : '□'}
              </Text>
            ))}
          </Box>
        ) : null
      // "ver os passos" (pedido do Arthur, 04/11): os passos na vertical, com quem faz, para ela ver onde mexer.
      const verPassos = (w: Workflow, k: string) =>
        w.lista.length > 0 ? (
          <Button
            key={`ver-${k}`}
            label={abertos.includes(w.arquivo) ? 'fechar os passos' : 'ver os passos'}
            onPress={() => void update($, passosAbertos, a => (a.includes(w.arquivo) ? a.filter(x => x !== w.arquivo) : [...a, w.arquivo]))}
          />
        ) : null
      const listaDePassos = (w: Workflow, k: string) =>
        abertos.includes(w.arquivo) ? (
          <Box key={`lista-${k}`} flexDirection="column">
            {w.lista.map((p, i) => (
              <Text key={`${k}-passo-${i}`} color={p.quadro === 'nao' ? SINAL : ROCHA}>
                {`${p.quadro === 'sistema' ? '■' : p.quadro === 'nao' ? '✕' : '□'} ${i + 1}. ${p.nome} · ${
                  p.quadro === 'sistema' ? 'o sistema faz' : p.quadro === 'nao' ? `ainda não dá${p.motivo ? `: ${p.motivo}` : ''}` : 'fica com você'
                }`}
              </Text>
            ))}
          </Box>
        ) : null
      const contagem = (w: Workflow) => (w.passos > 0 ? `${w.passosSistema} de ${w.passos}` : null)
      const rodarNova = (nome: string, pedidoDele: string | null, k: string, rotulo = 'Rodar em conversa nova') =>
        pendente ? null : (
          <Button key={`nova-${k}`} label={rotulo} onPress={() => void abrirNova($, nome, pedidoDele)} />
        )
      // A frente do workflow, pequena e em cinza ao lado do nome (0.3.2, pedido do Arthur: "sem poluir").
      const nomeDaFrente = (w: Workflow) => (w.frente ? maiuscula(w.frente.replace(/[-_]/g, ' ')) : null)
      const estadoCurto = (w: Workflow) => (w.estado === 'completo' ? 'completo ✓' : w.estado)
      // A trilha da skill (0.3.2): um círculo por rodada aprovada sem correção (um pedido só, "sim"), até 2, e a
      // caixa da skill, que acende quando o cartão já usa uma skill. Regra de 04/11: 2 rodadas sem correção.
      const SEM_CORRECAO = 2
      const trilhaSkill = (w: Workflow, k: string, agora = false) => {
        const feitas = w.skill
          ? SEM_CORRECAO
          : Math.min(SEM_CORRECAO, w.rodadas.filter(r => r.aprovada === 'sim' && r.pedidos === 1).length)
        return (
          <Box key={`skill-${k}`} flexDirection="row" gap={1}>
            {Array.from({ length: SEM_CORRECAO }, (_, i) => (
              <Text key={`${k}-r${i}`} color={i < feitas ? TINTA : TRACO}>
                {i < feitas ? '●' : '○'}
              </Text>
            ))}
            <Text color={w.skill ? TINTA : CINZA} bold={w.skill} size="caption">
              {w.skill ? '⚙ skill pronta' : agora ? '⚙ próximo: skill' : '⚙ skill'}
            </Text>
          </Box>
        )
      }

      // O cartão Agora.
      const etiquetaAgora = aguardaAprovacao ? 'AGORA · ESPERANDO VOCÊ NO CHAT' : 'AGORA'
      const nomeDaVez = daVez?.nome ?? dado.workflowNome ?? (pedido ? maiuscula(pedido) : 'O seu primeiro workflow')
      const linhaDaVez = aguardaAprovacao
        ? /^em andamento/i.test(rodadas[rodadas.length - 1]?.tempo ?? '')
          ? 'A rodada está em andamento no chat.'
          : 'A entrega está no chat para você conferir.'
        : rodadas.length === 0
          ? 'Ainda não rodou.'
          : (daVez?.combinado ?? dado.combinadoCartao ?? dado.combinado)
            ? `Combinado: ${(daVez?.combinado ?? dado.combinadoCartao ?? dado.combinado ?? '').replace(/\*\*/g, '')}`
            : null
      // O próximo ponto de controle, um só (0.3.0): a lista dos três saiu.
      const proximo =
        daVez && estado === 'completo' && daVez.skill && !daVez.sozinho ? 'Próximo: chegar sozinho' : null
      // A última ação, curta: só o nome do arquivo, nunca o caminho.
      const ultimaCurta = acao ? (
        <Text color={CINZA} size="caption">
          {acao.texto.replace(/(?:[A-Za-z]:)?(?:[^\s/\\]+[/\\])+([^\s/\\]+)/g, '$1')} · {acao.hora}
        </Text>
      ) : null
      const rodarAqui = aguardaAprovacao || pendente ? null : pedido ? (
        <Button key="rodar-workflow" variant="primary" label={rotuloCurto(`Rodar ${pedido}`)} onPress={() => void enviar($, pedido)} />
      ) : ehOPrimeiro ? (
        <Button key="rodar-workflow" variant="primary" label="Rodar o meu primeiro workflow" onPress={() => void enviar($, 'vamos rodar o primeiro workflow')} />
      ) : null

      // A lista: os que já rodaram (ou que precisam de ajuste) e os que nunca rodaram, recolhidos.
      const outros = dado.workflows.filter(w => w !== daVez)
      const jaRodaram = outros.filter(w => w.rodadas.length > 0 || w.ilegivel)
      const nuncaRodaram = outros.filter(w => w.rodadas.length === 0 && !w.ilegivel)
      const aComecar: { nome: string; pedido: string | null }[] = [
        ...nuncaRodaram.map(w => ({ nome: w.nome, pedido: w.pedido })),
        ...dado.fila.map(f => ({ nome: maiuscula(f.nome), pedido: f.pedido })),
      ]
      // Cada workflow num cartão com moldura, em 2 linhas (0.3.2): o nome, a frente, o estado e os botões; embaixo,
      // os quadrados dos passos e, à direita, a trilha da skill. O Agora segue o único em tinta, com o botão primário.
      const linhaDoWorkflow = (w: Workflow, i: number) => {
        const k = `wf-${i}`
        const nomeDoArquivo = w.arquivo.split('/').pop()?.replace(/\.md$/, '').replace(/-/g, ' ') ?? w.arquivo
        const frente = nomeDaFrente(w)
        return (
          <Box key={k} flexDirection="column" borderStyle="round" borderColor={TRACO} paddingX={1}>
            <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" gap={1}>
              <Box flexDirection="row" flexWrap="wrap" gap={1}>
                <Text bold color={w.ilegivel ? SINAL : ROCHA}>{w.ilegivel ? `${maiuscula(nomeDoArquivo)} · precisa de ajuste` : w.nome}</Text>
                {frente && <Text color={CINZA} size="caption">· {frente}</Text>}
                {!w.ilegivel && <Text color={w.estado === 'completo' ? TINTA : CINZA} size="caption">{estadoCurto(w)}</Text>}
              </Box>
              <Box flexDirection="row" gap={1}>
                {rodarNova(w.ilegivel ? maiuscula(nomeDoArquivo) : w.nome, w.pedido, k, 'Rodar')}
                {verPassos(w, k)}
              </Box>
            </Box>
            {!w.ilegivel && (
              <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" gap={1}>
                <Box flexDirection="row" gap={1}>
                  {fileira(w, `${k}-quadros`)}
                  {contagem(w) && <Text color={CINZA} size="caption">o sistema faz {contagem(w)}</Text>}
                </Box>
                {trilhaSkill(w, k)}
              </Box>
            )}
            {listaDePassos(w, k)}
          </Box>
        )
      }

      return (
        <Box {...fundo}>
          {cabecalho}
          <Box flexDirection="column" borderStyle="round" borderColor={TINTA} padding={1}>
            <Text color={TINTA} size="caption">{etiquetaAgora}</Text>
            <Box flexDirection="row" flexWrap="wrap" gap={1}>
              <Text bold color={TINTA}>{nomeDaVez + (estado === 'completo' ? ' ✓' : '')}</Text>
              {daVez && nomeDaFrente(daVez) && <Text color={CINZA} size="caption">· {nomeDaFrente(daVez)}</Text>}
            </Box>
            {daVez && daVez.passos > 0 && (
              <Box flexDirection="row" flexWrap="wrap" justifyContent="space-between" gap={1}>
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  {fileira(daVez, 'agora-quadros')}
                  <Text color={ROCHA}>{`o sistema faz ${daVez.passosSistema} de ${daVez.passos} passos`}</Text>
                  {verPassos(daVez, 'agora')}
                </Box>
                {trilhaSkill(daVez, 'agora', true)}
              </Box>
            )}
            {daVez && listaDePassos(daVez, 'agora')}
            {linhaDaVez && <Text color={ROCHA}>{linhaDaVez}</Text>}
            {rodarAqui}
            {pendente && aviso}
            {proximo && <Text color={CINZA} size="caption">{proximo}</Text>}
            {ultimaCurta}
          </Box>
          {(jaRodaram.length > 0 || aComecar.length > 0) && (
            <Box flexDirection="column">
              <Text color={CINZA} size="caption">OS SEUS WORKFLOWS</Text>
              {jaRodaram.map(w => linhaDoWorkflow(w, dado.workflows.indexOf(w)))}
              {aComecar.length > 0 && (
                <Box flexDirection="column">
                  <Button key="fila" label={`A começar: ${aComecar.length}`} onPress={() => void update($, filaAberta, a => !a)} />
                  {aComecarAberto &&
                    aComecar.map((f, i) => (
                      <Box key={`comecar-${i}`} flexDirection="row" flexWrap="wrap" gap={1}>
                        <Text color={ROCHA}>{f.nome}</Text>
                        {rodarNova(f.nome, f.pedido, `comecar-${i}`)}
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          )}
          <Box flexDirection="column">
            {/* A subida desenhada no lugar da linha dos marcos (0.3.2); no terminal, que não desenha, a linha. */}
            <Text color={CINZA} size="caption">A SUBIDA</Text>
            {figura(subidaSvg(marcos, Boolean(fest)), 'A subida: o Base Camp, a Mera, a Island, a Lobuche East e o Everest, com você no caminho', 300, Boolean(fest)) ?? (
              <Text color={ROCHA}>{linhaDosMarcos(marcos)}</Text>
            )}
            <Box flexDirection="row" flexWrap="wrap" gap={1}>
              {MARCOS_LEGENDA.map(l => {
                const marco = marcos[l.chave]
                const extra = l.chave === 'island' && !marco.fechado && marcos.mera.fechado ? `: ${marcos.island.feitos} de ${marcos.island.total}` : ''
                return (
                  <Box key={`marco-${l.chave}`} flexDirection="row" gap={1}>
                    <Text color={ROCHA} size="caption">{`${l.nome} · ${l.resultado}${extra}${marco.fechado ? ' ✓' : ''}`}</Text>
                    <Button key={`i-${l.chave}`} dimColor label="i" onPress={() => void update($, marcoAberto, a => (a === l.chave ? null : l.chave))} />
                  </Box>
                )
              })}
            </Box>
            {marcoAbertoAgora && <Text color={ROCHA} size="caption">{MARCOS_LEGENDA.find(l => l.chave === marcoAbertoAgora)?.explica}</Text>}
            {falhou && <Text color={SINAL} size="caption">O diário não está gravando. Escreva travei.</Text>}
            <Box flexDirection="row" flexWrap="wrap" gap={1}>
              <Text color={CINZA} size="caption">{dado.tempoTotal ? `Base Camp montado em ${dado.tempoTotal}` : 'Base Camp montado'}</Text>
              <Button key="ver-resumo" label={zonaDoBaseCamp ? 'Fechar o resumo' : 'Ver o resumo'} onPress={() => void (zonaDoBaseCamp ? update($, doc, () => null) : abrirDoc($, 'resumo'))} />
            </Box>
            {zonaDoBaseCamp && (
              <Box flexDirection="column">
                {trilha}
                {progresso}
                {dado.testeFalhou !== null && (
                  <Text color={SINAL}>✕ O teste: quem sou eu não passou{dado.testeFalhou ? `: ${dado.testeFalhou}` : ''}</Text>
                )}
                <Box flexDirection="row" flexWrap="wrap" gap={1}>
                  <Button key="copiar-resumo" label="Copiar o resumo" onPress={press => void copiarResumo($, press.surface)} />
                  <Button key="guia" label={aberto === 'guia' ? 'Ver o resumo' : 'Ver o guia de bolso'} onPress={() => void abrirDoc($, aberto === 'guia' ? 'resumo' : 'guia')} />
                </Box>
                {docAberto}
                {!completo && <Text color={CINZA} size="caption">No programa, o Arthur sobe a Mera com você.</Text>}
              </Box>
            )}
          </Box>
          {rodape}
        </Box>
      )
    }

    // ----- Em andamento: três zonas (Agora; o que este passo já tem e o que o sistema sabe; a subida em uma linha).
    const ver = await read($, verArquivo)
    const textoArquivo = await read($, arquivoTexto)
    const sabidos = dado.campos.filter(c => c.estado === 'ok').length
    const curto = dado.blocos.length === 3
    const total = curto ? 3 : dado.blocos.filter(b => b.codigo !== 'D').length
    const numero = curto && atualBloco ? dado.blocos.findIndex(b => b.codigo === atualBloco.codigo) + 1 : atualBloco?.codigo
    const ehEntrega = atualBloco !== undefined && atualBloco.codigo === dado.blocos[dado.blocos.length - 1]?.codigo
    const ehComeco = atualBloco?.codigo === 'D'
    const lembrete = (await read($, parado)) && !ocupado
    const nomeAprov = aprov?.arquivo ? nomeDoArquivo(aprov.arquivo) : null
    const perguntaDaVez = ocupado ? null : await read($, pergunta)
    // O passo 2 antes da escolha (0.2.17): as 3 opções de primeiro workflow viram botões no cartão Agora.
    const escolhaDoWorkflow = curto && ehEntrega && !dado.escolhido && dado.opcoes.length > 0 && !ocupado && !pendente
    const testeFalhou = dado.campos.some(c => c.estado === 'falhou')
    // No curto, o retrato montado pede o confirmo e a tarefa feita pede o "ficou bom": o botão principal
    // aparece nesses dois momentos mesmo sem a frase de aprovação, e manda o "pode, aprovado" de sempre.
    // O botão aparece quando o retrato está na tela (o resumo existe), falte ou não um campo (0.3.2: no teste de 05/11 ele
    // sumia por um campo faltando, e a pessoa escreveu "continuar" duas vezes).
    const retratoMontado = curto && atualBloco?.codigo === '1' && Boolean(dado.resumo && dado.resumo.cartoes.length > 0)
    const tarefaFeita = curto && ehEntrega && dado.feita
    const materialChegou = ehComeco && dado.campos.some(c => c.codigo === 'D.2' && c.estado === 'ok')
    // Os botões dizem o resultado, não a ação (0.2.16); as frases que eles mandam não mudam.
    const rotuloAprovar = curto && atualBloco?.codigo === '1' ? 'Confirmar o retrato' : tarefaFeita ? 'Fechar o Base Camp' : 'Aprovar'
    const rotuloContinuar = curto && materialChegou ? 'Montar o meu retrato' : 'Continuar'
    const principal =
      aprov || retratoMontado || tarefaFeita ? (
        <Button key="aprovar" variant="primary" label={rotuloAprovar} onPress={() => void enviar($, 'pode, aprovado')} />
      ) : !perguntaDaVez && completo && !escolhaDoWorkflow ? (
        // Na escolha do workflow, os botões das opções são o caminho: sem um Continuar azul ao lado do recomendado.
        <Button key="continuar" variant="primary" label={rotuloContinuar} onPress={() => void enviar($, 'continuar')} />
      ) : null
    // O começo (0.3.2): o primário é copiar o pedido 1 até ele chegar; com o pedido 2, "Montar o meu retrato".
    const pedido1Chegou = dado.campos.some(c => c.codigo === 'D.1' && c.estado === 'ok')
    const comecoCurto = ehComeco && curto
    const principalDoComeco = !comecoCurto
      ? principal
      : materialChegou
        ? principal
        : !pedido1Chegou
          ? <Button key="copiar-pedido-1" variant="primary" label="Copiar o pedido 1" onPress={press => void copiarPedido1($, press.surface)} />
          : null
    const etiquetaCampos = ehEntrega ? 'O QUE ESTE PASSO ENTREGA' : ehComeco ? 'O SEU COMEÇO' : curto ? 'O QUE JÁ ESTÁ MONTADO' : 'O QUE ESTA ETAPA JÁ TEM'

    return (
      <Box {...fundo}>
        {cabecalho}
        <Box flexDirection="column" borderStyle="round" borderColor={TINTA} padding={1}>
          <Text color={TINTA} size="caption">
            {atualBloco
              ? atualBloco.codigo === 'D' && !curto
                ? 'AGORA · O COMEÇO'
                : `AGORA · ${curto ? 'PASSO' : 'ETAPA'} ${numero} DE ${total} · ${atualBloco.nome.toUpperCase()}`
              : 'AGORA'}
          </Text>
          {ocupado ? (
            <Text color={TINTA}>● {agora ?? 'O sistema está trabalhando'}…</Text>
          ) : aprov ? (
            <Text bold color={ROCHA}>Sua vez: aprove ou corrija{nomeAprov ? ` ${nomeAprov}` : ''}.</Text>
          ) : escolhaDoWorkflow ? (
            <Text bold color={ROCHA}>Sua vez: escolha o seu primeiro workflow.</Text>
          ) : (
            <Text bold color={ROCHA}>{perguntaDaVez ? `Sua vez: ${perguntaDaVez}` : 'Sua vez: responda na conversa.'}</Text>
          )}
          {atualBloco && PARA_QUE[atualBloco.codigo] && !aprov && !comecoCurto && <Text color={CINZA} size="caption">{PARA_QUE[atualBloco.codigo]}</Text>}
          {comecoCurto && (
            // O mapa dos 3 passos e os 2 pedidos com o estado (0.3.2): o caminho desenhado, no lugar da explicação na conversa.
            <Box flexDirection="column">
              <Box flexDirection="row" flexWrap="wrap" gap={1}>
                {['1 · Você manda', '2 · Você confirma o retrato', '3 · O primeiro workflow roda'].map((p, i) => (
                  <Box key={`mapa-${i}`} flexDirection="row" gap={1}>
                    <Box borderStyle="round" borderColor={i === 0 ? TINTA : TRACO} paddingX={1}>
                      <Text bold={i === 0} color={i === 0 ? ROCHA : CINZA} size="caption">{i === 0 ? `● ${p}` : p}</Text>
                    </Box>
                    {i < 2 && <Text color={TRACO}>→</Text>}
                  </Box>
                ))}
              </Box>
              <Text color={pedido1Chegou ? TINTA : ROCHA}>{pedido1Chegou ? '✓' : '○'} Pedido 1 · a outra IA{pedido1Chegou ? ' · recebido' : ''}</Text>
              <Text color={materialChegou ? TINTA : ROCHA}>
                {materialChegou ? '✓' : '○'} Pedido 2 · você, por voz{materialChegou ? ' · recebido' : ''}
              </Text>
              {!materialChegou && <Text color={CINZA} size="caption">Fale pelo microfone do Claude, na caixa de mensagem.</Text>}
            </Box>
          )}
          {escolhaDoWorkflow && (
            <Box flexDirection="column" gap={1}>
              <Text color={CINZA} size="caption">O SEU PRIMEIRO WORKFLOW · ESCOLHA UM (O PRIMEIRO É O RECOMENDADO)</Text>
              {dado.opcoes.map((o, i) => (
                // A entrega em cima, como legenda; o botão leva o pedido, com a primeira letra em maiúscula, e manda
                // "primeiro workflow: <pedido>" como está na linha.
                <Box key={`opcao-${i}`} flexDirection="column">
                  {o.entrega.length > 0 && <Text color={CINZA} size="caption">{o.entrega}</Text>}
                  <Button
                    key={`escolha-${i}`}
                    variant={i === 0 ? 'primary' : undefined}
                    label={rotuloCurto(maiuscula(o.pedido))}
                    onPress={() => void enviar($, `primeiro workflow: ${o.pedido}`)}
                  />
                </Box>
              ))}
            </Box>
          )}
          <Box flexDirection="row" flexWrap="wrap" gap={1}>
            {!ocupado && !pendente && principalDoComeco}
            {comecoCurto && !pedido1Chegou && !materialChegou && !ocupado && !pendente && (
              <Button key="sem-outra-ia" label="Não uso outra IA" onPress={() => void enviar($, 'não uso outra IA')} />
            )}
            {corrigirBotao}
            {!ocupado && !pendente && <Button key="travei" label="Travei" onPress={() => void enviar($, 'travei')} />}
            {lembrete && !pendente && (
              <Button key="tentar-novamente" label="Tente novamente" onPress={() => void enviar($, 'tente novamente')} />
            )}
          </Box>
          {pendente && aviso}
          {aprov && !ocupado && aprov.arquivo && (
            <Button key="ver" dimColor label={ver ? 'Fechar o arquivo' : 'Ler o arquivo no painel'} onPress={() => void abrirArquivo($)} />
          )}
          {ver && textoArquivo && <Markdown text={textoArquivo} />}
          {lembrete && <Text color={SINAL}>Parado há 4 min? Pode ser o app.</Text>}
          {ultima}
        </Box>
        {((dado.campos.length > 0 && !comecoCurto) || (dado.resumo && dado.resumo.cartoes.length > 0)) && (
          <Box flexDirection="column" gap={1}>
            {dado.campos.length > 0 && !comecoCurto &&
              (sabidos === dado.campos.length ? (
                <Text color={TINTA}>
                  ✓ {ehEntrega ? 'Tudo o que este passo entrega já está pronto.' : ehComeco ? 'O começo está completo.' : curto ? 'O retrato está montado: é só confirmar.' : 'Tudo o que esta etapa precisa já está anotado.'}
                </Text>
              ) : (
                <Box flexDirection="column">
                  <Text color={CINZA} size="caption">
                    {etiquetaCampos} · {sabidos} DE {dado.campos.length}
                  </Text>
                  {dado.campos.map(c =>
                    c.estado === 'falhou' ? (
                      <Text key={`campo-${c.codigo}`} color={SINAL}>
                        ✕ {c.rotulo} não passou{c.motivo ? `: ${c.motivo}` : ''}
                      </Text>
                    ) : (
                      <Text key={`campo-${c.codigo}`} color={c.estado === 'falta' ? CINZA : ROCHA} dimColor={c.estado === 'falta'}>
                        {c.estado === 'ok' ? '✓' : c.estado === 'pulada' ? '–' : '○'} {c.rotulo}
                        {c.estado === 'pulada' ? ' (pulada, fica para depois)' : ''}
                      </Text>
                    ),
                  )}
                  {testeFalhou && !ocupado && !pendente && (
                    <Button key="testar-de-novo" label="Corrigir e testar de novo" onPress={() => void enviar($, 'corrigir e testar de novo')} />
                  )}
                </Box>
              ))}
            {dado.resumo && dado.resumo.cartoes.length > 0 && (
              <Box flexDirection="column">
                <Text color={CINZA} size="caption">O QUE EU JÁ SEI DE VOCÊ</Text>
                <Box flexDirection="column" gap={1}>
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
                  {dado.resumo.falta.length > 0 ? (
                    <Box flexDirection="column" borderStyle="round" borderColor={CINZA} paddingX={1}>
                      <Text bold color={ROCHA}>Falta isto</Text>
                      {dado.resumo.falta.map((f, j) => (
                        <Text key={`falta-${j}`} color={CINZA}>○ {f}</Text>
                      ))}
                    </Box>
                  ) : (
                    // "Falta isto" vazio não some: diz que nada falta (0.2.16).
                    <Text color={CINZA}>Nada falta: o retrato está completo com o que você mandou.</Text>
                  )}
                </Box>
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
