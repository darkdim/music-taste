import { useMemo, useState } from "react";

import { tracks } from "./data/tracks";

import Header from "./components/Header";
import Stats from "./components/Stats";
import Controls from "./components/Controls";
import TrackList from "./components/TrackList";
import ViewTabs from "./components/ViewTabs";

import { useRatings } from "./hooks/useRatings";

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

  const artists = useMemo(() => {
    return [...new Set(
      tracks.map((track) => track.artist)
    )].sort((a, b) => a.localeCompare(b));
  }, []);

  const visibleTracks = useMemo(() => {
    const query = search.toLowerCase().trim();

    let result = tracks.filter((track) => {
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

    if (view === "rated") {
      result = result.filter(
        (track) => ratings[track.id]
      );
    }

    if (view === "unrated") {
      result = result.filter(
        (track) => !ratings[track.id]
      );
    }

    if (view === "top100") {
      return result
        .filter((track) => ratings[track.id])
        .sort((a, b) => {
          const ratingA = ratings[a.id] || 0;
          const ratingB = ratings[b.id] || 0;

          return ratingB - ratingA;
        })
        .slice(0, 100);
    }

    if (sortBy === "title") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sortBy === "artist") {
      result.sort((a, b) =>
        a.artist.localeCompare(b.artist)
      );
    }

    if (sortBy === "rating") {
      result.sort((a, b) => {
        const ratingA = ratings[a.id] || 0;
        const ratingB = ratings[b.id] || 0;

        return ratingB - ratingA;
      });
    }

    return result;
  }, [
    search,
    artist,
    sortBy,
    view,
    ratings,
  ]);

  const ratedCount = Object.keys(ratings).length;

  const viewCounts = {
    all: tracks.length,
    rated: ratedCount,
    unrated: tracks.length - ratedCount,
    top100: Math.min(ratedCount, 100),
  };

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
          counts={viewCounts}
        />

        <div className="result-info">
          Showing {visibleTracks.length} of {tracks.length} tracks
        </div>

        <TrackList
          tracks={visibleTracks}
          ratings={ratings}
          onRatingChange={setRating}
        />
      </main>
    </div>
  );
}

export default App;