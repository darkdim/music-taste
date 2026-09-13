import TrackRow from "./TrackRow";

function TrackList({
  tracks,
  ratings,
  onRatingChange,
}) {
  return (
    <section className="track-list">
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          rank={index + 1}
          rating={ratings[track.id] || 0}
          onRatingChange={onRatingChange}
        />
      ))}

      {tracks.length === 0 && (
        <div className="empty">
          No tracks found.
        </div>
      )}
    </section>
  );
}

export default TrackList;