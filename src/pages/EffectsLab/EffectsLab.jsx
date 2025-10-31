// src/pages/EffectsLab/EffectsLab.jsx
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaGithub } from "react-icons/fa";
import effectsData from "../../data/effects.json";
import { copyToClipboard } from "../../utils/copyToClipboard";

// Highlight animation styles
const highlightStyles = `
  @keyframes highlightPulse {
    0% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(147, 51, 234, 0); }
    100% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
  }
  .highlight-animation {
    animation: highlightPulse 2s ease-in-out;
  }
`;

// Empty Block Component that fills remaining space
const EmptyBlock = ({ height = "auto" }) => (
  <div
    className="w-full bg-gray-800 rounded-xl border border-white/20 "
    style={{ minHeight: height }}
    aria-hidden="true"
  ></div>
);

// EffectCard Component
const EffectCard = ({
  effect,
  index,
  activeTab,
  onTabChange,
  onCopyCode,
  getCurrentCode,
  renderPreview,
}) => {
  return (
    <motion.div
      id={effect.name?.toLowerCase().replace(/\s+/g, '-')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-700"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1 mr-2">
            {effect.name}
          </h3>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded-full flex-shrink-0">
            {effect.type}
          </span>
        </div>

        {/* Effect Preview */}
        <div className="mb-4 p-4 bg-gradient-to-br from-cyan-500/80 to-purple-500/80 dark:from-slate-700 dark:to-slate-600 rounded-xl border-2 border-purple-200 dark:border-slate-600 flex justify-center items-center min-h-[100px]">
          <style>{effect.css}</style>
          {renderPreview(effect, index)}
        </div>

        {/* Code Tabs */}
        <div className="mb-3 relative">
          <div className="flex border-b border-gray-200 dark:border-gray-600 mb-2">
            {["css", "html", "js"].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(index, tab)}
                className={`cursor-pointer px-2 py-1 font-medium text-xs flex-1 ${
                  activeTab === tab
                    ? "text-purple-600 border-b-2 border-purple-600"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Code Block with Copy Button */}
          <button
            onClick={() => onCopyCode(getCurrentCode(effect, index))}
            className="cursor-pointer absolute z-10 top-10 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-200 group"
            title="Copy code"
          >
            <FaCopy className="w-4 h-4 text-gray-300 group-hover:text-white" />
          </button>
          <div className="bg-gray-900 rounded-lg p-2 max-h-28 overflow-y-auto relative custom-scrollbar">
            <pre className="text-blue-400 text-left text-xs pr-6">
              <code>{getCurrentCode(effect, index)}</code>
            </pre>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1 flex-1">
            {effect.tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-400 cursor-pointer hover:underline flex items-center gap-1 ml-2 flex-shrink-0"
            href={
              effect.contributor_github || "https://github.com/roshansuthar1105"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="w-3 h-3" />
            by {effect.contributor}
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const EffectsLab = () => {
  const [effects] = useState(effectsData);
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    // Get the fragment identifier from the URL
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash) {
      // Find the effect that matches the hash
      const targetEffect = effects.find(effect => 
        effect.name?.toLowerCase().replace(/\s+/g, '-') === hash ||
        effect.path?.toLowerCase() === hash
      );
      
      if (targetEffect) {
        // If the effect exists but is filtered out, show its type
        setSelectedType(targetEffect.type);
        
        // Scroll to the element after a short delay to ensure rendering
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a highlight effect
            element.classList.add('highlight-animation');
            setTimeout(() => element.classList.remove('highlight-animation'), 2000);
          }
        }, 100);
      }
    }
  }, [effects]);
  const [activeTabs, setActiveTabs] = useState({});
  const previewRefs = useRef([]);

  const types = useMemo(
    () => ["all", ...new Set(effects.map((effect) => effect.type))],
    [effects]
  );

  const filteredEffects = useMemo(
    () =>
      selectedType === "all"
        ? effects
        : effects.filter((effect) => effect.type === selectedType),
    [selectedType, effects]
  );

  // Distribute effects into masonry columns with empty blocks for balance
  const masonryColumns = useMemo(() => {
    const columns = [[], [], []];

    // Distribute real effects
    filteredEffects.forEach((effect, index) => {
      columns[index % 3].push({
        effect,
        originalIndex: index,
        type: "effect",
      });
    });

    // Calculate maximum column length
    const maxColumnLength = Math.max(...columns.map((col) => col.length));

    // Add empty blocks to make all columns equal length
    columns.forEach((column, columnIndex) => {
      const emptyBlocksNeeded = maxColumnLength - column.length;
      for (let i = 0; i < emptyBlocksNeeded; i++) {
        column.push({
          type: "empty",
          id: `empty-${columnIndex}-${i}`,
          // Calculate approximate height to fill space (average card height)
          height: 300, // Approximate height of an effect card
        });
      }
    });

    return columns;
  }, [filteredEffects]);

  // Initialize active tabs for each effect
  useEffect(() => {
    const initialTabs = {};
    filteredEffects.forEach((_, index) => {
      initialTabs[index] = "css";
    });
    setActiveTabs(initialTabs);
  }, [filteredEffects]);

  const handleCopyCode = useCallback(async (code) => {
    await copyToClipboard(code);
  }, []);

  const handleTabChange = useCallback((effectIndex, tab) => {
    setActiveTabs((prev) => ({
      ...prev,
      [effectIndex]: tab,
    }));
  }, []);

  // Initialize JavaScript for effects that need it
  useEffect(() => {
    filteredEffects.forEach((effect, index) => {
      if (effect.js && previewRefs.current[index]) {
        try {
          const jsCode = effect.js.replace(
            /document\.querySelector/g,
            "preview.querySelector"
          );
          const initFunction = new Function("preview", jsCode);
          initFunction(previewRefs.current[index]);
        } catch (error) {
          console.warn(`Error initializing JS for ${effect.name}:`, error);
        }
      }
    });
  }, [filteredEffects, activeTabs]);

  const renderPreview = useCallback((effect, index) => {
    if (effect.html) {
      return (
        <div
          ref={(el) => (previewRefs.current[index] = el)}
          dangerouslySetInnerHTML={{ __html: effect.html }}
          className="w-full h-full flex items-center justify-center"
        />
      );
    }

    return (
      <div
        className={`cursor-pointer text-center p-2 bg-white dark:bg-gray-200 rounded-lg shadow-md ${effect.previewClass} w-full h-full flex items-center justify-center`}
      >
        Hover Me
      </div>
    );
  }, []);

  const getCurrentCode = useCallback(
    (effect, effectIndex) => {
      const currentTab = activeTabs[effectIndex] || "css";
      switch (currentTab) {
        case "css":
          return effect.css;
        case "html":
          return effect.html || "<!-- No HTML provided -->";
        case "js":
          return effect.js || "// No JavaScript provided";
        default:
          return effect.css;
      }
    },
    [activeTabs]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Effects Lab
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <span className="text-sm text-purple-700 dark:text-purple-300">
              New to contributing?
            </span>
            <a
              href="#guidepage"
              className="scroll-smooth text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline underline-offset-2 transition-colors duration-200"
            >
              View guide
            </a>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Interactive CSS effects and animations. Copy the code and bring your
            designs to life!
          </p>
        </motion.div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 text-sm shadow-md hover:shadow-lg ${
                selectedType === type
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {masonryColumns.map((column, columnIndex) => (
            <div key={columnIndex} className="grid gap-3">
              {column.map((item) =>
                item.type === "effect" ? (
                  <EffectCard
                    key={item.effect.name}
                    effect={item.effect}
                    index={item.originalIndex}
                    activeTab={activeTabs[item.originalIndex]}
                    onTabChange={handleTabChange}
                    onCopyCode={handleCopyCode}
                    getCurrentCode={getCurrentCode}
                    renderPreview={renderPreview}
                  />
                ) : (
                  <EmptyBlock key={item.id} height={item.height} />
                )
              )}
            </div>
          ))}
        </div>

        {/* How to Contribute Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 text-left"
          id="guidepage"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            How to Contribute Effects
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-3">
              Share your creative CSS effects and animations. You can contribute
              in two ways:
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Option 1: Use the Contribution Form (Recommended)
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 text-sm mb-4">
                <li>
                  Go to the form page :{" "}
                  <a
                    href="/contribute"
                    target="_blank"
                    className=" text-blue-400 underline "
                  >
                    /contribute
                  </a>{" "}
                </li>
                <li>Fill out the form above with your effect details</li>
                <li>
                  Click "Generate JSON" to create the properly formatted code
                </li>
                <li>Copy the generated JSON output</li>
                <li>
                  Add it to <code>src/data/effects.json</code> in your pull
                  request
                </li>
              </ol>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-300 text-sm">
                  <strong>Pro tip:</strong> Use the "Load Example" button to see
                  a properly formatted example!
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Option 2: Manual JSON Creation
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-300 text-sm">
                <li>
                  Edit <code>src/data/effects.json</code>
                </li>
                <li>
                  Add a new effect object following the exact format below
                </li>
                <li>
                  <strong>Important:</strong> Escape newlines in CSS using{" "}
                  <code>\n</code>
                </li>
                <li>Include type, tags, and your username</li>
                <li>Submit a pull request</li>
              </ol>
            </div>

            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                {`{
  "name": "Your Effect Name",
  "type": "animation",
  "previewClass": "your-effect",
  "css": ".your-class {\\n  property: value;\\n  another-property: value;\\n}",
  "html": "<div class=\\"your-class\\">Your content</div>",
  "js": "// Optional JavaScript code",
  "contributor": "yourname",
  "contributor_github": "https://github.com/yourusername",
  "tags": ["animation", "hover", "interaction"]
}`}
              </pre>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                <strong>Note:</strong> When creating JSON manually, remember to:
              </p>
              <ul className="list-disc list-inside mt-1 text-yellow-700 dark:text-yellow-400 text-sm">
                <li>
                  Use double quotes for all property names and string values
                </li>
                <li>
                  Escape double quotes within strings using <code>\"</code>
                </li>
                <li>
                  Replace actual newlines with <code>\n</code> in CSS code
                </li>
                <li>Ensure proper comma placement between properties</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EffectsLab;
