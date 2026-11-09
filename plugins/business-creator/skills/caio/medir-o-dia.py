# medir-o-dia.py · versao 1 (plugin Business Creator 0.3.7)
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
#   Conferir a copia: python rotinas\medir-o-dia.py --versao   (imprime "medir-o-dia versao 1")
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

import json
import os
import re
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

PAUSA = timedelta(minutes=15)
VERSAO = 1
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
    r = {"tarefas": 0, "entregues": 0, "esperando": 0, "travadas": 0, "em_andamento": 0, "decisoes_abertas": 0}
    arq = pasta / "dia" / f"tarefas-{dia:%Y-%m}.md"
    marca = f"{dia:%d/%m}"
    if arq.exists():
        for linha in arq.read_text(encoding="utf-8").splitlines():
            if not linha.startswith(f"- {marca}"):
                continue
            r["tarefas"] += 1
            # o resultado e o campo logo depois do "via:"; "repete" e "virou" vem depois e nao contam
            campos = [c.strip().lower() for c in linha.split(" · ")]
            i = next((k for k, c in enumerate(campos) if c.startswith("via:")), None)
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
    destino = pasta / "dia" / f"medida-{dia:%Y-%m-%d}.md"
    destino.parent.mkdir(exist_ok=True)
    destino.write_text(texto, encoding="utf-8")
    print(texto)
    print(f"Gravado em dia/medida-{dia:%Y-%m-%d}.md")


if __name__ == "__main__":
    main()
