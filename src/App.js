import "./App.css";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.tsx";
import { BrowserRouter, Routes ,Route} from "react-router-dom";
import Home from "./Pages/Home.tsx";
import MovieList from "./Pages/MovieList.tsx";
import MovieDetails from "./Pages/MovieDetails.tsx";
import Toprated from "./Pages/Toprated.jsx";
import Actordetails from "./Pages/Actordetails.tsx";
import FavoriteActors from './Pages/FavoriteActors.tsx';
import Watchlist from "./Pages/Watchlist.tsx";
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode === "true";
  });

  // We want to make sure our dark mode preference is saved to local storage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Let's create a function to toggle our dark mode
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
          <Route path="/favorite-actors" element={<FavoriteActors />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
