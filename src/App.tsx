import { useEffect, useState } from 'react';
import style from "./App.module.css";

export const App = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setSuggestions(["asd", "dsa"]);
  }, [])
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-white">
      <label>Smart Autocomplete</label>
      <div className="relative w-full max-w-sm">
        <input
          className="w-full border border-white p-2"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your search..."
        />
        <ul className="absolute left-0 top-full w-full bg-white shadow-md mt-1">
          {
            suggestions.map((suggestion, key) => (
              <li key={key} className="text-black p-2 hover:bg-gray-200">{suggestion}</li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};
