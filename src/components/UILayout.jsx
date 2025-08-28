"use client";

import { useState } from "react";
import InputAndShow from "./InputAndShow";

export default function UILayout({ dataAnime, successData }) {
  const nameLength = dataAnime?.title ? dataAnime.title.length : 0;
  const titleAnime = dataAnime?.title || "";
  const urlAnime = dataAnime?.url || "";

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <header className="my-8 text-3xl font-bold tracking-widest">
          Wordlime
        </header>
        {successData ? (
          <h1 className="mb-2">
            Đã có bộ Anime mà có mơ bạn cũng không đoán được:)
          </h1>
        ) : (
          <h1 className="mb-2">Chưa tìm đc bộ Anime nào đủ khó với bạn ;-;</h1>
        )}
        {dataAnime?.title && (
          <p className="mb-4 text-lg text-gray-700">
            Tên bộ này gồm(đã bao gồm cả các dấu không ngờ đến):{" "}
            {dataAnime.title.length}
          </p>
        )}
        {successData ? (
          <InputAndShow
            nameLength={nameLength}
            titleAnime={titleAnime}
            urlAnime={urlAnime}
          />
        ) : (
          <h1>Đợi xíu cho web hoạt động đi</h1>
        )}
      </div>
    </>
  );
}
