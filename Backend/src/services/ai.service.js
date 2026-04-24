const OpenAI = require("openai")
const puppeteer = require("puppeteer")

const ai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1"
})

async function generatePdfFromHtml(html) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
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
    const prompt = `You are a professional resume writer. Extract information from the resume and self description below, then return ONLY a valid JSON object with no extra text, no newlines inside string values.

Resume Content: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return this exact JSON structure (all values must be single-line strings, no line breaks inside values):
{
  "name": "full name",
  "email": "email",
  "phone": "phone",
  "linkedin": "full linkedin url or empty string",
  "github": "full github url or empty string",
  "summary": "2-3 sentence professional summary tailored to job",
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [{"name": "project name", "tech": "tech stack", "description": "one line description", "link": "url or empty"}],
  "education": [{"degree": "degree name", "institution": "institution", "year": "year range", "grade": "grade"}],
  "activities": ["activity1", "activity2"]
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
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; font-size: 11px; color: #222; background: #fff; }
  .header { background: #1a2332; color: white; padding: 24px 30px; }
  .header h1 { font-size: 26px; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px; }
  .contact { display: flex; gap: 16px; flex-wrap: wrap; font-size: 10.5px; }
  .contact a { color: #a8c4e0; text-decoration: none; }
  .body { padding: 20px 30px; }
  .section { margin-bottom: 16px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1a2332; border-left: 3px solid #1a2332; padding-left: 8px; margin-bottom: 10px; }
  .summary { color: #444; line-height: 1.6; }
  .skills { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill { background: #f0f4f8; border: 1px solid #d0dce8; padding: 3px 10px; border-radius: 3px; font-size: 10px; color: #1a2332; }
  .project { margin-bottom: 10px; }
  .project-header { display: flex; justify-content: space-between; align-items: center; }
  .project-name { font-weight: 700; color: #1a2332; font-size: 11.5px; }
  .project-tech { color: #666; font-size: 10px; font-style: italic; }
  .project-desc { color: #444; margin-top: 3px; line-height: 1.5; }
  .project-link a { color: #1a2332; font-size: 10px; }
  .edu-item { margin-bottom: 8px; }
  .edu-header { display: flex; justify-content: space-between; }
  .edu-degree { font-weight: 700; color: #1a2332; }
  .edu-grade { color: #666; }
  .edu-inst { color: #444; }
  .activity { color: #444; margin-bottom: 4px; padding-left: 12px; position: relative; }
  .activity::before { content: '•'; position: absolute; left: 0; color: #1a2332; }
</style>
</head>
<body>
<div class="header">
  <h1>${data.name}</h1>
  <div class="contact">
    ${data.email ? `<span><a href="mailto:${data.email}">${data.email}</a></span>` : ''}
    ${data.phone ? `<span>${data.phone}</span>` : ''}
    ${data.linkedin ? `<span><a href="${data.linkedin}">LinkedIn</a></span>` : ''}
    ${data.github ? `<span><a href="${data.github}">GitHub</a></span>` : ''}
  </div>
</div>
<div class="body">
  ${data.summary ? `<div class="section"><div class="section-title">Professional Summary</div><div class="summary">${data.summary}</div></div>` : ''}
  ${data.skills?.length ? `<div class="section"><div class="section-title">Skills</div><div class="skills">${data.skills.map(s => `<span class="skill">${s}</span>`).join('')}</div></div>` : ''}
  ${data.projects?.length ? `<div class="section"><div class="section-title">Projects</div>${data.projects.map(p => `<div class="project"><div class="project-header"><span class="project-name">${p.name}</span><span class="project-tech">${p.tech}</span></div><div class="project-desc">${p.description}</div>${p.link ? `<div class="project-link"><a href="${p.link}">${p.link}</a></div>` : ''}</div>`).join('')}</div>` : ''}
  ${data.education?.length ? `<div class="section"><div class="section-title">Education</div>${data.education.map(e => `<div class="edu-item"><div class="edu-header"><span class="edu-degree">${e.degree}</span><span class="edu-grade">${e.grade}</span></div><div class="edu-inst">${e.institution} | ${e.year}</div></div>`).join('')}</div>` : ''}
  ${data.activities?.length ? `<div class="section"><div class="section-title">Extra-Curricular</div>${data.activities.map(a => `<div class="activity">${a}</div>`).join('')}</div>` : ''}
</div>
</body>
</html>`

    return await generatePdfFromHtml(html)
}

module.exports = { generateInterviewReport, generateResumePdf }