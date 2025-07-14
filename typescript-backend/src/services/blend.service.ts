import { CustomModel, pool } from '../../orm/custom';
import { ICafe } from '../interfaces/cafe.interface';
import { IBlendServiceAPI } from '../interfaces/blend.service.interface';

const blendModel = new CustomModel('Blend');

const blendService: IBlendServiceAPI = {
  async getBlend(): Promise<ICafe[]> {
    const q = `
        -- Get all my friends
        WITH my_friends AS (
            SELECT friend_id
            FROM "Friend" as f
            WHERE f.user_id = PASS IN CURR USER HERE
        ),

        -- Get all the cafes I have visited
        my_visited AS (
            SELECT cid as cafe_id
            FROM "Reviews" as r
            WHERE r.uid = PASS IN CURR USER HERE
        ),

        -- Get all the cafes and their avg rating that I haven't visited but my friends have 
        top_k AS (
            SELECT r.cid AS cafe_id, AVG(r.rating) AS avg_rating, COUNT(*) AS friend_count
            FROM "Reviews" AS r
            WHERE r.uid IN (
                SELECT friend_id FROM my_friends
            )
            AND 
            r.cid NOT IN (
                SELECT my_visited.cafe_id 
                FROM my_visited
            )
            GROUP BY r.cid
            ORDER BY avg_rating DESC, friend_count DESC
            LIMIT SOME NUMBER HERE 
        ),

        -- Get all cafes for each one of my friends 
        top_cafe_per_friend AS (
            SELECT DISTINCT ON (r.uid)
            r.uid,
            r.cid AS cafe_id,
            r.rating
            FROM "Reviews" AS r
            WHERE r.uid IN (
                SELECT friend_id FROM my_friends
            )
            AND
            WHERE r.uid NOT IN (
                SELECT my_cafes.cafe_id 
                FROM my_cafes
            )
            ORDER BY r.uid, r.rating DESC, r.id DESC
        ), 

        -- Remove the top_cafe_per_friend already in top_k
        unique_top_k_cafe_per_friend AS (
            SELECT tc.cafe_id, tc.rating
            FROM top_cafe_per_friend AS tc
            WHERE tc.cafe_id NOT IN (
                SELECT top_k.cafe_id
                FROM top_k
            ) 
            ORDER BY tc.rating DESC
            LIMIT SOME NUMBER HERE 
        )

        
  `;
    const { rows } = await pool.query(q, [term]);
    return rows;
  },

};

export default blendService;
