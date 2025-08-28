"use client";

import GetAnimeById from "@/api/GetAnimeById";
import Note from "@/components/Note";
import UILayout from "@/components/UILayout";
import { useEffect, useState } from "react";

export default function Home() {
  const [randomId, setRandomId] = useState(null);
  const [dataAnime, setDataAnime] = useState([]);
  const [checkDataAnime, setCheckDataAnime] = useState(false);
  const [successData, setSuccessData] = useState(false);
  const [note, setNote] = useState(false);

  useEffect(() => {
    const id = Math.floor(Math.random() * 50000) + 1;
    console.log("Generated random ID:", id);
    setRandomId(id);
  }, []);

  useEffect(() => {
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
        console.log("Generated new random ID:", newId);
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
  }, [randomId]);

  useEffect(() => {
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
  }, [checkDataAnime, dataAnime]);

  return (
    <>
      <UILayout dataAnime={dataAnime} successData={successData} />
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
