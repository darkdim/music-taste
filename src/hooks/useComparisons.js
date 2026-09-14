import { useEffect, useState } from "react";

const STORAGE_KEY = "music-taste-comparisons";

function loadComparisons() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useComparisons() {
  const [comparisons, setComparisons] = useState(loadComparisons);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(comparisons)
    );
  }, [comparisons]);

  function addComparison(winnerId, loserId) {
    if (winnerId === loserId) return;

    setComparisons((prev) => [
      ...prev,
      {
        winnerId,
        loserId,
        timestamp: Date.now(),
      },
    ]);
  }

  return {
    comparisons,
    addComparison,
  };
}