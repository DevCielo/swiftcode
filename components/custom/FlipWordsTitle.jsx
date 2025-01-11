// src/components/FlipWordsTitle.jsx
import React from "react";
import { FlipWords } from "../ui/flip-words";

export function FlipWordsTitle() {
  const words = ["intelligent", "stunning", "responsive", "customizable"];

  return (
    <div className="flex justify-center items-center px-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-4xl lg:text-4xl font-semibold font-poppins bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent">
          Create<FlipWords words={words} /> <br />
          websites effortlessly with <span className="bg-gradient-to-r from-purple-400 to-purple-800 bg-clip-text text-transparent font-bold"> Swiftcode
          </span>
        </h1>
      </div>
    </div>
  );
}
