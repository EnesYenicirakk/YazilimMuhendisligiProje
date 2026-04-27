import { aiConfig } from '../config/aiConfig'

/**
 * Yapay Zeka Asistanı API Servisi
 */
export const fetchAiResponse = async (userMessage) => {
  if (!aiConfig.apiKey) {
    throw new Error('API anahtarı eksik. Lütfen yapılandırmayı kontrol edin.')
  }

  try {
    const response = await fetch(aiConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiConfig.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': aiConfig.siteName,
      },
      body: JSON.stringify({
        model: aiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'Sen yardımcı bir kişisel asistansın. Kullanıcının sorularına kısa, öz ve nazik cevaplar ver.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'API isteği başarısız oldu.')
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('AI Service Error:', error)
    throw error
  }
}
