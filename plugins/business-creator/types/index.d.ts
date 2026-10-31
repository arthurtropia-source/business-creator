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
  estado: 'ok' | 'pulada' | 'falta'
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
  feita: boolean
  combinado: string | null
  testeOk: boolean
  separacaoOk: boolean
  campos: Campo[]
  montado: Montado[]
}

export type Aprovacao = {
  arquivo: string | null
}

// Uma etapa que acabou de fechar: o texto da obra e de onde a trilha sai na animação.
export type Festa = {
  texto: string
  anterior: number
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
      aprovacao: Aprovacao | null
      ultimo: string | null
      festa: Festa | null
      fim: number | null
      parado: boolean
      verArquivo: boolean
      arquivoTexto: string | null
      doc: 'guia' | 'resumo' | null
      docTexto: string | null
    }
  }
}
