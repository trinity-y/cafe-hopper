import { CustomModel } from '../../orm/custom';
import { CreateBookmarkDTO, IBookmark } from '../interfaces/bookmark.interface';
import { IBookmarkServiceAPI } from '../interfaces/bookmark.service.interface'; 

const bookmarkModel = new CustomModel('Bookmark');

const bookmarkService: IBookmarkServiceAPI = {
    async getAllBookmarks(): Promise<IBookmark[]> {
        return bookmarkModel.findMany();
    },
    async getAllBookmarksFromUser (uid: number) : Promise<IBookmark[] | null>{
        return bookmarkModel.findMany({ uid });
    },
    async createBookmark (bookmark: CreateBookmarkDTO){
        return bookmarkModel.create(bookmark);
    },
    async deleteBookmark (id: number){
        return bookmarkModel.delete(id);
    }
}

export default bookmarkService;
