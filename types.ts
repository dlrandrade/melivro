
export enum BookStatus {
  WANT_TO_READ = 'want_to_read',
  READING = 'reading',
  READ = 'read',
  DROPPED = 'dropped'
}

export enum CitationType {
  RECOMMENDED = 'recommended',
  READING = 'reading',
  FAVORITE = 'favorite',
  CITED = 'cited'
}

export enum ActivityType {
  STATUS_UPDATE = 'status_update',
  GOAL_SET = 'goal_set'
}

export interface NotablePerson {
  id: string;
  name: string;
  slug: string;
  bio: string;
  imageUrl: string;
  country: string;
  tags: string[];
}

export interface Book {
  id: string;
  title: string;
  slug:string;
  authors: string;
  isbn10?: string;
  isbn13?: string;
  coverUrl: string;
  synopsis: string;
  language: string;
  categories: string[];
  citationCount: number;
  rating?: number;
  pages?: number;
  publicationDate?: string;
  reviewCount?: number;
}

export interface Citation {
  id: string;
  personId: string;
  bookId: string;
  citedYear: number;
  citedType: CitationType;
  sourceUrl: string;
  sourceTitle: string;
  sourceDate?: string;
  quoteExcerpt: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
}

export interface Activity {
  id: string;
  user: User;
  type: ActivityType;
  timestamp: string;
  payload: {
    book?: Book;
    person?: NotablePerson; // "Inspired by"
    status?: BookStatus;
    goal?: {
      year: number;
      count: number;
    };
  };
  likes: number;
  comments: number;
}
