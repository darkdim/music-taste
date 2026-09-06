import { useState } from "react";
import { tracks } from "./data/tracks";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  const filteredTracks = tracks.filter((track) => {
    const text = `
      ${track.title}
      ${track.artist}
      ${track.album}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="app">

      <header>
        <h1>🎵 My Music Analyzer</h1>

        <p>
          {tracks.length} tracks
        </p>
      </header>

      <div className="toolbar">

        <input
          type="text"
          placeholder="Search track, artist, album..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

      </div>

      <main>

        <div className="track-header">
          <span>#</span>
          <span>Track</span>
          <span>Artist</span>
          <span>Album</span>
        </div>

        {filteredTracks.map((track) => (
          <div
            className="track"
            key={track.id}
          >

            <span>
              {track.id}
            </span>

            <span>
              <a
                href={track.url}
                target="_blank"
                rel="noreferrer"
              >
                {track.title}
              </a>
            </span>

            <span>
              {track.artist}
            </span>

            <span>
              {track.album}
            </span>

          </div>
        ))}

      </main>

    </div>
  );
}

export default App;