export interface IBookmark {
  id: number;
  uid: number;
  cid: number;
}

export type CreateBookmarkDTO = Omit<IBookmark, 'id'>;
