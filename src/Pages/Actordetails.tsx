import React, { useState } from "react";
import { Award, Instagram, Star, Twitter, Heart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import storage from '../utils/storage';

const Actordetails = () => {
  const actors = [
    {
      id: 1,
      name: "Timothée Chalamet",
      birthDate: "December 27, 1995",
      birthPlace: "New York City, New York, USA",
      nationality: "American-French",
      height: "5' 10\" (1.78 m)",
      biography:
        "Timothée Hal Chalamet is an American actor. He has received various accolades, including nominations for an Academy Award, two Golden Globe Awards, and three BAFTA Film Awards. Born and raised in New York City, he began his career on the stage and in television productions, appearing in the drama series Homeland in 2012.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1492446845049-9c50cc313f00?auto=format&fit=crop&w=2000&q=80",
      awards: [
        {
          name: "Academy Award Nomination",
          year: 2018,
          category: "Best Actor",
          film: "Call Me by Your Name",
        },
        {
          name: "Golden Globe Nomination",
          year: 2018,
          category: "Best Actor - Drama",
          film: "Call Me by Your Name",
        },
        {
          name: "BAFTA Nomination",
          year: 2018,
          category: "Best Actor",
          film: "Call Me by Your Name",
        },
      ],
      socialMedia: {
        instagram: "https://instagram.com/tchalamet",
        twitter: "https://twitter.com/realchalamet",
        imdb: "https://www.imdb.com/name/nm3154303/",
      },
      knownFor: [
        {
          id: 1,
          title: "Dune: Part Two",
          role: "Paul Atreides",
          year: 2024,
          rating: 8.8,
          image:
            "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 2,
          title: "Wonka",
          role: "Willy Wonka",
          year: 2023,
          rating: 7.2,
          image:
            "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 3,
          title: "Dune",
          role: "Paul Atreides",
          year: 2021,
          rating: 8.0,
          image:
            "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
        },
      ],
      stats: {
        moviesCount: 18,
        totalAwards: 12,
        avgRating: 8.4,
        yearsActive: "2012-present",
      },
      upcomingProjects: [
        {
          title: "Bob Dylan Biopic",
          role: "Bob Dylan",
          status: "Pre-production",
          expectedRelease: "2025",
        },
      ],
    },
    {
      id: 2,
      name: "Zendaya",
      birthDate: "September 1, 1996",
      birthPlace: "Oakland, California, USA",
      nationality: "American",
      height: "5' 10\" (1.78 m)",
      biography:
        "Zendaya is an American actress and singer. She began her career as a child model and backup dancer before gaining prominence for her role as Rocky Blue on the Disney Channel sitcom Shake It Up. She has gone on to star in numerous acclaimed films and television series.",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      coverImage:
        "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=2000&q=80",
      awards: [
        {
          name: "Emmy Award",
          year: 2020 ,
          category: "Outstanding Lead Actress in a Drama Series",
          film: "Euphoria",
        },
        {
          name: "Critics' Choice Award",
          year: 2021,
          category: "Best Actress in a Drama Series",
          film: "Euphoria",
        },
      ],
      socialMedia: {
        instagram: "https://instagram.com/zendaya",
        twitter: "https://twitter.com/zendaya",
        imdb: "https://www.imdb.com/name/nm3918038/",
      },
      knownFor: [
        {
          id: 1,
          title: "Dune",
          role: "Chani",
          year: 2021,
          rating: 8.0,
          image:
            "https://images.unsplash.com/photo-1601758123927-1c1c1c1c1c1c?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 2,
          title: "Spider-Man: No Way Home",
          role: "MJ",
          year: 2021,
          rating: 8.7,
          image:
            "https://images.unsplash.com/photo-1601758123927-1c1c1c1c1c1c?auto=format&fit=crop&w=800&q=80",
        },
      ],
      stats: {
        moviesCount: 15,
        totalAwards: 5,
        avgRating: 8.5,
        yearsActive: "2010-present",
      },
      upcomingProjects: [
        {
          title: "Dune: Part Two",
          role: "Chani",
          status: "Post-production",
          expectedRelease: "2024",
        },
      ],
    },
  ];

  const { id } = useParams();
  const actor = actors.find((m) => m.id === Number(id)) || actors[0];
  const [isFavorite, setIsFavorite] = useState(storage.getFavorites().includes(actor.id));

  const handleFavorite = () => {
    const favorites = storage.getFavorites();
    if (isFavorite) {
      storage.setFavorites(favorites.filter((id) => id !== actor.id));
    } else {
      storage.setFavorites([...favorites, actor.id]);
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${actor.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
        </div>
        <div className="relative h-full container flex items-end pb-8">
          <div className="flex items-end gap-8">
            <img
              src={actor.image}
              alt={actor.name}
              className="w-48 h-48 rounded-xl object-cover border-4 border-gray-900"
            />
            <div>
              <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span>{actor.stats.avgRating} Average Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span>{actor.stats.totalAwards} Awards</span>
                </div>
              </div>
              <button
                className={`bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-colors ${isFavorite ? 'bg-red-500' : ''}`}
                onClick={handleFavorite}
              >
                {isFavorite ? (
                  <Heart className="w-5 h-5 text-white" />
                ) : (
                  <Heart className="w-5 h-5 text-orange" />
                )}
                
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Biography</h2>
        <p>{actor.biography}</p>
      </div>

      <div className="mb-8">
 <h2 className="text-2xl font-bold">Known For</h2>
        <ul className="list-disc pl-5">
          {actor.knownFor.map((movie) => (
            <li key={movie.id} className="mb-2">
              <Link to={`/movies/${movie.id}`} className="text-blue-500 hover:underline">
                {movie.title} ({movie.year}) - {movie.role} - Rating: {movie.rating}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Awards</h2>
        <ul className="list-disc pl-5">
          {actor.awards.map((award, index) => (
            <li key={index} className="mb-2">
              {award.name} ({award.year}) - {award.category} for {award.film}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Upcoming Projects</h2>
        <ul className="list-disc pl-5">
          {actor.upcomingProjects.map((project, index) => (
            <li key={index} className="mb-2">
              {project.title} - {project.role} - Status: {project.status} (Expected Release: {project.expectedRelease})
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Social Media</h2>
        <div className="flex gap-4">
          <a href={actor.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Instagram
          </a>
          <a href={actor.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            Twitter
          </a>
          <a href={actor.socialMedia.imdb} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            IMDb
          </a>
        </div>
      </div>
    </div>
  );
};

export default Actordetails;