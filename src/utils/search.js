// Utility function to perform deep search across all content
import blocks from '../data/blocks.json';
import colors from '../data/colors.json';
import components from '../data/components.json';
import effects from '../data/effects.json';
import snippets from '../data/snippets.json';

// Define sections and their routes
const sections = {
  component: {
    path: '/components',
    label: 'Components',
    data: components,
    searchFields: ['title', 'description', 'tags', 'code', 'usage']
  },
  snippet: {
    path: '/snippets',
    label: 'CSS Snippets',
    data: snippets,
    searchFields: ['title', 'description', 'code', 'category', 'tags']
  },
  block: {
    path: '/templates',
    label: 'UI Blocks',
    data: blocks,
    searchFields: ['title', 'description', 'category', 'tags', 'code']
  },
  effect: {
    path: '/effects',
    label: 'Effects',
    data: effects,
    searchFields: ['title', 'description', 'category', 'tags', 'code']
  },
  color: {
    path: '/colors',
    label: 'Colors',
    data: colors,
    searchFields: ['name', 'title', 'description', 'colors', 'tags']
  }
};

// Function to highlight matching text
const highlightMatch = (text, searchTerm) => {
  if (!text) return '';
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  const parts = text.split(regex);
  return {
    original: text,
    highlighted: parts.map((part, i) => 
      regex.test(part) ? { text: part, highlight: true } : { text: part, highlight: false }
    )
  };
};

// Function to get the context of a match in code or description
const getMatchContext = (text, searchTerm, contextLength = 50) => {
  if (!text) return '';
  const index = text.toLowerCase().indexOf(searchTerm.toLowerCase());
  if (index === -1) return '';

  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + searchTerm.length + contextLength);
  let snippet = text.slice(start, end);

  // Add ellipsis if we're not at the start/end
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
};

export const searchContent = (query) => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return [];

  const results = [];

  Object.entries(sections).forEach(([sectionKey, section]) => {
    const { data, path, label, searchFields } = section;

    if (Array.isArray(data)) {
      data.forEach((item, itemIndex) => {
        let matches = [];
        let score = 0;

        // Search through all specified fields
        searchFields.forEach(field => {
          const value = item[field];
          if (!value) return;

          // Handle arrays (like tags)
          if (Array.isArray(value)) {
            const matchingTags = value.filter(tag => 
              tag.toLowerCase().includes(searchTerm)
            );
            if (matchingTags.length > 0) {
              score += matchingTags.length * 2;
              matches.push({
                field,
                context: matchingTags.join(', '),
                highlight: highlightMatch(matchingTags.join(', '), searchTerm)
              });
            }
          }
          // Handle strings
          else if (typeof value === 'string') {
            const valueLower = value.toLowerCase();
            if (valueLower.includes(searchTerm)) {
              // Higher score for title matches
              score += field === 'title' ? 10 : 
                      field === 'description' ? 5 : 1;
              
              matches.push({
                field,
                context: getMatchContext(value, searchTerm),
                highlight: highlightMatch(value, searchTerm)
              });
            }
          }
        });

        if (matches.length > 0) {
          // Generate a unique fragment identifier for each item
          const fragmentId = item.name 
            ? encodeURIComponent(item.name.toLowerCase().replace(/\s+/g, '-'))
            : item.path 
              ? encodeURIComponent(item.path.toLowerCase())
              : `item-${itemIndex}`;

          const result = {
            id: `${sectionKey}-${itemIndex}`,
            type: sectionKey,
            section: label,
            path: `${path}#${fragmentId}`,
            title: item.title || '',
            description: item.description || '',
            matches,
            score
          };

          // For colors, use the name of the color palette
          if (sectionKey === 'color') {
            result.title = item.name || item.title || 'Custom Color';
          }

          // For effects, include the effect name
          if (sectionKey === 'effect') {
            result.title = item.name || item.title || item.effect || 'Custom Effect';
          }

          results.push(result);
        }
      });
    }
  });

  // Sort results by score
  return results.sort((a, b) => b.score - a.score);
};

// Export additional utilities
export const getSection = (type) => sections[type] || null;