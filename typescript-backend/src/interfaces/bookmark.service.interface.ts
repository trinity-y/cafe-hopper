import { CreateBookmarkDTO, IBookmark } from './bookmark.interface';

export interface IBookmarkServiceAPI {
  getAllBookmarks(): Promise<IBookmark[]>;
  getAllBookmarksFromUser(uid: number): Promise<IBookmark[] | null>;
  createBookmark(bookmark: CreateBookmarkDTO):  Promise<IBookmark | null>;
  deleteBookmark(id: number): Promise<boolean>;
}
