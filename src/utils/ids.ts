
/**
 * GLOBAL ID GENERATOR
 * Extracted to prevent circular dependency cycles in the build.
 */
export const generateId = (category: string, seq: number) => {
  // Normalize category code (e.g., 'Workshop' -> 'WORK')
  const codeMap: Record<string, string> = {
    'Workshop': 'WORK',
    'Seminar': 'SEMI',
    'Webinar': 'WEBI',
    'Certificate': 'CERT',
    'Degree': 'BACH',
    'Masters': 'MAST',
    'Technology': 'TECH',
    'Agriculture': 'AGRI',
    'Business': 'BUS',
    'Health': 'HLTH',
    'Engineering': 'ENG',
    'Finance': 'FIN'
  };
  
  const prefix = codeMap[category] || category.substring(0, 4).toUpperCase();
  return `imi_ws_${prefix}_${seq.toString().padStart(3, '0')}`;
};
