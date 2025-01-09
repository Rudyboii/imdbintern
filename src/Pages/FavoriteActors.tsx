import React, { useEffect, useState } from "react";

interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
}

const FavoriteActorPage: React.FC = () => {
  const [favoriteActors, setFavoriteActors] = useState<Actor[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteActors") || "[]");
    setFavoriteActors(storedFavorites);
  }, []);

  if (!favoriteActors.length) {
    return (
      <div className="text-center mt-8">
        <h1 className="text-2xl font-bold">No Favorite Actors Found</h1>
        <p>Add your favorite actors to see them here.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Favorite Actors</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoriteActors.map((actor) => (
          <div key={actor.id} className="p-4 bg-gray-200 rounded shadow">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                  : "/placeholder-profile.jpg"
              }
              alt={actor.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="mt-2 text-lg font-semibold">{actor.name}</h2>
            <p className="text-gray-600">{actor.known_for_department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteActorPage;
