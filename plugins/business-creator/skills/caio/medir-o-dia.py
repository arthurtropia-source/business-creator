# medir-o-dia.py · versao 2 (plugin Business Creator 0.4.0)
#
# O que faz: mede um dia de trabalho nesta pasta, so com contagens, a partir do historico das conversas
# que o app do Claude guarda no computador (~/.claude/projects/). Nada do conteudo sai: nem pedido, nem
# nome de arquivo, nem numero de trabalho. So minutos, quantidades e porcentagens.
# De onde vem: os arquivos .jsonl das conversas abertas nesta pasta (e nas subpastas dela), mais o
# registro do dia (dia/tarefas-AAAA-MM.md) e a fila de decisoes (dia/fila.md), se existirem.
# O que sai: imprime a medida e grava dia/medida-AAAA-MM-DD.md (reescrito a cada execucao).
# Como conferir: a linha "Conversas lidas" tem de bater com as conversas que voce abriu no dia; se der
# zero, o caminho do historico esta errado e a rotina para com a mensagem.
#
# Uso (a partir da pasta da pessoa):
#   Mac:     python3 rotinas/medir-o-dia.py [AAAA-MM-DD]
#   Windows: python rotinas\medir-o-dia.py [AAAA-MM-DD]   (ou: py rotinas\medir-o-dia.py)
#   Conferir a copia: python rotinas\medir-o-dia.py --versao   (imprime "medir-o-dia versao 2")
# Sem data, mede o dia de hoje. So a biblioteca padrao do Python.
#
# As definicoes (iguais as da avaliacao da primeira implantacao, 30/10/2026, para comparar):
# - tempo de conversa: a soma dos intervalos entre os registros de cada conversa, tirando as pausas
#   (intervalo de mais de 15 min sem nada acontecendo); a espera por aprovacao conta inteira;
# - espera por aprovacao: da hora em que o sistema pediu para usar uma ferramenta ate a resposta, so
#   quando foi a pessoa que aprovou ou recusou na janela do app;
# - toques: as mensagens escritas pela pessoa (os cliques dos botoes do painel contam, porque mandam
#   uma mensagem por ela); nao contam as mensagens que uma conversa manda para outra;
#   (a espera e "no maximo": inclui o tempo de rodar o que foi aprovado, que nao se separa no historico)
# - falhas tecnicas: resultados de ferramenta com erro; "em sequencia" e o mesmo tipo de ferramenta
#   falhando 3 vezes ou mais seguidas na mesma conversa.
#
# Versao 2: quatro contagens novas, no fim da medida (secao "O uso (versao 2)"), todas sem conteudo:
# - minutos ate a primeira entrega: do inicio da montagem (base-camp.md, linha "D · O comeco", coluna
#   Inicio, DD/MM/AAAA HH:MM) ate a primeira tarefa entregue do dia (primeira linha do dia em
#   dia/tarefas-AAAA-MM.md com " · entregue:"); so quando o dia medido e o dia em que a montagem
#   comecou; sem base-camp.md, sem a hora ou sem entrega no dia, a linha nao aparece;
# - tarefas entregues nos ultimos 7 dias: o dia medido e os 6 anteriores, 7 numeros do mais antigo ao
#   mais novo (o caderno e um arquivo por mes, a janela pode pegar dois);
# - palavras do metodo nas respostas do sistema, no dia medido: so o texto das respostas do assistente
#   (nao conta chamada nem resultado de ferramenta, nem mensagem da pessoa), sem diferenciar maiuscula,
#   palavra inteira: workflow, cartao, rodada, Campo 1, Campo 2, Campo 3, Mera, Island, Lobuche, skill,
#   prompt, token, sessao; sai o total e, entre parenteses, so as palavras com contagem maior que zero;
# - Dia 1: n de 4, so quando o dia medido e o dia em que a montagem comecou ou terminou ("Concluida em"
#   do base-camp.md): (a) os arquivos do sistema existem, (b) o base-camp.md tem "Quem sou eu: passou",
#   (c) ha tarefa entregue no dia, (d) esta medida foi gravada; depois do numero, o que faltou em palavras
#   fixas, e a parte, se dia/passagem.md existe (nao entra no numero);
# - feito fora do sistema: as linhas do dia com "via: fora" no caderno (o que a pessoa contou que fez
#   ou vai fazer fora daqui). Essas linhas nao entram em nenhuma contagem da tabela (tarefas registradas,
#   entregues, esperando, travadas, em andamento, toques por tarefa) nem nas entregas dos 7 dias.
# O trecho "levou: <n> min" da linha nao entra na medida.
# Se uma contagem nova falhar, as de antes saem do mesmo jeito.

import json
import os
import re
import sys
import unicodedata
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

PAUSA = timedelta(minutes=15)
VERSAO = 2
ESPERA_MAX = timedelta(hours=2)  # uma janela esquecida aberta a noite toda nao vira "espera do dia"


def codificar(caminho: str) -> str:
    return re.sub(r"[^A-Za-z0-9]", "-", caminho)


def quando(texto):
    try:
        return datetime.fromisoformat(texto.replace("Z", "+00:00")).astimezone()
    except (AttributeError, ValueError):
        return None


def base_do_historico() -> Path:
    config = os.environ.get("CLAUDE_CONFIG_DIR")
    return (Path(config) if config else Path.home() / ".claude") / "projects"


def historicos(pasta: Path):
    base = base_do_historico()
    if not base.is_dir():
        return []
    alvo = codificar(str(pasta)).lower()
    achados, exata = [], False
    pastas = [d for d in base.iterdir() if d.is_dir()]
    for d in pastas:
        nome = d.name.lower()
        if nome == alvo:
            exata = True
            achados.extend(d.glob("*.jsonl"))
        elif nome.startswith(alvo + "-"):
            # subpasta da pasta (ou uma pasta com nome parecido): confere pelo cwd gravado
            achados.extend(f for f in d.glob("*.jsonl") if cwd_de(f, pasta))
    if not exata:
        # caminho longo: o app pode encurtar o nome da pasta do historico; procura pelo cwd gravado
        for d in pastas:
            if d.name.lower() != alvo and not d.name.lower().startswith(alvo + "-"):
                achados.extend(f for f in d.glob("*.jsonl") if cwd_de(f, pasta))
    return achados


def cwd_de(f: Path, pasta: Path) -> bool:
    raiz = str(pasta).rstrip("\\/").lower()
    try:
        with f.open(encoding="utf-8", errors="replace") as h:
            for i, linha in enumerate(h):
                if i > 50:
                    break
                try:
                    d = json.loads(linha)
                except ValueError:
                    continue
                c = d.get("cwd")
                if c:
                    c = c.rstrip("\\/").lower()
                    return c == raiz or c.startswith(raiz + os.sep.lower()) or c.startswith(raiz + "/")
    except (OSError, ValueError):
        return False
    return False


def mensagem_da_pessoa(d) -> bool:
    if d.get("type") != "user" or d.get("isMeta") or d.get("isSidechain"):
        return False
    origem = d.get("turnOrigin")
    if origem is not None:
        return origem == "human"
    if d.get("promptSource") == "system":
        return False
    conteudo = (d.get("message") or {}).get("content")
    if isinstance(conteudo, list):
        if any(isinstance(b, dict) and b.get("type") == "tool_result" for b in conteudo):
            return False
        texto = " ".join(b.get("text", "") for b in conteudo if isinstance(b, dict))
    else:
        texto = conteudo or ""
    texto = texto.strip()
    return bool(texto) and not texto.startswith("<")


def ler_conversa(f: Path, dia: date):
    registros = []
    try:
        h = f.open(encoding="utf-8", errors="replace")
    except OSError:
        return registros
    with h:
        for linha in h:
            try:
                d = json.loads(linha)
            except ValueError:
                continue
            if not isinstance(d, dict) or d.get("isSidechain"):
                continue
            t = quando(d.get("timestamp"))
            if t is None or t.date() != dia:
                continue
            registros.append((t, d))
    registros.sort(key=lambda x: x[0])
    return registros


def medir(pasta: Path, dia: date):
    arquivos = historicos(pasta)
    m = {
        "conversas": 0, "abertas_por_outra": 0, "tempo": timedelta(), "espera": timedelta(),
        "aprovacoes": 0, "recusas": 0, "esperas_longas": 0, "toques": 0, "falhas": 0,
        "falhas_em_sequencia": 0, "resumos": 0,
    }
    for f in arquivos:
        regs = ler_conversa(f, dia)
        if not regs:
            continue
        m["conversas"] += 1
        primeira = next((d for _, d in regs if d.get("type") == "user" and not d.get("isMeta")), None)
        if primeira is not None and primeira.get("turnOrigin") in ("sdk", "peer"):
            m["abertas_por_outra"] += 1
        pedidos = {}  # id da ferramenta -> (hora, nome)
        espera_aqui = []  # intervalos de espera, para nao virarem pausa
        seguidas, ultima_falha = 0, None
        for t, d in regs:
            if d.get("type") == "system" and "Compacted" in str(d.get("content", "")):
                m["resumos"] += 1
            if mensagem_da_pessoa(d):
                m["toques"] += 1
            conteudo = (d.get("message") or {}).get("content")
            if not isinstance(conteudo, list):
                continue
            for b in conteudo:
                if not isinstance(b, dict):
                    continue
                if b.get("type") == "tool_use":
                    pedidos[b.get("id")] = (t, b.get("name", ""))
                elif b.get("type") == "tool_result":
                    origem = pedidos.get(b.get("tool_use_id"))
                    decisao = d.get("permissionDecision") or {}
                    if origem and str(decisao.get("source", "")).startswith("user"):
                        intervalo = min(t - origem[0], ESPERA_MAX)
                        m["espera"] += intervalo
                        espera_aqui.append((origem[0], t))
                        if decisao.get("decision") == "reject":
                            m["recusas"] += 1
                        else:
                            m["aprovacoes"] += 1
                        if intervalo > timedelta(minutes=2):
                            m["esperas_longas"] += 1
                    if b.get("is_error") and decisao.get("decision") != "reject":
                        m["falhas"] += 1
                        nome = origem[1] if origem else ""
                        seguidas = seguidas + 1 if nome == ultima_falha else 1
                        ultima_falha = nome
                        if seguidas == 3:
                            m["falhas_em_sequencia"] += 1
                    else:
                        seguidas, ultima_falha = 0, None
        # o tempo: soma dos intervalos, sem as pausas; a espera conta inteira
        for (t0, _), (t1, _) in zip(regs, regs[1:]):
            passo = t1 - t0
            dentro_da_espera = any(a <= t0 and t1 <= b for a, b in espera_aqui)
            if passo <= PAUSA or dentro_da_espera:
                m["tempo"] += min(passo, ESPERA_MAX)
    return m


def registro(pasta: Path, dia: date):
    r = {"tarefas": 0, "entregues": 0, "esperando": 0, "travadas": 0, "em_andamento": 0, "decisoes_abertas": 0,
         "fora": 0}
    arq = pasta / "dia" / f"tarefas-{dia:%Y-%m}.md"
    marca = f"{dia:%d/%m}"
    if arq.exists():
        for linha in arq.read_text(encoding="utf-8").splitlines():
            if not linha.startswith(f"- {marca}"):
                continue
            r["tarefas"] += 1
            # o resultado e o campo logo depois do "via:"; "levou", "com", "repete" e "virou" vem depois e nao contam
            campos = [c.strip().lower() for c in linha.split(" · ")]
            i = next((k for k, c in enumerate(campos) if c.startswith("via:")), None)
            if i is not None and campos[i].startswith("via: fora"):
                # feito fora do sistema: so a contagem propria, fora das da tabela
                r["tarefas"] -= 1
                r["fora"] += 1
                continue
            resultado = campos[i + 1] if i is not None and i + 1 < len(campos) else ""
            if resultado.startswith("entregue"):
                r["entregues"] += 1
            elif resultado.startswith("travou"):
                r["travadas"] += 1
            elif resultado.startswith("esperando"):
                r["esperando"] += 1
            else:
                r["em_andamento"] += 1
    fila = pasta / "dia" / "fila.md"
    if fila.exists():
        r["decisoes_abertas"] = sum(1 for l in fila.read_text(encoding="utf-8").splitlines()
                                    if l.startswith("- ") and "· aberta" in l)
    return r


# ---------------------------------------------------------------- versao 2: contagens novas

PALAVRAS = [
    ("workflow", r"workflows?"), ("cartão", r"cart(?:ão|ões)"), ("rodada", r"rodadas?"),
    ("Campo 1", r"campo\s+1"), ("Campo 2", r"campo\s+2"), ("Campo 3", r"campo\s+3"),
    ("Mera", r"mera"), ("Island", r"island"), ("Lobuche", r"lobuche"),
    ("skill", r"skills?"), ("prompt", r"prompt"), ("token", r"tokens?"), ("sessão", r"sess(?:ão|ões)"),
]
PALAVRAS_RE = [(nome, re.compile(r"(?<!\w)" + padrao + r"(?!\w)", re.IGNORECASE)) for nome, padrao in PALAVRAS]
DATA_HORA = re.compile(r"(\d{1,2})/(\d{1,2})/(\d{4})\s+(\d{1,2}):(\d{2})")
LINHA_HORA = re.compile(r"^- (\d{2})/(\d{2}) (\d{2}):(\d{2})")


def ler_texto(arq: Path):
    try:
        return arq.read_text(encoding="utf-8", errors="replace")
    except (OSError, ValueError):
        return None


def texto_do_assistente(d) -> str:
    if d.get("type") != "assistant":
        return ""
    conteudo = (d.get("message") or {}).get("content")
    if isinstance(conteudo, str):
        return conteudo
    if isinstance(conteudo, list):
        return "\n".join(b.get("text", "") for b in conteudo
                         if isinstance(b, dict) and b.get("type") == "text" and isinstance(b.get("text"), str))
    return ""


def contar_palavras(pasta: Path, dia: date):
    cont = {nome: 0 for nome, _ in PALAVRAS}
    for f in historicos(pasta):
        for _, d in ler_conversa(f, dia):
            texto = unicodedata.normalize("NFC", texto_do_assistente(d))
            if not texto:
                continue
            for nome, rx in PALAVRAS_RE:
                cont[nome] += len(rx.findall(texto))
    return cont


def base_camp(pasta: Path):
    """Do base-camp.md: inicio (datetime ou None), data de conclusao (date ou None), nivel completo, quem sou eu passou."""
    texto = ler_texto(pasta / "base-camp.md")
    if texto is None:
        return None
    b = {"inicio": None, "concluida": None, "completo": False, "quem_sou_eu": False}
    linhas = texto.splitlines()
    cabecalho = None
    for l in linhas:
        s = l.strip()
        if s.startswith("|") and "início" in s.lower() and not s.startswith("| D"):
            cabecalho = [c.strip().lower() for c in s.strip("|").split("|")]
        if s.startswith("| D · O começo |"):
            celulas = [c.strip() for c in s.strip("|").split("|")]
            alvo = None
            if cabecalho:
                idx = next((k for k, c in enumerate(cabecalho) if c.startswith("início")), None)
                if idx is not None and idx < len(celulas):
                    alvo = celulas[idx]
            else:
                alvo = s
            m = DATA_HORA.search(alvo or "")
            if m:
                try:
                    b["inicio"] = datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)),
                                           int(m.group(4)), int(m.group(5)))
                except ValueError:
                    pass
        if s.startswith("- **Concluída em:**"):
            m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", s)
            if m:
                try:
                    b["concluida"] = date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
                except ValueError:
                    pass
        if "**Nível:** completo" in s:
            b["completo"] = True
        if s.startswith("- **Quem sou eu:** passou"):
            b["quem_sou_eu"] = True
    return b


def linha_fora(linha: str) -> bool:
    return any(c.strip().lower().startswith("via: fora") for c in linha.split(" · "))


def linha_entregue(linha: str) -> bool:
    if linha_fora(linha):
        return False
    if " · entregue:" in linha:
        return True
    campos = [c.strip().lower() for c in linha.split(" · ")]
    i = next((k for k, c in enumerate(campos) if c.startswith("via:")), None)
    return i is not None and i + 1 < len(campos) and campos[i + 1].startswith("entregue")


def linhas_do_dia(pasta: Path, dia: date, cache: dict):
    chave = f"{dia:%Y-%m}"
    if chave not in cache:
        texto = ler_texto(pasta / "dia" / f"tarefas-{chave}.md")
        cache[chave] = texto.splitlines() if texto is not None else []
    marca = f"- {dia:%d/%m}"
    return [l for l in cache[chave] if l.startswith(marca)]


def entregues_em(pasta: Path, dia: date, cache: dict) -> int:
    return sum(1 for l in linhas_do_dia(pasta, dia, cache) if linha_entregue(l))


def primeira_entrega(pasta: Path, dia: date, cache: dict):
    horas = []
    for l in linhas_do_dia(pasta, dia, cache):
        if linha_entregue(l):
            m = LINHA_HORA.match(l)
            if m:
                try:
                    horas.append(datetime(dia.year, dia.month, dia.day, int(m.group(3)), int(m.group(4))))
                except ValueError:
                    pass
    return min(horas) if horas else None


def arquivos_do_sistema(pasta: Path, bc):
    """Lista fixa do que falta dos arquivos do sistema (vazia = tudo certo)."""
    falta = []
    agents = ler_texto(pasta / "AGENTS.md")
    if agents is None or "sistema em montagem" in agents.lower() or "montagem em andamento" in agents.lower():
        falta.append("AGENTS.md")
    for rel in ("contexto/sobre-mim.md", "contexto/como-trabalhar-comigo.md", "contexto/computador.md", "memoria.md"):
        if not (pasta / rel).is_file():
            falta.append(rel)
    if bc and bc["completo"]:
        try:
            achou = any(p.is_file() for p in (pasta / "frentes").glob("*/AGENTS.md"))
        except OSError:
            achou = False
        if not achou:
            falta.append("frentes/*/AGENTS.md")
    return falta


def uso_v2(pasta: Path, dia: date, fora=None):
    """As linhas da secao da versao 2. Cada contagem falha sozinha: se uma quebrar, as outras saem."""
    linhas = []
    cache, bc = {}, None
    try:
        bc = base_camp(pasta)
    except Exception:
        bc = None
    try:
        if bc and bc["inicio"] and bc["inicio"].date() == dia:
            primeira = primeira_entrega(pasta, dia, cache)
            if primeira is not None and primeira >= bc["inicio"]:
                linhas.append(f"- Minutos do início da montagem até a primeira tarefa entregue: "
                              f"{minutos(primeira - bc['inicio'])} min")
    except Exception:
        pass
    try:
        serie = [entregues_em(pasta, dia - timedelta(days=k), cache) for k in range(6, -1, -1)]
        linhas.append("- Tarefas entregues nos últimos 7 dias (do mais antigo ao mais novo): "
                      + " ".join(str(n) for n in serie))
    except Exception:
        pass
    try:
        cont = contar_palavras(pasta, dia)
        total = sum(cont.values())
        achadas = ", ".join(f"{nome} {n}" for nome, _ in PALAVRAS for n in [cont[nome]] if n > 0)
        linhas.append(f"- Palavras do método nas respostas: {total}" + (f" ({achadas})" if achadas else ""))
    except Exception:
        pass
    if fora is not None:
        linhas.append(f'- Feito fora do sistema (linhas "via: fora"): {fora}')
    try:
        if bc and ((bc["inicio"] and bc["inicio"].date() == dia) or bc["concluida"] == dia):
            faltas = []
            sistema = arquivos_do_sistema(pasta, bc)
            if sistema:
                faltas.append("os arquivos do sistema (" + ", ".join(sistema) + ")")
            if not bc["quem_sou_eu"]:
                faltas.append('o teste "quem sou eu"')
            if entregues_em(pasta, dia, cache) < 1:
                faltas.append("a primeira tarefa entregue")
            n = 4 - len(faltas)  # o item (d), esta medida gravada, vale sempre que o script grava
            linhas.append(f"- Dia 1: {n} de 4" + (f" (falta: {'; '.join(faltas)})" if faltas else ""))
            linhas.append("- passagem: " + ("gravada" if (pasta / "dia" / "passagem.md").is_file() else "ainda não"))
    except Exception:
        pass
    return linhas


def minutos(td: timedelta) -> int:
    return round(td.total_seconds() / 60)


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass
    if "--versao" in sys.argv:
        print(f"medir-o-dia versao {VERSAO}")
        return
    pasta = Path.cwd()
    dia = date.today()
    if len(sys.argv) > 1:
        try:
            dia = date.fromisoformat(sys.argv[1])
        except ValueError:
            sys.exit("Data no formato AAAA-MM-DD, por exemplo 2026-11-10.")
    m = medir(pasta, dia)
    if m["conversas"] == 0:
        sys.exit(f"Nenhuma conversa desta pasta em {dia:%d/%m/%Y} no historico do app "
                 f"(procurei em {base_do_historico()}). Nada foi gravado.")
    r = registro(pasta, dia)
    tempo = minutos(m["tempo"])
    espera = minutos(m["espera"])
    pct = round(100 * espera / tempo) if tempo else 0
    toques_por_tarefa = f"{m['toques'] / r['tarefas']:.1f}".replace(".", ",") if r["tarefas"] else "sem registro"
    texto = f"""# Medida do dia {dia:%d/%m/%Y}
> Gerada por `rotinas/medir-o-dia.py` (versão {VERSAO}). Só contagens: nenhum pedido, nome de arquivo ou número de trabalho.

| Medida | Hoje |
|---|---|
| Conversas lidas | {m['conversas']} (abertas pelo CAIO: {m['abertas_por_outra']}) |
| Tempo de conversa, sem as pausas | {tempo} min |
| Espera por aprovação (no máximo) | {espera} min ({pct}% do tempo); {m['aprovacoes']} aprovações e {m['recusas']} recusas na janela do app; {m['esperas_longas']} esperas de mais de 2 min |
| Tarefas registradas | {r['tarefas']}: {r['entregues']} entregues, {r['esperando']} esperando você, {r['travadas']} travadas, {r['em_andamento']} em andamento |
| Toques (mensagens suas) | {m['toques']} ({toques_por_tarefa} por tarefa) |
| Falhas técnicas | {m['falhas']}; {m['falhas_em_sequencia']} em sequência (3 ou mais seguidas) |
| Decisões esperando você no fim do dia | {r['decisoes_abertas']} |
| Resumos automáticos de conversa longa | {m['resumos']} |
"""
    try:
        extra = uso_v2(pasta, dia, r["fora"])
    except Exception:
        extra = []
    if extra:
        texto += "\n## O uso (versão 2)\n" + "\n".join(extra) + "\n"
    destino = pasta / "dia" / f"medida-{dia:%Y-%m-%d}.md"
    destino.parent.mkdir(exist_ok=True)
    destino.write_text(texto, encoding="utf-8")
    print(texto)
    print(f"Gravado em dia/medida-{dia:%Y-%m-%d}.md")


if __name__ == "__main__":
    main()
