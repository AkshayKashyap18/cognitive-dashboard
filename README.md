# 🧠 Cognitive Skills & Student Performance Dashboard

An interactive analytics dashboard built with **Next.js**, **TailwindCSS**, **Recharts**, and **SheetJS (xlsx)** to analyze student cognitive skills, performance, and learning personas.  
This project was created as part of the **Igebra.ai assignment**.

---

## 🚀 Features (Detailed)

### 📊 1. Data Visualization
The dashboard uses **Recharts** to provide multiple interactive charts:
- **Bar Chart (Skill vs Assessment Score)**  
  - Compares average comprehension, attention, focus, retention, and engagement with average assessment scores.  
  - Helps identify which skills have the strongest impact on results.  
  - 📌 Example: Low attention → lower average scores.

- **Scatter Plot (Attention vs Score)**  
  - Plots individual students’ attention vs assessment scores.  
  - Useful for spotting outliers (e.g., students with high attention but low scores → need different support).

- **Radar Chart (Individual Student Profile)**  
  - Displays a selected student’s cognitive skill distribution across comprehension, attention, focus, retention, and engagement.  
  - 📌 Helps teachers quickly understand a student’s strengths and weaknesses.

- **Persona Map (Clustering)**  
  - Groups students visually into **learning personas** (e.g., High Achievers, Distracted, Needs Attention).  
  - Clicking a cluster filters the table to that persona.

---

### 🔍 2. Filtering & Search
- **Search Box**: Type a name, student ID, class, or persona to instantly filter results.  
- **Persona Filter Chips**: One-click persona selection (toggle ON/OFF).  
- **Class Filter**: Dropdown to isolate specific class sections.  
- **Score Range Filter**: Set minimum & maximum assessment score thresholds.  

👉 Combined filters allow teachers to narrow down to very specific student groups (e.g., “Class 10, Needs Attention, Score < 50”).

---

### 📑 3. Excel Upload
- Upload your own `.xlsx` file with **student data**.  
- File parsing is powered by **SheetJS (xlsx)**.  
- Required attributes:  
  - `student_id`, `name`, `class`, `comprehension`, `attention`, `focus`,  
    `retention`, `engagement_time`, `assessment_score`, `persona`.  
- Data is **cleaned & converted into numeric values** before analysis.  

📌 This allows real schools to directly upload classroom data instead of relying on a preloaded dataset.

---

### 📥 4. Export Options
- Export currently **filtered student data** or **entire dataset** as a `.csv` file.  
- Export includes all fields and applies active filters (e.g., only "High Achievers" if filtered).  
- Filenames include timestamps → `students_export_2025-09-18.csv`.  

👉 Teachers can download results for **offline analysis or reporting**.

---

### 📈 5. Key Metrics (KPIs)
The dashboard header displays **live KPI cards**:
- **Average Assessment Score**: Mean of all student scores.  
- **Average Engagement Time**: Mean minutes spent engaged.  
- **Total Students**: Number of unique student records.  

📌 Quick overview for **principals/teachers** to monitor overall class health.

---

### 📱 6. Responsive Modern UI
- Built with **TailwindCSS + custom theme** (teal/mint with dark mode support).  
- Fully responsive (desktop, tablet, mobile).  
- Custom-styled **cards, tables, filters, and charts**.  
- Hover effects and smooth interactions for a professional feel.

---

### 🗂️ 7. Student Table
- **Sortable columns** (by score, attention, comprehension, engagement, etc.).  
- **Pagination**: Adjustable page size (10, 20, 50, etc.).  
- **Clickable Rows**: Opens a detailed **student modal** with radar chart + personal info.  

👉 Teachers can drill down into each student profile.

---

### 🧠 8. Learning Personas
Based on data patterns, students are grouped into **personas**:
1. **Engaged High Achiever** – high attention + high comprehension → top performance.  
2. **Needs Attention** – low attention even if comprehension is moderate → underperforms.  
3. **Steady Learner** – consistent across metrics, moderate performance.  
4. **Distracted Low Engagement** – low attention & engagement → lowest performance.  

📌 Helps schools provide **personalized interventions**.

---

### 🔮 9. Insights Panel
The app generates **interpreted insights**:
- “Comprehension & Attention are strong predictors of assessment score.”  
- “Students with high focus but low engagement need more interactive activities.”  
- “Persona distribution shows many ‘Distracted Learners’ → targeted intervention required.”  

---

## 📂 Project Structure
```
cognitive-dashboard/
├── notebook/ # Python/Jupyter (EDA, ML, clustering)
│ ├── analysis.ipynb
│ ├── generate_data.py
│ ├── requirements.txt
│ └── synthetic_students.csv
├── nextjs-dashboard/ # Next.js frontend
│ ├── components/ # React components (Charts, PersonaMap, Table, etc.)
│ ├── pages/ # Next.js pages (index.js = main dashboard)
│ ├── public/data/ # JSON datasets (students.json, persona_map.json)
│ ├── styles/ # Tailwind + global styles
│ └── package.json
└── README.md
```

---

## 🛠️ Setup & Installation

Clone the repo:

```bash
git clone https://github.com/YOUR-USERNAME/cognitive-dashboard.git
cd cognitive-dashboard/nextjs-dashboard
```
Install dependencies:
```
npm install
```
Run locally:
```
npm run dev
```
App runs at http://localhost:3000
---

## 📂 Dataset
-Default dataset: public/data/students.json

-Generated from: notebook/synthetic_students.csv

-Columns include:  student_id,name,class,comprehension, attention, focus, retention, engagement_time
                 
-assessment_score

-persona

-👉 You can also upload your own Excel sheet with the same schema using the built-in uploader.

---

 **📦 Deployment**

   ```
   The app is live and hosted on Vercel.

   ```
---

**Made by Akshay Kashyap M**
