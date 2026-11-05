export type Status = 'pendente' | 'em andamento' | 'aprovado' | 'pulado'

export type Bloco = {
  codigo: string
  nome: string
  status: Status
  minutos: number | null
}

export type Campo = {
  codigo: string
  rotulo: string
  // "falhou": o teste que não passou, com o motivo que o roteiro gravou (0.2.16).
  estado: 'ok' | 'pulada' | 'falta' | 'falhou'
  motivo?: string
}

export type Montado = {
  rotulo: string
  ok: boolean
}

export type Nivel = 'leve' | 'completo'

// Uma das opções de primeiro workflow do passo 2 (0.2.17): a linha "- <pedido>: <entrega>" do base-camp.md.
// O pedido é o que a pessoa vai escrever ("fechar o dia"); a entrega é a primeira entrega, em uma linha ('' no formato antigo).
export type Opcao = {
  pedido: string
  entrega: string
}

// Uma linha da tabela "As rodadas" do cartão do workflow (0.2.17).
export type Rodada = {
  data: string
  tempo: string
  // O primeiro inteiro da coluna "Pedidos dela até a entrega"; null quando a coluna não tem número.
  pedidos: number | null
  // "sim" ou "não" na coluna "Entrega aprovada?"; "pendente" para o resto (vazio, "a conferir").
  aprovada: 'sim' | 'nao' | 'pendente'
  obs: string
}

// Um passo do cartão, pela coluna Situação (0.2.19): "o sistema fez" = o sistema faz; "ainda não dá" = não dá; o resto fica com ela.
export type Quadro = 'sistema' | 'ela' | 'nao'

// Um passo "ainda não dá", com o motivo (o texto depois dos dois-pontos da Situação).
export type Furo = {
  passo: string
  motivo: string
}

// Uma linha da tabela "Os próximos" de um cartão, ou uma opção não escolhida no passo 2 (0.2.19).
// A frente é a do cartão de onde veio (0.3.0, para a Island); null nas opções do passo 2.
export type NaFila = {
  nome: string
  pedido: string | null
  frente?: string | null
}

// Um passo do cartão, para o "ver os passos" (0.3.0): o nome, quem faz e, no "ainda não dá", o motivo.
export type Passo = {
  nome: string
  quadro: Quadro
  motivo: string
}

// Os marcos das montanhas, calculados dos cartões (0.3.0). A data é a do cartão que fechou o marco.
export type Marco = {
  fechado: boolean
  workflow: string | null
  data: string | null
}

export type Marcos = {
  mera: Marco
  island: Marco & { feitos: number; total: number }
  lobuche: Marco
}

// A conversa de agora, para a linha do diário (0.3.0). O painel grava só isto na pasta dela.
export type Conversa = {
  id: string
  inicio: number
  pedido: string
  pedidos: number
  sistemaMs: number
  frente: string | null
  workflow: string | null
  gravou: string[]
  leu: string[]
  rodou: string[]
  passos: string[]
  // Conversa da montagem, da atualização da pasta ou da abertura de um workflow numa conversa nova: não entra.
  deSistema: boolean
}

// Um cartão de workflow, como o painel de trabalho o mostra (0.2.19): todos os cartões de frentes/*/workflows/ e workflows/.
export type Workflow = {
  // O caminho do cartão, relativo à pasta.
  arquivo: string
  frente: string | null
  nome: string
  pedido: string | null
  processo: string | null
  combinado: string | null
  estado: 'incompleto' | 'em andamento' | 'completo'
  estadoTexto: string | null
  quadros: Quadro[]
  // Os passos com o nome, para o "ver os passos" (0.3.0).
  lista: Passo[]
  passos: number
  passosSistema: number
  furos: Furo[]
  // O "antes" do cartão (o número de partida), para o fecho de um marco (0.3.0).
  antes: string | null
  // O cartão não se deixa ler: sem o título, sem o pedido e sem passos (0.3.0: "precisa de ajuste").
  ilegivel: boolean
  // Algum passo usa uma skill (a coluna "Com quê" cita skill ou .claude/skills/).
  skill: boolean
  // O cartão diz "Chega sozinho: sim".
  sozinho: boolean
  rodadas: Rodada[]
  // A data da última rodada, em milissegundos (0 sem rodada); a modificação do arquivo desempata.
  quando: number
  mtime: number
}

export type Painel = {
  nivel: Nivel
  iniciada: boolean
  concluida: boolean
  blocos: Bloco[]
  processo: string | null
  antes: string | null
  // O primeiro workflow (0.2.17): as opções do passo 2, a escolhida (pelo pedido), as não escolhidas e o tempo da montagem.
  opcoes: Opcao[]
  escolhido: string | null
  proximos: string[]
  tempoTotal: string | null
  // O cartão do workflow (0.2.17): o nome do H1, o pedido, o combinado do cartão, o estado e as tabelas.
  workflowNome: string | null
  // O caminho do cartão do primeiro workflow (a linha "Primeiro workflow" do base-camp.md); null antes da 0.2.1.
  workflow: string | null
  pedido: string | null
  combinadoCartao: string | null
  estado: 'incompleto' | 'em andamento' | 'completo'
  estadoTexto: string | null
  passos: number
  passosSistema: number
  rodadas: Rodada[]
  // O painel de trabalho (0.2.19): todos os cartões, o da vez (o arquivo) e a fila, sem repetir e sem os que já têm cartão.
  workflows: Workflow[]
  daVez: string | null
  fila: NaFila[]
  feita: boolean
  combinado: string | null
  testeOk: boolean
  // O motivo gravado em "não passou: <motivo>" ('' sem motivo); null quando o teste não falhou.
  testeFalhou: string | null
  separacaoOk: boolean
  campos: Campo[]
  montado: Montado[]
  resumo: Resumo | null
  // O primeiro nome da pessoa, pelo cartão "Quem você é" do resumo; null sem ele.
  nome: string | null
}

export type Resumo = {
  cartoes: { titulo: string; linhas: { texto: string; duvida: boolean }[] }[]
  falta: string[]
}

export type Aprovacao = {
  arquivo: string | null
}

// Uma etapa que acabou de fechar: o texto da obra e de onde a trilha sai na animação.
export type Festa = {
  texto: string
  anterior: number
}

// A última coisa que a montagem fez (a frase de ToolUse) e a hora local, HH:MM.
export type UltimaAcao = {
  texto: string
  hora: string
}

declare module 'claude-code' {
  // A ferramenta do teste da etapa 6, que o próprio mod registra.
  interface McpToolInputs {
    'mcp__business-creator__teste_do_base_camp': { pergunta: string }
  }

  interface PluginState {
    'business-creator': {
      painel: Painel | null
      pasta: string
      sessao: string
      logo: string
      icones: Record<string, string>
      enviado: string | null
      turno: string | null
      trabalhando: boolean
      atividade: string | null
      palavra: string | null
      ultimaAcao: UltimaAcao | null
      aprovacao: Aprovacao | null
      ultimo: string | null
      festa: Festa | null
      fim: number | null
      parado: boolean
      verArquivo: boolean
      arquivoTexto: string | null
      doc: 'guia' | 'resumo' | null
      docTexto: string | null
      pergunta: string | null
      filaAberta: boolean
      passosAbertos: string[]
      // O marco com a explicação aberta, pelo "i" da legenda da subida (0.3.2).
      marcoAberto: string | null
      aAbrir: string | null
      conversa: Conversa | null
      diarioFalhou: boolean
    }
  }
}
