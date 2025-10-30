// src/pages/UIBlocksLibrary/UIBlocksLibrary.jsx
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import blocksData from "../../data/blocks.json";
import { copyToClipboard } from "../../utils/copyToClipboard";

// Import block components
import HeroSection from "./blocks/HeroSection";
import PricingCards from "./blocks/PricingCards";
import StatsDashboard from "./blocks/StatsDashboard";
import UserProfile from "./blocks/UserProfile";
import ModernCard from "./blocks/ModernCard";
import NotificationAlert from "./blocks/NotificationAlert";
import InteractiveForm from "./blocks/InteractiveForm";

// Import icons
import {
  FiCopy,
  FiCheck,
  FiSmartphone,
  FiTablet,
  FiMonitor,
  FiFilter,
  FiX,
  FiGithub,
  FiCode,
  FiEye,
  FiMinus,
  FiPlus,
  FiMaximize,
  FiMinimize,
  FiRefreshCw,
  FiPlay,
  FiPause,
} from "react-icons/fi";

const UIBlocksLibrary = () => {
  const [blocks, setBlocks] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewSize, setPreviewSize] = useState("desktop");
  const [sourceCodes, setSourceCodes] = useState({});
  const [copiedBlock, setCopiedBlock] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [componentWidths, setComponentWidths] = useState({});
  const [isResizing, setIsResizing] = useState(null);
  const [refreshCounters, setRefreshCounters] = useState({});
  const [autoRefresh, setAutoRefresh] = useState({});
  const containerRef = useRef(null);

  const blockComponents = {
    HeroSection,
    PricingCards,
    NotificationAlert,
    ModernCard,
    StatsDashboard,
    UserProfile,
    InteractiveForm
  };

  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const displayBlocks = blocksData.map((block) => ({
          ...block,
          Component:
            blockComponents[block.path] || (() => <div>Block not found</div>),
        }));

        const sourceCodePromises = blocksData.map(async (block) => {
          try {
            const module = await import(`./blocks/${block.path}.jsx?raw`);
            return { path: block.path, sourceCode: module.default };
          } catch (error) {
            console.warn(`Failed to load source for ${block.path}:`, error);
            try {
              const response = await fetch(
                `/src/pages/UIBlocksLibrary/blocks/${block.path}.jsx`
              );
              if (response.ok) {
                const sourceCode = await response.text();
                return { path: block.path, sourceCode };
              }
            } catch (fetchError) {
              console.error(`Fetch failed for ${block.path}:`, fetchError);
            }
            return {
              path: block.path,
              sourceCode: "// Source code not available",
            };
          }
        });

        const sourceCodeResults = await Promise.all(sourceCodePromises);
        const codeMap = {};
        sourceCodeResults.forEach((result) => {
          codeMap[result.path] = result.sourceCode;
        });

        setBlocks(displayBlocks);
        setSourceCodes(codeMap);
      } catch (error) {
        console.error("Error loading blocks:", error);
      }
    };

    loadBlocks();
  }, []);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const intervals = {};

    Object.keys(autoRefresh).forEach((blockPath) => {
      if (autoRefresh[blockPath]) {
        intervals[blockPath] = setInterval(() => {
          setRefreshCounters((prev) => ({
            ...prev,
            [blockPath]: (prev[blockPath] || 0) + 1,
          }));
        }, 2000); // Refresh every 2 seconds
      }
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [autoRefresh]);
  const allTags = [...new Set(blocksData.flatMap((block) => block.tags))];

  const filteredBlocks = blocks.filter((block) => {
    const matchesSearch =
      block.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTags =
      selectedTags.length === 0 ||
      block.tags.some((tag) => selectedTags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const previewSizes = {
    mobile: "max-w-sm",
    tablet: "max-w-md",
    desktop: "max-w-full",
  };

  const previewIcons = {
    mobile: <FiSmartphone className="w-4 h-4" />,
    tablet: <FiTablet className="w-4 h-4" />,
    desktop: <FiMonitor className="w-4 h-4" />,
  };
  const refreshComponent = (blockPath) => {
    setRefreshCounters((prev) => ({
      ...prev,
      [blockPath]: (prev[blockPath] || 0) + 1,
    }));
  };

  const toggleAutoRefresh = (blockPath) => {
    setAutoRefresh((prev) => ({
      ...prev,
      [blockPath]: !prev[blockPath],
    }));
  };
  const cleanSourceCode = (code) => {
    if (!code || code === "// Source code not available") return code;

    let cleanCode = code
      .replace(/import\.meta\.hot.*?}\s*$/s, "")
      .replace(/\/\/# sourceMappingURL=.*$/gm, "")
      .replace(/import.*vite.*client.*/g, "")
      .replace(/import.*jsxDevRuntime.*/g, "")
      .replace(/\$RefreshReg\$.*/g, "")
      .replace(/\$RefreshSig\$.*/g, "")
      .replace(/import React.*?;?\s*/g, "");

    const lines = cleanCode.split("\n");
    const filteredLines = lines.filter((line) => {
      return (
        !line.includes("@vite") &&
        !line.includes("vite_") &&
        !line.includes("RefreshRuntime") &&
        !line.includes("$RefreshReg$") &&
        !line.includes("$RefreshSig$") &&
        !line.includes("sourceMappingURL")
      );
    });

    return filteredLines.join("\n").trim();
  };

  const handleCopyCode = async (blockPath, blockTitle) => {
    const sourceCode = sourceCodes[blockPath];
    if (sourceCode && sourceCode !== "// Source code not available") {
      const cleanCode = cleanSourceCode(sourceCode);
      await copyToClipboard(cleanCode);
      setCopiedBlock(blockTitle);
      setTimeout(() => setCopiedBlock(null), 2000);
    } else {
      try {
        const response = await fetch(
          `/src/pages/UIBlocksLibrary/blocks/${blockPath}.jsx`
        );
        if (response.ok) {
          const sourceCode = await response.text();
          const cleanCode = cleanSourceCode(sourceCode);
          await copyToClipboard(cleanCode);
          setCopiedBlock(blockTitle);
          setTimeout(() => setCopiedBlock(null), 2000);
        } else {
          alert("Source code not available for this block");
        }
      } catch (error) {
        console.error("Final fallback failed:", error);
        alert("Could not load source code for this block");
      }
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchTerm("");
  };

  const updateComponentWidth = (blockPath, change) => {
    setComponentWidths((prev) => {
      const currentWidth = prev[blockPath] || 100;
      const newWidth = Math.max(30, Math.min(100, currentWidth + change));
      return { ...prev, [blockPath]: newWidth };
    });
  };

  const resetComponentWidth = (blockPath) => {
    setComponentWidths((prev) => {
      const newState = { ...prev };
      delete newState[blockPath];
      return newState;
    });
  };

  const startResizing = (blockPath) => {
    setIsResizing(blockPath);
  };

  const stopResizing = () => {
    setIsResizing(null);
  };

  const handleResize = (event, blockPath) => {
    if (!isResizing) return;

    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const relativeX = event.clientX - containerRect.left;
    const containerWidth = containerRect.width;
    const percentage = (relativeX / containerWidth) * 100;

    const newWidth = Math.max(20, Math.min(200, percentage));
    setComponentWidths((prev) => ({ ...prev, [blockPath]: newWidth }));
  };

  // Add global mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e) => handleResize(e, isResizing);
      const handleMouseUp = stopResizing;

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-2xl px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {blocks.length} UI Blocks Available
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 dark:from-white dark:to-blue-400 bg-clip-text text-transparent mb-4">
            UI Blocks Library
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Discover ready-to-use UI sections and page templates. Copy the code
            instantly and customize for your projects!
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 mb-8"
        >
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blocks by name, tags, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 md:py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm md:text-base"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiFilter className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <FiX className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Tag Filters Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base w-full sm:w-auto justify-center"
              >
                <FiFilter className="w-4 h-4" />
                Tags
                {selectedTags.length > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center">
                    {selectedTags.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-50 p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Filter by Tags
                      </span>
                      {selectedTags.length > 0 && (
                        <button
                          onClick={clearFilters}
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                            selectedTags.includes(tag)
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Preview Size Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 md:p-2 shadow-sm">
              {["mobile", "tablet", "desktop"].map((size) => (
                <button
                  key={size}
                  onClick={() => setPreviewSize(size)}
                  className={`flex items-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                    previewSize === size
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {previewIcons[size]}
                  <span className="hidden sm:inline">
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Active Filters */}
        {(selectedTags.length > 0 || searchTerm) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex flex-wrap items-center gap-2 mb-6"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:text-blue-600 ml-1"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:text-green-600 ml-1"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </motion.div>
        )}

        {/* Blocks Grid */}
        <AnimatePresence mode="wait">
          {filteredBlocks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12 md:py-16"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <FiCode className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No blocks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 text-sm md:text-base">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
              <button
                onClick={clearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-colors duration-200 text-sm md:text-base"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:gap-8">
              {filteredBlocks.map((block, index) => {
                const currentWidth = componentWidths[block.path] || 100;
                const refreshCount = refreshCounters[block.path] || 0;
                const isAutoRefreshing = autoRefresh[block.path] || false;

                return (
                  <motion.div
                    key={block.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-4 md:p-8 border-b border-gray-100 dark:border-gray-700">
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {block.title}
                            </h3>
                            {block.isNew && (
                              <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                                New
                              </span>
                            )}
                          </div>
                          {block.description && (
                            <p className="text-gray-600 dark:text-gray-400 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                              {block.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 md:gap-2">
                            {block.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 md:px-3 md:py-1.5 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-800 dark:text-green-300 text-xs md:text-sm font-medium rounded-full border border-green-200 dark:border-green-800/30"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-4">
                          <a
                            className="flex items-center gap-1 md:gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group/contributor text-sm md:text-base"
                            href={
                              block.contributor_github ||
                              "https://github.com/roshansuthar1105"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FiGithub className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="font-medium group-hover/contributor:underline">
                              by {block.contributor}
                            </span>
                          </a>
                        </div>
                      </div>

                      {/* Interactive Controls */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        {/* Width Controls */}
                        <div className="flex-1 flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            Component Width: {Math.round(currentWidth)}%
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateComponentWidth(block.path, -10)
                              }
                              disabled={currentWidth <= 30}
                              className="p-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Decrease width"
                            >
                              <FiMinus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => resetComponentWidth(block.path)}
                              className="p-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                              title="Reset to default"
                            >
                              <FiMaximize className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                updateComponentWidth(block.path, 10)
                              }
                              disabled={currentWidth >= 100}
                              className="p-2 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              title="Increase width"
                            >
                              <FiPlus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Refresh Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => refreshComponent(block.path)}
                            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500 rounded-lg transition-colors text-sm font-medium"
                            title="Refresh data"
                          >
                            <FiRefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">Refresh</span>
                          </button>
                          <button
                            onClick={() => toggleAutoRefresh(block.path)}
                            className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors text-sm font-medium ${
                              isAutoRefreshing
                                ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                                : "bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-500"
                            }`}
                            title={
                              isAutoRefreshing
                                ? "Stop auto-refresh"
                                : "Start auto-refresh"
                            }
                          >
                            {isAutoRefreshing ? (
                              <FiPause className="w-4 h-4" />
                            ) : (
                              <FiPlay className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                              {isAutoRefreshing ? "Auto ON" : "Auto OFF"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Block Preview */}
                      <div className="relative">
                        <div
                          className={`mx-auto border-2 border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                            previewSize === "mobile"
                              ? "max-w-sm"
                              : previewSize === "tablet"
                              ? "max-w-md"
                              : "w-full"
                          }`}
                          style={{
                            width:
                              previewSize === "desktop"
                                ? `${currentWidth}%`
                                : "auto",
                            maxWidth:
                              previewSize === "desktop" ? "100%" : undefined,
                          }}
                        >
                          <div
                            className="bg-white dark:bg-gray-900 p-4 md:p-8 relative"
                            onMouseDown={(e) => startResizing(block.path)}
                          >
                            {block.Component ? (
                              <block.Component refreshCount={refreshCount} />
                            ) : (
                              <div className="text-center py-8 md:py-12 text-gray-500">
                                Component not found
                              </div>
                            )}

                            {/* Resize Handle - Only show for desktop preview */}
                            {previewSize === "desktop" && (
                              <div
                                className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 transition-colors ${
                                  isResizing === block.path ? "bg-blue-500" : ""
                                }`}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  startResizing(block.path);
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Preview Size Indicator */}
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-medium backdrop-blur-sm flex items-center gap-1 md:gap-2">
                          {previewIcons[previewSize]}
                          {previewSize}
                        </div>

                        {/* Refresh Counter */}
                        {refreshCount > 0 && (
                          <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            #{refreshCount}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
                      <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1 md:gap-2">
                          <FiEye className="w-3 h-3 md:w-4 md:h-4" />
                          <span>Preview: {previewSize}</span>
                        </div>
                        {isAutoRefreshing && (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Auto-refresh ON</span>
                          </div>
                        )}
                        {block.lastUpdated && (
                          <span>Updated {block.lastUpdated}</span>
                        )}
                      </div>

                      <button
                        onClick={() => handleCopyCode(block.path, block.title)}
                        disabled={
                          !sourceCodes[block.path] ||
                          sourceCodes[block.path] ===
                            "// Source code not available"
                        }
                        className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 md:px-8 md:py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center gap-2 md:gap-3 group/button min-w-[140px] md:min-w-[180px] justify-center text-sm md:text-base"
                      >
                        {copiedBlock === block.title ? (
                          <>
                            <FiCheck className="w-4 h-4 md:w-5 md:h-5" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <FiCopy className="w-4 h-4 md:w-5 md:h-5" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* How to Contribute Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-20 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 md:p-10 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
              Want to Contribute?
            </h2>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Add your reusable UI blocks to the library and help the community
              grow!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                Getting Started
              </h3>
              <ol className="space-y-3 md:space-y-4 text-gray-600 dark:text-gray-300 text-sm md:text-base">
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full text-xs md:text-sm flex items-center justify-center font-bold mt-0.5">
                    1
                  </span>
                  <span>
                    Create a new{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-sm">
                      .jsx
                    </code>{" "}
                    file in the blocks directory
                  </span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full text-xs md:text-sm flex items-center justify-center font-bold mt-0.5">
                    2
                  </span>
                  <span>Export your block component as default</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full text-xs md:text-sm flex items-center justify-center font-bold mt-0.5">
                    3
                  </span>
                  <span>
                    Add block metadata to{" "}
                    <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-sm">
                      blocks.json
                    </code>
                  </span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full text-xs md:text-sm flex items-center justify-center font-bold mt-0.5">
                    4
                  </span>
                  <span>Import and register your component</span>
                </li>
                <li className="flex items-start gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 bg-blue-500 text-white rounded-full text-xs md:text-sm flex items-center justify-center font-bold mt-0.5">
                    5
                  </span>
                  <span>Submit a pull request</span>
                </li>
              </ol>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6 overflow-x-auto">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <FiCode className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">
                  Example Block
                </h4>
              </div>
              <pre className="text-xs md:text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 overflow-x-auto">
                {`// blocks/YourBlock.jsx
const YourBlock = () => {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-900">
        Your Awesome Block
      </h2>
      <p className="text-gray-600 mt-2">
        Start building your UI block here!
      </p>
    </section>
  );
};

export default YourBlock;`}
              </pre>
            </div>
          </div>

          <div className="text-center mt-6 md:mt-8">
            <a
              href="https://github.com/your-repo/contributing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 md:px-8 md:py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm md:text-base"
            >
              <FiGithub className="w-4 h-4 md:w-5 md:h-5" />
              View Contribution Guidelines
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UIBlocksLibrary;
