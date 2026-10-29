"""Monta a pasta da pessoa (o esqueleto), que recebe o método pelo plugin Business Creator.

A pasta leva só o que é dela: o AGENTS.md, o CLAUDE.md, o base-camp.md, a montagem/respostas.md
e o .claude/settings.json, que já aponta para o marketplace sem-ia, com a atualização ligada, e
liga o plugin. A montagem, o painel e o estilo de resposta chegam pelo plugin, quando a pessoa
confia na pasta no app; cada correção chega como versão nova do plugin, sem zip novo.

O esqueleto fica em esqueleto/ com nomes que não ligam sozinhos (AGENTS.md.modelo, CLAUDE.md.modelo,
settings.json fora de .claude/): guardado com os nomes de verdade, ele tomaria qualquer sessão
aberta dentro do ARTHUR-OS.

Uso:
  python3 montar-pasta.py completo --saida <pasta fora do OS>   -> <saida>/meu-os
  python3 montar-pasta.py leve --saida <pasta fora do OS>
  python3 montar-pasta.py completo --zip                          -> entrega/meu-os-plugin-completo.zip
"""
from __future__ import annotations

import re
import shutil
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
ESQUELETO = AQUI / "esqueleto"


def raiz_do_os() -> Path | None:
    for pasta in AQUI.parents:
        if (pasta / "AGENTS.md").exists() and (pasta / "laboratorio-os").is_dir():
            return pasta
    return None


def montar(destino: Path, nivel: str) -> Path:
    pasta = destino / "meu-os"
    if pasta.exists():
        sys.exit(f"Já existe: {pasta}")
    (pasta / "montagem").mkdir(parents=True)
    (pasta / ".claude").mkdir()
    shutil.copy(ESQUELETO / "AGENTS.md.modelo", pasta / "AGENTS.md")
    shutil.copy(ESQUELETO / "CLAUDE.md.modelo", pasta / "CLAUDE.md")
    shutil.copy(ESQUELETO / "montagem/respostas.md", pasta / "montagem/respostas.md")
    shutil.copy(ESQUELETO / "settings.json", pasta / ".claude/settings.json")
    base = (ESQUELETO / "base-camp.md").read_text()
    base, trocas = re.subn(r"(\*\*Nível:\*\*) \w+", rf"\1 {nivel}", base)
    if trocas != 1:
        sys.exit("O base-camp.md do esqueleto não tem a linha do nível.")
    (pasta / "base-camp.md").write_text(base)
    return pasta


def main() -> None:
    args = sys.argv[1:]
    if not args or args[0] not in ("completo", "leve"):
        sys.exit(__doc__)
    nivel = args[0]
    if "--saida" in args:
        saida = Path(args[args.index("--saida") + 1]).expanduser().resolve()
        os_raiz = raiz_do_os()
        if os_raiz and (saida == os_raiz or os_raiz in saida.parents):
            sys.exit("Monte fora do ARTHUR-OS: dentro dele, a pasta herda o AGENTS.md da raiz.")
        print(montar(saida, nivel))
        return
    if "--zip" in args:
        with tempfile.TemporaryDirectory() as tmp:
            montar(Path(tmp), nivel)
            (AQUI / "entrega").mkdir(exist_ok=True)
            print(shutil.make_archive(str(AQUI / "entrega" / f"meu-os-plugin-{nivel}"), "zip",
                                      root_dir=tmp, base_dir="meu-os"))
        return
    sys.exit(__doc__)


if __name__ == "__main__":
    main()
