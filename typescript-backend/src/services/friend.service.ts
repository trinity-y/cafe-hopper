import { CustomModel, pool } from '../../orm/custom';
import { IFriend, CreateFriendDTO } from 'src/interfaces/friend.interface';
import { IFriendServiceAPI } from 'src/interfaces/friend.service.interface';
import { IUser } from 'src/interfaces/user.interface';

const friendModel = new CustomModel('Friend');
const userModel = new CustomModel('User');

const friendService: IFriendServiceAPI = {
    async getUserFriendsByUserId(user_id: number): Promise<IUser[]> {
        const query = `SELECT u.id, u.username, u.firebase_uid
                       FROM "Friend" f
                       JOIN "User" u ON f.following_id = u.id
                       WHERE f.user_id = $1`;

        const friends = await userModel.rawQuery(query, [user_id]);

        return friends;
    },

    async getUserMutualsByUserId(user_id: number): Promise<IUser[]> {
        const query = `SELECT u.id, u.username, u.firebase_uid
                       FROM "Mutuals" f
                       JOIN "User" u ON f.friend_id = u.id
                       WHERE f.user_id = $1`;

        const mutuals = await userModel.rawQuery(query, [user_id]);

        return mutuals;
    },

    async createFriend(friend: CreateFriendDTO): Promise<IFriend | null> {
        return friendModel.create(friend);
    },

    async deleteFriend(uid: number, following_id: number): Promise<boolean> {
        const query = `
            DELETE FROM "Friend" 
            WHERE user_id = $1 AND following_id = $2;
        `;

        return await userModel.rawQuery(query, [uid, following_id]);
    }
};

export default friendService;
