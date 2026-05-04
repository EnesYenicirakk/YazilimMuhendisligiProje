import { aiConfig } from '../config/aiConfig'

/**
 * Yapay Zeka Asistanı API Servisi
 */
export const fetchAiResponse = async (userMessage, context = '') => {
  if (!aiConfig.apiKey) {
    throw new Error('API anahtarı eksik. Lütfen yapılandırmayı kontrol edin.')
  }

  try {
    const systemContent = `Sen Nex adında, gelişmiş bir kurumsal iş asistanısın. Görevin, kullanıcının iş süreçlerini (stok, sipariş, finans, müşteri ilişkileri) yönetmesine yardımcı olmak ve eldeki verilere dayanarak mantıklı analizler sunmaktır.
    
    KURALLAR:
    1. Her zaman nazik, profesyonel ve çözüm odaklı ol.
    2. Kullanıcının sorduğu istatistiksel sorulara eldeki güncel verilerle yanıt ver.
    3. Eğer bir veri negatifse (örneğin Net Kar: -₺1.850), bunun bir zarar durumu olduğunu ancak iyileştirilebileceğini belirterek profesyonel yorum yap.
    4. Cevaplarını kısa ve öz tut, gereksiz teknik terimlerden kaçın.
    5. Kullanıcı "toplam sipariş" gibi genel bir soru sorduğunda, sadece bugünü değil sistemdeki toplam veriyi baz al.
    
    ${context ? `MEVCUT SİSTEM VERİLERİ (GÜNCEL):
    ${context}` : ''}`

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
            content: systemContent
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
