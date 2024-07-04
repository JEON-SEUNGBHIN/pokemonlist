"use client";

import { Pokemon } from "@/types/pokemon";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

const MainPage = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]); // 포켓몬 데이터를 저장하는 상태 변수
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태를 나타내는 상태 변수
  const [offset, setOffset] = useState(0); // 현재 offset을 저장하는 상태 변수
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부를 나타내는 상태 변수
  const loadMoreRef = useRef<HTMLDivElement>(null); // 무한 스크롤을 위해 참조할 요소

  // 포켓몬 데이터를 가져오는 함수
  const fetchPokemon = useCallback(async () => {
    if (!hasMore || isLoading) return; // 더 불러올 데이터가 없거나 이미 로딩 중이면 함수 종료

    setIsLoading(true); // 로딩 상태로 변경
    try {
      const response = await fetch(`/api/pokemons?offset=${offset}&limit=20`); // API 요청
      const data = await response.json(); // 응답 데이터를 JSON으로 파싱
      setPokemonList((prevList) => [...prevList, ...data]); // 기존 데이터에 새로운 데이터 추가
      if (data.length < 20) { 
        setHasMore(false); // 받아온 데이터가 20개 미만이면 더 이상 데이터가 없음을 설정
      }
      setOffset((prevOffset) => prevOffset + 20); // offset을 20만큼 증가
    } catch (error) {
      console.error("에러 발생", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, offset]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          fetchPokemon(); // 하단 요소가 화면에 나타나면 새로운 데이터를 요청
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current); // 하단 요소를 관찰

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current); // 클린업 함수에서 관찰 해제
    };
  }, [isLoading, hasMore, fetchPokemon]);

  if (pokemonList.length === 0 && isLoading) {
    return <div>Loading...</div>; // 초기 로딩 상태 표시
  }

  return (
    <div className="w-full flex flex-col">
      <ul className="w-3/4 grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 m-auto">
        {pokemonList.map((pokemon) => (
          <Link key={pokemon.id} href={`/main/detail/${pokemon.id}`}>
            <li className="m-2 p-2 border rounded-lg cursor-pointer">
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <p className="font-semibold">{pokemon.korean_name}</p>
              <p>도감 번호: {pokemon.id}</p>
            </li>
          </Link>
        ))}
      </ul>
      <div ref={loadMoreRef} className="h-10"></div> {/* 무한 스크롤 트리거 요소 */}
      {isLoading && <div>Loading more...</div>}
    </div>
  );
};

export default MainPage;
