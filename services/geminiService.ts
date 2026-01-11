
import { GoogleGenAI, Type } from "@google/genai";

// FIX: Initialize with API key directly from environment variable as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchBookDetailsFromAmazonUrl = async (url: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um assistente para um site de livros. Analise esta URL de produto da Amazon e extraia: título, autor(es), sinopse, URL da imagem da capa (alta resolução) e o ISBN-13. A URL é: ${url}. Retorne como um único objeto JSON.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            authors: { type: Type.STRING },
            synopsis: { type: Type.STRING },
            coverUrl: { type: Type.STRING },
            isbn13: { type: Type.STRING }
          },
          required: ['title', 'authors', 'synopsis', 'coverUrl', 'isbn13']
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Amazon URL Fetch Error:", error);
    return null;
  }
};

export const extractBooksFromUrl = async (url: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um assistente de pesquisa para um site de curadoria de livros chamado meLivro.me. Sua tarefa é analisar o conteúdo da URL fornecida e extrair uma lista de livros mencionados. Para cada livro, identifique o título exato, o(s) autor(es), e um breve contexto sobre como o livro foi mencionado. A URL é: ${url}. Retorne um array JSON com objetos, cada um contendo 'title', 'author', e 'relevance'.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "O título exato do livro." },
              author: { type: Type.STRING, description: "O nome do(s) autor(es) do livro." },
              relevance: { type: Type.STRING, description: "Breve contexto de como o livro foi mencionado na fonte." }
            },
            required: ['title', 'author']
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini URL Extraction Error:", error);
    return [];
  }
};


export const fetchBookDetailsFromAmazon = async (title: string, author: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Encontre a URL da capa de alta resolução na Amazon, uma sinopse oficial concisa (máximo 2 frases) e o ISBN-13 para o livro "${title}" de ${author}. Retorne apenas em formato JSON.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coverUrl: { type: Type.STRING, description: 'URL da imagem da capa do livro na Amazon.' },
            synopsis: { type: Type.STRING, description: 'Sinopse oficial do livro.' },
            isbn13: { type: Type.STRING, description: 'O ISBN de 13 dígitos do livro.' },
          },
          required: ['coverUrl', 'synopsis', 'isbn13']
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Amazon Fetch Error:", error);
    return null;
  }
};


export const getRealRecommendations = async (personName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Quais são as recomendações de livros mais recentes de ${personName}? Liste o título, autor e o motivo da recomendação.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              reason: { type: Type.STRING },
              year: { type: Type.INTEGER }
            },
            required: ['title', 'author', 'reason']
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const extractBooksFromText = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um especialista em literatura e sua tarefa é analisar o texto a seguir para extrair todos os livros mencionados. Para cada livro, forneça o título completo, o nome do autor, e um breve contexto sobre como o livro foi mencionado (ex: 'recomendado como leitura essencial', 'citado como inspiração'). Retorne o resultado como um array de objetos JSON, onde cada objeto tem as chaves 'title', 'author', e 'relevance'. O texto para análise é: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              relevance: { type: Type.STRING, description: 'Como a pessoa menciona o livro' }
            },
            required: ['title', 'author']
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
