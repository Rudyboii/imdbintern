let watchlist = [];  // For Movies
let watchlist2 = []; // For TV Shows
let favoriteActors = [];

const api = {
  // Watchlist Methods for Movies
  getWatchlist: async (any) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...watchlist]), 500); // Return a copy of the movie watchlist
    });
  },

  addMovieToWatchlist: async (movie) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!watchlist.find((entry) => entry.id === movie.id && entry.type === "movie")) {
          watchlist.push({ ...movie, type: "movie" }); // Add type as 'movie'
        }
        resolve(true);
      }, 500);
    });
  },

  removeFromWatchlist: async (itemId, type) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (type === "movie") {
          watchlist = watchlist.filter((item) => !(item.id === itemId && item.type === type));
        }
        resolve(true);
      }, 500);
    });
  },

  isInWatchlist: async (itemId, type) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exists = watchlist.some((item) => item.id === itemId && item.type === type);
        resolve(exists);
      }, 500);
    });
  },

  // Watchlist Methods for TV Shows
  getWatchlist2: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...watchlist2]), 500); // Return a copy of the TV show watchlist
    });
  },

  addTVShowToWatchlist: async (tvShow) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!watchlist2.find((s) => s.id === tvShow.id && s.type === "tv")) {
          watchlist2.push({ ...tvShow, type: "tv" }); // Add type as 'tv'
        }
        resolve(true);
      }, 500);
    });
  },

  removeTVShowFromWatchlist: async (tvShowId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        watchlist2 = watchlist2.filter((tvShow) => tvShow.id !== tvShowId);
        resolve(true);
      }, 500);
    });
  },

  // Favorite Actor Methods
  addActorToFavorites: async (actor) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!favoriteActors.find((a) => a.id === actor.id)) {
          favoriteActors.push(actor);
        }
        resolve(true);
      }, 500);
    });
  },

  removeActorFromFavorites: async (actorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        favoriteActors = favoriteActors.filter((actor) => actor.id !== actorId);
        resolve(true);
      }, 500);
    });
  },

  isActorInFavorites: async (actorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const exists = favoriteActors.some((actor) => actor.id === actorId);
        resolve(exists);
      }, 500);
    });
  },

  getFavoriteActors: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...favoriteActors]), 500); // Return a copy of favorite actors
    });
  },
};

export default api;
