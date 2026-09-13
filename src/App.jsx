import { useState } from "react";

import { tracks } from "./data/tracks";

import Header from "./components/Header";
import Stats from "./components/Stats";
import Controls from "./components/Controls";
import ViewTabs from "./components/ViewTabs";
import TrackList from "./components/TrackList";
import QuickRating from "./components/QuickRating";

import { useRatings } from "./hooks/useRatings";
import { useTracks } from "./hooks/useTracks";
import { useRanking } from "./hooks/useRanking";

import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [view, setView] = useState("all");
  const [quickRating, setQuickRating] = useState(false);

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

  const {
    rankedTracks,
    top100,
  } = useRanking({
    tracks,
    ratings,
  });

  return (
    <div className="app">
      <Header />
      {quickRating && (
        <QuickRating
          tracks={tracks}
          ratings={ratings}
          onRatingChange={setRating}
          onClose={() => setQuickRating(false)}
        />
      )}

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

        <button
          className="quick-rating-button"
          onClick={() => setQuickRating(true)}
        >
          Start Rating
        </button>

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
          tracks={view === "top100" ? top100 : filteredTracks}
          ratings={ratings}
          onRatingChange={setRating}
        />
      </main>
    </div>
  );
}

export default App;