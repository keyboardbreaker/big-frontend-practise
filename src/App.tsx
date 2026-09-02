import { useCallback, useEffect, useState } from 'react';

export const App = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        setHighlightedIndex((prev) => {
          if (prev === null) return 0;
          return Math.min(prev + 1, suggestions.length - 1);
        });
      };
      if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) => {
          if (prev === null) return suggestions.length - 1;
          return Math.max(prev - 1, 0);
        });
      }
      if (e.key === "Enter" && highlightedIndex !== null) {
        setInputValue(suggestions[highlightedIndex]);
        setIsOpen(false); 
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }

  }, [suggestions, highlightedIndex, setInputValue, setIsOpen]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  }, []);

  const handleSuggestionClick = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    const suggestion:string = e.currentTarget.dataset.value!;
    setInputValue(suggestion);
    setIsOpen(false); 
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input:string = e.currentTarget.value;
    setInputValue(input);
    setIsOpen(true);
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
          onBlur={handleBlur}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="suggestion-list"
          aria-autocomplete="list"
        />
        {isOpen && suggestions.length > 0 &&(
        <ul
          role="listbox"  
          className="absolute left-0 top-full w-full bg-white shadow-md mt-1">
          {
            suggestions.map((suggestion, index) => (
                <li 
                  role="option"
                  aria-selected={highlightedIndex === index}
                  className={highlightedIndex === index ? 
                    "bg-gray-300 text-black p-2 cursor-pointer" : 
                    "text-black p-2 hover:bg-gray-200 cursor-pointer"}
                  onClick={handleSuggestionClick} 
                  data-value={suggestion}
                  key={suggestion}>
                    {suggestion}
                </li>
            ))
          }
        </ul>)}
      </div>
    </div>
  );
};