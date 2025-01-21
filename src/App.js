import "./App.css";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.tsx";
import { BrowserRouter, Routes ,Route} from "react-router-dom";
import Home from "./Pages/Home.tsx";
import MovieList from "./Pages/MovieList.tsx";
import MovieDetails from "./Pages/MovieDetails.tsx";
import Toprated from "./Pages/Toprated.tsx";
import Actordetails from "./Pages/Actordetails.tsx";
import PopularCasts from "./Pages/PopularCasts.tsx";
import FavoriteActors from './Pages/FavoriteActors.tsx';
import Watchlist from "./Pages/Watchlist.tsx";
import TVShowDetails from "./Pages/TVShowDetails.tsx";
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <BrowserRouter>
      <div
        className={`min-h-screen ${
          darkMode ? "bg-black text-white" : "bg-white text-black"
        } ${darkMode ? "dark-mode" : ""}`}
      >
        <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/movies" element={<MovieList/>}/>
          <Route path="/movie/:id" element={<MovieDetails/>}/>
          <Route path="/actor/:id" element={<Actordetails/>}/>
          <Route path="/top-rated" element={<Toprated/>}/>
          <Route path="/popular-casts" element={<PopularCasts />} />
          <Route path="/favorite-actors" element={<FavoriteActors />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/tv/:id" element={<TVShowDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
