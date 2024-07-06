import { NextResponse } from "next/server";
import axios from "axios";

interface ErrorWithDigest extends Error {
  digest?: string;
}

function hasDigestProperty(error: any): error is ErrorWithDigest {
  return typeof error === 'object' && 'digest' in error;
}

export const GET = async (
  request: Request,
  { params }: { params: { id: string } },
) => {
  const { id } = params;

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const speciesResponse = await axios.get(
      `https://pokeapi.co/api/v2/pokemon-species/${id}`,
    );

    const koreanName = speciesResponse.data.names?.find(
      (name: any) => name.language.name === "ko",
    );

    const typesWithKoreanNames = await Promise.all(
      response.data.types.map(async (type: any) => {
        const typeResponse = await axios.get(type.type.url);
        const koreanTypeName =
          typeResponse.data.names?.find(
            (name: any) => name.language.name === "ko",
          )?.name || type.type.name;
        return { ...type, type: { ...type.type, korean_name: koreanTypeName } };
      }),
    );

    const abilitiesWithKoreanNames = await Promise.all(
      response.data.abilities.map(async (ability: any) => {
        const abilityResponse = await axios.get(ability.ability.url);
        const koreanAbilityName =
          abilityResponse.data.names?.find(
            (name: any) => name.language.name === "ko",
          )?.name || ability.ability.name;
        return {
          ...ability,
          ability: { ...ability.ability, korean_name: koreanAbilityName },
        };
      }),
    );

    const movesWithKoreanNames = await Promise.all(
      response.data.moves.map(async (move: any) => {
        const moveResponse = await axios.get(move.move.url);
        const koreanMoveName =
          moveResponse.data.names?.find(
            (name: any) => name.language.name === "ko",
          )?.name || move.move.name;
        return { ...move, move: { ...move.move, korean_name: koreanMoveName } };
      }),
    );

    const pokemonData = {
      ...response.data,
      korean_name: koreanName?.name || response.data.name,
      types: typesWithKoreanNames,
      abilities: abilitiesWithKoreanNames,
      moves: movesWithKoreanNames,
    };

    return NextResponse.json(pokemonData);
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);

    // 타입 가드를 사용하여 error 객체에 digest 속성이 있는지 확인
    if (hasDigestProperty(error)) {
      console.error("Error digest:", error.digest);
    }

    return NextResponse.json({ error: "Failed to fetch data" });
  }
};