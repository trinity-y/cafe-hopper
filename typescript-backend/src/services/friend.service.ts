import { CustomModel, pool } from '../../orm/custom';
import { IFriend, CreateFriendDTO } from 'src/interfaces/friend.interface';
import { IFriendServiceAPI } from 'src/interfaces/friend.service.interface';

const friendModel = new CustomModel('Friend');

const friendService: IFriendServiceAPI = {
    async getUserFriendsByUserId(user_id: number): Promise<IFriend[] | null> {
        return friendModel.findMany({user_id: user_id});
    },

    async createFriend(friend: CreateFriendDTO): Promise<IFriend | null> {
        return friendModel.create(friend);
    }
};

export default friendService;
