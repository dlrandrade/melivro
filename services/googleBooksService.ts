
import { Book } from '../types';

const API_KEY = process.env.API_KEY;

// Helper to safely get nested properties from the API response
const get = (obj: any, path: string, defaultValue: any = undefined) => {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
};

export const fetchBookDetailsFromGoogleBooksByISBN = async (isbn: string): Promise<Partial<Book> | null> => {
    if (!API_KEY) {
        console.error("API Key is missing. Please set the API_KEY environment variable.");
        alert("A chave da API não está configurada. A busca no Google Books pode não funcionar.");
        return null;
    }

    // Sanitize ISBN to remove hyphens and other non-numeric characters.
    const sanitizedIsbn = isbn.trim().replace(/[^0-9X]/gi, '');

    // If the sanitized ISBN is empty (e.g., user entered "abc"), prevent the API call.
    if (!sanitizedIsbn) {
        console.warn(`Invalid ISBN provided. Original: "${isbn}", Sanitized: "${sanitizedIsbn}"`);
        alert("O ISBN fornecido é inválido. Insira um número de ISBN válido.");
        return null;
    }

    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${sanitizedIsbn}&key=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Google Books API request failed with status:", response.status);
            return null;
        }

        const data = await response.json();
        if (!data.items || data.items.length === 0) {
            console.warn(`No book found for ISBN: ${isbn}`);
            return null;
        }

        const volumeInfo = data.items[0].volumeInfo;
        const isbn13Identifier = volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13');
        
        // Prefer higher quality images if available from the API
        const coverUrl = get(volumeInfo, 'imageLinks.large') || get(volumeInfo, 'imageLinks.medium') || get(volumeInfo, 'imageLinks.thumbnail');

        const bookData: Partial<Book> = {
            title: volumeInfo.title,
            authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor desconhecido',
            synopsis: volumeInfo.description,
            coverUrl: coverUrl,
            isbn13: isbn13Identifier ? isbn13Identifier.identifier : isbn,
            pages: volumeInfo.pageCount,
            publicationDate: volumeInfo.publishedDate,
            categories: volumeInfo.categories || [],
        };

        return bookData;

    } catch (error) {
        console.error("Error fetching data from Google Books API:", error);
        return null;
    }
};
