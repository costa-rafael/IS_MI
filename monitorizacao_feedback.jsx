import { useState, useRef, useCallback, useEffect } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const STATIC_DATA = {
  positivos: ["Materia interessante","Material interessante","Os temas das aulas são interessantes","Aulas muito interativas","Trabalhar com outras licenciaturas","Informação bem estruturada no Moodle","Aulas interativas","interessante","conhecer pessoas de outros cursos","Aulas tranquilas, bom ambiente para aprender","Professora acessível","Conhecer novas pessoas","Professora acessível, bom ambiente em aula","slides bem estruturados","aula bem estruturada","Clareza em alguns tópicos","Aula e cadeira muito bem estruturada","Material de apoio, Disponibilidade do professor","A cadeira é interessante","Professora disponível","Professora disponível","Os slides estão bem concebidos e os quizzes ajudam a acompanhar a matéria","Pensamento criativo","O professor tira as dúvidas","A matéria é bem lecionada","O quiz no início da aula ajuda muito a entender a matéria","Atividades durante a aula","Exercício durante a aula","Aula interativa com exercícios","É positivo existirem quizzes em aula para testar o conhecimento","A professora mantém as aulas interessantes e faz exercícios connosco","Entregas divididas e faseadas","O professor torna as aulas interessantes","Professora disponível e eficiente","Trabalho em equipa","Professor disponível e eficiente","Professora disponível e que fala com clareza","Quizzes que permitem acompanhar a matéria","Interação com a turma","Não há presenças obrigatórias","Professora explica muito bem e verifica que os alunos perceberam","O conteúdo é interessante","Temos muito tempo para preparar o projeto","Prof explica e ensina bem","Bastante prático","A professora mostra interesse em que os alunos aprendam","Trabalhamos com pessoas de outros cursos","A professora esforça-se para que os alunos aprendam","Tem parte prática para aplicar","A Professora está sempre disposta a ajudar e explicar","Grupos com outras licenciaturas e professores disponíveis","Matéria fácil até agora e professor disposto a ajudar","O professor deixa tudo organizado no Moodle","A professora explica muito bem. As aulas captam a atenção","A matéria é interessante e induz pensamento crítico","É uma cadeira nova com uma professora motivada e disponível","É uma aula dinâmica entre exposição e aplicação de conhecimentos","Professora muito ativa e cooperadora","Matéria apelativa","Aula interativa","Cadeira apelativa","A professora explica bem e num bom ritmo","Os recursos no moodle são bons","A professora consegue explicar bem a matéria de forma fluída","Os powerpoints explicam bem a matéria","Aula dinâmica com uma professora disponível","Professor paciente","Tudo muito bem explicado desde o início"],
  negativos: ["Professor","Ainda não demos matéria relacionada diretamente com IA","PGP 2.0","A cadeira foi criada à pressa","Informações pouco claras no Moodle","Ter aula na multiusos","Ligeiramente desorganizado","Aulas confusas","Moodle com pouca informação","Pouco entusiasmo por parte do professor","Confusão","Secante é só ler powerpoints","Professor não ensina os conteúdos da forma mais correta","Espaço demasiado grande para uma turma","Aulas com os mesmos problemas de Planeamento e Gestão de Projetos do primeiro ano","Conteúdos podiam ser melhores","A forma como ele explica é extremamente confusa e pouco clara","Seria preferível ter uma cadeira de cibersegurança","Testes fora do horário de aulas","A parte do código é confusa","Matéria complica-se muito rapidamente","O professor explica de forma vaga e não é fácil de acompanhar","Os slides são confusos","A cadeira é muito desorganizada. Docentes transmitem informações contraditórias","As aulas são desorganizadas o professor não sabe os conteúdos que tem de lecionar","O projeto é grande demais para a percentagem que vale","Os quizzes serem a descontar é negativo. O método de aulas invertidas é negativo","Teste na data de exame","A matéria aprofunda demasiado certos temas. Programa da UC confuso","Monotonia em sala de aula marcação de testes fora do horário","Fala baixo","Confusão na sala grande","Fala rápido e é difícil acompanhar","O professor não explica","Aulas pouco dinâmicas é sempre um powerpoint","Não há acompanhamento dos grupos como em PGP","Professor não explica nem ensina bem","É uma cópia de uma UC do ano passado","As aulas são só para tirar dúvidas de matéria que aprendemos sozinhos em casa","A sala","Cadeira repetitiva é só uma cópia de projetos com uns extras","Só demos matéria do ano passado até agora","Muita matéria dada em cada aula","PGP 2.0","Grande parte da matéria já foi dada no ano passado em SOV","Demasiada matéria dada por aula","O professor dá a matéria de forma secante","As aulas não são explicativas da matéria. É muito trabalho autónomo","A sala multiusos não é adequada para uma aula","Cadeira desorganizada nunca sei o que se pretende em cada atividade","Os slides só são disponibilizados no final da aula","A exposição da matéria em aula é apressada","Professor marca faltas","Cadeira que existe todos os semestres igual","Pouco interativo","As aulas são pouco produtivas","Muitos tópicos lecionados no secundário","Os grupos não foram bem pensados","Conteúdo repetido para quem esteve em SOV","O ritmo da aula é muito lento","É basicamente planeamento e gestão de projetos outra vez","O professor engana-se constantemente enquanto explica","Não sabe lecionar o conteúdo da cadeira","Testes marcados fora do horário de aula","A sala é demasiado grande para poucas pessoas","Matéria repetida","A matéria é passada a correr e é difícil acompanhar"],
  totalRespostas: 23,
  fileName: "Monitorização Intercalar · 2025/2026 · 1.º Semestre"
};

// ─── LOCAL ANALYSIS ENGINE ────────────────────────────────────────────────────
const THEMES = {
  pos: [
    { key: "professor_pos", label: "Professores disponíveis e acessíveis", keywords: ["disponível","acessível","disposta","disponível","paciente","cooperadora","motivada","esforça","interesse","clara","clareza","fluída","explica bem","bem explicad"] },
    { key: "interativo", label: "Aulas interativas e dinâmicas", keywords: ["interativ","dinâmic","exercício","atividade","quiz","prático","aplicacion"] },
    { key: "conteudo_pos", label: "Conteúdo interessante e apelativo", keywords: ["interessante","apelativ","fixe","engraçad","criativ","pensamento crítico","bem escolhido","importante"] },
    { key: "estrutura_pos", label: "Boa organização e estrutura", keywords: ["estruturad","organizado","moodle","slides","resources","material","recurso","powerpoint"] },
    { key: "colaboracao", label: "Colaboração e trabalho em equipa", keywords: ["equipa","licenciatura","outras curso","conhecer pessoas","grupos","faseada","dividid"] },
  ],
  neg: [
    { key: "professor_neg", label: "Qualidade de ensino dos professores", keywords: ["professor não","não explica","pouco entusiasmo","vaga","confusa","secante","engana","não sabe","pouco clara","não ensina","mal"] },
    { key: "organizacao_neg", label: "Desorganização e falta de clareza", keywords: ["desorganizad","confus","contraditóri","claro","clareza","não sei o que se pretende","à pressa"] },
    { key: "repeticao", label: "Conteúdo repetido de UCs anteriores", keywords: ["pgp","repetid","cópia","ano passado","sov","já vimos","mesmos problemas","igual","outra vez"] },
    { key: "avaliacao", label: "Avaliação e testes fora de horário", keywords: ["teste","fora do horário","exame","quizze","descontar","percentagem"] },
    { key: "espaco", label: "Espaço físico inadequado", keywords: ["sala","multiusos","grande","espaço","turma"] },
    { key: "ritmo", label: "Ritmo e carga de trabalho inadequados", keywords: ["rápido","lento","muita matéria","a correr","apressada","autónomo","sozinho","trabalho autónomo"] },
  ]
};

function countTheme(items, keywords) {
  return items.filter(item =>
    keywords.some(kw => item.toLowerCase().includes(kw.toLowerCase()))
  ).length;
}

function buildThemeCounts(data) {
  const pos = THEMES.pos.map(t => ({ ...t, count: countTheme(data.positivos, t.keywords) }))
    .sort((a, b) => b.count - a.count);
  const neg = THEMES.neg.map(t => ({ ...t, count: countTheme(data.negativos, t.keywords) }))
    .sort((a, b) => b.count - a.count);
  return { pos, neg };
}

function buildSynthesis(data) {
  const themes = buildThemeCounts(data);
  const posR = Math.round(data.positivos.length / (data.positivos.length + data.negativos.length) * 100);

  const posTop = themes.pos.filter(t => t.count > 0).slice(0, 3);
  const negTop = themes.neg.filter(t => t.count > 0).slice(0, 4);

  const posText = posTop.length
    ? `Os aspetos mais valorizados pelos alunos centram-se em: ${posTop.map(t => `${t.label} (${t.count} menções)`).join(", ")}. No geral, ${posR}% dos comentários são positivos, o que indica uma perceção favorável da unidade curricular.`
    : "Não foram identificados padrões positivos significativos.";

  const negText = negTop.length
    ? `As principais preocupações dos alunos são: ${negTop.map(t => `${t.label} (${t.count} menções)`).join("; ")}. Estes problemas são recorrentes e merecem atenção imediata.`
    : "Não foram identificados padrões negativos significativos.";

  const recItems = negTop.slice(0, 4).map((t, i) => {
    const recs = {
      professor_neg: "Rever a metodologia de ensino do docente responsável e considerar sessões de formação pedagógica ou supervisão.",
      organizacao_neg: "Clarificar objetivos e estrutura da UC no Moodle antes do início de cada semana letiva.",
      repeticao: "Diferenciar o conteúdo face a UCs anteriores (PGP, SOV) e tornar explícita a mais-valia desta UC.",
      avaliacao: "Reagendar os momentos de avaliação para o horário letivo oficial e rever o peso dos quizzes na nota final.",
      espaco: "Solicitar uma sala com capacidade adequada ao número de alunos inscritos.",
      ritmo: "Ajustar o ritmo das aulas e reduzir o trabalho autónomo não estruturado.",
    };
    return `${i + 1}. ${recs[t.key] || `Abordar o problema: ${t.label}.`}`;
  });

  const sumText = `Com base em ${data.totalRespostas} respostas de monitorização intercalar, a unidade curricular apresenta um balanço de ${posR}% de comentários positivos e ${100 - posR}% negativos.\n\nOs pontos fortes residem na disponibilidade e qualidade pedagógica de alguns docentes, bem como no carácter interativo de parte das aulas. Os alunos valorizam também a componente colaborativa e o conteúdo quando é apresentado de forma clara.\n\nAs principais críticas recaem sobre a qualidade de ensino de determinados docentes, a desorganização percebida, a repetição de conteúdos de UCs anteriores e a marcação de avaliações fora do horário letivo. Estas questões requerem intervenção prioritária para garantir a satisfação e o aproveitamento dos alunos.`;

  return { posText, negText, recText: recItems.join("\n"), sumText, themes };
}

function buildNotes(data) {
  const themes = buildThemeCounts(data);
  const posR = Math.round(data.positivos.length / (data.positivos.length + data.negativos.length) * 100);

  const common = [
    themes.neg.find(t => t.key === "repeticao") && `Conteúdo repetido de UCs anteriores (PGP/SOV) é mencionado em ${themes.neg.find(t => t.key === "repeticao").count} respostas — o tema mais recorrente nos negativos.`,
    themes.pos.find(t => t.key === "professor_pos") && `Docentes acessíveis e disponíveis surgem em ${themes.pos.find(t => t.key === "professor_pos").count} comentários positivos — o ponto mais valorizado.`,
    themes.neg.find(t => t.key === "organizacao_neg") && `Falta de organização e objetivos pouco claros surge em ${themes.neg.find(t => t.key === "organizacao_neg").count} respostas negativas.`,
  ].filter(Boolean);

  const alerts = [
    themes.neg.find(t => t.key === "professor_neg") && `Qualidade de ensino de determinados docentes é crítica: ${themes.neg.find(t => t.key === "professor_neg").count} alunos referem que o professor não explica ou é confuso.`,
    themes.neg.find(t => t.key === "avaliacao") && `Avaliações fora do horário letivo mencionadas em ${themes.neg.find(t => t.key === "avaliacao").count} respostas — situação com impacto direto na relação pedagógica.`,
    posR < 55 && `Balanço próximo do equilíbrio (${posR}% positivo) — indicador de insatisfação significativa que requer acompanhamento.`,
    themes.neg.find(t => t.key === "espaco") && `Inadequação do espaço físico (sala multiusos) é referida em ${themes.neg.find(t => t.key === "espaco").count} respostas.`,
  ].filter(Boolean).slice(0, 3);

  const positive = [
    `${posR}% dos comentários são positivos — base sólida para melhorias incrementais.`,
    themes.pos.find(t => t.key === "interativo") && `Aulas interativas e com exercícios práticos são amplamente valorizadas (${themes.pos.find(t => t.key === "interativo").count} menções).`,
    themes.pos.find(t => t.key === "colaboracao") && `A componente colaborativa com outras licenciaturas é vista como enriquecedora (${themes.pos.find(t => t.key === "colaboracao").count} menções).`,
  ].filter(Boolean);

  return { common, alerts, positive };
}

// ─── EXCEL PARSER ─────────────────────────────────────────────────────────────
async function parseExcel(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadXLSX = () => {
          const XLSX = window.XLSX;
          const wb = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
          const SKIP = new Set([".", "nenhum","nenhuma","nao sei","nao","não","nada a referir","não sei","nada a apontar","nada a referir.","não tem","nada a dizer","nada","nada.","x","nenhuk",""]);
          const headers = rows[0] || [];
          const positivos = [], negativos = [];
          for (let r = 1; r < rows.length; r++) {
            for (let c = 0; c < headers.length; c++) {
              const h = String(headers[c] || "");
              const v = String(rows[r][c] || "").trim();
              if (!v || SKIP.has(v.toLowerCase())) continue;
              if (h.includes("Aspeto positivo") && !h.includes("Pontos") && !h.includes("Feedback")) positivos.push(v);
              else if (h.includes("Aspeto Negativo") && !h.includes("Pontos") && !h.includes("Feedback")) negativos.push(v);
            }
          }
          resolve({ positivos, negativos, totalRespostas: rows.length - 1, fileName: file.name.replace(/\.[^.]+$/, "") });
        };
        if (window.XLSX) { loadXLSX(); }
        else {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
          s.onload = loadXLSX;
          s.onerror = () => resolve(null);
          document.head.appendChild(s);
        }
      } catch { resolve(null); }
    };
    reader.readAsArrayBuffer(file);
  });
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #060b12; --s1: rgba(255,255,255,0.038); --s2: rgba(255,255,255,0.062);
    --bd: rgba(255,255,255,0.082); --bd2: rgba(255,255,255,0.16);
    --tx: #dde4f0; --tx2: rgba(221,228,240,0.65); --tx3: rgba(221,228,240,0.36);
    --G: #4ade80; --R: #f87171; --B: #60a5fa; --P: #c084fc; --Y: #fbbf24;
    --gG: rgba(74,222,128,0.08); --gR: rgba(248,113,113,0.08);
    --gB: rgba(96,165,250,0.08); --gP: rgba(192,132,252,0.08);
  }
  html, body { height: 100%; background: var(--bg); }
  .app { min-height: 100vh; color: var(--tx); font-family: 'Cormorant Garamond', Georgia, serif; position: relative; overflow-x: hidden; }
  .bg { position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse 90% 55% at 15% 5%, rgba(96,165,250,0.05) 0%, transparent 65%),
      radial-gradient(ellipse 55% 45% at 85% 85%, rgba(192,132,252,0.04) 0%, transparent 65%),
      radial-gradient(ellipse 40% 35% at 55% 40%, rgba(74,222,128,0.03) 0%, transparent 55%); }
  .grid { position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 52px 52px; }
  .wrap { position: relative; z-index: 1; max-width: 1020px; margin: 0 auto; padding: 0 28px 100px; }

  /* HEADER */
  .hdr { padding: 52px 0 38px; border-bottom: 1px solid var(--bd); margin-bottom: 36px; }
  .hdr-eye { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .2em; color: var(--tx3); text-transform: uppercase; margin-bottom: 14px; }
  .hdr-h1 { font-size: clamp(30px, 4.5vw, 50px); font-weight: 600; line-height: 1.05; letter-spacing: -.025em; margin-bottom: 6px; }
  .hdr-h1 em { font-style: normal; color: var(--B); }
  .hdr-file { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--tx3); margin-bottom: 28px; }

  /* STAT BAR */
  .sbar { display: flex; gap: 2px; background: var(--s1); border: 1px solid var(--bd); border-radius: 11px; padding: 3px; margin-bottom: 26px; }
  .sitem { flex: 1; padding: 13px 16px; border-radius: 8px; transition: background .2s; cursor: default; }
  .sitem:hover { background: var(--s2); }
  .sval { font-size: 24px; font-weight: 700; font-family: 'DM Mono', monospace; line-height: 1; }
  .slbl { font-size: 10px; color: var(--tx3); font-family: 'DM Mono', monospace; letter-spacing: .06em; margin-top: 3px; }
  .sdiv { width: 1px; background: var(--bd); flex-shrink: 0; }
  .sratio { flex: 2; min-width: 0; }
  .ratio-track { height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; display: flex; margin-bottom: 5px; }
  .rpos { background: var(--G); transition: width .8s ease; }
  .rneg { background: var(--R); transition: width .8s ease; }
  .ratio-lbl { display: flex; justify-content: space-between; font-family: 'DM Mono', monospace; font-size: 10px; }

  /* ACTIONS */
  .acts { display: flex; gap: 10px; flex-wrap: wrap; }
  .btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 8px; padding: 10px 20px; font-size: 12.5px; font-family: 'DM Mono', monospace; letter-spacing: .04em; cursor: pointer; transition: all .18s; border: 1px solid transparent; font-weight: 500; }
  .btn:disabled { opacity: .35; cursor: not-allowed; }
  .btn-ai { background: rgba(96,165,250,.1); border-color: rgba(96,165,250,.28); color: #93c5fd; }
  .btn-ai:hover:not(:disabled) { background: rgba(96,165,250,.18); border-color: rgba(96,165,250,.48); }
  .btn-ghost { background: var(--s1); border-color: var(--bd); color: var(--tx2); }
  .btn-ghost:hover:not(:disabled) { background: var(--s2); border-color: var(--bd2); }
  .btn-sm { padding: 5px 13px; font-size: 11px; }
  .btn-copy { padding: 5px 12px; font-size: 11px; background: transparent; border-color: var(--bd); color: var(--tx3); }
  .btn-copy:hover { border-color: var(--bd2); color: var(--tx2); }
  .btn-copy.ok { border-color: rgba(74,222,128,.4); color: var(--G); }

  /* DROP ZONE */
  .dz { border: 1.5px dashed var(--bd); border-radius: 10px; padding: 16px 22px; text-align: center; cursor: pointer; transition: all .2s; margin-bottom: 14px; }
  .dz:hover, .dz.over { border-color: rgba(96,165,250,.4); background: rgba(96,165,250,.03); }
  .dz span { font-family: 'DM Mono', monospace; font-size: 11.5px; color: var(--tx3); }
  .dz a { color: #93c5fd; text-decoration: none; }

  /* SECTION LABEL */
  .slabel { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--tx3); letter-spacing: .18em; text-transform: uppercase; margin: 32px 0 14px; display: flex; align-items: center; gap: 12px; }
  .slabel::after { content: ''; flex: 1; height: 1px; background: var(--bd); }

  /* CARD */
  .card { background: var(--s1); border: 1px solid var(--bd); border-radius: 14px; overflow: hidden; margin-bottom: 14px; transition: border-color .25s, box-shadow .25s; animation: fadeUp .35s ease both; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  .card:hover { border-color: var(--bd2); }
  .card.lit { box-shadow: inset 0 1px 0 var(--glow, transparent); }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  .card-hdr { display: flex; justify-content: space-between; align-items: center; padding: 18px 22px 16px; border-bottom: 1px solid var(--bd); }
  .card-tg { display: flex; align-items: center; gap: 12px; }
  .card-bar { width: 3px; height: 34px; border-radius: 2px; flex-shrink: 0; }
  .card-title { font-size: 15.5px; font-weight: 600; letter-spacing: -.01em; }
  .card-sub { font-family: 'DM Mono', monospace; font-size: 10px; color: var(--tx3); letter-spacing: .08em; text-transform: uppercase; margin-top: 2px; }
  .card-body { padding: 22px; }

  /* THEME BARS */
  .tbar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .tbar-label { font-size: 13px; color: var(--tx2); min-width: 0; flex: 1; line-height: 1.4; }
  .tbar-track { width: 140px; flex-shrink: 0; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
  .tbar-fill { height: 100%; border-radius: 2px; transition: width .9s cubic-bezier(.22,1,.36,1); }
  .tbar-count { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--tx3); min-width: 28px; text-align: right; }

  /* SYNTH TEXT */
  .synth { font-size: 15px; line-height: 1.82; color: var(--tx2); }
  .synth p { margin-bottom: 9px; }
  .synth p:last-child { margin-bottom: 0; }
  .synth strong { color: var(--tx); font-weight: 600; }
  .rec-list { list-style: none; }
  .rec-item { display: flex; gap: 12px; padding: 9px 0; border-bottom: 1px solid var(--bd); font-size: 14px; line-height: 1.65; color: var(--tx2); }
  .rec-item:last-child { border-bottom: none; }
  .rec-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--tx3); min-width: 18px; padding-top: 2px; }

  /* PROGRESS */
  .ptrack { height: 2px; background: rgba(255,255,255,0.05); border-radius: 1px; margin-top: 14px; overflow: hidden; }
  .pfill { height: 100%; border-radius: 1px; opacity: .4; }

  /* NOTES */
  .ngrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .ncol-title { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--bd); }
  .nchip { background: var(--s1); border: 1px solid var(--bd); border-left: 2.5px solid transparent; border-radius: 8px; padding: 10px 13px; margin-bottom: 8px; font-size: 13.5px; line-height: 1.6; color: var(--tx2); transition: background .15s; }
  .nchip:hover { background: var(--s2); }

  /* RAW */
  details summary { cursor: pointer; font-family: 'DM Mono', monospace; font-size: 11px; color: var(--tx3); letter-spacing: .08em; padding: 10px 0; user-select: none; list-style: none; }
  details summary::-webkit-details-marker { display: none; }
  .raw-item { font-size: 12.5px; color: var(--tx2); padding: 5px 10px; border-radius: 5px; margin-bottom: 4px; line-height: 1.55; }

  @media (max-width: 640px) {
    .ngrid { grid-template-columns: 1fr; }
    .sratio { flex: 100% 0 0; }
    .tbar-track { width: 80px; }
  }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);
  return (
    <button className={`btn btn-sm btn-copy ${ok ? "ok" : ""}`} onClick={() => {
      navigator.clipboard.writeText(text || "");
      setOk(true); setTimeout(() => setOk(false), 2000);
    }}>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        {ok
          ? <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          : <><rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1 8V2a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>
        }
      </svg>
      {ok ? "Copiado" : "Copiar"}
    </button>
  );
}

function Card({ color, glow, delay = 0, title, sub, lit, actions, children }) {
  return (
    <div className={`card ${lit ? "lit" : ""}`} style={{ "--glow": glow, animationDelay: `${delay}s` }}>
      <div className="card-hdr">
        <div className="card-tg">
          <div className="card-bar" style={{ background: color }} />
          <div>
            <div className="card-title">{title}</div>
            {sub && <div className="card-sub">{sub}</div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>{actions}</div>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

function ThemeBars({ themes, color, maxCount }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);
  return (
    <div>
      {themes.filter(t => t.count > 0).map((t, i) => (
        <div className="tbar-row" key={t.key} style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="tbar-label">{t.label}</div>
          <div className="tbar-track">
            <div className="tbar-fill" style={{ width: visible ? `${(t.count / maxCount) * 100}%` : "0%", background: color }} />
          </div>
          <div className="tbar-count">{t.count}</div>
        </div>
      ))}
    </div>
  );
}

function RecList({ text }) {
  const lines = text.split("\n").filter(l => l.trim());
  return (
    <ul className="rec-list">
      {lines.map((line, i) => {
        const body = line.replace(/^\d+\.\s*/, "");
        return (
          <li key={i} className="rec-item">
            <span className="rec-num">{i + 1 < 10 ? `0${i+1}` : i+1}</span>
            <span>{body}</span>
          </li>
        );
      })}
    </ul>
  );
}

function SynthText({ text }) {
  return (
    <div className="synth">
      {text.split("\n").filter(l => l.trim()).map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(STATIC_DATA);
  const [analysis, setAnalysis] = useState(() => buildSynthesis(STATIC_DATA));
  const [notes, setNotes] = useState(() => buildNotes(STATIC_DATA));
  const [drag, setDrag] = useState(false);
  const [activeTab, setActiveTab] = useState("pos");
  const fileRef = useRef();

  const loadFile = useCallback(async (file) => {
    if (!file) return;
    const parsed = await parseExcel(file);
    if (parsed && parsed.positivos.length > 0) {
      setData(parsed);
      setAnalysis(buildSynthesis(parsed));
      setNotes(buildNotes(parsed));
    }
  }, []);

  const posR = Math.round(data.positivos.length / (data.positivos.length + data.negativos.length) * 100);
  const maxPos = Math.max(...analysis.themes.pos.map(t => t.count), 1);
  const maxNeg = Math.max(...analysis.themes.neg.map(t => t.count), 1);

  const allText = [
    `ASPETOS POSITIVOS\n\n${analysis.posText}`,
    `ASPETOS NEGATIVOS\n\n${analysis.negText}`,
    `RECOMENDAÇÕES\n\n${analysis.recText}`,
    `RESUMO EXECUTIVO\n\n${analysis.sumText}`,
  ].join("\n\n────────────\n\n");

  const SECTIONS = [
    { key: "pos", title: "Aspetos Positivos", color: "var(--G)", glow: "var(--gG)", sub: `${data.positivos.length} comentários`, content: <><SynthText text={analysis.posText} /><div style={{marginTop:"20px"}}><div className="slabel" style={{margin:"0 0 12px"}}>Temas identificados</div><ThemeBars themes={analysis.themes.pos} color="var(--G)" maxCount={maxPos} /></div></> },
    { key: "neg", title: "Aspetos Negativos", color: "var(--R)", glow: "var(--gR)", sub: `${data.negativos.length} comentários`, content: <><SynthText text={analysis.negText} /><div style={{marginTop:"20px"}}><div className="slabel" style={{margin:"0 0 12px"}}>Temas identificados</div><ThemeBars themes={analysis.themes.neg} color="var(--R)" maxCount={maxNeg} /></div></> },
    { key: "rec", title: "Recomendações", color: "var(--B)", glow: "var(--gB)", sub: "Ações prioritárias", content: <RecList text={analysis.recText} /> },
    { key: "sum", title: "Resumo Executivo", color: "var(--P)", glow: "var(--gP)", sub: "Para direção / coordenação", content: <SynthText text={analysis.sumText} /> },
  ];

  const NOTE_COLS = [
    { key: "common", label: "Recorrente", color: "var(--B)", border: "rgba(96,165,250,.38)", items: notes.common },
    { key: "alert",  label: "Atenção",    color: "var(--R)", border: "rgba(248,113,113,.38)", items: notes.alerts },
    { key: "pos",    label: "Destaque",   color: "var(--G)", border: "rgba(74,222,128,.38)",  items: notes.positive },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="bg" /><div className="grid" />
        <div className="wrap">

          {/* HEADER */}
          <div className="hdr">
            <div className="hdr-eye">Análise de Feedback Académico · Automática</div>
            <h1 className="hdr-h1">Monitorização <em>Intercalar</em></h1>
            <div className="hdr-file">{data.fileName}</div>

            <div className="sbar">
              <div className="sitem">
                <div className="sval" style={{ color: "var(--tx)" }}>{data.totalRespostas}</div>
                <div className="slbl">Respostas</div>
              </div>
              <div className="sdiv" />
              <div className="sitem">
                <div className="sval" style={{ color: "var(--G)" }}>{data.positivos.length}</div>
                <div className="slbl">Positivos</div>
              </div>
              <div className="sdiv" />
              <div className="sitem">
                <div className="sval" style={{ color: "var(--R)" }}>{data.negativos.length}</div>
                <div className="slbl">Negativos</div>
              </div>
              <div className="sdiv" />
              <div className="sitem sratio">
                <div className="ratio-track">
                  <div className="rpos" style={{ width: `${posR}%` }} />
                  <div className="rneg" style={{ width: `${100 - posR}%` }} />
                </div>
                <div className="ratio-lbl">
                  <span style={{ color: "var(--G)" }}>{posR}% positivo</span>
                  <span style={{ color: "var(--R)" }}>{100 - posR}% negativo</span>
                </div>
                <div className="slbl" style={{ marginTop: "4px" }}>Balanço</div>
              </div>
            </div>

            <div className="acts">
              <CopyBtn text={allText} />
              <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v8M4 6l3 3 3-3M2 10v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Carregar Excel
                <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => loadFile(e.target.files[0])} />
              </label>
            </div>
          </div>

          {/* DROP ZONE */}
          <div className={`dz ${drag ? "over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}>
            <span>Arrasta um ficheiro <a>.xlsx</a> para actualizar a análise automaticamente</span>
          </div>

          {/* SYNTHESIS CARDS */}
          <div className="slabel">Síntese Automática</div>
          {SECTIONS.map((s, i) => (
            <Card key={s.key} color={s.color} glow={s.glow} delay={i * 0.07}
              title={s.title} sub={s.sub} lit
              actions={<CopyBtn text={
                s.key === "pos" ? analysis.posText :
                s.key === "neg" ? analysis.negText :
                s.key === "rec" ? analysis.recText : analysis.sumText
              } />}>
              {s.content}
              <div className="ptrack"><div className="pfill" style={{ width: "100%", background: s.color }} /></div>
            </Card>
          ))}

          {/* NOTES */}
          <div className="slabel" style={{ marginTop: "36px" }}>Notas para Tomada de Decisão</div>
          <Card color="var(--Y)" glow="rgba(251,191,36,.07)" delay={0.2}
            title="Padrões, Alertas e Destaques" sub="Análise transversal de recorrências e irregularidades" lit
            actions={<CopyBtn text={[...notes.common, ...notes.alerts, ...notes.positive].join("\n")} />}>
            <div className="ngrid">
              {NOTE_COLS.map(col => (
                <div key={col.key}>
                  <div className="ncol-title" style={{ color: col.color }}>{col.label}</div>
                  {col.items.map((n, i) => (
                    <div key={i} className="nchip" style={{ borderLeftColor: col.border }}>{n}</div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* RAW DATA */}
          <details style={{ marginTop: "20px" }}>
            <summary>+ Comentários brutos · {data.positivos.length + data.negativos.length} entradas</summary>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "14px" }}>
              {[
                { l: "Positivos", items: data.positivos, c: "var(--G)", bg: "rgba(74,222,128,.04)" },
                { l: "Negativos", items: data.negativos, c: "var(--R)", bg: "rgba(248,113,113,.04)" }
              ].map(col => (
                <div key={col.l}>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: "10px", color: col.c, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: "10px" }}>
                    {col.l} ({col.items.length})
                  </div>
                  {col.items.map((item, i) => (
                    <div key={i} className="raw-item" style={{ background: col.bg }}>{item}</div>
                  ))}
                </div>
              ))}
            </div>
          </details>

        </div>
      </div>
    </>
  );
}
