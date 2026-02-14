const KEYWORD_MAP = [
  { keywords: ['frühstück', 'breakfast', 'essen', 'müsli', 'cereal'], icon: '🥣', color: '#FF9500' },
  { keywords: ['zähne', 'zähneputzen', 'teeth', 'brush teeth'], icon: '🪥', color: '#4CAF50' },
  { keywords: ['anziehen', 'kleidung', 'dress', 'clothes', 'umziehen'], icon: '👕', color: '#2196F3' },
  { keywords: ['haare', 'bürsten', 'kämmen', 'hair', 'brush hair'], icon: '🪮', color: '#E91E63' },
  { keywords: ['schuhe', 'shoes'], icon: '👟', color: '#795548' },
  { keywords: ['waschen', 'wash', 'duschen', 'shower', 'baden', 'bath'], icon: '🚿', color: '#00BCD4' },
  { keywords: ['schule', 'school', 'haus verlassen', 'losgehen', 'leave', 'rausgehen'], icon: '🚪', color: '#9C27B0' },
  { keywords: ['abendessen', 'dinner', 'abendbrot'], icon: '🍽️', color: '#FF9500' },
  { keywords: ['aufräumen', 'aufräum', 'tidy', 'clean', 'ordnung'], icon: '🧹', color: '#FFC107' },
  { keywords: ['geschichte', 'vorlesen', 'buch', 'story', 'book', 'lesen'], icon: '📖', color: '#2196F3' },
  { keywords: ['schlafen', 'bett', 'sleep', 'bed', 'gute nacht'], icon: '🛏️', color: '#3F51B5' },
  { keywords: ['spielen', 'play', 'spiel'], icon: '🎮', color: '#FF5722' },
  { keywords: ['hausaufgaben', 'homework', 'lernen', 'learn'], icon: '📝', color: '#607D8B' },
  { keywords: ['jacke', 'mantel', 'coat', 'jacket'], icon: '🧥', color: '#8BC34A' },
  { keywords: ['rucksack', 'tasche', 'bag', 'pack'], icon: '🎒', color: '#FF5722' },
  { keywords: ['trinken', 'drink', 'wasser', 'water'], icon: '🥤', color: '#03A9F4' },
  { keywords: ['medikament', 'medicine', 'medizin'], icon: '💊', color: '#F44336' },
]

const FALLBACK_COLORS = [
  '#FF9500', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0',
  '#FFC107', '#00BCD4', '#FF5722', '#795548', '#607D8B',
]

let colorIndex = 0

export function suggestDefaults(taskName) {
  const lower = taskName.toLowerCase().trim()
  if (!lower) return null

  for (const entry of KEYWORD_MAP) {
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        return { icon: entry.icon, color: entry.color }
      }
    }
  }

  // Fallback: rotate through palette
  const color = FALLBACK_COLORS[colorIndex % FALLBACK_COLORS.length]
  colorIndex++
  return { icon: '⭐', color }
}
