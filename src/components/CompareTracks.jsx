import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  SkipForward,
  X,
} from "lucide-react";

function CompareTracks({
  tracks,
  ratings,
  rankedTracks,
  onComparison,
  onClose,
}) {
  const ratedTracks = useMemo(() => {
    return tracks.filter((track) => ratings[track.id]);
  }, [tracks, ratings]);

  console.log(
    "RATED TRACKS:",
    ratedTracks.map((track) => ({
      id: track.id,
      title: track.title,
      rating: ratings[track.id],
    }))
  );

  const [pair, setPair] = useState(() => {
    const newPair = getNextPair(
      ratedTracks,
      ratings,
      rankedTracks
    );

    console.log("INITIAL PAIR:", {
      left: newPair?.left?.id,
      right: newPair?.right?.id,
    });

    console.log(
      "INITIAL RATINGS:",
      newPair
        ? [
          ratings[newPair.left.id],
          ratings[newPair.right.id],
        ]
        : null
    );

    return newPair;
  });

  function getNewPair() {
    setPair(
      getNextPair(
        ratedTracks,
        ratings,
        rankedTracks
      )
    );
  }

  function chooseWinner(winner, loser) {
    onComparison(winner.id, loser.id);

    setPair(
      getNextPair(
        ratedTracks,
        ratings,
        rankedTracks,
        winner.id,
        loser.id
      )
    );
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      if (pair) {
        chooseWinner(pair.left, pair.right);
      }
    }

    if (event.key === "ArrowRight") {
      if (pair) {
        chooseWinner(pair.right, pair.left);
      }
    }

    if (event.code === "Space") {
      event.preventDefault();
      getNewPair();
    }

    if (event.key === "Escape") {
      onClose();
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (ratedTracks.length < 2) {
    return (
      <section className="compare-tracks">
        <button
          className="compare-close"
          onClick={onClose}
          title="Close"
        >
          <X size={22} />
        </button>

        <div className="compare-empty">
          <h2>Not enough rated tracks</h2>

          <p>
            Rate at least two tracks before starting comparisons.
          </p>

          <button onClick={onClose}>
            Back to library
          </button>
        </div>
      </section>
    );
  }
  console.log(ratings[pair.left.id], ratings[pair.right.id]);
  console.log("PAIR:", {
    left: {
      id: pair.left.id,
      title: pair.left.title,
      rating: ratings[pair.left.id],
    },
    right: {
      id: pair.right.id,
      title: pair.right.title,
      rating: ratings[pair.right.id],
    },
  });

  return (
    <section className="compare-tracks">
      <button
        className="compare-close"
        onClick={onClose}
        title="Close"
      >
        <X size={22} />
      </button>

      <header className="compare-header">
        <div>
          <h1>Compare Tracks</h1>
          <p>
            Which one do you prefer?
          </p>
        </div>
      </header>

      {pair && (
        <>
          <div className="compare-rating">
            Both rated{" "}
            <strong>{ratings[pair.left.id]}★</strong>
          </div>

          <div className="compare-content">
            <button
              className="compare-card"
              onClick={() =>
                chooseWinner(pair.left, pair.right)
              }
            >
              <span className="compare-position">
                A
              </span>

              <span className="compare-artist">
                {pair.left.artist}
              </span>

              <span className="compare-title">
                {pair.left.title}
              </span>

              <span className="compare-album">
                {pair.left.album}
              </span>

              <span className="compare-rating-value">
                {ratings[pair.left.id]}★
              </span>
            </button>

            <div className="compare-vs">
              VS
            </div>

            <button
              className="compare-card"
              onClick={() =>
                chooseWinner(pair.right, pair.left)
              }
            >
              <span className="compare-position">
                B
              </span>

              <span className="compare-artist">
                {pair.right.artist}
              </span>

              <span className="compare-title">
                {pair.right.title}
              </span>

              <span className="compare-album">
                {pair.right.album}
              </span>

              <span className="compare-rating-value">
                {ratings[pair.right.id]}★
              </span>
            </button>
          </div>

          <div className="compare-navigation">
            <button onClick={getNewPair}>
              <SkipForward size={18} />
              Skip
            </button>
          </div>

          <div className="compare-hint">
            <span>
              <ArrowLeft size={14} /> Left wins
            </span>

            <span>
              <ArrowRight size={14} /> Right wins
            </span>

            <span>
              Space — skip
            </span>

            <span>
              Esc — close
            </span>
          </div>
        </>
      )}
    </section>
  );
}

function getNextPair(
  tracks,
  ratings,
  rankedTracks,
  previousLeftId,
  previousRightId
) {
  if (tracks.length < 2) {
    return null;
  }

  /*
   * Group rated tracks by explicit rating.
   */
  const groups = {};

  for (const track of tracks) {
    const rating = ratings[track.id];

    if (!rating) {
      continue;
    }

    if (!groups[rating]) {
      groups[rating] = [];
    }

    groups[rating].push(track);
  }

  /*
   * Keep only groups with at least two tracks.
   */
  const availableGroups = Object.entries(groups)
    .filter(([, group]) => group.length >= 2);

  if (availableGroups.length === 0) {
    return null;
  }

  /*
   * Select the largest rating group.
   */
  availableGroups.sort(
    ([, groupA], [, groupB]) =>
      groupB.length - groupA.length
  );

  const [, selectedGroup] = availableGroups[0];

  const selectedIds = new Set(
    selectedGroup.map((track) => track.id)
  );

  /*
   * Get preference scores for this rating group.
   */
  const rankedGroup = rankedTracks
    .filter((track) => selectedIds.has(track.id))
    .sort(
      (a, b) =>
        b.preferenceScore - a.preferenceScore
    );

  /*
   * Find two adjacent tracks with the
   * smallest score difference.
   */
  let bestPair = null;
  let smallestDifference = Infinity;

  for (let i = 0; i < rankedGroup.length - 1; i++) {
    const left = rankedGroup[i];
    const right = rankedGroup[i + 1];

    /*
     * Don't immediately repeat the same pair.
     */
    const isPreviousPair =
      (left.id === previousLeftId &&
        right.id === previousRightId) ||
      (left.id === previousRightId &&
        right.id === previousLeftId);

    if (isPreviousPair) {
      continue;
    }

    const difference = Math.abs(
      left.preferenceScore -
      right.preferenceScore
    );

    if (difference < smallestDifference) {
      smallestDifference = difference;

      bestPair = {
        left,
        right,
      };
    }
  }

  /*
   * If every possible pair was excluded,
   * allow the closest pair again.
   */
  if (!bestPair && rankedGroup.length >= 2) {
    bestPair = {
      left: rankedGroup[0],
      right: rankedGroup[1],
    };
  }

  if (bestPair) {
    console.log("SELECTED PAIR:", {
      rating: ratings[bestPair.left.id],
      left: {
        id: bestPair.left.id,
        title: bestPair.left.title,
        score: bestPair.left.preferenceScore,
      },
      right: {
        id: bestPair.right.id,
        title: bestPair.right.title,
        score: bestPair.right.preferenceScore,
      },
      difference: smallestDifference,
    });
  }

  return bestPair;
}

export default CompareTracks;