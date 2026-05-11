interface RecentSearchesProps {
  searches: string[]
  onSelect: (query: string) => void
  onClear: () => void
}

export default function RecentSearches({ searches, onSelect, onClear }: RecentSearchesProps) {
  if (searches.length === 0)
    return null

  return (
    <section className="recent-searches" aria-label="Recent searches">
      <span>Recent</span>
      <div className="recent-search-list">
        {searches.map(search => (
          <button
            key={search}
            type="button"
            className="recent-search-chip"
            aria-label={`Search ${search} again`}
            onClick={() => onSelect(search)}
          >
            {search}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="recent-search-clear"
        aria-label="Clear recent searches"
        onClick={onClear}
      >
        Clear
      </button>
    </section>
  )
}
