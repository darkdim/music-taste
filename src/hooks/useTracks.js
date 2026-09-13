import { useMemo } from "react";

export function useTracks({
  tracks,
  search,
  artist,
  sortBy,
  view,
  ratings,
}) {
  const artists = useMemo(() => {
    return [...new Set(
      tracks.map((track) => track.artist)
    )].sort((a, b) => a.localeCompare(b));
  }, [tracks]);

  const filteredTracks = useMemo(() => {
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
    tracks,
    search,
    artist,
    sortBy,
    view,
    ratings,
  ]);

  const counts = useMemo(() => {
    const rated = tracks.filter(
      (track) => ratings[track.id]
    ).length;

    return {
      all: tracks.length,
      rated,
      unrated: tracks.length - rated,
      top100: Math.min(rated, 100),
    };
  }, [tracks, ratings]);

  return {
    artists,
    filteredTracks,
    counts,
  };
}