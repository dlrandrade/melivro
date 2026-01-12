
import { NotablePerson, Book, CitationType, Activity, ActivityType, BookStatus, User } from './types';

export const AFFILIATE_TAG = 'danluz-20';

export const MOCK_USERS: { [key: string]: User } = {
  'u1': { id: 'u1', name: 'Daniel G.', username: 'dan_dev', avatarUrl: 'https://i.pravatar.cc/48?u=dan_dev' },
  'u2': { id: 'u2', name: 'Camila Reads', username: 'camila_reads', avatarUrl: 'https://i.pravatar.cc/48?u=camila_reads' },
  'u3': { id: 'u3', name: 'Marcos P.', username: 'marcos99', avatarUrl: 'https://i.pravatar.cc/48?u=marcos99' },
};

export const MOCK_PEOPLE: NotablePerson[] = [
  {
    id: '1',
    name: 'Bill Gates',
    slug: 'bill-gates',
    bio: 'Cofundador da Microsoft, filantropo e um dos maiores leitores do mundo. Conhecido por suas listas anuais no GatesNotes.',
    imageUrl: 'https://i.insider.com/65e9f92e032bd36534574773?width=1200&format=jpeg',
    country: 'EUA',
    tags: ['Tecnologia', 'Filantropia', 'Saúde Global']
  },
  {
    id: '2',
    name: 'Naval Ravikant',
    slug: 'naval',
    bio: 'Empreendedor, investidor e filósofo moderno. Defensor da leitura como ferramenta de liberdade mental.',
    imageUrl: 'https://pbs.twimg.com/profile_images/1256801994196824064/qJ4J3_2e_400x400.jpg',
    country: 'EUA',
    tags: ['Filosofia', 'Investimento', 'Felicidade']
  },
  {
    id: '3',
    name: 'Yuval Noah Harari',
    slug: 'yuval-harari',
    bio: 'Historiador e autor best-seller de Sapiens. Suas recomendações focam no futuro da humanidade.',
    imageUrl: 'https://www.ynharari.com/wp-content/uploads/2022/10/Image-for-the-new-homepage-1-1.jpg',
    country: 'Israel',
    tags: ['História', 'Ciência', 'Futuro']
  },
  {
    id: '4',
    name: 'Tim Ferriss',
    slug: 'tim-ferriss',
    bio: 'Autor de "4 Horas para o Corpo" e "Tribe of Mentors". É conhecido por seu podcast onde entrevista especialistas de diversas áreas.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Tim_Ferriss_in_2017_%28cropped%29.jpg/640px-Tim_Ferriss_in_2017_%28cropped%29.jpg',
    country: 'EUA',
    tags: ['Produtividade', 'Empreendedorismo']
  },
  {
    id: '5',
    name: 'Brené Brown',
    slug: 'brene-brown',
    bio: 'Pesquisadora e autora, famosa por seus estudos sobre coragem, vulnerabilidade, vergonha e empatia.',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Brene_Brown_2012_cropped.jpg/1200px-Brene_Brown_2012_cropped.jpg',
    country: 'EUA',
    tags: ['Psicologia', 'Liderança']
  },
  {
    id: '6',
    name: 'Sam Altman',
    slug: 'sam-altman',
    bio: 'CEO da OpenAI e ex-presidente da Y Combinator. Suas leituras frequentemente exploram o futuro da tecnologia e da sociedade.',
    imageUrl: 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i4jPh_2t0sI8/v1/1200x-1.jpg',
    country: 'EUA',
    tags: ['IA', 'Futurismo', 'Startups']
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: '101',
    title: 'Sapiens: Uma Breve História da Humanidade',
    slug: 'sapiens',
    authors: 'Yuval Noah Harari',
    isbn13: '9788535925173',
    coverUrl: 'https://m.media-amazon.com/images/I/71YvR0+VbAL._SY466_.jpg',
    synopsis: 'O livro que explica como o Homo Sapiens se tornou o dono do planeta, desde as savanas africanas até as metrópoles modernas.',
    language: 'PT',
    categories: ['História', 'Não-ficção'],
    citationCount: 156,
    rating: 9.4,
    pages: 464,
    publicationDate: '10 Nov 2014',
    reviewCount: 1240,
  },
  {
    id: '102',
    title: 'Educada (Educated)',
    slug: 'educated',
    authors: 'Tara Westover',
    isbn13: '9788501115164',
    coverUrl: 'https://m.media-amazon.com/images/I/81S2Hh6J6PL._SY466_.jpg',
    synopsis: 'Uma biografia emocionante sobre a busca pelo conhecimento contra todas as probabilidades, de uma infância isolada em Idaho a uma educação em Cambridge.',
    language: 'PT',
    categories: ['Biografia', 'Educação'],
    citationCount: 42,
    rating: 9.1,
    pages: 352,
    publicationDate: '20 Fev 2018',
    reviewCount: 1860,
  },
  {
    id: '103',
    title: 'Por que nós dormimos',
    slug: 'why-we-sleep',
    authors: 'Matthew Walker',
    isbn13: '9788551003718',
    coverUrl: 'https://m.media-amazon.com/images/I/71I97E2i2JL._SY466_.jpg',
    synopsis: 'Um mergulho profundo na ciência do sono, revelando o papel vital que ele desempenha em nossa saúde física e mental.',
    language: 'PT',
    categories: ['Saúde', 'Ciência'],
    citationCount: 88,
    rating: 8.9,
    pages: 400,
    publicationDate: '03 Out 2017',
    reviewCount: 950,
  },
  {
    id: '104',
    title: 'O Gene',
    slug: 'the-gene',
    authors: 'Siddhartha Mukherjee',
    isbn13: '9788535927597',
    coverUrl: 'https://m.media-amazon.com/images/I/61I2o80WfUL._SY466_.jpg',
    synopsis: 'A história épica e íntima da unidade fundamental da hereditariedade, entrelaçando ciência, história e memórias pessoais.',
    language: 'PT',
    categories: ['Ciência', 'Biologia'],
    citationCount: 34,
    rating: 9.3,
    pages: 608,
    publicationDate: '17 Mai 2016',
    reviewCount: 730,
  }
];

export const MOCK_CITATIONS = [
  { id: 'c1', personId: '1', bookId: '101', citedYear: 2016, citedType: CitationType.RECOMMENDED, sourceTitle: 'Gates Notes', sourceUrl: 'https://www.gatesnotes.com', quoteExcerpt: 'Eu recomendaria Sapiens para qualquer pessoa interessada na história da nossa espécie. É brilhante.' },
  { id: 'c2', personId: '1', bookId: '102', citedYear: 2018, citedType: CitationType.FAVORITE, sourceTitle: 'Favoritos do Ano de 2018', sourceUrl: 'https://www.gatesnotes.com', quoteExcerpt: 'Eu nunca achei que leria um livro sobre uma família de sobrevivencialistas e não conseguiria parar.' },
  { id: 'c3', personId: '1', bookId: '103', citedYear: 2019, citedType: CitationType.RECOMMENDED, sourceTitle: 'Summer Reading List', sourceUrl: 'https://www.gatesnotes.com', quoteExcerpt: 'Walker me convenceu a mudar meus hábitos de sono para melhorar minha saúde.' },
  { id: 'c4', personId: '1', bookId: '104', citedYear: 2016, citedType: CitationType.RECOMMENDED, sourceTitle: 'Gates Notes', sourceUrl: 'https://www.gatesnotes.com', quoteExcerpt: 'Mukherjee escreveu este livro para um público leigo porque sabe que as novas tecnologias genéticas estão prestes a afetar profundamente a todos nós.' }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    user: MOCK_USERS['u1'],
    type: ActivityType.GOAL_SET,
    timestamp: '2 horas atrás',
    payload: { goal: { year: 2024, count: 24 } },
    likes: 15,
    comments: 2
  },
  {
    id: 'a2',
    user: MOCK_USERS['u2'],
    type: ActivityType.STATUS_UPDATE,
    timestamp: '5 horas atrás',
    payload: {
      book: MOCK_BOOKS[1], // Educada
      person: MOCK_PEOPLE[0], // Bill Gates
      status: BookStatus.READ
    },
    likes: 42,
    comments: 8
  },
  {
    id: 'a3',
    user: MOCK_USERS['u3'],
    type: ActivityType.STATUS_UPDATE,
    timestamp: '1 dia atrás',
    payload: {
      book: MOCK_BOOKS[0], // Sapiens
      person: MOCK_PEOPLE[2], // Yuval Noah Harari
      status: BookStatus.WANT_TO_READ
    },
    likes: 28,
    comments: 5
  }
];