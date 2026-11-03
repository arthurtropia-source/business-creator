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

export type Painel = {
  nivel: Nivel
  iniciada: boolean
  concluida: boolean
  blocos: Bloco[]
  processo: string | null
  antes: string | null
  tarefas: string[]
  // As tarefas que ainda não foram feitas: o painel as oferece em "Peça ao seu sistema" (0.2.16).
  restantes: string[]
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
