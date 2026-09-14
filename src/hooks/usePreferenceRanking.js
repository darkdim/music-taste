import { useMemo } from "react";

const INITIAL_SCORE = 1000;
const K_FACTOR = 32;

/**
 * Calculate preference scores from pairwise comparisons.
 *
 * Ratings (1–5) define the primary ranking group.
 * Pairwise comparisons only refine the order
 * inside the same rating group.
 *
 * Example:
 *
 * 5★
 *   Track A > Track B
 *   Track C > Track A
 *
 * Result:
 *
 *   #1 Track C
 *   #2 Track A
 *   #3 Track B
 *
 * Each track starts at 1000.
 */
export function usePreferenceRanking({
  tracks,
  ratings,
  comparisons,
}) {
  const rankedTracks = useMemo(() => {
    const ratedTracks = tracks.filter(
      (track) => ratings[track.id] !== undefined
    );

    if (ratedTracks.length === 0) {
      return [];
    }

    /*
     * Create separate groups for each rating.
     *
     * 5★ comparisons must not affect 4★ tracks.
     */
    const groups = {};

    for (const track of ratedTracks) {
      const rating = ratings[track.id];

      if (!groups[rating]) {
        groups[rating] = [];
      }

      groups[rating].push(track);
    }

    /*
     * Calculate preference scores independently
     * for every rating group.
     */
    const scores = {};

    for (const rating of Object.keys(groups)) {
      const groupTracks = groups[rating];

      for (const track of groupTracks) {
        scores[track.id] = INITIAL_SCORE;
      }

      const groupTrackIds = new Set(
        groupTracks.map((track) => track.id)
      );

      for (const comparison of comparisons) {
        const {
          winnerId,
          loserId,
        } = comparison;

        /*
         * Ignore comparisons outside this rating group.
         */
        if (
          !groupTrackIds.has(winnerId) ||
          !groupTrackIds.has(loserId)
        ) {
          continue;
        }

        if (winnerId === loserId) {
          continue;
        }

        const winnerScore = scores[winnerId];
        const loserScore = scores[loserId];

        const expectedWinner =
          1 /
          (
            1 +
            Math.pow(
              10,
              (loserScore - winnerScore) / 400
            )
          );

        const expectedLoser = 1 - expectedWinner;

        scores[winnerId] =
          winnerScore +
          K_FACTOR * (1 - expectedWinner);

        scores[loserId] =
          loserScore -
          K_FACTOR * expectedLoser;
      }
    }

    const comparisonCounts = {};

    for (const comparison of comparisons) {
      comparisonCounts[comparison.winnerId] =
        (comparisonCounts[comparison.winnerId] || 0) + 1;

      comparisonCounts[comparison.loserId] =
        (comparisonCounts[comparison.loserId] || 0) + 1;
    }

    /*
     * Build the final ranked list.
     */
    return ratedTracks
      .map((track) => ({
        ...track,
        rating: ratings[track.id],
        preferenceScore: Math.round(
          scores[track.id] ?? INITIAL_SCORE
        ),
        comparisonCount:
          comparisonCounts[track.id] || 0,
      }))
      .sort((a, b) => {
        /*
         * 1. Explicit user rating.
         *
         * 5★ always beats 4★, etc.
         */
        if (b.rating !== a.rating) {
          return b.rating - a.rating;
        }

        /*
         * 2. Pairwise preference score.
         *
         * Only relevant inside the same rating group.
         */
        if (
          b.preferenceScore !==
          a.preferenceScore
        ) {
          return (
            b.preferenceScore -
            a.preferenceScore
          );
        }

        /*
         * 3. Deterministic fallback.
         */
        const artistCompare =
          a.artist.localeCompare(b.artist);

        if (artistCompare !== 0) {
          return artistCompare;
        }

        return a.title.localeCompare(b.title);
      });
  }, [tracks, ratings, comparisons]);

  const top100 = useMemo(() => {
    return rankedTracks.slice(0, 100);
  }, [rankedTracks]);

  return {
    rankedTracks,
    top100,
  };
}