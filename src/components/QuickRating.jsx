import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Star,
  X,
} from "lucide-react";

function shuffleTracks(tracks) {
  return [...tracks].sort(() => Math.random() - 0.5);
}

function QuickRating({
  tracks,
  ratings,
  onRatingChange,
  onClose,
}) {
  const unratedTracks = useMemo(() => {
    return tracks.filter((track) => !ratings[track.id]);
  }, [tracks, ratings]);

  const [queue, setQueue] = useState(unratedTracks);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTrack = queue[currentIndex];

  const currentRating = currentTrack
    ? ratings[currentTrack.id] || 0
    : 0;

  const ratedCount = tracks.length - unratedTracks.length;

  function shuffleQueue() {
    setQueue(shuffleTracks(unratedTracks));
    setCurrentIndex(0);
  }

  function goNext() {
    setCurrentIndex((index) =>
      Math.min(index + 1, queue.length - 1)
    );
  }

  function goPrevious() {
    setCurrentIndex((index) =>
      Math.max(index - 1, 0)
    );
  }

  function rate(value) {
    if (!currentTrack) return;

    onRatingChange(currentTrack.id, value);

    if (currentIndex < queue.length - 1) {
      setCurrentIndex((index) => index + 1);
    }
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key >= "1" && event.key <= "5") {
        rate(Number(event.key));
      }

      if (event.key === "0" && currentTrack) {
        onRatingChange(currentTrack.id, 0);
      }

      if (event.key === "ArrowRight") {
        goNext();
      }

      if (event.key === "ArrowLeft") {
        goPrevious();
      }

      if (event.key === "Escape") {
        onClose();
      }

      if (event.key.toLowerCase() === "s") {
        shuffleQueue();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  useEffect(() => {
    if (currentIndex >= queue.length && queue.length > 0) {
      setCurrentIndex(queue.length - 1);
    }
  }, [queue.length, currentIndex]);

  if (queue.length === 0) {
    return (
      <section className="quick-rating">
        <button
          className="quick-rating-close"
          onClick={onClose}
          title="Close"
        >
          <X size={22} />
        </button>

        <div className="quick-rating-content">
          <div className="quick-rating-number">
            All tracks rated
          </div>

          <h2>You're done!</h2>

          <div className="quick-rating-artist">
            {ratedCount} / {tracks.length} tracks rated
          </div>

          <button
            className="quick-rating-done"
            onClick={onClose}
          >
            Back to library
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="quick-rating">
      <button
        className="quick-rating-close"
        onClick={onClose}
        title="Close"
      >
        <X size={22} />
      </button>

      <div className="quick-rating-progress">
        <span>
          {currentIndex + 1} / {queue.length}
        </span>

        <span>
          {ratedCount} / {tracks.length} rated
        </span>
      </div>

      <div className="quick-rating-content">
        <div className="quick-rating-number">
          #{currentTrack.id}
        </div>

        <h2>{currentTrack.title}</h2>

        <div className="quick-rating-artist">
          {currentTrack.artist}
        </div>

        <div className="quick-rating-album">
          {currentTrack.album}
        </div>

        <div className="quick-rating-stars">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              className={
                value <= currentRating
                  ? "quick-star active"
                  : "quick-star"
              }
              onClick={() => rate(value)}
              title={`${value} stars`}
            >
              <Star size={32} />
            </button>
          ))}
        </div>

        <div className="quick-rating-hint">
          <span>1–5 rate</span>
          <span>← → navigate</span>
          <span>S shuffle</span>
          <span>Esc close</span>
        </div>
      </div>

      <div className="quick-rating-navigation">
        <button
          onClick={goPrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <button onClick={shuffleQueue}>
          <Shuffle size={18} />
          Shuffle Unrated
        </button>

        <button
          onClick={goNext}
          disabled={currentIndex === queue.length - 1}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}

export default QuickRating;