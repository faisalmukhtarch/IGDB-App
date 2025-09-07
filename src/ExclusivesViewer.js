// src/ExclusivesViewer.js
import React, { useEffect, useState } from 'react';

const PLATFORMS = {
  'Nintendo Switch': 130,
  'PlayStation 5': 167,
};

export default function ExclusivesViewer() {
  const [games, setGames] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlatform, setCurrentPlatform] = useState('Nintendo Switch');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Fetch games from backend proxy
  async function fetchGames(platformId, offsetParam = 0, append = false) {
    setLoading(true);
    setError(null);
    const query = `
      fields id, name, platforms.name, first_release_date, cover.image_id;
      where platforms = (${platformId});
      sort first_release_date desc;
      limit 20;
      offset ${offsetParam};
    `;

    try {
      const response = await fetch('/api/igdb', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: query,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (append) {
        setGames(prev => [...prev, ...data]);
      } else {
        setGames(data);
      }
      setHasMore(data.length === 20);
      setOffset(offsetParam);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  // Initial load and reload on platform change
  useEffect(() => {
    fetchGames(PLATFORMS[currentPlatform], 0, false);
  }, [currentPlatform]);

  // Handler for "Load More"
  const loadMore = () => {
    fetchGames(PLATFORMS[currentPlatform], offset + 20, true);
  };

  // Filter games client-side by search term (case-insensitive)
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 700, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Game Exclusives Dashboard</h2>

      {/* Platform Tabs */}
      <div style={{ marginBottom: 20 }}>
        {Object.keys(PLATFORMS).map(platform => (
          <button
            key={platform}
            onClick={() => setCurrentPlatform(platform)}
            style={{
              marginRight: 10,
              padding: '8px 16px',
              cursor: 'pointer',
              backgroundColor: platform === currentPlatform ? '#1e90ff' : 'white',
              color: platform === currentPlatform ? 'white' : '#1e90ff',
              border: '1px solid #1e90ff',
              borderRadius: 4,
            }}
          >
            {platform}
          </button>
        ))}
      </div>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{
          padding: '8px',
          width: '100%',
          marginBottom: 20,
          boxSizing: 'border-box',
          fontSize: 16,
          borderRadius: 4,
          border: '1px solid #ccc',
        }}
      />

      {/* Error */}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {/* Loading */}
      {loading && <p>Loading games...</p>}

      {/* Games List */}
      {filteredGames.length === 0 && !loading && <p>No games found.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredGames.map(game => (
          <li
            key={game.id}
            style={{
              marginBottom: 15,
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              borderRadius: 6,
              padding: 10,
            }}
          >
            <img
              src={
                game.cover
                  ? `https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg`
                  : 'https://via.placeholder.com/64x90?text=No+Image'
              }
              alt={game.name}
              style={{ width: 64, height: 90, marginRight: 15, objectFit: 'cover', borderRadius: 4 }}
            />
            <div>
              <strong style={{ fontSize: 18 }}>{game.name}</strong>
              <br />
              <small>
                Release Date:{' '}
                {game.first_release_date
                  ? new Date(game.first_release_date * 1000).toLocaleDateString()
                  : 'Unknown'}
              </small>
            </div>
          </li>
        ))}
      </ul>

      {/* Load More Button */}
      {hasMore && !loading && (
        <button
          onClick={loadMore}
          style={{
            padding: '10px 20px',
            marginTop: 10,
            cursor: 'pointer',
            backgroundColor: '#1e90ff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
          }}
        >
          Load More
        </button>
      )}
    </div>
  );
}