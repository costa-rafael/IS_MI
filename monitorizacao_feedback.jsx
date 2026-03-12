import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";

const EXEMPLO = {
  fileName: "dados_exemplo",
  totalRespostas: 10,
  positivos: [
    "Aulas dinâmicas",
    "Professora disponível",
    "Bom equilíbrio entre teoria e prática",
    "Material claro no Moodle",
    "Exercícios úteis em aula",
  ],
  negativos: [
    "Ritmo rápido em alguns tópicos",
    "Pouco tempo para dúvidas",
    "Sala pouco confortável",
    "Avaliações concentradas",
    "Instruções por vezes ambíguas",
  ],
};

const STOP_WORDS = new Set([
  "a",
  "o",
  "as",
  "os",
  "de",
  "do",
  "da",
  "dos",
  "das",
  "e",
  "em",
  "na",
  "no",
  "nas",
  "nos",
  "para",
  "com",
  "que",
  "um",
  "uma",
  "é",
  "por",
  "ao",
  "à",
]);

const estilos = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif; color: #0f172a; background: #f8fafc; }
  .page { min-height: 100vh; padding: 32px 16px 48px; }
  .container { max-width: 1000px; margin: 0 auto; }
  .hero { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; box-shadow: 0 8px 20px rgba(15,23,42,.05); }
  h1 { margin: 0 0 6px; font-size: clamp(1.4rem, 2.2vw, 2rem); }
  .muted { color: #475569; margin: 0; }
  .row { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
  .btn { border: 1px solid #cbd5e1; background: white; color: #0f172a; border-radius: 10px; padding: 9px 12px; font-weight: 600; cursor: pointer; }
  .btn:hover { background: #f1f5f9; }
  .cards { margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: 12px; }
  .card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; }
  .k { font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: #64748b; }
  .v { margin-top: 6px; font-size: 28px; font-weight: 700; }
  .grid { margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px,1fr)); gap: 12px; }
  .panel { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; }
  .panel h2 { margin: 0 0 10px; font-size: 1.05rem; }
  ul { margin: 0; padding-left: 18px; }
  li { margin-bottom: 8px; color: #1e293b; }
  .tag { display: inline-flex; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; border-radius: 999px; padding: 4px 10px; margin: 4px 6px 0 0; font-size: 13px; }
  .dropzone { margin-top: 14px; border: 2px dashed #93c5fd; background: #f8fbff; border-radius: 12px; padding: 14px; color: #1e3a8a; }
`;

function extrairTemas(textos) {
  const map = new Map();
  const palavras = textos
    .join(" ")
    .toLowerCase()
    .replace(/[^\p{L}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w));

  for (const palavra of palavras) {
    map.set(palavra, (map.get(palavra) || 0) + 1);
  }

  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([palavra, qtd]) => `${palavra} (${qtd})`);
}

function lerExcel(file) {
  return file.arrayBuffer().then((buffer) => {
    const wb = XLSX.read(buffer, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });

    const headers = (rows[0] || []).map((h) => String(h || ""));
    const positivos = [];
    const negativos = [];

    for (let r = 1; r < rows.length; r++) {
      for (let c = 0; c < headers.length; c++) {
        const valor = String(rows[r]?.[c] || "").trim();
        if (!valor) continue;

        const h = headers[c].toLowerCase();
        if (h.includes("positivo")) positivos.push(valor);
        if (h.includes("negativo")) negativos.push(valor);
      }
    }

    return {
      fileName: file.name.replace(/\.[^.]+$/, ""),
      totalRespostas: Math.max(rows.length - 1, 0),
      positivos,
      negativos,
    };
  });
}

export default function MonitorizacaoFeedbackApp() {
  const [data, setData] = useState(EXEMPLO);
  const [erro, setErro] = useState("");
  const inputRef = useRef(null);

  const ratioPositivo = useMemo(() => {
    const total = data.positivos.length + data.negativos.length;
    if (!total) return 0;
    return Math.round((data.positivos.length / total) * 100);
  }, [data]);

  const temasPositivos = useMemo(() => extrairTemas(data.positivos), [data.positivos]);
  const temasNegativos = useMemo(() => extrairTemas(data.negativos), [data.negativos]);

  const carregar = async (file) => {
    if (!file) return;
    try {
      const parsed = await lerExcel(file);
      if (!parsed.positivos.length && !parsed.negativos.length) {
        setErro("Não foram encontradas colunas com 'positivo' ou 'negativo'.");
        return;
      }
      setErro("");
      setData(parsed);
    } catch {
      setErro("Falha ao ler o ficheiro Excel.");
    }
  };

  return (
    <>
      <style>{estilos}</style>
      <main className="page">
        <div className="container">
          <section className="hero">
            <h1>Monitorização Intercalar</h1>
            <p className="muted">Interface refeita de raiz com foco em legibilidade e contraste.</p>

            <div className="row">
              <button className="btn" onClick={() => inputRef.current?.click()}>
                Carregar ficheiro Excel
              </button>
              <button
                className="btn"
                onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 2))}
              >
                Copiar dados (JSON)
              </button>
              <input
                ref={inputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: "none" }}
                onChange={(e) => carregar(e.target.files?.[0])}
              />
            </div>

            <div className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => {
              e.preventDefault();
              carregar(e.dataTransfer.files?.[0]);
            }}>
              Arraste aqui um ficheiro .xlsx/.xls para atualizar a análise.
            </div>
            {erro ? <p style={{ color: "#b91c1c", marginBottom: 0 }}>{erro}</p> : null}
          </section>

          <section className="cards">
            <article className="card"><div className="k">Ficheiro</div><div className="v" style={{ fontSize: 20 }}>{data.fileName}</div></article>
            <article className="card"><div className="k">Respostas</div><div className="v">{data.totalRespostas}</div></article>
            <article className="card"><div className="k">Positivos</div><div className="v" style={{ color: "#166534" }}>{data.positivos.length}</div></article>
            <article className="card"><div className="k">Negativos</div><div className="v" style={{ color: "#991b1b" }}>{data.negativos.length}</div></article>
            <article className="card"><div className="k">Balanço positivo</div><div className="v" style={{ color: "#1d4ed8" }}>{ratioPositivo}%</div></article>
          </section>

          <section className="grid">
            <article className="panel">
              <h2>Comentários positivos</h2>
              <ul>{data.positivos.slice(0, 10).map((p, i) => <li key={i}>{p}</li>)}</ul>
            </article>
            <article className="panel">
              <h2>Comentários negativos</h2>
              <ul>{data.negativos.slice(0, 10).map((n, i) => <li key={i}>{n}</li>)}</ul>
            </article>
            <article className="panel">
              <h2>Temas mais citados (positivos)</h2>
              {temasPositivos.map((t) => <span className="tag" key={t}>{t}</span>)}
            </article>
            <article className="panel">
              <h2>Temas mais citados (negativos)</h2>
              {temasNegativos.map((t) => <span className="tag" key={t}>{t}</span>)}
            </article>
          </section>
        </div>
      </main>
    </>
  );
}
