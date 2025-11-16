export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'physics',
    name: 'Physics',
    icon: '⚛️',
    color: '#3b82f6',
    description: 'Forces, energy, motion, and the fundamental laws of the universe'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    icon: '🧪',
    color: '#8b5cf6',
    description: 'Elements, compounds, reactions, and molecular interactions'
  },
  {
    id: 'biology',
    name: 'Biology',
    icon: '🧬',
    color: '#10b981',
    description: 'Living organisms, cells, genetics, and ecosystems'
  },
  {
    id: 'astronomy',
    name: 'Astronomy',
    icon: '🌌',
    color: '#6366f1',
    description: 'Stars, planets, galaxies, and the cosmos'
  },
  {
    id: 'earth_science',
    name: 'Earth Science',
    icon: '🌍',
    color: '#059669',
    description: 'Geology, meteorology, oceanography, and environmental science'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: '📐',
    color: '#f59e0b',
    description: 'Numbers, equations, geometry, and mathematical concepts'
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    color: '#06b6d4',
    description: 'Computing, engineering, and modern innovations'
  },
  {
    id: 'medicine',
    name: 'Medicine',
    icon: '⚕️',
    color: '#ef4444',
    description: 'Human health, anatomy, diseases, and medical breakthroughs'
  },
  {
    id: 'environmental',
    name: 'Environmental Science',
    icon: '🌱',
    color: '#84cc16',
    description: 'Climate, conservation, and sustainability'
  },
  {
    id: 'neuroscience',
    name: 'Neuroscience',
    icon: '🧠',
    color: '#ec4899',
    description: 'The brain, nervous system, and cognitive processes'
  }
];

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.id === id);
};

export const getRandomCategory = (): Category => {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
};
