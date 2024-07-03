"use client";

import { Pokemon } from "@/types/pokemon";
import { useEffect, useState } from "react";

const MainPage = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch("/api/pokemons");
        const data = await response.json();
        setPokemonList(data);
      } catch (error) {
        console.error("에러 발생", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <ul className="grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 m-6">
        {pokemonList.map((pokemon) => (
          <li key={pokemon.id} className="m-2 p-2 border rounded-lg cursor-pointer">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p className="font-semibold">{pokemon.korean_name}</p>
            <p>도감 번호: {pokemon.id}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;
