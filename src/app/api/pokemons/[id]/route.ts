import { NextResponse } from "next/server";
import axios from "axios";

const POKEAPI_BASE_URL = process.env.NEXT_PUBLIC_POKEAPI_URL;

export const GET = async (request: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    // 포켓몬 정보 및 종 정보를 병렬로 가져오기
    const [pokemonResponse, speciesResponse] = await Promise.all([
      axios.get(`${POKEAPI_BASE_URL}/pokemon/${id}`),
      axios.get(`${POKEAPI_BASE_URL}/pokemon-species/${id}`),
    ]);

    // 종의 한국어 이름 찾기
    const koreanName = speciesResponse.data.names.find((name: any) => name.language.name === "ko");

    // 타입 정보 병렬로 가져오기
    const typesWithKoreanNames = await Promise.all(
      pokemonResponse.data.types.map(async (type: any) => {
        const typeResponse = await axios.get(type.type.url);
        const koreanTypeName = typeResponse.data.names.find((name: any) => name.language.name === "ko")?.name || type.type.name;
        return { ...type, type: { ...type.type, korean_name: koreanTypeName } };
      })
    );

    // 능력 정보 병렬로 가져오기
    const abilitiesWithKoreanNames = await Promise.all(
      pokemonResponse.data.abilities.map(async (ability: any) => {
        const abilityResponse = await axios.get(ability.ability.url);
        const koreanAbilityName = abilityResponse.data.names.find((name: any) => name.language.name === "ko")?.name || ability.ability.name;
        return { ...ability, ability: { ...ability.ability, korean_name: koreanAbilityName } };
      })
    );

    // 기술 정보 병렬로 가져오기
    const movesWithKoreanNames = await Promise.all(
      pokemonResponse.data.moves.map(async (move: any) => {
        const moveResponse = await axios.get(move.move.url);
        const koreanMoveName = moveResponse.data.names.find((name: any) => name.language.name === "ko")?.name || move.move.name;
        return { ...move, move: { ...move.move, korean_name: koreanMoveName } };
      })
    );

    // 포켓몬 데이터 구성
    const pokemonData = {
      ...pokemonResponse.data,
      korean_name: koreanName?.name || pokemonResponse.data.name,
      types: typesWithKoreanNames,
      abilities: abilitiesWithKoreanNames,
      moves: movesWithKoreanNames,
    };

    return NextResponse.json(pokemonData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" });
  }
};
