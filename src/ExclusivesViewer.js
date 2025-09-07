import React, { useEffect, useState } from 'react';

export default function ExclusivesViewer() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchGames() {
    setLoading(true);
    setError(null);
    const query = `
      fields id, name, platforms.name, first_release_date, cover.image_id;
      where platforms = (130);
      limit 20;
      sort first_release_date desc;
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
      setGames(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) return <p>Loading games...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Nintendo Switch Exclusives</h2>
      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <ul style={{listStyle:'none', padding:0}}>
          {games.map(game => (
            <li key={game.id} style={{ marginBottom: '1em', display: 'flex', alignItems: 'center' }}>
              <img
                src={game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg` : 'https://via.placeholder.com/64x90?text=No+Image'}
                alt={game.name}
                style={{ width: 64, height: 90, marginRight: 10, objectFit: 'cover' }}
              />
              <div>
                <strong>{game.name}</strong><br/>
                Release Date: {game.first_release_date ? new Date(game.first_release_date * 1000).toLocaleDateString() : 'Unknown'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}