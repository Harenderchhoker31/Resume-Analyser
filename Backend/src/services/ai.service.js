const OpenAI = require("openai")

const ai = new OpenAI({
    apiKey: process.env.NVIDIA_API_KEY,
    baseURL: "https://integrate.api.nvidia.com/v1"
})



async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert technical interviewer and career coach. Analyze the candidate's resume, self description, and job description thoroughly, then generate a detailed interview report. Return ONLY a valid JSON object with no extra text.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Requirements:
- Generate at least 5 technical questions highly relevant to the job and candidate's background
- Generate at least 5 behavioral questions based on the candidate's experience and job requirements
- Identify ALL skill gaps between the candidate's profile and job requirements
- Create a 5-day detailed preparation plan with 4-5 specific tasks per day
- Each question answer must be detailed (4-6 sentences) covering key points, approach, and examples
- matchScore should reflect honest assessment of candidate fit

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

module.exports=generateInterviewReport 