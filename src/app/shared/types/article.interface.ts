import { ProfileInterface } from './profile.interface';

export interface ArticleInterface {
  author: ProfileInterface;
  body: string;
  createdAt: string;
  description: string;
  favorited: true;
  favoritesCount: number;
  slug: string;
  tagList: string[];
  title: string;
  updatedAt: string;
}
