function Stats({
  trackCount,
  artistCount,
  ratedCount,
  averageRating,
}) {
  return (
    <section className="stats">
      <div className="stat">
        <span className="stat-number">{trackCount}</span>
        <span className="stat-label">Tracks</span>
      </div>

      <div className="stat">
        <span className="stat-number">{artistCount}</span>
        <span className="stat-label">Artists</span>
      </div>

      <div className="stat">
        <span className="stat-number">{ratedCount}</span>
        <span className="stat-label">Rated</span>
      </div>

      <div className="stat">
        <span className="stat-number">{averageRating}</span>
        <span className="stat-label">Average rating</span>
      </div>
    </section>
  );
}

export default Stats;