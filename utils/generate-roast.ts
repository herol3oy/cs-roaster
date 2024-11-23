import { GoogleGenerativeAI } from '@google/generative-ai'

export const generateRoast = async (
  couchsurferInfo: string,
  language: string = 'English',
  isCsRequest: boolean = false,
  postcard: string,
  chocolate: string,
  cooking: string,
) => {
  const systemInstruction = isCsRequest
    ? 'You create polite and creative Couchsurfing request based on their profile information. Keep it fun, humorous, and brief.'
    : 'You create playful ridicule and roasts of CouchSurfer member based on their profile information. Keep it fun, humorous, and brief.'

  const prompt = isCsRequest
    ? `Write a short and creative couch request without a subject in ${language}.
       Make sure to mention that the request sender would like to do one of the following if any of them are on. if null, don't mention:
       Postcard: ${postcard}
       Chocolate: ${chocolate}
       Cooking: ${cooking}
       You have the HTML profile info of the request sender (1st) and the possible future host, request receiver, (2nd) below:
       ${couchsurferInfo}
       `
    : `Write a short and playful roast in ${language} for the following CouchSurfer: ${couchsurferInfo}`

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction,
    generationConfig: { temperature: 1 },
  })

  return (await model.generateContent(prompt)).response.text()
}
