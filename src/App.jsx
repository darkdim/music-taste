import { useState } from "react";

import { tracks } from "./data/tracks";

import Header from "./components/Header";
import Stats from "./components/Stats";
import Controls from "./components/Controls";
import ViewTabs from "./components/ViewTabs";
import TrackList from "./components/TrackList";

import { useRatings } from "./hooks/useRatings";
import { useTracks } from "./hooks/useTracks";

import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [view, setView] = useState("all");

  const {
    ratings,
    setRating,
    ratedTracks,
    averageRating,
  } = useRatings();

  const {
    artists,
    filteredTracks,
    counts,
  } = useTracks({
    tracks,
    search,
    artist,
    sortBy,
    view,
    ratings,
  });

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

        <ViewTabs
          view={view}
          setView={setView}
          counts={counts}
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