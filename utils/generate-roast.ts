import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: 'https://api.deepseek.com',
})

export const generateRoast = async (
  couchsurferInfo: string,
  language: string = 'English',
  isCsRequest: boolean = false,
  postcard?: string,
  chocolate?: string,
  cooking?: string,
) => {
  const systemInstruction = isCsRequest
    ? 'You create polite and creative Couchsurfing request based on their profile information. Keep it fun, humorous, and brief.'
    : 'You create playful ridicule and roasts of CouchSurfer member based on their profile information. Keep it fun, humorous, and brief.'

  const prompt = isCsRequest
    ? `Write a short and creative couch request without subject in ${language}. Only return the request so I only copy and paste it.
        Make sure to mention that the request sender would like to do one of the following if any of them are on. If null, don't mention:
        Postcard: ${postcard}
        Chocolate: ${chocolate}
        Cooking: ${cooking}

You have the HTML profile info of the request sender (1st) and the possible future host, request receiver (2nd) below:
${couchsurferInfo}`
    : `Write a short and playful roast in ${language} for the following CouchSurfer:

${couchsurferInfo}`

  const completion = await client.chat.completions.create({
    model: 'deepseek-chat',
    temperature: 1,
    messages: [
      {
        role: 'system',
        content: systemInstruction,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  return completion.choices[0].message.content ?? ''
}
