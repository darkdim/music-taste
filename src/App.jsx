import { useMemo, useState } from "react";
import "./App.css";
import { tracks } from "./data/tracks";

function App() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");

  const filteredTracks = useMemo(() => {
    const query = search.toLowerCase().trim();

    const result = tracks.filter((track) => {
      if (!query) {
        return true;
      }

      return (
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.album.toLowerCase().includes(query)
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "artist") {
        return a.artist.localeCompare(b.artist);
      }

      if (sortBy === "album") {
        return a.album.localeCompare(b.album);
      }

      return a.title.localeCompare(b.title);
    });
  }, [search, sortBy]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Music Taste</h1>
          <p>Your music. Your taste. Your ranking.</p>
        </div>

        <div className="track-count">
          <strong>{tracks.length}</strong>
          <span>tracks</span>
        </div>
      </header>

      <main className="main">
        <section className="controls">
          <input
            type="search"
            placeholder="Search tracks, artists or albums..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="title">Sort by title</option>
            <option value="artist">Sort by artist</option>
            <option value="album">Sort by album</option>
          </select>
        </section>

        <section className="library">
          <div className="library-header">
            <h2>My Library</h2>

            <span>
              {filteredTracks.length} of {tracks.length}
            </span>
          </div>

          <div className="track-list">
            {filteredTracks.map((track, index) => (
              <article className="track" key={track.id}>
                <div className="track-number">
                  {index + 1}
                </div>

                <div className="track-info">
                  <h3>{track.title}</h3>

                  <p>
                    {track.artist}
                    {track.album && ` • ${track.album}`}
                  </p>
                </div>

                {track.spotifyUrl && (
                  <a
                    className="spotify-link"
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Spotify
                  </a>
                )}
              </article>
            ))}
          </div>

          {filteredTracks.length === 0 && (
            <div className="empty">
              <h3>No tracks found</h3>
              <p>Try another search.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;