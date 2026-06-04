export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })

    const text = await response.text()
    res.setHeader('Content-Type', 'application/json')
    res.status(response.status).send(text)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}