"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function InputAndShow({
  nameLength,
  titleAnime,
  urlAnime,
  character,
  characterNameLength,
}) {
  console.log("InputAndShow props:", {
    nameLength,
    titleAnime,
    urlAnime,
    character,
    characterNameLength,
  });

  const MAX_ROWS = 6;

  // Chọn chế độ active (Anime hoặc Character)
  const isCharacterMode = !!character;
  const activeLength = isCharacterMode ? characterNameLength : nameLength;
  const activeTitle = isCharacterMode ? character : titleAnime;
  const activeUrl = isCharacterMode ? "#" : urlAnime; // nếu cần link nhân vật thì sau này gắn API
  const answer = (activeTitle || "")?.toUpperCase();

  const [letters, setLetters] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [submittedRows, setSubmittedRows] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyPress = (char) => {
    if (isSolved || gameOver || currentRow >= MAX_ROWS) return;

    setLetters((prev) => {
      const rowStart = currentRow * activeLength;
      const rowEnd = (currentRow + 1) * activeLength;
      const rowLetters = prev.slice(rowStart, rowEnd);

      if (rowLetters.length < activeLength) {
        return [...prev, char.toUpperCase()];
      }
      return prev;
    });
  };

  const handleBackspace = () => {
    if (isSolved || gameOver || currentRow >= MAX_ROWS) return;

    setLetters((prev) => {
      const rowStart = currentRow * activeLength;
      const rowEnd = (currentRow + 1) * activeLength;
      if (prev.length > rowStart && prev.length <= rowEnd) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const handleEnter = () => {
    if (isSolved || gameOver || currentRow >= MAX_ROWS) return;

    const rowStart = currentRow * activeLength;
    const rowEnd = (currentRow + 1) * activeLength;
    const rowLetters = letters.slice(rowStart, rowEnd);

    if (rowLetters.length === activeLength) {
      setSubmittedRows((prev) => [...prev, currentRow]);
      const guess = rowLetters.join("").toUpperCase();

      if (guess === answer) {
        setIsSolved(true);
        return;
      }

      if (currentRow === MAX_ROWS - 1) {
        setGameOver(true);
        return;
      }

      setCurrentRow((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      const allowedSymbols = [
        " ",
        ",",
        ".",
        "-",
        ":",
        ";",
        "'",
        "!",
        "@",
        "#",
        "$",
        "%",
        "^",
        "&",
        "*",
        "(",
        ")",
        "?",
      ];
      if (/^[a-zA-Z0-9]$/.test(key) || allowedSymbols.includes(key)) {
        handleKeyPress(key);
      } else if (key === "Backspace") {
        handleBackspace();
      } else if (key === "Enter") {
        handleEnter();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [letters, currentRow, isSolved, gameOver, activeLength]);

  const getCellColor = (rowIdx, colIdx) => {
    const index = rowIdx * activeLength + colIdx;
    const char = letters[index]?.toUpperCase();

    if (
      rowIdx === currentRow &&
      !submittedRows.includes(rowIdx) &&
      letters.length === index
    ) {
      return "border-2 border-blue-500 animate-pulse";
    }

    if (!char) return "bg-white border-gray-300";
    if (!submittedRows.includes(rowIdx)) return "bg-white border-gray-300";

    if (answer[colIdx] === char)
      return "bg-green-500 border-green-600 text-white";
    if (answer.includes(char))
      return "bg-yellow-400 border-yellow-500 text-white";
    return "bg-gray-200 border-gray-300 text-gray-700";
  };

  const inputLocked = isSolved || gameOver;

  return (
    <>
      {/* Lưới nhập */}
      <div className="grid grid-rows-6 gap-2 mb-4">
        {[...Array(MAX_ROWS)].map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${activeLength}, minmax(0, 1fr))`,
            }}
          >
            {[...Array(activeLength)].map((_, colIdx) => {
              const index = rowIdx * activeLength + colIdx;
              return (
                <div
                  key={colIdx}
                  className={`w-12 h-12 border-2 flex items-center justify-center text-xl font-bold uppercase rounded-lg ${getCellColor(
                    rowIdx,
                    colIdx
                  )}`}
                >
                  {letters[index] || ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Thông báo trạng thái */}
      {isSolved && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-green-100 text-green-800 font-semibold">
          🎉 Chuẩn rồi! Bạn đoán đúng:{" "}
          <Link
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {activeTitle}
          </Link>
        </div>
      )}
      {gameOver && !isSolved && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-100 text-red-800 font-semibold">
          😵 Hết lượt! Đáp án là:{" "}
          <Link
            href={activeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {activeTitle}
          </Link>
        </div>
      )}

      {/* Bàn phím ảo */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex justify-center gap-2">
          {"1234567890".split("").map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={inputLocked}
              className={`px-4 py-3 rounded-lg text-base font-bold uppercase cursor-pointer border-none ${
                inputLocked
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300"
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, idx) => (
          <div key={idx} className="flex justify-center gap-2">
            {row.split("").map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                disabled={inputLocked}
                className={`px-4 py-3 rounded-lg text-base font-bold uppercase cursor-pointer border-none ${
                  inputLocked
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-gray-300"
                }`}
              >
                {key}
              </button>
            ))}
            {idx === 2 && (
              <>
                <button
                  onClick={handleBackspace}
                  disabled={inputLocked}
                  className={`px-4 py-3 rounded-lg text-base font-bold uppercase border-none ${
                    inputLocked
                      ? "bg-red-200 text-white/60 cursor-not-allowed"
                      : "bg-red-400 text-white"
                  }`}
                >
                  ⌫
                </button>
                <button
                  onClick={handleEnter}
                  disabled={inputLocked}
                  className={`px-4 py-3 rounded-lg text-base font-bold uppercase border-none ${
                    inputLocked
                      ? "bg-green-200 text-white/60 cursor-not-allowed"
                      : "bg-green-500 text-white"
                  }`}
                >
                  Enter
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
