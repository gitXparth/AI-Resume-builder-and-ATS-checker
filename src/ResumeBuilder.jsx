import { useState, useMemo } from "react";
import { Plus, Trash2, ScanLine, Check, X, FileText, User, Briefcase, GraduationCap, Sparkles, Target, Radio } from "lucide-react";

const STOPWORDS = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","is","are","was","were","be","been","this","that","as","by","from","will","you","your","we","our","team","looking","strong","experience","years","work","working"]);

function extractKeywords(text) {
  return [...new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\+\#\.\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  )];
}

const initialExperience = [
  { id: 1, role: "Frontend Developer", company: "Acme Studio", period: "2023 — Present", desc: "Built React and Tailwind interfaces, improved page load speed by 30%." },
];

const initialEducation = [
  { id: 1, school: "State University", degree: "B.Sc. Computer Science", period: "2019 — 2023" },
];

// ── Design tokens ──────────────────────────────────────────────
const C = {
  ink: "#12171A",
  panel: "#1B2225",
  panel2: "#222A2E",
  border: "#303A3E",
  paper: "#F6F3EA",
  paperLine: "#E1DBC8",
  paperInk: "#23282A",
  brass: "#CB9552",
  brassDim: "#8A6A3E",
  brassSoft: "rgba(203,149,82,0.14)",
  forest: "#72A57E",
  forestSoft: "rgba(114,165,126,0.14)",
  rust: "#C46257",
  rustSoft: "rgba(196,98,87,0.14)",
  fog: "#9BA6A1",
  fogDim: "#5E6A66",
  cream: "#EFEBDF",
};

const F = {
  display: "'Space Grotesk', 'Segoe UI', sans-serif",
  body: "'IBM Plex Sans', 'Segoe UI', sans-serif",
  serif: "'Source Serif 4', Georgia, serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

export default function ResumeBuilder() {
  const [tab, setTab] = useState("details");
  const [name, setName] = useState("Alex Rivera");
  const [title, setTitle] = useState("Frontend Developer");
  const [email, setEmail] = useState("alex.rivera@email.com");
  const [phone, setPhone] = useState("+1 (555) 012-3456");
  const [summary, setSummary] = useState(
    "Frontend developer with 2 years of experience building React applications with Tailwind CSS. Comfortable working across the stack and shipping features end to end."
  );
  const [experience, setExperience] = useState(initialExperience);
  const [education, setEducation] = useState(initialEducation);
  const [skills, setSkills] = useState(["React", "TypeScript", "Tailwind CSS", "Git"]);
  const [skillInput, setSkillInput] = useState("");

  const [jobDesc, setJobDesc] = useState("");
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  const resumeText = useMemo(
    () =>
      [summary, ...experience.map((e) => `${e.role} ${e.desc}`), skills.join(" ")].join(" "),
    [summary, experience, skills]
  );

  const atsResult = useMemo(() => {
    if (!jobDesc.trim()) return null;
    const jobKeywords = extractKeywords(jobDesc);
    const resumeKeywords = new Set(extractKeywords(resumeText));
    const matched = jobKeywords.filter((k) => resumeKeywords.has(k));
    const missing = jobKeywords.filter((k) => !resumeKeywords.has(k));
    const score = jobKeywords.length ? Math.round((matched.length / jobKeywords.length) * 100) : 0;
    return { matched, missing, score };
  }, [jobDesc, resumeText]);

  function runScan() {
    if (!jobDesc.trim()) return;
    setScanning(true);
    setScanned(false);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 1100);
  }

  function addExperience() {
    setExperience([...experience, { id: Date.now(), role: "New role", company: "Company", period: "Year — Year", desc: "Describe what you did." }]);
  }
  function updateExperience(id, field, value) {
    setExperience(experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }
  function removeExperience(id) {
    setExperience(experience.filter((e) => e.id !== id));
  }

  function addEducation() {
    setEducation([...education, { id: Date.now(), school: "School", degree: "Degree", period: "Year — Year" }]);
  }
  function updateEducation(id, field, value) {
    setEducation(education.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  }
  function removeEducation(id) {
    setEducation(education.filter((e) => e.id !== id));
  }

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  }
  function removeSkill(s) {
    setSkills(skills.filter((k) => k !== s));
  }

  const tabs = [
    { id: "details", label: "Details", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Sparkles },
    { id: "ats", label: "Signal check", icon: Radio },
  ];

  const scoreColor = (s) => (s >= 70 ? C.forest : s >= 40 ? C.brass : C.rust);

  return (
    <div style={{ background: C.ink, minHeight: "100%", padding: "28px 20px", fontFamily: F.body }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", border: `1.5px solid ${C.brass}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <FileText size={14} color={C.brass} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: C.cream, fontFamily: F.display, letterSpacing: "0.01em" }}>
              Resume Builder
            </div>
            <div style={{ fontSize: 10.5, color: C.fog, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: F.mono }}>
              draft · tailor · scan
            </div>
          </div>
          {scanned && atsResult && (
            <div style={{
              marginLeft: "auto", display: "flex", alignItems: "center", gap: 8,
              fontFamily: F.mono, fontSize: 12, color: scoreColor(atsResult.score),
              border: `1px solid ${C.border}`, borderRadius: 20, padding: "5px 12px", background: C.panel,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: scoreColor(atsResult.score) }} />
              {atsResult.score}% MATCH
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 22 }}>

          {/* LEFT: instrument panel */}
          <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", overflowX: "auto", borderBottom: `1px solid ${C.border}` }}>
              {tabs.map((t, i) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 5,
                      padding: "12px 16px", minWidth: 92,
                      fontSize: 12.5, border: "none", background: active ? C.panel2 : "transparent",
                      color: active ? C.cream : C.fog,
                      borderBottom: active ? `2px solid ${C.brass}` : "2px solid transparent",
                      cursor: "pointer", whiteSpace: "nowrap", fontWeight: active ? 600 : 500,
                      fontFamily: F.display, transition: "background 0.15s, color 0.15s",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: F.mono, fontSize: 10, color: active ? C.brass : C.fogDim }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon size={13} />
                    </span>
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div style={{ padding: 20 }}>
              {tab === "details" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                  <Field label="Full name" value={name} onChange={setName} />
                  <Field label="Title" value={title} onChange={setTitle} />
                  <Field label="Email" value={email} onChange={setEmail} />
                  <Field label="Phone" value={phone} onChange={setPhone} />
                  <div>
                    <label style={labelStyle}>Summary</label>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} />
                  </div>
                </div>
              )}

              {tab === "experience" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {experience.map((exp) => (
                    <div key={exp.id} style={cardStyle}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => removeExperience(exp.id)} style={iconBtn}><Trash2 size={14} /></button>
                      </div>
                      <Field label="Role" value={exp.role} onChange={(v) => updateExperience(exp.id, "role", v)} />
                      <Field label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, "company", v)} />
                      <Field label="Period" value={exp.period} onChange={(v) => updateExperience(exp.id, "period", v)} />
                      <div>
                        <label style={labelStyle}>Description</label>
                        <textarea value={exp.desc} onChange={(e) => updateExperience(exp.id, "desc", e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
                      </div>
                    </div>
                  ))}
                  <button onClick={addExperience} style={addBtn}><Plus size={14} /> Add experience</button>
                </div>
              )}

              {tab === "education" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {education.map((ed) => (
                    <div key={ed.id} style={cardStyle}>
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={() => removeEducation(ed.id)} style={iconBtn}><Trash2 size={14} /></button>
                      </div>
                      <Field label="School" value={ed.school} onChange={(v) => updateEducation(ed.id, "school", v)} />
                      <Field label="Degree" value={ed.degree} onChange={(v) => updateEducation(ed.id, "degree", v)} />
                      <Field label="Period" value={ed.period} onChange={(v) => updateEducation(ed.id, "period", v)} />
                    </div>
                  ))}
                  <button onClick={addEducation} style={addBtn}><Plus size={14} /> Add education</button>
                </div>
              )}

              {tab === "skills" && (
                <div>
                  <label style={labelStyle}>Add a skill</label>
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      placeholder="e.g. Node.js"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button onClick={addSkill} style={{ ...addBtn, padding: "8px 12px" }}><Plus size={14} /></button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skills.map((s) => (
                      <span key={s} style={pillStyle}>
                        {s}
                        <X size={12} style={{ cursor: "pointer" }} onClick={() => removeSkill(s)} />
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tab === "ats" && (
                <div>
                  <div style={{ fontSize: 12, color: C.fog, marginBottom: 12, lineHeight: 1.55 }}>
                    Paste a job description below. The signal meter reads how closely your resume's language lines up with it.
                  </div>
                  <label style={labelStyle}>Job description</label>
                  <textarea
                    value={jobDesc}
                    onChange={(e) => { setJobDesc(e.target.value); setScanned(false); }}
                    rows={6}
                    placeholder="Paste the job posting text here..."
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                  <button
                    onClick={runScan}
                    disabled={!jobDesc.trim() || scanning}
                    style={{
                      ...addBtn, marginTop: 10, opacity: !jobDesc.trim() ? 0.45 : 1,
                      background: C.brass, color: C.ink, borderColor: C.brass, fontWeight: 700,
                    }}
                  >
                    <ScanLine size={14} /> {scanning ? "Scanning…" : "Run signal scan"}
                  </button>

                  {scanning && (
                    <div style={{ marginTop: 18 }}>
                      <div style={{ fontFamily: F.mono, fontSize: 11, color: C.brass, letterSpacing: "0.08em", marginBottom: 6 }}>
                        READING KEYWORDS…
                      </div>
                      <div style={{ position: "relative", height: 6, borderRadius: 3, background: C.panel2, overflow: "hidden" }}>
                        <div style={{
                          position: "absolute", top: 0, bottom: 0, width: "35%",
                          background: `linear-gradient(90deg, transparent, ${C.brass}, transparent)`,
                          animation: "sweep 1.1s linear infinite",
                        }} />
                      </div>
                    </div>
                  )}

                  {scanned && atsResult && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ fontFamily: F.mono, fontSize: 11, color: C.fog, letterSpacing: "0.08em", marginBottom: 8 }}>
                        MATCH SIGNAL
                      </div>
                      <SignalMeter score={atsResult.score} color={scoreColor(atsResult.score)} />
                      <div style={{ fontSize: 12.5, color: C.fog, marginTop: 10, marginBottom: 18, lineHeight: 1.5 }}>
                        {atsResult.score >= 70 ? "Strong signal — this resume speaks the job posting's language." :
                         atsResult.score >= 40 ? "Partial signal — a few key terms are missing from your resume." :
                         "Weak signal — this resume likely needs real tailoring for this role."}
                      </div>

                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.forest, marginBottom: 7, fontFamily: F.mono, letterSpacing: "0.05em" }}>
                          MATCHED ({atsResult.matched.length})
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {atsResult.matched.slice(0, 20).map((k) => (
                            <span key={k} style={{ ...pillStyle, background: C.forestSoft, borderColor: C.forest, color: C.forest }}>
                              <Check size={11} /> {k}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.rust, marginBottom: 7, fontFamily: F.mono, letterSpacing: "0.05em" }}>
                          MISSING ({atsResult.missing.length})
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {atsResult.missing.slice(0, 20).map((k) => (
                            <span key={k} style={{ ...pillStyle, background: C.rustSoft, borderColor: C.rust, color: C.rust }}>
                              <X size={11} /> {k}
                            </span>
                          ))}
                          {atsResult.missing.length === 0 && (
                            <span style={{ fontSize: 12, color: C.fog }}>None — great coverage.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: paper preview */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "relative", background: C.paper, borderRadius: 3, padding: "40px 36px",
              fontFamily: F.serif, color: C.paperInk, overflow: "hidden",
              boxShadow: "0 1px 2px rgba(0,0,0,0.3), 0 12px 32px rgba(0,0,0,0.35)",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: C.brass }} />
              {scanning && (
                <div style={{
                  position: "absolute", left: 0, right: 0, top: 0, height: 2, background: C.brass,
                  boxShadow: `0 0 8px ${C.brass}`, animation: "scanmove 1.1s linear infinite",
                }} />
              )}
              <h2 style={{ fontSize: 25, margin: 0, fontWeight: 700, letterSpacing: "-0.01em" }}>{name}</h2>
              <div style={{ fontSize: 14, color: "#5C6660", marginBottom: 6, fontStyle: "italic" }}>{title}</div>
              <div style={{ fontSize: 11.5, color: "#8A8F86", marginBottom: 20, fontFamily: F.mono }}>{email} · {phone}</div>

              <SectionLabel>Summary</SectionLabel>
              <p style={{ fontSize: 13, lineHeight: 1.65, marginTop: 6 }}>{summary}</p>

              <SectionLabel>Experience</SectionLabel>
              {experience.map((e) => (
                <div key={e.id} style={{ marginBottom: 13 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                    <span>{e.role} · {e.company}</span>
                    <span style={{ fontWeight: 400, color: "#8A8F86", fontSize: 11.5, fontFamily: F.mono }}>{e.period}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#3B443E", lineHeight: 1.65, margin: "3px 0 0" }}>{e.desc}</p>
                </div>
              ))}

              <SectionLabel>Education</SectionLabel>
              {education.map((ed) => (
                <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 7 }}>
                  <span><strong>{ed.degree}</strong> · {ed.school}</span>
                  <span style={{ color: "#8A8F86", fontSize: 11.5, fontFamily: F.mono }}>{ed.period}</span>
                </div>
              ))}

              <SectionLabel>Skills</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 6 }}>
                {skills.map((s) => (
                  <span key={s} style={{ fontSize: 11, border: `1px solid ${C.paperLine}`, borderRadius: 3, padding: "2.5px 9px", color: "#3B443E", fontFamily: F.mono }}>{s}</span>
                ))}
              </div>
            </div>
            <div style={{ fontFamily: F.mono, fontSize: 10, color: C.fogDim, textAlign: "center", marginTop: 10, letterSpacing: "0.08em" }}>
              LIVE PREVIEW
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scanmove { from { top: 0; } to { top: 100%; } }
        @keyframes sweep { from { left: -35%; } to { left: 100%; } }
        input::placeholder, textarea::placeholder { color: ${C.fogDim}; }
        input:focus, textarea:focus { outline: none; border-color: ${C.brass} !important; box-shadow: 0 0 0 3px ${C.brassSoft}; }
        button:focus-visible { outline: 2px solid ${C.brass}; outline-offset: 2px; }
      `}</style>
    </div>
  );
}

function SignalMeter({ score, color }) {
  const ticks = Array.from({ length: 10 });
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: F.mono, fontSize: 32, fontWeight: 700, color }}>{score}</span>
        <span style={{ fontFamily: F.mono, fontSize: 13, color: C.fog }}>/ 100</span>
      </div>
      <div style={{ position: "relative", height: 10, background: C.panel2, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, width: `${score}%`, background: color, transition: "width 0.5s ease" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          {ticks.map((_, i) => (
            <div key={i} style={{ flex: 1, borderRight: i < 9 ? `1px solid ${C.ink}` : "none" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A9793A", fontWeight: 700, borderBottom: `1px solid ${C.paperLine}`, paddingBottom: 5, marginTop: 20, marginBottom: 5, fontFamily: F.mono }}>
      {children}
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 11, color: C.fog, marginBottom: 5, fontWeight: 600, fontFamily: F.display, letterSpacing: "0.02em" };
const inputStyle = { width: "100%", padding: "9px 11px", fontSize: 13, border: `1px solid ${C.border}`, borderRadius: 6, background: C.ink, color: C.cream, fontFamily: F.body, boxSizing: "border-box", transition: "border-color 0.15s" };
const cardStyle = { border: `1px solid ${C.border}`, borderRadius: 8, padding: 13, display: "flex", flexDirection: "column", gap: 9, background: C.panel2 };
const addBtn = { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 14px", fontSize: 12.5, border: `1px solid ${C.border}`, borderRadius: 6, background: C.panel2, color: C.cream, cursor: "pointer", fontWeight: 600, fontFamily: F.display };
const iconBtn = { border: "none", background: "transparent", color: C.rust, cursor: "pointer", padding: 2 };
const pillStyle = { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, border: `1px solid ${C.border}`, borderRadius: 20, padding: "3.5px 11px", background: C.panel2, color: C.cream, fontFamily: F.mono };
