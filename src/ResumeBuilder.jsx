import { useState, useMemo } from "react";
import { Plus, Trash2, ScanLine, Check, X, FileText, User, Briefcase, GraduationCap, Sparkles, Target } from "lucide-react";

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
    }, 900);
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
    { id: "ats", label: "ATS check", icon: Target },
  ];

  const scoreColor = (s) => (s >= 70 ? "#2F5233" : s >= 40 ? "#B45309" : "#9F2B25");

  return (
    <div style={{ background: "#EEF0EA", minHeight: "100%", padding: "24px", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <FileText size={22} color="#1C2B33" />
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#1C2B33", margin: 0 }}>Resume builder</h1>
          <span style={{ fontSize: 12, color: "#6B7A72", background: "#DFE4D9", padding: "3px 10px", borderRadius: 20, marginLeft: 4 }}>
            + ATS compatibility checker
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 20 }}>
          {/* LEFT: editor */}
          <div style={{ background: "#FBFBF8", border: "1px solid #DEDFD6", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #E4E5DC", overflowX: "auto" }}>
              {tabs.map((t) => {
                const Icon = t.icon;
                const active = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
                      fontSize: 13, border: "none", background: active ? "#F0F1EA" : "transparent",
                      color: active ? "#1C2B33" : "#7A8078", borderBottom: active ? "2px solid #2F5233" : "2px solid transparent",
                      cursor: "pointer", whiteSpace: "nowrap", fontWeight: active ? 600 : 400,
                    }}
                  >
                    <Icon size={14} /> {t.label}
                  </button>
                );
              })}
            </div>

            <div style={{ padding: 18 }}>
              {tab === "details" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      placeholder="e.g. Node.js"
                      style={{ ...inputStyle, flex: 1 }}
                    />
                    <button onClick={addSkill} style={addBtn}><Plus size={14} /></button>
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
                  <div style={{ fontSize: 12, color: "#7A8078", marginBottom: 10, lineHeight: 1.5 }}>
                    New feature: paste a job description below to see how well your resume matches it, and which keywords are missing.
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
                    style={{ ...addBtn, marginTop: 10, opacity: !jobDesc.trim() ? 0.5 : 1, background: "#1C2B33", color: "#fff", borderColor: "#1C2B33" }}
                  >
                    <ScanLine size={14} /> {scanning ? "Scanning..." : "Scan resume"}
                  </button>

                  {scanned && atsResult && (
                    <div style={{ marginTop: 18 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: "50%",
                          border: `4px solid ${scoreColor(atsResult.score)}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 700,
                          color: scoreColor(atsResult.score),
                        }}>
                          {atsResult.score}%
                        </div>
                        <div style={{ fontSize: 13, color: "#4A524B" }}>
                          {atsResult.score >= 70 ? "Strong match with this job description." :
                           atsResult.score >= 40 ? "Partial match — consider adding missing keywords." :
                           "Low match — this resume may need significant tailoring."}
                        </div>
                      </div>

                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#2F5233", marginBottom: 6 }}>
                          Matched keywords ({atsResult.matched.length})
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {atsResult.matched.slice(0, 20).map((k) => (
                            <span key={k} style={{ ...pillStyle, background: "#E4EEE2", borderColor: "#BFD8B9", color: "#2F5233" }}>
                              <Check size={11} /> {k}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#9F2B25", marginBottom: 6 }}>
                          Missing keywords ({atsResult.missing.length})
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          {atsResult.missing.slice(0, 20).map((k) => (
                            <span key={k} style={{ ...pillStyle, background: "#F5E4E2", borderColor: "#E2B9B4", color: "#9F2B25" }}>
                              <X size={11} /> {k}
                            </span>
                          ))}
                          {atsResult.missing.length === 0 && (
                            <span style={{ fontSize: 12, color: "#7A8078" }}>None — great coverage.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: live preview */}
          <div style={{ position: "relative" }}>
            <div style={{
              background: "#fff", border: "1px solid #DEDFD6", borderRadius: 12, padding: "36px 32px",
              fontFamily: "Georgia, 'Source Serif 4', serif", color: "#1C2B33", overflow: "hidden", position: "relative",
            }}>
              {scanning && (
                <div style={{
                  position: "absolute", left: 0, right: 0, top: 0, height: 3, background: "#2F5233",
                  animation: "scanmove 0.9s linear",
                }} />
              )}
              <h2 style={{ fontSize: 24, margin: 0, fontWeight: 700 }}>{name}</h2>
              <div style={{ fontSize: 14, color: "#5A6660", marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12, color: "#7A8078", marginBottom: 18 }}>{email} · {phone}</div>

              <SectionLabel>Summary</SectionLabel>
              <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>{summary}</p>

              <SectionLabel>Experience</SectionLabel>
              {experience.map((e) => (
                <div key={e.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700 }}>
                    <span>{e.role} · {e.company}</span>
                    <span style={{ fontWeight: 400, color: "#7A8078", fontSize: 12 }}>{e.period}</span>
                  </div>
                  <p style={{ fontSize: 12.5, color: "#3B443E", lineHeight: 1.6, margin: "2px 0 0" }}>{e.desc}</p>
                </div>
              ))}

              <SectionLabel>Education</SectionLabel>
              {education.map((ed) => (
                <div key={ed.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span><strong>{ed.degree}</strong> · {ed.school}</span>
                  <span style={{ color: "#7A8078", fontSize: 12 }}>{ed.period}</span>
                </div>
              ))}

              <SectionLabel>Skills</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                {skills.map((s) => (
                  <span key={s} style={{ fontSize: 11.5, border: "1px solid #DEDFD6", borderRadius: 4, padding: "2px 8px", color: "#3B443E" }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes scanmove { from { top: 0; } to { top: 100%; } }`}</style>
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
    <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2F5233", fontWeight: 700, borderBottom: "1px solid #E4E5DC", paddingBottom: 4, marginTop: 18, marginBottom: 4, fontFamily: "Inter, sans-serif" }}>
      {children}
    </div>
  );
}

const labelStyle = { display: "block", fontSize: 11.5, color: "#7A8078", marginBottom: 4, fontWeight: 600 };
const inputStyle = { width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #DEDFD6", borderRadius: 6, background: "#fff", color: "#1C2B33", fontFamily: "inherit", boxSizing: "border-box" };
const cardStyle = { border: "1px solid #E4E5DC", borderRadius: 8, padding: 12, display: "flex", flexDirection: "column", gap: 8, background: "#FDFDFB" };
const addBtn = { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 12px", fontSize: 12.5, border: "1px solid #DEDFD6", borderRadius: 6, background: "#fff", color: "#1C2B33", cursor: "pointer", fontWeight: 600 };
const iconBtn = { border: "none", background: "transparent", color: "#9F2B25", cursor: "pointer", padding: 2 };
const pillStyle = { display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, border: "1px solid #DEDFD6", borderRadius: 20, padding: "3px 10px", background: "#F0F1EA", color: "#3B443E" };
