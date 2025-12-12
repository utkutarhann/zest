import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

let openai: OpenAI | null = null;

if (apiKey) {
  openai = new OpenAI({ apiKey });
}

const SYSTEM_PROMPT = `
Sen "Zest" adında, enerjik bir "Yemek Keşif Asistanı"sın.
Görevin: Kullanıcının elindeki malzemelerle yapabileceği EN POPÜLER 6-8 Türk yemeğini bulmak ve bunları güvenilir kaynaklara yönlendirmek.

SENARYO KURALLARI:
- "bar": SADECE Kokteyl veya İçecek öner.
- "kitchen": SADECE Yemek öner.
- "fit": Düşük kalorili, sağlıklı öneriler yap.
- "full": Tam bir menü (Ana Yemek + İçecek) öner.

ÖZEL TERCİHLER (Varsa Kesinlikle Uy):
- "vegetarian": Asla et/balık kullanma.
- "gluten_free": Un, ekmek, makarna vb. kullanma.
- "alcohol_free": Asla alkol kullanma.

ÇIKTI FORMATI (JSON):
Aşağıdaki yapıda bir JSON objesi döndür:
{
  "recipes": [
    {
      "dishName": "Yemek İsmi (Örn: Karnıyarık)",
      "sourceName": "Kaynak Site İsmi (Örn: Nefis Yemek Tarifleri, Yemek.com, Lezzet.com.tr)",
      "sourceUrl": "Google Arama Linki (Format: https://www.google.com/search?q=site:kaynaksite.com+Yemek+Ismi)",
      "imageUrl": "Yemeği görselleştirmek için EN İYİ İngilizce arama terimi. (Örn: 'Cuba Libre cocktail', 'Menemen dish', 'Karnıyarık turkish food'). Tek kelime yerine spesifik tamlama kullan.",
      "missingIngredients": ["Eksik 1", "Eksik 2"], // Kullanıcının elinde olmayan ama tarif için KRİTİK olan malzemeler.
      "missingCount": 2 // Eksik malzeme sayısı. 0 ise "Tüm Malzemeler Var!" demektir.
    }
  ],
  "chefTip": "Seçtiğin malzemelerle (özellikle X ve Y) harika bir uyum yakalayabilirsin. Benim tavsiyem Z yemeğini denemen çünkü..." // Kullanıcıya özel, samimi bir tavsiye.
}

ÖNEMLİ KURALLAR:
1. ASLA tarifin kendisini yazma. Sadece yönlendir.
2. "missingIngredients" hesaplarken kullanıcının verdiği listeyi baz al. Tuz, karabiber, yağ, su gibi temel malzemeleri "eksik" sayma (bunlar evde var varsayılır).
3. En az 6, en fazla 9 öneri sun.
4. Kaynaklar Türk yemek siteleri olsun (Nefis Yemek Tarifleri, Yemek.com, Lezzet, Mynet Yemek vb.).
`;

export const generateRecipe = async (
  scenario: string,
  ingredients: string[],
  dietaryPreferences: string[] = [],
  language: 'tr' | 'en'
) => {
  if (!openai) {
    throw new Error('OpenAI API Key is missing');
  }

  const userPrompt = `
    Language: ${language}
    Scenario: ${scenario}
    Ingredients: ${ingredients.join(', ')}
    Dietary Preferences: ${dietaryPreferences.join(', ')}
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('No content generated');

  const result = JSON.parse(content);

  // Sort recipes: 0 missing first, then ascending
  if (result.recipes && Array.isArray(result.recipes)) {
    result.recipes.sort((a: any, b: any) => {
      const diff = (a.missingCount || 0) - (b.missingCount || 0);
      if (diff !== 0) return diff;
      // Secondary sort by dishName to be deterministic
      return a.dishName.localeCompare(b.dishName);
    });
  }

  return result;
};

const DETAIL_SYSTEM_PROMPT = `
Sen "Zest" adında, uzman bir şefsin.
Görevin: Verilen yemek ismi için detaylı, adım adım bir tarif oluşturmak.

ÇIKTI FORMATI (JSON):
{
  "prepTime": 30, // Hazırlama süresi (dakika)
  "cookTime": 45, // Pişirme süresi (dakika)
  "servings": 4, // Kaç kişilik
  "difficulty": "medium", // 'easy', 'medium', 'hard'
  "calories": 350, // Porsiyon başına kalori (tahmini)
  "sourceUrl": "https://www.nefisyemektarifleri.com/...", // Varsa GERÇEK tarif linki, yoksa Google arama linki
  "ingredients": [
    { "name": "Yumurta", "amount": "2", "unit": "adet" },
    { "name": "Tuz", "amount": "1", "unit": "çay kaşığı" }
  ],
  "steps": [
    {
      "order": 1,
      "instruction": "Yumurtaları bir kaba kırın.",
      "tip": "Oda sıcaklığında olmaları daha iyi sonuç verir."
    }
  ]
}

KURALLAR:
1. Miktarlar net olsun.
2. Adımlar anlaşılır ve sıralı olsun.
3. Zorluk seviyesini yemeğin karmaşıklığına göre belirle.
4. "ingredients" ve "steps" dizileri ASLA boş olmamalı.
5. Eğer yemek hakkında bilgin yoksa, en yakın tahmini yap veya genel bir tarif uydur ama ASLA boş döndürme.
6. "sourceUrl" alanı için: Eğer bu yemek için bildiğin popüler ve gerçek bir tarif sayfası varsa (Nefis Yemek Tarifleri, Yemek.com vb.) onun direkt linkini ver. Eğer yoksa Google arama linki oluştur.
`;

// Simple in-memory cache
const detailCache = new Map<string, any>();

export const generateRecipeDetail = async (dishName: string, language: 'tr' | 'en') => {
  // Check cache first
  const cacheKey = `${dishName}-${language}`;
  if (detailCache.has(cacheKey)) {
    console.log(`Serving from cache for: ${dishName}`);
    return detailCache.get(cacheKey);
  }

  if (!openai) {
    throw new Error('OpenAI API Key is missing');
  }

  const userPrompt = `
    Language: ${language}
    Dish Name: ${dishName}
    Provide detailed recipe steps and ingredients.
    Ensure valid JSON output.
    Try to provide a real URL for the recipe if possible.
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: DETAIL_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('No content generated');

  try {
    const result = JSON.parse(content);
    // Cache the result
    detailCache.set(cacheKey, result);
    return result;
  } catch (e) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Invalid JSON response from AI");
  }
};
