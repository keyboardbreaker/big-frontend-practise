import { useCallback, useEffect, useState } from 'react';

export const App = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const mockApi = async (query: string): Promise<string[]> => {
    const res = await fetch("/suggestions.json");
    const allSuggestions = await res.json();
    return allSuggestions.filter((suggestion: string) =>
      suggestion.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!suggestions.length) return;

      if (e.key === "ArrowDown") {
        console.log("select in the list of suggestions");

      }
    }, [suggestions]);

  const handleSuggestionClick = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    const suggestion:string = e.currentTarget.dataset.value!;
    setInputValue(suggestion);
    setSuggestions([]);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input:string = e.currentTarget.value;
    setInputValue(input);
  }, []);

  useEffect(() => {
    if (!inputValue) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await mockApi(inputValue);
      setSuggestions(results);
    }, 300);
    
    mockApi(inputValue);

    return () => clearTimeout(timer);
  }, [inputValue]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-8 text-white">
      <label>Smart Autocomplete</label>
      <div className="relative w-full max-w-sm">
        <input
          className="w-full border border-white p-2"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter your search..."
          onKeyDown={handleKeyDown}
        />
        <ul className="absolute left-0 top-full w-full bg-white shadow-md mt-1">
          {
            suggestions.map((suggestion) => (
                <li 
                  onClick={handleSuggestionClick} 
                  data-value={suggestion}
                  key={suggestion} className="text-black p-2 hover:bg-gray-200">
                    {suggestion}
                </li>
            ))
          }
        </ul>
      </div>
    </div>
  );
};
