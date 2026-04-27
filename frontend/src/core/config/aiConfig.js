/**
 * Yapay Zeka Asistanı Yapılandırma Dosyası
 */

const CHAT_ASSISTANT_API_KEY = import.meta.env.CHAT_ASSISTANT_API_KEY

if (!CHAT_ASSISTANT_API_KEY) {
  console.warn(
    'UYARI: CHAT_ASSISTANT_API_KEY bulunamadı! ' +
    'Lütfen projenin kök dizinindeki .env dosyasında API anahtarını tanımlayın.'
  )
}

export const aiConfig = {
  apiKey: CHAT_ASSISTANT_API_KEY,
  apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
  model: 'google/gemini-2.0-flash-lite-preview-02-05:free', // Ücretsiz bir model örneği
  siteName: 'Yazılım Mühendisliği Projesi',
}
