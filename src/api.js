
let watchlist = [];

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
};

export default api;
