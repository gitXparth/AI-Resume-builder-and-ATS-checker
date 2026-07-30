# 📄 Resume Builder App

An interactive, responsive, and modern **Resume Builder Web Application** designed to help users quickly build, customize, and download professional resumes in PDF format.
local host link--> (usually http://localhost:5173)
---

## 🚀 Quick Summary (What This App Does)

The **Resume Builder App** is an intuitive web client application that allows users to fill dynamic resume form fields, view live template previews, and generate or download high-quality PDF resumes with a single click.

---

## ✨ Key Features

- 🎨 **Multiple Professional Templates:** Clean, modern, and ATS-friendly resume layouts.
- 👁️ **Real-Time Live Preview:** Form data changes are instantly reflected on the right-side preview panel.
- 📑 **Dynamic Sections:**
  - **Personal Details:** Name, Contact, Email, LinkedIn, GitHub, Location, Profile Summary.
  - **Work Experience:** Job Title, Company, Dates, Key Accomplishments.
  - **Education:** Degree, College/University, Graduation Year, CGPA/Percentage.
  - **Skills:** Technical skills, Soft skills, Categorized tags.
  - **Projects:** Project Name, Tech Stack, Links, Description.
  - **Certifications & Achievements:** Extra accomplishments and credentials.
- 💾 **Data Persistence:** Automatically saves user drafts to browser `LocalStorage` so data isn't lost on page reload.
- 📥 **PDF Export:** High-resolution PDF generation via an HTML rendering engine.
- 📱 **Fully Responsive UI:** Optimized interface across desktop, tablet, and mobile screens.

---

## 🛠️ Tech Stack & Dependencies

| Technology / Library | Purpose / Role |
| :--- | :--- |
| **React.js** (Vite + React) | Core frontend framework to render UI components |
| **JavaScript (ES6+)** | State management, dynamic logic, and data handling |
| **Tailwind CSS / CSS3** | Clean, modern, responsive styling & component UI |
| **Lucide-React / FontAwesome** | UI icons for contact details, buttons, and sections |
| **html2pdf.js / jsPDF** | Converts HTML DOM templates into printable PDF documents |
| **React Context API / State** | Global state control (keeping form inputs and live preview synced) |

---

## 🏗️ Project Architecture & Data Flow

```text
  ┌─────────────────────────────────────────────────────────────┐
  │                    User Input / Forms                       │
  │  (Personal Info, Experience, Education, Skills, Projects)   │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │              Global State (Context API / State)             │
  │            (Stores input data & active template)            │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
  ┌─────────────────────────┐               ┌─────────────────────────┐
  │   LocalStorage Saver    │               │  Live Preview Component │
  │ (Preserves Form Inputs) │               │   (Renders selected UI) │
  └─────────────────────────┘               └────────────┬────────────┘
                                                         │
                                                         ▼
                                            ┌─────────────────────────┐
                                            │   PDF Generator Engine  │
                                            │    (Downloads Resume)   │
                                            └─────────────────────────┘
