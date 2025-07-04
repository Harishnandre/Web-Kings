import React, { createContext, useContext, useState } from 'react';

const RatingsContext = createContext();
export const useRatings = () => useContext(RatingsContext);

export const RatingsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⭐ Helper to handle POST requests with fetch
  const postData = async (url, data) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong');
      }

      return result;
    } catch (err) {
      console.error('Rating error:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ Rate a food item
  const rateFood = async (foodId, userId, rating) => {
    return await postData(`/api/ratings/food/${foodId}`, { userId, rating });
  };

  // ⭐ Rate a canteen
  const rateCanteen = async (canteenId, userId, rating) => {
    return await postData(`/api/ratings/canteen/${canteenId}`, { userId, rating });
  };

  // Clear error
  const clearError = () => setError(null);

  return (
    <RatingsContext.Provider
      value={{
        rateFood,
        rateCanteen,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </RatingsContext.Provider>
  );
};
