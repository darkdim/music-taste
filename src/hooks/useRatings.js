import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "music-taste-ratings";

function loadRatings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function useRatings() {
  const [ratings, setRatings] = useState(loadRatings);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(ratings)
    );
  }, [ratings]);

  function setRating(trackId, rating) {
    setRatings((prev) => {
      const next = { ...prev };

      if (rating === 0) {
        delete next[trackId];
      } else {
        next[trackId] = rating;
      }

      return next;
    });
  }

  function getRating(trackId) {
    return ratings[trackId] || 0;
  }

  const ratedTracks = useMemo(
    () => Object.keys(ratings).length,
    [ratings]
  );

  const averageRating = useMemo(() => {
    if (ratedTracks === 0) {
      return "—";
    }

    const total = Object.values(ratings).reduce(
      (sum, rating) => sum + rating,
      0
    );

    return (total / ratedTracks).toFixed(1);
  }, [ratings, ratedTracks]);

  return {
    ratings,
    setRating,
    getRating,
    ratedTracks,
    averageRating,
  };
}