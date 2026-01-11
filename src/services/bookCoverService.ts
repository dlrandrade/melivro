import { Book } from '../../types';

/**
 * Book Cover Service
 * Fetches book covers from multiple free APIs:
 * 1. Google Books API (no key required, limited)
 * 2. Open Library API (free, unlimited)
 */

// Fetch from Google Books (no API key - works with limits)
export const fetchFromGoogleBooks = async (title: string, author: string): Promise<Partial<Book> | null> => {
    // Try Title + Author first, then just Title
    const queries = [`${title} ${author}`, title];

    for (const q of queries) {
        const query = encodeURIComponent(q);
        const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

        try {
            const response = await fetch(url);
            if (!response.ok) continue;

            const data = await response.json();
            if (!data.items || data.items.length === 0) continue;

            const volumeInfo = data.items[0].volumeInfo;
            const isbn13 = volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_13');
            const isbn10 = volumeInfo.industryIdentifiers?.find((id: any) => id.type === 'ISBN_10');

            // Get best quality image - upgrade HTTP to HTTPS
            let coverUrl = volumeInfo.imageLinks?.extraLarge ||
                volumeInfo.imageLinks?.large ||
                volumeInfo.imageLinks?.medium ||
                volumeInfo.imageLinks?.thumbnail ||
                volumeInfo.imageLinks?.smallThumbnail || '';

            // Replace HTTP with HTTPS and ensure decent quality but not too high that it might break
            if (coverUrl) {
                coverUrl = coverUrl.replace('http://', 'https://');
                coverUrl = coverUrl.replace('&edge=curl', ''); // Remove curl effect
                // zoom=1 is usually safer and always present
            }

            return {
                title: volumeInfo.title,
                authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : author,
                synopsis: volumeInfo.description || '',
                coverUrl: coverUrl,
                isbn13: isbn13?.identifier || isbn10?.identifier || '',
                pages: volumeInfo.pageCount,
                publicationDate: volumeInfo.publishedDate,
                categories: volumeInfo.categories || [],
            };
        } catch (error) {
            console.error('Google Books fetch error:', error);
        }
    }
    return null;
};

// Fetch from Open Library (completely free, no limits)
export const fetchFromOpenLibrary = async (title: string, author: string): Promise<Partial<Book> | null> => {
    const queries = [`${title} ${author}`, title];

    for (const q of queries) {
        const query = encodeURIComponent(q);
        const url = `https://openlibrary.org/search.json?q=${query}&limit=1`;

        try {
            const response = await fetch(url);
            if (!response.ok) continue;

            const data = await response.json();
            if (!data.docs || data.docs.length === 0) continue;

            const book = data.docs[0];
            const coverId = book.cover_i;
            const isbn = book.isbn ? book.isbn[0] : '';

            // Open Library cover URL - Prefer ISBN if available, otherwise coverId
            let coverUrl = '';
            if (isbn) {
                coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
            } else if (coverId) {
                coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
            }

            return {
                title: book.title,
                authors: book.author_name ? book.author_name.join(', ') : author,
                synopsis: book.first_sentence?.join(' ') || '',
                coverUrl: coverUrl,
                isbn13: isbn,
                pages: book.number_of_pages_median,
                publicationDate: book.first_publish_year?.toString(),
                categories: book.subject?.slice(0, 5) || [],
            };
        } catch (error) {
            console.error('Open Library fetch error:', error);
        }
    }
    return null;
};

// Fetch cover by ISBN from Open Library (direct image URL)
export const fetchCoverByISBN = (isbn: string): string => {
    if (!isbn) return '';
    const sanitizedIsbn = isbn.replace(/[^0-9X]/gi, '');
    return `https://covers.openlibrary.org/b/isbn/${sanitizedIsbn}-L.jpg`;
};

// Combined search - tries Google Books first, then Open Library
export const fetchBookDetails = async (title: string, author: string): Promise<Partial<Book> | null> => {
    // Try Google Books first
    let result = await fetchFromGoogleBooks(title, author);

    // If no cover from Google, try Open Library
    if (!result || !result.coverUrl) {
        const olResult = await fetchFromOpenLibrary(title, author);
        if (olResult && olResult.coverUrl) {
            if (result) {
                result.coverUrl = olResult.coverUrl;
                if (!result.isbn13) result.isbn13 = olResult.isbn13;
            } else {
                result = olResult;
            }
        }
    }

    return result;
};

// Search specifically for cover URL
export const searchBookCover = async (title: string, author: string): Promise<string> => {
    const result = await fetchBookDetails(title, author);
    return result?.coverUrl || '';
};

export default {
    fetchFromGoogleBooks,
    fetchFromOpenLibrary,
    fetchBookDetails,
    searchBookCover,
    fetchCoverByISBN
};
