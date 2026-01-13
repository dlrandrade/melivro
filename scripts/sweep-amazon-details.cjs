
require('dotenv').config();
const fs = require('fs');

async function callScraper(url) {
    const prompt = `Você é um especialista em curadoria de livros. Analise o conteúdo da página da Amazon fornecida e extraia:
- sinopse detalhada (preferencialmente vinda da seção "bookDescription_feature", traduzida para PORTUGUÊS BRASILEIRO. Texto rico e completo. Mantenha os parágrafos.)
- Nota média de avaliação (rating) de 1 a 5 (ex: 4.8)
- Número total de avaliações (reviewCount)

Retorne APENAS um objeto JSON válido com as propriedades: synopsis, rating, reviewCount. Sem explicações adicionais.`;

    const fnUrl = process.env.VITE_OPENROUTER_FN_URL;
    const resp = await fetch(fnUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, url }),
    });

    const json = await resp.json();
    if (!resp.ok) throw new Error(json.error || "Failed fetch");
    const match = json.result.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in result: " + json.result);
    return JSON.parse(match[0]);
}

async function run() {
    // Use fetch to get books from Supabase REST API (bypassing the need for the library for just a simple GET)
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    const resp = await fetch(`${supabaseUrl}/rest/v1/books?select=id,title,authors,isbn13`, {
        headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` }
    });
    const books = await resp.json();

    console.log(`Iniciando processamento de ${books.length} livros...`);
    const sqlFile = 'updates.sql';
    fs.writeFileSync(sqlFile, '-- Amazon Synopses and Ratings Update\n');

    for (const book of books) {
        console.log(`> Buscando detalhes para: ${book.title}...`);
        try {
            const query = book.isbn13 || `${book.title} ${book.authors} amazon.com.br`;
            const searchUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(query)}`;

            const details = await callScraper(searchUrl);

            if (details) {
                console.log(`  - Nota: ${details.rating}`);
                const synopsisEscaped = details.synopsis ? details.synopsis.replace(/'/g, "''") : '';
                const rating = parseFloat(details.rating) || 'NULL';
                const reviewCount = parseInt(details.reviewCount) || 'NULL';

                const sql = `UPDATE books SET synopsis = '${synopsisEscaped}', rating = ${rating}, review_count = ${reviewCount} WHERE id = '${book.id}';\n`;
                fs.appendFileSync(sqlFile, sql);
                console.log(`  - SQL gerado.`);
            }
        } catch (e) {
            console.log(`  - ERRO: ${e.message}`);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log(`Fim. SQL salvo em ${sqlFile}`);
}
run();
