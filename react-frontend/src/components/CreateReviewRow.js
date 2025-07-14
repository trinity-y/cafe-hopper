const CreateReviewRow = async (rating, foodRating, drinkRating, atmosphereRating, notes, uid, cid) => {
  const newReview = {
    rating: rating,
    foodRating: foodRating,
    drinkRating: drinkRating,
    atmosphereRating: atmosphereRating,
    notes: notes,
    uid: uid, // unknown
    cid: cid,
  };
  try {
    const response = await fetch('http://localhost:3001/reviews/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newReview)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export default CreateReviewRow;