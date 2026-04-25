const OpenAI = require("openai")
const puppeteer = require("puppeteer")

const ai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1"
})

async function generatePdfFromHtml(html) {
    const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
        headless: true
    })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' }
    })
    await browser.close()
    return pdfBuffer
}



async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert technical interviewer and career coach. Analyze the candidate's resume, self description, and job description thoroughly, then generate a detailed interview report. Return ONLY a valid JSON object with no extra text.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Requirements:
- Generate at least 7 technical questions highly relevant to the job and candidate's background
- Generate at least 7 behavioral questions based on the candidate's experience and job requirements
- Identify ALL skill gaps between the candidate's profile and job requirements
- Create a 7-day detailed preparation plan with 4-5 specific tasks per day
- Each question answer must be concise (2-3 sentences) covering the key points and approach
- matchScore should reflect honest assessment of candidate fit. 

Return JSON in this exact format:
{
  "matchScore": <number 0-100>,
  "title": "<job title>",
  "technicalQuestions": [
    {"question": "<detailed question>", "intention": "<why interviewer asks this>", "answer": "<detailed answer with key points and approach>"}
  ],
  "behavioralQuestions": [
    {"question": "<detailed question>", "intention": "<why interviewer asks this>", "answer": "<detailed answer with STAR method guidance>"}
  ],
  "skillGaps": [
    {"skill": "<missing skill>", "severity": "low|medium|high"}
  ],
  "preparationPlan": [
    {"day": 1, "focus": "<topic>", "tasks": ["<specific task 1>", "<specific task 2>", "<specific task 3>", "<specific task 4>"]}
  ]
}`

    const response = await ai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096
    })

    const text = response.choices[0].message.content
    const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)
    return JSON.parse(json)
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Extract information from the resume below and return ONLY a valid JSON object with no extra text and no newlines inside string values.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return this exact JSON (single-line strings only, no line breaks):
{
  "name": "full name",
  "phone": "phone",
  "email": "email",
  "summary": "3-4 sentence professional summary tailored to the job, highlighting strengths and relevant skills",
  "languages": ["language1", "language2"],
  "skills": ["skill1", "skill2"],
  "projects": [{"name": "name", "tech": "tech stack", "description": "2-3 line description of what it does and key features"}],
  "experience": [{"role": "role", "company": "company", "duration": "duration", "description": "what you did"}],
  "education": [{"degree": "degree", "institution": "institution", "year": "year range", "grade": "grade"}],
  "activities": ["detailed activity description"]
}`

    const response = await ai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2048
    })

    const text = response.choices[0].message.content
    const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)
    const data = JSON.parse(json)

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Arial', sans-serif; font-size: 11px; color: #222; background: #fff; }
  .header { text-align: center; padding: 28px 40px 18px; border-bottom: 2px solid #1a2332; }
  .header h1 { font-size: 28px; font-weight: 800; color: #1a2332; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .header .contact { font-size: 10.5px; color: #444; margin-top: 4px; }
  .header .contact span { margin: 0 8px; }
  .body { padding: 18px 40px; }
  .section { margin-bottom: 14px; }
  .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #1a2332; border-bottom: 1.5px solid #1a2332; padding-bottom: 3px; margin-bottom: 8px; }
  .summary { color: #333; line-height: 1.7; font-size: 11px; }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 5px; }
  .skill { background: #eef2f7; border: 1px solid #c8d6e8; padding: 2px 9px; border-radius: 2px; font-size: 10px; color: #1a2332; font-weight: 500; }
  .project { margin-bottom: 10px; }
  .project-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
  .project-name { font-weight: 700; font-size: 11.5px; color: #1a2332; }
  .project-tech { font-size: 9.5px; color: #666; font-style: italic; }
  .project-desc { color: #444; line-height: 1.6; font-size: 10.5px; }
  .exp-item { margin-bottom: 10px; }
  .exp-top { display: flex; justify-content: space-between; }
  .exp-role { font-weight: 700; color: #1a2332; font-size: 11.5px; }
  .exp-duration { color: #666; font-size: 10px; }
  .exp-company { color: #555; font-size: 10.5px; margin-bottom: 2px; }
  .exp-desc { color: #444; line-height: 1.6; font-size: 10.5px; }
  .edu-item { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; }
  .edu-left .edu-degree { font-weight: 700; color: #1a2332; font-size: 11px; }
  .edu-left .edu-inst { color: #555; font-size: 10.5px; }
  .edu-right { text-align: right; }
  .edu-year { color: #666; font-size: 10px; }
  .edu-grade { color: #1a2332; font-weight: 600; font-size: 10px; }
  .activity { color: #444; line-height: 1.6; font-size: 10.5px; padding-left: 12px; position: relative; margin-bottom: 4px; }
  .activity::before { content: '\u2022'; position: absolute; left: 0; color: #1a2332; font-weight: 700; }
</style>
</head>
<body>
<div class="header">
  <h1>${data.name}</h1>
  <div class="contact">
    ${data.phone ? `<span>${data.phone}</span>` : ''}
    ${data.email ? `<span>${data.email}</span>` : ''}
  </div>
</div>
<div class="body">
  ${data.summary ? `<div class="section"><div class="section-title">Professional Summary</div><div class="summary">${data.summary}</div></div>` : ''}
  ${data.languages?.length ? `<div class="section"><div class="section-title">Programming Languages</div><div class="skills-grid">${data.languages.map(l => `<span class="skill">${l}</span>`).join('')}</div></div>` : ''}
  ${data.skills?.length ? `<div class="section"><div class="section-title">Skills &amp; Tools</div><div class="skills-grid">${data.skills.map(s => `<span class="skill">${s}</span>`).join('')}</div></div>` : ''}
  ${data.projects?.length ? `<div class="section"><div class="section-title">Projects</div>${data.projects.map(p => `<div class="project"><div class="project-top"><span class="project-name">${p.name}</span><span class="project-tech">${p.tech}</span></div><div class="project-desc">${p.description}</div></div>`).join('')}</div>` : ''}
  ${data.experience?.length ? `<div class="section"><div class="section-title">Experience</div>${data.experience.map(e => `<div class="exp-item"><div class="exp-top"><span class="exp-role">${e.role}</span><span class="exp-duration">${e.duration}</span></div><div class="exp-company">${e.company}</div><div class="exp-desc">${e.description}</div></div>`).join('')}</div>` : ''}
  ${data.education?.length ? `<div class="section"><div class="section-title">Education</div>${data.education.map(e => `<div class="edu-item"><div class="edu-left"><div class="edu-degree">${e.degree}</div><div class="edu-inst">${e.institution}</div></div><div class="edu-right"><div class="edu-year">${e.year}</div><div class="edu-grade">${e.grade}</div></div></div>`).join('')}</div>` : ''}
  ${data.activities?.length ? `<div class="section"><div class="section-title">Co-Curricular Activities</div>${data.activities.map(a => `<div class="activity">${a}</div>`).join('')}</div>` : ''}
</div>
</body>
</html>`

    return await generatePdfFromHtml(html)
}

module.exports = { generateInterviewReport, generateResumePdf }