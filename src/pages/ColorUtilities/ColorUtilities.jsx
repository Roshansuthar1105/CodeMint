// src/pages/ColorUtilities/ColorUtilities.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import colorsData from "../../data/colors.json";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { MdOutlineContentCopy } from "react-icons/md";
import { FiCheck } from "react-icons/fi";

const ColorUtilities = () => {
  const [colors] = useState(colorsData);
  const [selectedType, setSelectedType] = useState("all");
  const [copyFeedback, setCopyFeedback] = useState(null);

  useEffect(() => {
    // Get the fragment identifier from the URL
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash) {
      // Find the color item that matches the hash
      const targetColor = colors.find(color => 
        color.name?.toLowerCase().replace(/\s+/g, '-') === hash ||
        color.path?.toLowerCase() === hash
      );
      
      if (targetColor) {
        // If the color exists but is filtered out, show its type
        setSelectedType(targetColor.type);
        
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
  }, [colors]);

  const types = ["all", ...new Set(colors.map((color) => color.type))];

  const filteredColors =
    selectedType === "all"
      ? colors
      : colors.filter((color) => color.type === selectedType);

  const handleCopyColor = async (colorValue, format, colorName) => {
    let textToCopy = colorValue;

    if (format === "gradient" && Array.isArray(colorValue)) {
      textToCopy = `linear-gradient(45deg, ${colorValue.join(", ")})`;
    } else if (format === "hex" && Array.isArray(colorValue)) {
      textToCopy = colorValue.join(", ");
    } else if (format === "singlehex") {
      textToCopy = colorValue;
    }

    await copyToClipboard(textToCopy);
    setCopyFeedback(`${colorName || "Color"} copied!`);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const getGradientStyle = (colorArray) => {
    return {
      background: `linear-gradient(135deg, ${colorArray.join(", ")})`,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block mb-2">
            <span className="text-4xl">🌈</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
            Color Utilities
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Beautiful color palettes and gradients. Copy HEX, RGB, or CSS
            gradient code for your projects!
          </p>
        </motion.div>

        {/* Copy Feedback Toast */}
        {copyFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-green-400"
          >
            <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
              <FiCheck className="w-3 h-3" />
            </div>
            <span className="font-medium text-sm">{copyFeedback}</span>
          </motion.div>
        )}

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {types.map((type) => (
            <motion.button
              key={type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
                selectedType === type
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white"
                  : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Highlight animation styles */}
        <style jsx>{`
          @keyframes highlightPulse {
            0% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(147, 51, 234, 0); }
            100% { box-shadow: 0 0 0 0 rgba(147, 51, 234, 0); }
          }
          .highlight-animation {
            animation: highlightPulse 2s ease-in-out;
          }
        `}</style>

        {/* Colors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredColors.map((color, index) => (
            <motion.div
              key={color.name}
              id={color.name?.toLowerCase().replace(/\s+/g, '-')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 }} }
              transition={{
                delay: index * 0.05,
                duration: 0.3,
                scale: { duration: 0.2 },
              }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-slate-700 group"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                    {color.name}
                  </h3>
                  <span className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-800 dark:text-pink-300 text-xs font-semibold rounded-full">
                    {color.type}
                  </span>
                </div>

                {/* Large Color Preview */}
                <div className="mb-4 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-slate-600 shadow-md">
                  {color.type === "gradient" ? (
                    <div
                      className="h-32 w-full relative group/preview"
                      style={getGradientStyle(color.colors)}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover/preview:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05,transition: { duration: 0.3 }}}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleCopyColor(
                              color.colors,
                              "gradient",
                              color.name
                            )
                          }
                          className="opacity-0 group-hover/preview:opacity-100 transition-all duration-300 px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-lg font-medium shadow-lg hover:bg-white text-sm"
                        >
                          Copy Gradient
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-32">
                      {color.colors.map((colorHex, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="flex-1 relative group/color cursor-pointer transition-all duration-300 hover:flex-[1.3]"
                          style={{ backgroundColor: colorHex }}
                          onClick={() =>
                            handleCopyColor(colorHex, "singlehex", colorHex)
                          }
                        >
                          <div className="absolute inset-0 bg-black/0 group-hover/color:bg-black/10 transition-all duration-300 flex items-center justify-center">
                            <MdOutlineContentCopy className="text-white text-xl opacity-0 group-hover/color:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Color Swatches with HEX codes */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {color.colors.map((colorHex, colorIndex) => (
                    <motion.div
                      key={colorIndex}
                      whileHover={{ scale: 1.1,transition: { duration: 0.3 } }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="text-center relative group/swatch"
                    >
                      <div
                        className="w-full aspect-square rounded-lg mx-auto mb-1 border-2 border-gray-300 dark:border-slate-600 cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        style={{ backgroundColor: colorHex }}
                        onClick={() =>
                          handleCopyColor(colorHex, "singlehex", colorHex)
                        }
                      >
                        {/* Copy icon overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover/swatch:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <MdOutlineContentCopy className="text-white text-sm opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-300 drop-shadow" />
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-600 dark:text-gray-400 font-mono font-medium block truncate">
                        {colorHex.toUpperCase()}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Copy Action Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.03,transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                    onClick={() =>
                      handleCopyColor(color.colors, "hex", color.name)
                    }
                    className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <MdOutlineContentCopy className="w-3 h-3" />
                    Copy HEX
                  </motion.button>
                  {color.type === "gradient" && (
                    <motion.button
                      whileHover={{ scale: 1.03,transition: { duration: 0.3 } }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      onClick={() =>
                        handleCopyColor(color.colors, "gradient", color.name)
                      }
                      className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                    >
                      <MdOutlineContentCopy className="w-3 h-3" />
                      Copy Gradient
                    </motion.button>
                  )}
                </div>

                {/* Tags and Contributor */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div className="flex flex-wrap gap-1">
                    {color.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-pink-800 dark:text-pink-300 text-xs font-medium rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    href={
                      color.contributor_github ||
                      "https://github.com/roshansuthar1105"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    by{" "}
                    <span className="font-semibold hover:underline">
                      {color.contributor}
                    </span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How to Contribute Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-slate-700"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            How to Contribute Colors
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
              Share your beautiful color palettes and gradients with the
              community:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 text-sm">
              <li className="pl-1">
                Edit{" "}
                <code className="px-2 py-0.5 bg-gray-100 dark:bg-slate-700 rounded text-sm text-pink-600 dark:text-pink-400 font-mono">
                  src/data/colors.json
                </code>
              </li>
              <li className="pl-1">
                Add a new color object with HEX values or gradient colors
              </li>
              <li className="pl-1">Include type, tags, and your username</li>
              <li className="pl-1">Submit a pull request</li>
            </ol>
            <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Example Format:
              </p>
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                {`// For color palette
{
  "name": "Your Palette Name",
  "type": "palette",
  "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
  "contributor": "yourname",
  "contributor_github": "https://github.com/yourusername",
  "tags": ["vibrant", "fresh"]
}

// For gradient
{
  "name": "Your Gradient Name",
  "type": "gradient",
  "colors": ["#667eea", "#764ba2"],
  "contributor": "yourname",
  "contributor_github": "https://github.com/yourusername",
  "tags": ["purple", "smooth"]
}`}
              </pre>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ColorUtilities;
