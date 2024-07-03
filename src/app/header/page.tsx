import Link from "next/link";
import React from "react";

const HeaderPage = () => {
  return (
    <header className="w-full my-8 text-center">
      <nav className="m-auto">
        <Link href="/" className="text-3xl font-bold">포켓몬 도감</Link>
      </nav>
    </header>
  );
};

export default HeaderPage;
