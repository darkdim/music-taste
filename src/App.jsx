import { useState } from "react";

import { tracks } from "./data/tracks";

import Header from "./components/Header";
import Stats from "./components/Stats";
import Controls from "./components/Controls";
import ViewTabs from "./components/ViewTabs";
import TrackList from "./components/TrackList";
import QuickRating from "./components/QuickRating";
import CompareTracks from "./components/CompareTracks";

import { useRatings } from "./hooks/useRatings";
import { useTracks } from "./hooks/useTracks";
import { useComparisons } from "./hooks/useComparisons";
import { usePreferenceRanking } from "./hooks/usePreferenceRanking";

import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [artist, setArtist] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [view, setView] = useState("all");
  const [quickRating, setQuickRating] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

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
    comparisons,
    addComparison,
  } = useComparisons();

  const {
    rankedTracks,
    top100,
  } = usePreferenceRanking({
    tracks,
    ratings,
    comparisons,
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

      {compareMode && (
        <CompareTracks
          tracks={tracks}
          ratings={ratings}
          rankedTracks={rankedTracks}
          onComparison={addComparison}
          onClose={() => setCompareMode(false)}
        />
      )}

      <main className="container">
        <Stats
          trackCount={tracks.length}
          artistCount={artists.length}
          ratedCount={ratedTracks}
          averageRating={averageRating}
          comparisonCount={comparisons.length}
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

        <div className="action-buttons">
          <button
            className="quick-rating-button"
            onClick={() => setQuickRating(true)}
          >
            Start Rating
          </button>

          <button
            className="quick-rating-button"
            onClick={() => setCompareMode(true)}
          >
            Compare Tracks
          </button>
        </div>

        <ViewTabs
          view={view}
          setView={setView}
          counts={counts}
        />

        <div className="result-info">
          Showing{" "}
          {view === "top100"
            ? top100.length
            : filteredTracks.length}{" "}
          of {tracks.length} tracks
        </div>

        <TrackList
          tracks={
            view === "top100"
              ? top100
              : filteredTracks
          }
          ratings={ratings}
          onRatingChange={setRating}
        />
      </main>
    </div>
  );
}

export default App;