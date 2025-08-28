"use client";

import { useState } from "react";
import InputAndShow from "./InputAndShow";

export default function UILayout({ dataAnime, successData }) {
  const nameLength = dataAnime?.title ? dataAnime.title.length : 0;
  const titleAnime = dataAnime?.title || "";

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <header className="my-8 text-3xl font-bold tracking-widest">
          Wordlime
        </header>
        {successData ? (
          <h1 className="mb-2">Anime data available</h1>
        ) : (
          <h1 className="mb-2">Anime data not found</h1>
        )}
        {dataAnime?.title && (
          <p className="mb-4 text-lg text-gray-700">
            Title length (including spaces): {dataAnime.title.length}
          </p>
        )}
        {successData ? (
          <InputAndShow nameLength={nameLength} titleAnime={titleAnime} />
        ) : (
          <h1>No anime data available</h1>
        )}
      </div>
    </>
  );
}
