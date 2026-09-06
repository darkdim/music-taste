import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Search, Star } from "lucide-react";
import { tracks } from "./data/tracks";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem("music-taste-ratings");

    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(
      "music-taste-ratings",
      JSON.stringify(ratings)
    );
  }, [ratings]);

  const artists = useMemo(() => {
    const result = new Set();

    tracks.forEach((track) => {
      result.add(track.artist);
    });

    return [...result].sort();
  }, []);

  const filteredTracks = useMemo(() => {
    const result = tracks.filter((track) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        track.title.toLowerCase().includes(searchText) ||
        track.artist.toLowerCase().includes(searchText) ||
        track.album.toLowerCase().includes(searchText);

      const matchesArtist =
        artist === "all" || track.artist === artist;

      return matchesSearch && matchesArtist;
    });

    return result.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "artist") {
        return a.artist.localeCompare(b.artist);
      }

      if (sortBy === "rating") {
        return (ratings[b.id] || 0) - (ratings[a.id] || 0);
      }

      return 0;
    });
  }, [search, artist, sortBy, ratings]);

  function setRating(trackId, rating) {
    setRatings((prev) => ({
      ...prev,
      [trackId]: rating,
    }));
  }

  const ratedTracks = Object.keys(ratings).length;

  const averageRating =
    ratedTracks > 0
      ? (
          Object.values(ratings).reduce(
            (sum, rating) => sum + rating,
            0
          ) / ratedTracks
        ).toFixed(1)
      : "—";

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Music Taste</h1>
          <p>Your music. Your taste. Your ranking.</p>
        </div>
      </header>

      <main className="container">
        <section className="stats">
          <div className="stat">
            <span className="stat-number">{tracks.length}</span>
            <span className="stat-label">Tracks</span>
          </div>

          <div className="stat">
            <span className="stat-number">{artists.length}</span>
            <span className="stat-label">Artists</span>
          </div>

          <div className="stat">
            <span className="stat-number">{ratedTracks}</span>
            <span className="stat-label">Rated</span>
          </div>

          <div className="stat">
            <span className="stat-number">{averageRating}</span>
            <span className="stat-label">Average rating</span>
          </div>
        </section>

        <section className="controls">
          <div className="search">
            <Search size={20} />

            <input
              type="text"
              placeholder="Search tracks, artists, albums..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            value={artist}
            onChange={(event) => setArtist(event.target.value)}
          >
            <option value="all">All artists</option>

            {artists.map((artistName) => (
              <option key={artistName} value={artistName}>
                {artistName}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="title">Sort by title</option>
            <option value="artist">Sort by artist</option>
            <option value="rating">Sort by rating</option>
          </select>
        </section>

        <div className="result-info">
          Showing {filteredTracks.length} of {tracks.length} tracks
        </div>

        <section className="track-list">
          {filteredTracks.map((track) => {
            const rating = ratings[track.id] || 0;

            return (
              <article className="track" key={track.id}>
                <div className="track-number">
                  {track.id}
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

                <div className="rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      className={
                        value <= rating ? "star active" : "star"
                      }
                      onClick={() =>
                        setRating(track.id, value)
                      }
                      title={`${value} stars`}
                    >
                      <Star size={18} />
                    </button>
                  ))}
                </div>

                <a
                  className="spotify-link"
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={18} />
                </a>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default App;