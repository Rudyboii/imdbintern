import React, { useEffect, useState } from "react";
import Hero from "../components/Hero.tsx";
import { Award, Clock, Star, TrendingUp, WatchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCarousel from "../components/MovieCarousel.tsx";
import WatchlistService from "../services/watchlist.service";
import  { fetchTrendingMovies, fetchUpcomingMovies } from "../services/tmdb.js"; 

const watchlistService = new WatchlistService();

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const watchlist = watchlistService.getWatchlist();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const trending = await fetchTrendingMovies();
        const upcoming = await fetchUpcomingMovies();
        setTrendingMovies(trending);
        setUpcomingMovies(upcoming);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: TrendingUp,
              label: "Trending",
              path: "/movies?sort=trending",
              color: "bg-yellow-500",
            },
            {
              icon: Star,
              label: "Top Rated",
              path: "/top-rated",
              color: "bg-purple-500",
            },
            {
              icon: Clock,
              label: "Coming Soon",
              path: "/coming-soon",
              color: "bg-blue-500",
            },
            {
              icon: Award,
              label: "Awards",
              path: "/awards",
              color: "bg-red-500",
            },
            {
              icon: WatchIcon,
              label: "Watchlist",
              path: "/watchlist",
              color: "bg-green-500",
            },
          ]
            
            .map((category, index) => (
              <Link
                key={index}
                to={category.path}
                className={`${category.color} p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-70 transition-opacity`}
              >
                <category.icon className="w-5 h-5" />
                <span className="font-medium">{category.label}</span>
              </Link>
            ))}
        </div>
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
              Trending Now
            </h2>
            <Link to="/movies?sort=trending" className="text-yellow-500 hover:text-yellow-400">
              View All
            </Link>
          </div>
          <MovieCarousel movies={trendingMovies} />
        </section>
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-yellow-500" />
              Coming Soon
            </h2>
            <Link to="/coming-soon" className="text-yellow-500 hover:text-yellow-400">
              View All
            </Link>
          </div>
          <MovieCarousel movies={upcomingMovies} />
        </section>
      </main>
    </div>
  );
};

export default Home;
