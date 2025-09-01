"use client";

import InputAndShow from "./InputAndShow";

export default function UILayout({
  switchMode,
  setSwitchMode,
  dataAnime,
  successData,
  successDataGenshin,
  character,
  characterNameLength,
}) {
  console.log("render");

  const nameLength = dataAnime?.title ? dataAnime?.title.length : 0;
  const titleAnime = dataAnime?.title || "";
  const urlAnime = dataAnime?.url || "";

  return (
    <>
      <div className="flex flex-col items-center min-h-screen bg-gray-100">
        <header className=" text-[25px] font-bold tracking-widest">
          Wordle
        </header>
        <div className="flex flex-row gap-2 mb-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              setSwitchMode(true);
              console.log("Switched to Genshin mode");
            }}
          >
            Switch to Genshin
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setSwitchMode(false)}
          >
            Switch to Anime
          </button>
        </div>
        {successData || successDataGenshin ? (
          <h1 className="mb-2">
            Đã có {switchMode ? "nhân vật Genshin" : "bộ Anime"} mà có mơ bạn
            cũng không đoán được:)
          </h1>
        ) : (
          <h1 className="mb-2">
            Chưa tìm đc {switchMode ? "nhân vật Genshin" : "bộ Anime"} nào đủ
            khó với bạn ;-;
          </h1>
        )}
        <p className="mb-4 text-lg text-gray-700">
          Tên {switchMode ? "nhân vật" : "bộ"} này gồm(đã bao gồm cả các dấu
          không ngờ đến):{" "}
          {switchMode ? characterNameLength : dataAnime?.title?.length}
        </p>
        {switchMode
          ? successDataGenshin && (
              <InputAndShow
                nameLength={0}
                titleAnime={null}
                urlAnime={null}
                character={character}
                characterNameLength={characterNameLength}
              />
            )
          : successData && (
              <InputAndShow
                nameLength={nameLength}
                titleAnime={titleAnime}
                urlAnime={urlAnime}
                character={null}
                characterNameLength={0}
              />
            )}
      </div>
    </>
  );
}
