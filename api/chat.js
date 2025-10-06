// api/chat.js
export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.APIKEYINGRESAR}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Eres un asistente experto en razonamiento clínico y evaluación neurológica mediante el examen mental del estado (NME). Tu objetivo es ayudar a profesionales de la salud a desarrollar y potenciar sus habilidades de razonamiento clínico, guiándolos a través de casos clínicos, análisis de síntomas, y decisiones diagnósticas basadas en evidencia.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error from OpenAI');
    }

    return res.status(200).json({
      message: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Error processing request' });
  }
}