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
    <div>
      <ul>
        {pokemonList.map((pokemon) => (
          <li key={pokemon.id}>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            {pokemon.id}. {pokemon.korean_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MainPage;
