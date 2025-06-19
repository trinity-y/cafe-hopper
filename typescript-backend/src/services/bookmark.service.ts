import { CustomModel } from '../../orm/custom';
import { CreateBookmarkDTO, IBookmark } from '../interfaces/bookmark.interface';
import { IBookmarkServiceAPI } from '../interfaces/bookmark.service.interface'; 

const bookmarkModel = CustomModel('Bookmark');

const bookmarkService: IBookmarkServiceAPI = {
    async getAllBookmarksFromUser (uid: number) : Promise<IBookmark[] | null>{
        return bookmarkModel.findMany(uid);
    },
    async createBookmark (bookmark: CreateBookmarkDTO){
        bookmarkModel.create(bookmark);
    },
    async deleteBookmark (id: number){
        bookmarkModel.delete(id);
    }
}

export default bookmarkService;
