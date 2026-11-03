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
  pedido: string | null
  combinadoCartao: string | null
  estado: 'incompleto' | 'em andamento' | 'completo'
  estadoTexto: string | null
  passos: number
  passosSistema: number
  rodadas: Rodada[]
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
    }
  }
}
