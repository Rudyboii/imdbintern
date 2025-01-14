import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  known_for: { title?: string; name?: string }[];
}

const API_KEY = "734a09c1281680980a71703eb69d9571";

const PopularActorsPage: React.FC = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://api.themoviedb.org/3/person/popular",
          {
            params: { api_key: API_KEY, language: "en-US", page: page },
          }
        );
        setActors((prevActors) => [
          ...prevActors,
          ...response.data.results,
        ]); // Concatenate new actors with the previous ones
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch actors.");
        setLoading(false);
      }
    };

    fetchActors();
  }, [page]);

  const loadMoreActors = () => {
    setPage((prevPage) => prevPage + 1); // Load next page of actors
  };

  if (loading && page === 1) {
    return <div className="text-center text-white">Loading actors...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-zinc-900 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Popular Actors</h1>

      {/* Actors Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {actors.length > 0 ? (
          actors.map((actor) => (
            <Link
              to={`/actor/${actor.id}`}
              key={actor.id}
              className="bg-zinc-800 rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105"
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                    : "/path/to/default-image.jpg"
                }
                alt={actor.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="font-semibold text-lg truncate">{actor.name}</h2>
                <p className="text-sm text-zinc-400">
                  {actor.known_for
                    ?.map((work) => work.title || work.name)
                    .slice(0, 2)
                    .join(", ")}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>No actors found.</p>
        )}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-6">
        {!loading && (
          <button
            onClick={loadMoreActors}
            className="px-6 py-2 bg-yellow-500 text-black font-bold rounded-lg"
          >
            Load More Actors
          </button>
        )}
      </div>
    </div>
  );
};

export default PopularActorsPage;
