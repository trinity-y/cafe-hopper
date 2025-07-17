import { CustomModel } from '../../orm/custom';
import { CreateBookmarkDTO, IBookmark } from '../interfaces/bookmark.interface';
import { IBookmarkServiceAPI } from '../interfaces/bookmark.service.interface'; 
import { ICafe } from '../interfaces/cafe.interface'

const bookmarkModel = new CustomModel('Bookmark');
const cafeModel = new CustomModel('Cafe');

type BookmarkedCafe = ICafe & { bookmarkId: number };

const bookmarkService: IBookmarkServiceAPI = {
    async getAllBookmarks(): Promise<IBookmark[] | null> {
        return bookmarkModel.findMany();
    },
    async getAllBookmarksForUser(uid: number): Promise<IBookmark[] | null> {
        console.log(`[bookmarkService] getAllBookmarksForUser called with uid: ${uid}`);
        const result = await bookmarkModel.findMany({ uid });
        console.log(`[bookmarkService] findMany returned:`, result);
        return result;
    },
    async getBookmarkedCafesForUser(uid: number): Promise<BookmarkedCafe[] | null> {
        // find bookmarks for the user
        const bookmarks = await bookmarkModel.findMany({ uid });
        console.log(`Bookmarked cafes result:`, bookmarks);

        const cafeIds = bookmarks.map(b => b.cid);
        if (cafeIds.length === 0) return [];

        // for each bookmark, find cafe with cid
        const cafes: BookmarkedCafe[] = [];
        for (const bookmark of bookmarks) {
            const cafe = await cafeModel.findUnique(bookmark.cid);
            if (cafe) {
                cafes.push({
                    ...cafe,
                    bookmarkId: bookmark.id,
                });
            }
        }

        return cafes;
    },
    async createBookmark (bookmark: CreateBookmarkDTO){
        try {
            return await bookmarkModel.create(bookmark);
        } catch (e) {
            if (e.code === '23505') { // PostgreSQL unique violation error code
            console.log('Bookmark already exists');
            // optionally fetch and return the existing bookmark, or return null
            return null;
            }
            throw e;
        }
    },
    async deleteBookmark (id: number){
        return bookmarkModel.delete(id);
    }
}

export default bookmarkService;
