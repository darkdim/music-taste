import { useMemo, useState } from "react";

import { tracks } from "./data/tracks";

import Header from "./components/Header";
import Stats from "./components/Stats";
import Controls from "./components/Controls";
import TrackList from "./components/TrackList";

import { useRatings } from "./hooks/useRatings";

import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState("all");
  const [sortBy, setSortBy] = useState("title");

  const {
    ratings,
    setRating,
    ratedTracks,
    averageRating,
  } = useRatings();

  const artists = useMemo(() => {
    return [...new Set(
      tracks.map((track) => track.artist)
    )].sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredTracks = useMemo(() => {
    const query = search.toLowerCase().trim();

    const result = tracks.filter((track) => {
      const matchesSearch =
        !query ||
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query) ||
        track.album.toLowerCase().includes(query);

      const matchesArtist =
        artist === "all" ||
        track.artist === artist;

      return matchesSearch && matchesArtist;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "artist") {
        return a.artist.localeCompare(b.artist);
      }

      if (sortBy === "rating") {
        const ratingA = ratings[a.id] || 0;
        const ratingB = ratings[b.id] || 0;

        return ratingB - ratingA;
      }

      return 0;
    });
  }, [
    search,
    artist,
    sortBy,
    ratings,
  ]);

  return (
    <div className="app">
      <Header />

      <main className="container">
        <Stats
          trackCount={tracks.length}
          artistCount={artists.length}
          ratedCount={ratedTracks}
          averageRating={averageRating}
        />

        <Controls
          search={search}
          setSearch={setSearch}
          artist={artist}
          setArtist={setArtist}
          sortBy={sortBy}
          setSortBy={setSortBy}
          artists={artists}
        />

        <div className="result-info">
          Showing {filteredTracks.length} of{" "}
          {tracks.length} tracks
        </div>

        <TrackList
          tracks={filteredTracks}
          ratings={ratings}
          onRatingChange={setRating}
        />
      </main>
    </div>
  );
}

export default App;