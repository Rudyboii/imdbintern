
let watchlist = [];
const favoriteActors = [];

const api = {
  getWatchlist: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(watchlist), 500);
    });
  },

  addMovieToWatchlist: async (movie) => {
    return new Promise((resolve) => {
      setTimeout(() => {

        if (!watchlist.find((m) => m.id === movie.id)) {
          watchlist.push(movie);
        }
        resolve(true);
      }, 500);
    });
  },


  removeMovieFromWatchlist: async (movieId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        watchlist = watchlist.filter((movie) => movie.id !== movieId);
        resolve(true);
      }, 500); 
    });
  },

  
  isInWatchlist: async (movieId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(!!watchlist.find((movie) => movie.id === movieId));
      }, 500); 
    });
  },
  // New Favorite Actor functionality
  addActorToFavorites(actor) {
    favoriteActors.push(actor);
    return Promise.resolve();
  },
  removeActorFromFavorites(actorId) {
    const index = favoriteActors.findIndex((a) => a.id === actorId);
    if (index > -1) {
      favoriteActors.splice(index, 1);
    }
    return Promise.resolve();
  },
  isActorInFavorites(actorId) {
    return Promise.resolve(favoriteActors.some((a) => a.id === actorId));
  },
  getFavoriteActors() {
    return Promise.resolve(favoriteActors);
  },
};

export default api;
