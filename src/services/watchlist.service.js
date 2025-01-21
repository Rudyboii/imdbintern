import api from '../api';

class WatchlistService {
  getWatchlist() {
    return api.getWatchlist();
  }

  addMovieToWatchlist(movieId) {
    api.addMovieToWatchlist(movieId);
  }

  removeMovieFromWatchlist(movieId) {
    api.removeMovieFromWatchlist(movieId);
  }
}

export default WatchlistService;