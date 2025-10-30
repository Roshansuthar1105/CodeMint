import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchBar = ({ className = '', mobile = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const items = [
    { title: 'Components', path: '/components', type: 'Page' },
    { title: 'Snippets', path: '/snippets', type: 'Page' },
    { title: 'Templates', path: '/templates', type: 'Page' },
    { title: 'Effects', path: '/effects', type: 'Page' },
    { title: 'Colors', path: '/colors', type: 'Page' },
    // Add more items as needed
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const filteredResults = items.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredResults);
    setIsSearching(false);
  }, [query]);

  const handleSelect = (item) => {
    setQuery('');
    setShowResults(false);
    navigate(item.path);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder="Search components, snippets, effects..."
          className={`w-full pl-10 pr-4 ${
            mobile ? 'py-3 text-base' : 'py-2 text-sm'
          } rounded-xl bg-gray-50/50 dark:bg-slate-800/50 backdrop-blur-sm
          border border-gray-200/50 dark:border-slate-700/50 hover:border-purple-200 dark:hover:border-purple-800
          text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 
          focus:border-purple-400 dark:focus:border-purple-600
          shadow-sm hover:shadow-md dark:shadow-slate-900/10
          transition-all duration-200 ease-in-out`}
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <FiSearch className={`w-4 h-4 ${mobile ? 'scale-110' : ''} text-purple-400 dark:text-purple-500`} />
        </div>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full 
            bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 
            hover:bg-gray-200 dark:hover:bg-slate-600 
            hover:text-gray-700 dark:hover:text-gray-200
            focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20
            transition-all duration-200"
          >
            <FiX className={`${mobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (query.trim() !== '' || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-2 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md
            rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-slate-900/50
            border border-gray-100 dark:border-slate-700/50 
            overflow-hidden z-50 transform-gpu"
          >
            {isSearching ? (
              <div className="p-6 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent dark:border-purple-400 dark:border-t-transparent" />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="w-full px-4 py-3 flex items-center space-x-3
                    hover:bg-purple-50 dark:hover:bg-purple-900/20
                    group transition-all duration-200 ease-in-out"
                  >
                    <FiSearch className="w-4 h-4 text-purple-400 dark:text-purple-500 
                    group-hover:text-purple-500 dark:group-hover:text-purple-400
                    transition-colors duration-200" />
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-gray-900 dark:text-white
                        group-hover:text-purple-700 dark:group-hover:text-purple-300
                        transition-colors duration-200">
                        {item.title}
                      </div>
                      <div className="text-xs text-purple-500/60 dark:text-purple-400/60
                        group-hover:text-purple-600 dark:group-hover:text-purple-400
                        transition-colors duration-200 font-medium">
                        {item.type}
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transform scale-90 
                      group-hover:scale-100 transition-all duration-200 text-purple-500 dark:text-purple-400">
                      →
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No results found for "<span className="text-purple-500 dark:text-purple-400">{query}</span>"
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;