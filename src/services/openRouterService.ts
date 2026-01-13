// src/services/openRouterService.ts
import { type Book } from '../../types';
import { fetchBookDetails } from './bookCoverService';

/** Generic helper to call OpenRouter Edge Function */
async function callOpenRouter(options: { prompt?: string; url?: string }): Promise<any> {
  const fnUrl = import.meta.env.VITE_OPENROUTER_FN_URL;
  const resp = await fetch(fnUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  });
  const json = await resp.json();
  if (!resp.ok) {
    throw new Error(json.error || `OpenRouter function error ${resp.status}`);
  }
  return json.result;
}

/** Helper to extract JSON from AI response that may contain markdown code blocks */
function extractJson(text: string): string {
  // Remove markdown code blocks if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }
  // Try to find JSON array or object directly
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return arrayMatch[0];
  }
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return objectMatch[0];
  }
  return text.trim();
}

/** Fetch book details from an Amazon URL */
export async function fetchBookDetailsFromAmazonUrl(url: string): Promise<Partial<Book> | null> {
  try {
    const prompt = `Você é um especialista em curadoria de livros. Analise o conteúdo da página da Amazon fornecida e extraia:
- título do livro
- autor(es)
- sinopse detalhada (preferencialmente vinda da seção "bookDescription_feature" ou similar, traduzida para PORTUGUÊS BRASILEIRO se necessário. Mantenha um texto rico e fluido, não apenas 2 frases)
- URL da capa em alta resolução
- ISBN-13
- Nota média de avaliação (rating) de 1 a 5 (ex: 4.8)
- Número total de avaliações (reviewCount)

Retorne APENAS um objeto JSON válido com as propriedades: title, authors, synopsis, coverUrl, isbn13, rating, reviewCount. Sem explicações adicionais.`;

    const raw = await callOpenRouter({ prompt, url });
    const jsonStr = extractJson(raw);
    const data = JSON.parse(jsonStr);
    return {
      ...data,
      rating: data.rating ? parseFloat(data.rating) : undefined,
      reviewCount: data.reviewCount ? parseInt(data.reviewCount) : undefined
    } as Partial<Book>;
  } catch (e) {
    console.error('OpenRouter Amazon fetch error:', e);
    return null;
  }
}


/** Fetch generic link preview */
export async function fetchLinkPreview(url: string): Promise<{ title: string; image?: string; description: string } | null> {
  try {
    const prompt = `Analise o conteúdo do link fornecido. Gere um preview rico contendo:
- Título da página ou artigo
- URL de uma imagem representativa (og:image ou similar)
- Breve descrição/sumário (máximo 2 linhas)

Retorne APENAS um objeto JSON válido com as propriedades: title, image, description. Sem explicações.`;

    const raw = await callOpenRouter({ prompt, url });
    const jsonStr = extractJson(raw);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Link preview error:', e);
    return null;
  }
}

/** Extract list of books from a generic URL */
export async function extractBooksFromUrl(url: string): Promise<Array<{ title: string; author: string; relevance: string }>> {
  try {
    const prompt = `Você é um assistente de curadoria de livros. Analise o conteúdo e extraia, para cada livro mencionado:
- título exato
- autor(es)
- breve contexto de como o livro foi citado

Retorne APENAS um array JSON válido de objetos com as chaves "title", "author" e "relevance". Sem explicações adicionais.`;

    const raw = await callOpenRouter({ prompt, url });
    const jsonStr = extractJson(raw);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('OpenRouter extraction error:', e);
    return [];
  }
}

/** Extract list of books from raw text */
export async function extractBooksFromText(text: string): Promise<Array<{ title: string; author: string; relevance: string }>> {
  try {
    const prompt = `Você é um assistente de curadoria de livros. Analise o texto abaixo e extraia, para cada livro mencionado:
- título exato
- autor(es)
- breve contexto de como o livro foi citado

Retorne APENAS um array JSON válido de objetos com as chaves "title", "author" e "relevance". Sem explicações adicionais.

Texto:
${text}`;
    const raw = await callOpenRouter({ prompt });
    const jsonStr = extractJson(raw);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('OpenRouter text extraction error:', e);
    return [];
  }
}

/** Fetch book details from title + author using real APIs */
export async function fetchBookDetailsFromTitleAndAuthor(title: string, author: string): Promise<Partial<Book> | null> {
  try {
    // Use real book APIs (Google Books + Open Library) for covers
    const bookData = await fetchBookDetails(title, author);

    if (bookData) {
      return {
        coverUrl: bookData.coverUrl || '',
        synopsis: bookData.synopsis || '',
        isbn13: bookData.isbn13 || '',
        pages: bookData.pages,
        categories: bookData.categories || [],
      };
    }

    // Fallback: try AI for full details if no data found
    const prompt = `Forneça os detalhes para o livro "${title}" de ${author}.
Inclua uma sinopse curta (máximo 2 frases), ISBN-13 e uma URL de capa (pode ser um padrão conhecido da Amazon ou Open Library).
Retorne APENAS um objeto JSON com as propriedades: synopsis, isbn13, coverUrl. Sem explicações.`;
    const raw = await callOpenRouter({ prompt });
    const jsonStr = extractJson(raw);
    const aiData = JSON.parse(jsonStr);
    return {
      coverUrl: aiData.coverUrl || '',
      synopsis: aiData.synopsis || '',
      isbn13: aiData.isbn13 || '',
    };
  } catch (e) {
    console.error('Book details fetch error:', e);
    return null;
  }
}

/** Get real recommendations for a person */
export async function getRealRecommendations(personName: string): Promise<Array<{ title: string; author: string; reason: string; year?: number }>> {
  try {
    const prompt = `Quais são as recomendações de livros mais conhecidas de ${personName}? Liste título, autor, motivo da recomendação e, se disponível, o ano em que recomendou.

Retorne APENAS um array JSON válido de objetos com as propriedades: title, author, reason, year. Sem explicações adicionais.`;
    const raw = await callOpenRouter({ prompt });
    const jsonStr = extractJson(raw);
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('OpenRouter recommendations error:', e);
    return [];
  }
}
