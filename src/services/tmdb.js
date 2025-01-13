import axios from "axios";

const API_KEY = "734a09c1281680980a71703eb69d9571";
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const fetchTrendingMovies = async () => {
  const response = await api.get("/trending/movie/week");
  return response.data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    rating: movie.vote_average,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    backdrop: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`, // Full-size backdrop image
    year: new Date(movie.release_date).getFullYear(),
    genre: movie.genre_ids, // You can map these to genre names if needed
  }));
};

export const fetchUpcomingMovies = async () => {
  const response = await api.get("/movie/upcoming");
  return response.data.results.map((movie) => ({
    id: movie.id,
    title: movie.title,
    rating: movie.vote_average,
    image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    backdrop: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`, // Full-size backdrop image
    year: new Date(movie.release_date).getFullYear(),
    genre: movie.genre_ids, // You can map these to genre names if needed
  }));
};
