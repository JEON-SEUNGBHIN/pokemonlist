import { NextResponse } from "next/server";
import axios from "axios";

const TOTAL_POKEMON = 151; // 전체 포켓몬 수

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") || "0"); // 요청에서 offset 파라미터를 가져와 정수로 변환. 기본값은 0
  const limit = parseInt(searchParams.get("limit") || "20"); // 요청에서 limit 파라미터를 가져와 정수로 변환. 기본값은 20

  try {
    // 포켓몬 데이터를 지정된 범위로 가져오기 위한 배열 생성
    const range = Array.from(
      { length: limit },
      (_, index) => offset + index + 1
    ).filter((id) => id <= TOTAL_POKEMON); // offset부터 limit 개수만큼의 포켓몬 ID를 가진 배열을 생성하고, TOTAL_POKEMON을 넘지 않는 것으로 필터링

    // 지정된 범위의 포켓몬 데이터를 가져오는 Promise 배열 생성
    const allPokemonPromises = range.map((id) =>
      Promise.all([
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`), // 포켓몬 데이터 API 요청
        axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`), // 포켓몬 종(ex. 파이리, 이상해 등) 데이터 API 요청
      ])
    );

    // 모든 포켓몬 데이터 요청을 병렬로 처리하고 결과를 기다림
    const allPokemonResponses = await Promise.all(allPokemonPromises);

    // 각 포켓몬 데이터와 종 데이터를 합쳐서 새로운 배열 생성
    const allPokemonData = allPokemonResponses.map(
      ([response, speciesResponse], index) => {
        // 종 데이터에서 한국어 이름을 찾음
        const koreanName = speciesResponse.data.names.find(
          (name: any) => name.language.name === "ko"
        );

        // 포켓몬 데이터와 종 데이터를 합쳐서 새로운 객체 생성
        return { ...response.data, korean_name: koreanName?.name || null };
      }
    );

    // JSON 형태로 포켓몬 데이터 변환
    return NextResponse.json(allPokemonData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" });
  }
};
