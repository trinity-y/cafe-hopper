const baseUrl = process.env.REACT_APP_ISLOCAL === "true" ? process.env.REACT_APP_LOCAL_API_URL : process.env.REACT_APP_PROD_API_URL;

const CreateReviewRow = async (rating, foodRating, drinkRating, atmosphereRating, notes, uid, cid) => {
  const now = new Date();
  const timestamp = now.toISOString();

  const newReview = {
    rating: rating,
    foodRating: foodRating,
    drinkRating: drinkRating,
    atmosphereRating: atmosphereRating,
    notes: notes,
    timestamp, timestamp,
    uid: uid,
    cid: cid,
  };
  try {
    const response = await fetch(`${baseUrl}/reviews/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export default CreateReviewRow;