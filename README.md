 #📄 Resume Analyser
 
> A full-stack AI-powered Resume Analyser that uses Generative AI to evaluate resumes, extract key insights, and provide actionable feedback — instantly.
 
🌐 **Live Demo:** [resume-analyser-ebon-six.vercel.app](https://resume-analyser-ebon-six.vercel.app)  
📁 **Repository:** [github.com/Harenderchhoker31/Resume-Analyser](https://github.com/Harenderchhoker31/Resume-Analyser)
 
---
 
## ✨ Features
 
- 📤 **Resume Upload** — Upload your resume in PDF or DOCX format
- 🤖 **AI-Powered Analysis** — Generative AI extracts and evaluates resume content
- 📋 **Skills Extraction** — Identifies technical and soft skills from the resume
- 📊 **Resume Scoring** — Rates the resume based on structure, content, and completeness
- 💡 **Actionable Feedback** — Provides suggestions to improve the resume
- 🔍 **Job Role Matching** — Matches resume content against relevant job roles
- ⚡ **Fast & Responsive UI** — Clean, modern interface built with React and SCSS
---
 
## 🗂️ Project Structure
 
```
Resume-Analyser/
├── Backend/          # Node.js/Express API + GEN-AI integration
├── Frontend/         # React frontend with SCSS styling
└── .DS_Store
```
 
---
 
## 🛠️ Tech Stack
 
### Frontend
| Technology | Purpose |
|---|---|
| React | UI Library |
| SCSS | Styling & theming |
| JavaScript | Application logic |
| Vite | Build tool |
 
### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| Generative AI (GEN-AI) | Resume analysis & feedback |
| PDF/DOCX Parser | Resume text extraction |
 
---
 
## 🚀 Getting Started
 
### Prerequisites
 
- [Node.js](https://nodejs.org/) v18+
- npm or yarn
- A Generative AI API key (e.g., Google Gemini or OpenAI)
---
 
### Backend Setup
 
```bash
# Navigate to the backend directory
cd Backend
 
# Install dependencies
npm install
 
# Create environment file
cp .env.example .env
# Add your API keys and config
 
# Start the server
npm run dev
```
 
The API will run at `http://localhost:5000`
 
---
 
### Frontend Setup
 
```bash
# Navigate to the frontend directory
cd Frontend
 
# Install dependencies
npm install
 
# Start the development server
npm run dev
```
 
The app will be available at `http://localhost:5173`
 
---
 
## ⚙️ Environment Variables
 
Create a `.env` file inside the `Backend/` directory:
 
```env
PORT=5000
GENAI_API_KEY=your_generative_ai_api_key
```
 
---
 
## 🔄 How It Works
 
```
User uploads Resume (PDF/DOCX)
        ↓
Backend extracts text from the file
        ↓
Extracted text is sent to the GEN-AI model
        ↓
AI analyses skills, experience, structure & completeness
        ↓
Feedback, score & job role matches returned to the user
```
 
---
 
## 🚢 Deployment
 
This project is deployed using **Vercel** for the frontend.
 
### Deploy Frontend to Vercel
 
1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the **root directory** to `Frontend`.
4. Add your backend API URL as an environment variable (`VITE_API_URL`).
5. Click **Deploy**.
### Deploy Backend
 
Use any Node.js hosting platform such as [Railway](https://railway.app), [Render](https://render.com), or [Cyclic](https://cyclic.sh).
 
---
 
## 🤝 Contributing
 
Contributions, issues, and feature requests are welcome!
 
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request
---
 
## 👤 Author
 
**Harenderchhoker31**
 
- GitHub: [@Harenderchhoker31](https://github.com/Harenderchhoker31)
---
