"use client";

import GetAnimeById from "@/api/GetAnimeById";
import GetCharacterGenshin from "@/api/GetCharacterGenshin";
import Note from "@/components/Note";
import UILayout from "@/components/UILayout";
import { useEffect, useState } from "react";

export default function Home() {
  const [randomId, setRandomId] = useState(null);
  const [dataAnime, setDataAnime] = useState([]);
  const [checkDataAnime, setCheckDataAnime] = useState(false);
  const [successData, setSuccessData] = useState(false);
  const [successDataGenshin, setSuccessDataGenshin] = useState(false);
  const [note, setNote] = useState(false);
  const [switchMode, setSwitchMode] = useState(false);
  const [dataCharacterGenshin, setDataCharacterGenshin] = useState([]);
  const [character, setCharacter] = useState(null);
  const [characterNameLength, setCharacterNameLength] = useState(0);

  useEffect(() => {
    const id = Math.floor(Math.random() * 50000) + 1;
    setRandomId(id);
  }, []);

  useEffect(() => {
    if (!randomId) return;
    if (switchMode) return;
    let isMounted = true;
    const fetchAnime = async (id) => {
      console.log("Fetching anime with ID:", id);

      const res = await GetAnimeById(id);
      if (!isMounted) return;
      if (res.success) {
        console.log("Detail information anime character:", res.data);
        setDataAnime(res.data);
        setCheckDataAnime(true);
      } else if (res.status === 404) {
        // If 404, try another randomId
        const newId = Math.floor(Math.random() * 50000) + 1;
        setRandomId(newId);
      }
    };

    if (randomId) {
      setTimeout(() => {
        fetchAnime(randomId);
      }, 400);
    }
    return () => {
      isMounted = false;
    };
  }, [randomId, switchMode]);

  useEffect(() => {
    console.log("Changed switch mode:", switchMode);
  }, [switchMode]);

  useEffect(() => {
    if (switchMode) return;
    if (!checkDataAnime) return;
    if (!dataAnime) return;

    if (
      dataAnime.aired.prop.from.year < 2000 ||
      dataAnime.type != "TV" ||
      dataAnime.members < 5000 ||
      dataAnime.title.length >= 20
    ) {
      setTimeout(() => {
        const id = Math.floor(Math.random() * 50000) + 1;
        setRandomId(id);
        setCheckDataAnime(false);
      }, 400);
    } else {
      setSuccessData(true);
    }
  }, [checkDataAnime, dataAnime, switchMode]);

  useEffect(() => {
    // Chỉ chạy khi đang ở chế độ Genshin và chưa có data
    if (switchMode && !successDataGenshin) {
      const fetchCharacterGenshin = async () => {
        try {
          const res = await GetCharacterGenshin();
          if (res.success) {
            setDataCharacterGenshin(res.data);
            setSuccessDataGenshin(true);

            // 👉 Sau khi fetch thành công thì random luôn 1 nhân vật
            const length = res.data.length;
            const id = Math.floor(Math.random() * length);
            const randomCharacter = res.data[id];

            setCharacter(randomCharacter || "");
            setCharacterNameLength(
              randomCharacter ? randomCharacter.length : 0
            );
          }
        } catch (err) {
          console.error("Fetch Genshin character failed:", err);
        }
      };

      const timer = setTimeout(fetchCharacterGenshin, 400);
      return () => clearTimeout(timer); // cleanup khi unmount hoặc switch mode
    }
  }, [
    switchMode,
    successDataGenshin,
    setDataCharacterGenshin,
    setSuccessDataGenshin,
  ]);

  return (
    <>
      <UILayout
        switchMode={switchMode}
        setSwitchMode={setSwitchMode}
        dataAnime={dataAnime}
        dataCharacterGenshin={dataCharacterGenshin}
        successData={successData}
        successDataGenshin={successDataGenshin}
        character={character}
        characterNameLength={characterNameLength}
      />
      <button
        onClick={() => {
          setNote(true);
        }}
        className=" h-10 w-10 border border-black rounded-full fixed top-4 right-4 bg-white hover:bg-gray-200 transition"
      >
        ?
      </button>
      {note && <Note onClose={() => setNote(false)} />}
    </>
  );
}
