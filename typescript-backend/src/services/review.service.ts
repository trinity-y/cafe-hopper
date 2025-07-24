import { CustomModel } from '../../orm/custom';
import { IReview, CreateReviewDTO, UpdateReviewDTO } from '../interfaces/review.interface';
import { IReviewServiceAPI } from '../interfaces/review.service.interface'; 
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'

const reviewModel = new CustomModel('Reviews');

dayjs.extend(utc);
dayjs.extend(timezone);
const TIMEZONE = "America/New_York";

const reviewService: IReviewServiceAPI = {
    async getAllReviewsFromUser (uid: number) : Promise<IReview[] | null>{
        const where = {'uid': uid};
        return reviewModel.findMany(where);
    },
    async getAllReviewsFromCafe (cid: number) : Promise<IReview[] | null>{
        const where = {'cid': cid};
        return reviewModel.findMany(where);
    },
    async getAllReviews () : Promise<IReview[] | null>{
        return reviewModel.findMany();
    },
    async getReviewsForFeed(uid: number) : Promise<IReview[] | null> {
        // add index on timestamp col for better performance?
        const maxReviews = 50;

        // compile reviews for a user's feed and their like count
        // why use a view? this allows us to more easily change the backend if we dcide that the frontend wants different fields or if the db schema changes.
        // the view is only reliant on the schema of friends and reviews

        let viewQuery = `
        CREATE OR REPLACE VIEW "reviewsAndLikesForUser${uid}" AS
        SELECT "rid", "overallRating", "foodRating", "drinkRating", "atmosphereRating", "notes", "timestamp", "author", "cid", COALESCE("likes", 0) AS likes
        FROM
            (SELECT 
                "Reviews"."id" AS "rid",
                "Reviews"."rating" AS "overallRating",
                "Reviews"."drinkrating" AS "drinkRating",
                "Reviews"."foodrating" AS "foodRating",
                "Reviews"."atmosphererating" AS "atmosphereRating",
                "Reviews"."notes" AS "notes",
                "Reviews"."timestamp" AS "timestamp",
                "Reviews"."uid" AS "author",
                "Reviews"."cid" AS "cid",
                "Friend"."user_id" AS "uid"
            FROM "Reviews" INNER JOIN "Friend" ON "Reviews"."uid" = "Friend"."following_id"
            WHERE "Friend"."user_id" = ${uid}
            LIMIT ${maxReviews} ) AS "friendReviews" LEFT JOIN
            ( SELECT COUNT(*) AS likes, rid AS likerid
            FROM "Reaction" WHERE "reaction" = 'like'
            GROUP BY "rid" ) AS "likeCounts"
            ON "friendReviews"."rid" = "likeCounts"."likerid";`;
        await reviewModel.rawQuery(viewQuery);
        // join w/ relevant tables to get the attributes necessary
        let getReviewDataQuery = `
        SELECT "User"."username", "User"."id" AS uid, "Cafe"."name", "rid", "overallRating", "drinkRating", "foodRating", "atmosphereRating", "notes", "timestamp", "likes"
        FROM "reviewsAndLikesForUser${uid}", "User", "Cafe"
        WHERE "reviewsAndLikesForUser${uid}"."author" = "User"."id" AND
            "reviewsAndLikesForUser${uid}"."cid" = "Cafe"."id"
        ORDER BY "timestamp" DESC;`;
        const result = await reviewModel.rawQuery(getReviewDataQuery);
        const formattedResult = result.map((review) => {
            const { overallRating, drinkRating, foodRating, atmosphereRating, timestamp } = review;
            return {
                ...review,
                overallRating: parseFloat(overallRating),
                drinkRating: parseFloat(drinkRating),
                foodRating: parseFloat(foodRating),
                atmosphereRating: parseFloat(atmosphereRating),
                timestamp: dayjs.utc(timestamp).tz(TIMEZONE).format('MMMM D YYYY h:mm A') // August 16 2018 5:02 PM
            }
        })
        
        return formattedResult;
    },
    async createReview (review: CreateReviewDTO) : Promise<IReview>{
        return reviewModel.create(review);
    },
    async editReview (id: number, review: UpdateReviewDTO){
        try {
            reviewModel.updateMany(id, review);
        } catch(e){
            throw e;
        }
    },
    async deleteReview (id: number) : Promise<boolean>{
        return reviewModel.delete(id);
    }
}

export default reviewService;