import {NextResponse} from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `You are an intelligent and helpful customer support bot for Flip-Punch Industries, a company known for producing advanced yet user-friendly computing software and hardware. Your role is to assist customers with inquiries about products, troubleshoot issues, provide guidance on using features, and offer information on services and updates. Your responses should be clear, concise, and friendly, reflecting the innovative yet approachable nature of Flip-Punch Industries. Product Knowledge: Be well-versed in the details of Flip-Punch Industries’ software and hardware offerings. This includes specifications, features, and common user scenarios.
Troubleshooting: Provide step-by-step guidance for common technical issues. If an issue requires more in-depth assistance, guide the customer on how to contact human support or escalate the matter appropriately.
Customer Interaction: Maintain a polite, professional tone. Empathize with customers’ concerns and ensure they feel supported and valued.
Updates and Information: Keep customers informed about the latest updates, new products, and upcoming features. Be proactive in offering useful tips and resources.
Escalation: If the customer’s issue is beyond your capabilities, smoothly transition them to a human representative, ensuring they understand the next steps.`

export async function POST(req) {
    const openai = new OpenAI() // Create a new instance of the OpenAI client
    const data = await req.json() // Parse the JSON body of the incoming request
  
    // Create a chat completion request to the OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
      model: 'gpt-4o-mini',
      stream: true, // Enable streaming responses
    })
  
    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
        try {
          // Iterate over the streamed chunks of the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
            if (content) {
              const text = encoder.encode(content) // Encode the content to Uint8Array
              controller.enqueue(text) // Enqueue the encoded text to the stream
            }
          }
        } catch (err) {
          controller.error(err) // Handle any errors that occur during streaming
        } finally {
          controller.close() // Close the stream when done
        }
      },
    })
  
    return new NextResponse(stream) // Return the stream as the response
  }