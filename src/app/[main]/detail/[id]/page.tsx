import { Pokemon } from "@/types/pokemon";
import { Metadata } from "next";
import React from "react";

async function getPokemon(id: number): Promise<Pokemon> {
  const res = await fetch(`http://localhost:3000/api/pokemons/${id}`);
  if (!res.ok) {
    throw new Error("데이터 불러오기 실패");
  }
  const data = await res.json();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  const pokemon = await getPokemon(params.id);
  return {
    title: `${pokemon.korean_name} | 포켓몬 도감`,
    description: `${pokemon.korean_name}의 상세 정보`,
  };
}

export default async function DetailPage({
  params,
}: {
  params: { id: number };
}) {
  const pokemon = await getPokemon(params.id);

  return (
    <div>
      <h1>{pokemon.korean_name}</h1>
      <p>No. {pokemon.id}</p>
      <img src={pokemon.sprites.front_default} alt={pokemon.korean_name} />
      <p>이름: {pokemon.korean_name}</p>
      <p>
        키: {pokemon.height / 10}m 무게: {pokemon.weight / 10}kg
      </p>
      <div>
        <h2>타입</h2>
        <p>{pokemon.types.map((type) => type.type.korean_name)}</p>
      </div>
      <div>
        <h2>능력</h2>
        <p>{pokemon.abilities.map((ability) => ability.ability.korean_name)}</p>
      </div>
      <div>
        <h2>기술</h2>
        <p>{pokemon.moves.map((move) => move.move.korean_name)}</p>
      </div>
    </div>
  );
}
