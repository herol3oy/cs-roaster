import { GoogleGenerativeAI } from '@google/generative-ai'

export const generateRoast = async (
  couchsurferInfo: string,
  language: string,
) => {
  const systemInstruction =
    'You create playful ridicule and roasts of CouchSurfer member based on their profile information. Keep it fun, humorous, and brief'
  const prompt = `Write a short and playful roast in ${language} for the following CouchSurfer: ${couchsurferInfo}`

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction,
    generationConfig: { temperature: 1 },
  })

  return (await model.generateContent(prompt)).response.text()
}
