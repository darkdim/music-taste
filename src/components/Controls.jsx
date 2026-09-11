import { Search } from "lucide-react";

function Controls({
  search,
  setSearch,
  artist,
  setArtist,
  sortBy,
  setSortBy,
  artists,
}) {
  return (
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
  );
}

export default Controls;