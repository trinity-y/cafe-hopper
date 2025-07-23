import { CreateBookmarkDTO, IBookmark } from './bookmark.interface';
import { ICafe } from './cafe.interface'

export interface IBookmarkServiceAPI {
  getAllBookmarks(): Promise<IBookmark[] | null>;
  getAllBookmarksForUser(uid: number): Promise<IBookmark[] | null>;
  getBookmarkedCafesForUser(uid: number): Promise<(ICafe & { bookmarkId: number })[] | null>;
  createBookmark(bookmark: CreateBookmarkDTO):  Promise<IBookmark | null>;
  deleteBookmark(id: number): Promise<boolean>;
}
