import { Inter } from "next/font/google";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <form action="api/login">
        <button type="submit">Login With Spotify</button>
      </form>
    </>
  );
}
