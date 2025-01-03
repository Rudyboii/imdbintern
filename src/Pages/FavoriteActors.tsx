// src/Pages/FavoriteActors.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import storage from '../utils/storage';

const FavoriteActors = () => {
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
          year: 2020,
          category: "Outstanding Lead Actress in a Drama Series",
          film: "Euphoria ",
        },
        {
          name: "Critics' Choice Award",
          year: 2021,
          category: "Best Actress in a Drama Series",
          film: "Euphoria",
        },
        {
          name: "MTV Movie & TV Award",
          year: 2021,
          category: "Best Performance in a Show",
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
          title: "Dune: Part Two",
          role: "Chani",
          year: 2024,
          rating: 8.8,
          image:
            "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 2,
          title: "Spider-Man: No Way Home",
          role: "MJ",
          year: 2021,
          rating: 8.7,
          image:
            "https://images.unsplash.com/photo-1638481981234-1c1c1c1c1c1c?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 3,
          title: "Euphoria",
          role: "Rue Bennett",
          year: 2019,
          rating: 8.4,
          image:
            "https://images.unsplash.com/photo-1588888888888-1c1c1c1c1c1c?auto=format&fit=crop&w=800&q=80",
        },
      ],
      stats: {
        moviesCount: 15,
        totalAwards: 8,
        avgRating: 8.5,
        yearsActive: "2010-present",
      },
      upcomingProjects: [
        {
          title: "Spider-Man: Beyond the Spider-Verse",
          role: "MJ",
          status: "Post-production",
          expectedRelease: "2025",
        },
      ],
    },
  ];

  const favorites = storage.getFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Favorite Actors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actors
          .filter((actor) => favorites.includes(actor.id))
          .map((actor) => (
            <div key={actor.id} className="border rounded-lg p-4">
              <img src={actor.image} alt={actor.name} className="w-full h-48 object-cover rounded-lg" />
              <h2 className="text-xl font-semibold mt-2">{actor.name}</h2>
              <p className="text-gray-600">{actor.birthDate} | {actor.birthPlace}</p>
              <p className="mt-2">{actor.biography}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FavoriteActors;