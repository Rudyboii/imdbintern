const storage = {
  getFavorites: () => JSON.parse(localStorage.getItem('favorites')) || [],
  setFavorites: (favorites) => localStorage.setItem('favorites', JSON.stringify(favorites)),
};

export default storage;