import { Pokemon } from "@/types/pokemon";
import { Metadata } from "next";
import Link from "next/link";
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

  const pokemonId = String(pokemon.id).padStart(4, "0");

  return (
    <div className="w-full text-center">
      <div className="max-w-4xl mx-auto p-4">
        <div className="p-4 border mb-4">
          <h1 className="text-xl font-semibold">{pokemon.korean_name}</h1>
          <p>No. {pokemonId}</p>
        </div>
        <img
          className="mx-auto mb-4"
          src={pokemon.sprites.front_default}
          alt={pokemon.korean_name}
        />
        <p>이름: {pokemon.korean_name}</p>
        <p className="mb-6">
          키: {pokemon.height / 10}m 무게: {pokemon.weight / 10}kg
        </p>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex text-center">
            <h2 className="mr-3 text-lg font-semibold">타입:</h2>
            <ul className="flex">
              {pokemon.types.map((type, index) => (
                <li
                  key={index}
                  className="mr-4 px-2 bg-orange-500 text-white border rounded"
                >
                  {type.type.korean_name}
                </li>
              ))}
            </ul>
            <h2 className="mr-3 text-lg font-semibold">능력:</h2>
            <ul className="flex">
              {pokemon.abilities.map((ability, index) => (
                <li
                  key={index}
                  className="mr-4 px-2 bg-green-500 text-white border rounded"
                >
                  {ability.ability.korean_name}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center w-full">
            <h2 className="mt-4 text-lg font-semibold">기술:</h2>
            <ul className="flex flex-wrap justify-center mt-4 max-h-40 overflow-y-auto border p-2">
              {pokemon.moves.map((move, index) => (
                <li
                  key={index}
                  className="m-2 px-2 py-1 bg-gray-200 border rounded"
                >
                  {move.move.korean_name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Link
          href="/"
          className="block mt-8 p-3 bg-cyan-500 text-white border rounded mx-auto w-32"
        >
          뒤로 가기
        </Link>
      </div>
    </div>
  );
}
