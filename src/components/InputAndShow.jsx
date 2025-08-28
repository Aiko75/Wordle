"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function InputAndShow({ nameLength, titleAnime, urlAnime }) {
  const MAX_ROWS = 6;
  const answer = (titleAnime || "").toUpperCase();

  const [letters, setLetters] = useState([]); // tất cả ký tự người chơi nhập
  const [currentRow, setCurrentRow] = useState(0); // hàng đang nhập
  const [submittedRows, setSubmittedRows] = useState([]); // danh sách hàng đã submit
  const [isSolved, setIsSolved] = useState(false);
  const [gameOver, setGameOver] = useState(false); // hết 6 lượt mà chưa đúng

  const handleKeyPress = (char) => {
    if (isSolved || gameOver || currentRow >= MAX_ROWS) return;

    setLetters((prev) => {
      const rowStart = currentRow * nameLength;
      const rowEnd = (currentRow + 1) * nameLength;
      const rowLetters = prev.slice(rowStart, rowEnd);

      if (rowLetters.length < nameLength) {
        return [...prev, char.toUpperCase()];
      }
      return prev;
    });
  };

  const handleBackspace = () => {
    if (isSolved || gameOver || currentRow >= MAX_ROWS) return;

    setLetters((prev) => {
      const rowStart = currentRow * nameLength;
      const rowEnd = (currentRow + 1) * nameLength;
      // chỉ xóa khi đang ở trong row hiện tại
      if (prev.length > rowStart && prev.length <= rowEnd) {
        return prev.slice(0, -1);
      }
      return prev;
    });
  };

  const handleEnter = () => {
    if (isSolved || gameOver || currentRow >= MAX_ROWS) return;

    const rowStart = currentRow * nameLength;
    const rowEnd = (currentRow + 1) * nameLength;
    const rowLetters = letters.slice(rowStart, rowEnd);

    // chỉ submit khi đủ ký tự
    if (rowLetters.length === nameLength) {
      // khóa hàng hiện tại
      setSubmittedRows((prev) => [...prev, currentRow]);

      const guess = rowLetters.join("").toUpperCase();

      if (guess === answer) {
        setIsSolved(true);
        return;
      }

      // nếu đây là hàng thứ 6 (index 5) và vẫn sai -> game over + reveal
      if (currentRow === MAX_ROWS - 1) {
        setGameOver(true);
        return;
      }

      // sang hàng tiếp theo
      setCurrentRow((prev) => prev + 1);
    }
  };

  // Nhận phím cứng từ bàn phím
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
  }, [letters, currentRow, isSolved, gameOver, nameLength]);

  // tô màu + highlight ô đang nhập
  const getCellColor = (rowIdx, colIdx) => {
    const index = rowIdx * nameLength + colIdx;
    const char = letters[index]?.toUpperCase();

    // nếu chưa nhập ký tự và là ô hiện tại
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
              gridTemplateColumns: `repeat(${nameLength}, minmax(0, 1fr))`,
            }}
          >
            {[...Array(nameLength)].map((_, colIdx) => {
              const index = rowIdx * nameLength + colIdx;
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
            href={urlAnime}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {titleAnime}
          </Link>
        </div>
      )}
      {gameOver && !isSolved && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-red-100 text-red-800 font-semibold">
          😵 Hết lượt! Đáp án là:{" "}
          <Link
            href={urlAnime}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {titleAnime}
          </Link>
        </div>
      )}

      {/* Bàn phím ảo */}
      <div className="flex flex-col gap-2 mb-8">
        {/* Hàng số */}
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

        {/* Hàng chữ */}
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
