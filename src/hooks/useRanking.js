import { useMemo } from "react";

export function useRanking({ tracks, ratings }) {
  const rankedTracks = useMemo(() => {
    return tracks
      .filter((track) => ratings[track.id])
      .map((track) => ({
        ...track,
        rating: ratings[track.id],
      }))
      .sort((a, b) => {
        // Higher rating first.
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }

        // Stable alphabetical ordering for equal ratings.
        const artistCompare = a.artist.localeCompare(b.artist);

        if (artistCompare !== 0) {
          return artistCompare;
        }

        return a.title.localeCompare(b.title);
      });
  }, [tracks, ratings]);

  const top100 = useMemo(() => {
    return rankedTracks.slice(0, 100);
  }, [rankedTracks]);

  return {
    rankedTracks,
    top100,
  };
}