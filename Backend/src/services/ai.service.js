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
    const prompt = `You are a professional resume writer. Generate a highly professional, ATS-friendly resume in HTML format tailored for the job description below. Return ONLY a valid JSON object with no extra text.

Resume Content: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return JSON in this exact format:
{ "html": "<complete HTML document>" }

Strict Requirements:
- Use a clean, modern, professional design with inline CSS only
- Use a two-column or well-structured single-column layout
- Color scheme: dark navy (#1a2332) for headers, white background, subtle gray (#f8f9fa) for section backgrounds
- Font: Arial or system-ui, professional sizing (name: 24px bold, section headers: 13px uppercase, body: 11px)
- Sections in order: Header (name + contact), Summary, Skills, Experience/Projects, Education, Extra-Curricular
- ALL links must be real working anchor tags with correct href: email as mailto:, LinkedIn/GitHub/portfolio as full https:// URLs - extract exact URLs from the resume content
- Style anchor tags with color: #1a2332; text-decoration: none;
- Highlight skills and keywords that match the job description
- Keep it to 1 page, concise and impactful
- Do NOT include any placeholder text like [Company Name] or [Date]
- Content must sound human-written, not AI-generated
- Add a thin colored left border (#1a2332) to section headers for visual appeal
- Include a skills section with relevant technologies grouped by category`

    const response = await ai.chat.completions.create({
        model: "meta/llama-3.3-70b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4096
    })

    const text = response.choices[0].message.content
    const start = text.indexOf('"html"')
    const htmlStart = text.indexOf('"', start + 6) + 1
    const htmlEnd = text.lastIndexOf('"')
    const html = text.slice(htmlStart, htmlEnd)
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
    return await generatePdfFromHtml(html)
}

module.exports = { generateInterviewReport, generateResumePdf }