import { NextResponse } from "next/server";
import axios from "axios";

const TOTAL_POKEMON = 151;

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0");
  const limit = parseInt(searchParams.get("limit") || "20");

  try {
    // 포켓몬 데이터를 지정된 범위로 가져오기 위한 배열 생성
    const range = Array.from(
      { length: limit },
      (_, index) => offset + index + 1
    ).filter((id) => id <= TOTAL_POKEMON);

    // 지정된 범위의 포켓몬 데이터를 가져오는 Promise 배열 생성
    const allPokemonPromises = range.map((id) =>
      Promise.all([
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`),
        axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`),
      ])
    );

    const allPokemonResponses = await Promise.all(allPokemonPromises);

    const allPokemonData = allPokemonResponses.map(
      ([response, speciesResponse], index) => {
        const koreanName = speciesResponse.data.names.find(
          (name: any) => name.language.name === "ko"
        );
        return { ...response.data, korean_name: koreanName?.name || null };
      }
    );

    return NextResponse.json(allPokemonData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" });
  }
};
