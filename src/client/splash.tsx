import "./index.css";

import { requestExpandedMode } from "@devvit/web/client";
import { context } from "@devvit/web/client";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

export const Splash = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">

      <h1 className="text-5xl font-bold mb-2">
        🕵 Hidden Agents
      </h1>

      <p className="text-gray-300 mb-10 text-center">
        Someone among you is secretly the Spy...
      </p>

      <div className="bg-slate-900 rounded-xl p-6 w-80 shadow-xl">

        <p className="text-lg mb-2">
          Welcome
        </p>

        <h2 className="text-2xl font-bold mb-6">
          {context.username}
        </h2>

        <div className="flex justify-between mb-4">
          <span>Players Joined</span>
          <span>0 / 10</span>
        </div>

        <button
          className="w-full bg-orange-600 hover:bg-orange-700 rounded-lg py-3 text-lg font-semibold"
          onClick={(e) => requestExpandedMode(e.nativeEvent, "game")}
        >
          JOIN GAME
        </button>

      </div>

      <p className="mt-8 text-gray-500 text-sm">
        Reddit Hackathon 2026
      </p>

    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);