"use client";

import { useEffect, useState } from "react";

export default function Note({ onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed top-16 right-4 z-50 transition-transform duration-500 ${
        visible ? "translate-x-0" : "translate-x-full"
      } w-80`}
    >
      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-4 pt-6">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition"
        >
          ✕
        </button>

        {/* Nội dung */}
        <div className="flex items-start gap-3">
          <div className="text-blue-500 text-xl">💡</div>
          <div className="text-gray-800 text-sm leading-relaxed">
            Cái này tôi làm <span className="font-semibold">for fun</span>, và
            tốt nhất thì bạn nên nhập bàn phím máy tính để chơi :)
            <br />
            <span className="text-gray-600">
              Mấy cái nút kí tự đặc biệt như :, . ` dùng đc đấy nhé, nhưng tôi
              lười show ra thôi:)
            </span>
            <br />
            <span className="text-gray-600">
              Và nếu mấy ô có phàn nàn về việc phải đợi quá lâu để đc chơi thì
              bro, tôi bất khả kháng với việc này;-;
            </span>
            <br />
            <span className="text-gray-600">
              Về sau có note gì thì tôi sẽ note tiếp sau.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
