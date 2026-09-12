function ViewTabs({ view, setView, counts }) {
  const tabs = [
    {
      id: "all",
      label: "All",
      count: counts.all,
    },
    {
      id: "rated",
      label: "Rated",
      count: counts.rated,
    },
    {
      id: "unrated",
      label: "Unrated",
      count: counts.unrated,
    },
    {
      id: "top100",
      label: "Top 100",
      count: counts.top100,
    },
  ];

  return (
    <nav className="view-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={
            view === tab.id
              ? "view-tab active"
              : "view-tab"
          }
          onClick={() => setView(tab.id)}
        >
          <span>{tab.label}</span>
          <span className="view-tab-count">
            {tab.count}
          </span>
        </button>
      ))}
    </nav>
  );
}

export default ViewTabs;