"use client";

import { Pokemon } from "@/types/pokemon";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

const MainPage = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchPokemon = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/pokemons?offset=${offset}&limit=20`);
      const data = await response.json();
      setPokemonList((prevList) => [...prevList, ...data]);
      if (data.length < 20) {
        setHasMore(false); // 더 이상 데이터가 없는 경우
      }
      setOffset((prevOffset) => prevOffset + 20); // offset 업데이트는 여기서 처리
    } catch (error) {
      console.error("에러 발생", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, offset]);

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore) {
          fetchPokemon(); // IntersectionObserver에서 새로운 데이터를 요청
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [isLoading, hasMore]);

  if (pokemonList.length === 0 && isLoading) {
    return <div>Loading...</div>; // 초기 로딩 상태 표시
  }

  return (
    <div className="flex flex-col">
      <ul className="grid 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 m-6">
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
      <div ref={loadMoreRef} className="h-10"></div>
      {isLoading && <div>Loading more...</div>}
    </div>
  );
};

export default MainPage;
