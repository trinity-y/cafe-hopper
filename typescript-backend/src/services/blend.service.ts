import { CustomModel, pool } from '../../orm/custom';
import { ICafeWithRating } from '../interfaces/cafe.interface';
import { IBlendServiceAPI } from '../interfaces/blend.service.interface';

const blendModel = new CustomModel('Blend');

const blendService: IBlendServiceAPI = {
  async getBlend(userId: number): Promise<ICafeWithRating[]> {
    const q = `
        -- Get all my friends
        WITH my_friends AS (
            SELECT friend_id
            FROM "Friend" as f
            WHERE f.user_id = $1
        ),

        -- Get all the cafes I have visited
        my_visited AS (
            SELECT cid as cafe_id
            FROM "Reviews" as r
            WHERE r.uid = $1
        ),

        -- Get all the cafes and their avg rating that I haven't visited but my friends have. LIMIT THIS WITH AFTER TESTING
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
            HAVING COUNT(*) >= 2
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
            AND r.cid NOT IN (
                SELECT my_visited.cafe_id 
                FROM my_visited
            )
            ORDER BY r.uid, r.rating DESC, r.id DESC
        ), 

        -- Remove the top_cafe_per_friend already in top_k. THINK ABOUT THE LIMIT NUMBER HERE
        unique_top_k_cafe_per_friend AS (
            SELECT tc.cafe_id, tc.rating
            FROM top_cafe_per_friend AS tc
            WHERE tc.cafe_id NOT IN (
                SELECT top_k.cafe_id
                FROM top_k
            ) 
            ORDER BY tc.rating DESC
            LIMIT 5
        ),

        final_recommendations AS (
            SELECT 
                tk.cafe_id,
                tk.avg_rating as rating
            FROM top_k tk
            
            UNION ALL
            
            SELECT 
                utc.cafe_id,
                utc.rating
            FROM unique_top_k_cafe_per_friend utc
        )

        SELECT * FROM (
            SELECT DISTINCT ON (fr.cafe_id)
                fr.cafe_id as id,
                c.name,
                c.address,
                c."openingDays",
                c."googleRating",
                fr.rating as "finalRating",
                r.notes as "friendNotes",
                u.username as "friendUsername"
            FROM final_recommendations fr
            JOIN "Cafe" c ON fr.cafe_id = c.id
            JOIN "Reviews" r ON r.cid = fr.cafe_id 
                AND r.uid IN (SELECT friend_id FROM my_friends)
            JOIN "User" u ON r.uid = u.id
            ORDER BY fr.cafe_id, r.rating DESC  
        ) AS final_result
        ORDER BY final_result."finalRating" DESC, final_result.id ASC  
        LIMIT 10;
    `;
    
    // NO GO AMIGO!!
    const { rows } = await pool.query(q, [userId]);
    return rows;
  },

};

export default blendService;
