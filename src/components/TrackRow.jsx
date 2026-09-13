import { ExternalLink } from "lucide-react";
import Rating from "./Rating";

function TrackRow({
  track,
  rank,
  rating,
  onRatingChange,
}) {
  return (
    <article className="track">
      <div className="track-number">
        <span className="track-rank">{rank}</span>
        <span className="track-id">#{track.id}</span>
      </div>

      <div className="track-info">
        <h2>{track.title}</h2>

        <div className="artist">
          {track.artist}
        </div>

        <div className="album">
          {track.album}
        </div>
      </div>

      <Rating
        value={rating}
        onChange={(value) =>
          onRatingChange(track.id, value)
        }
      />

      <a
        className="spotify-link"
        href={track.spotifyUrl}
        target="_blank"
        rel="noreferrer"
        title="Open in Spotify"
      >
        <ExternalLink size={18} />
      </a>
    </article>
  );
}

export default TrackRow;