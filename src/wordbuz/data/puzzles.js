// ─── IQ & Knowledge Puzzle Bank ───────────────────────────────────────────────
// Types: 'mcq' = multiple choice, 'open' = typed number/word answer
// Difficulty: 'Easy' | 'Medium' | 'Hard'
// Categories: 'Math' | 'Physics' | 'Science' | 'Logic'
// Points: Easy=10, Medium=20, Hard=40

export const PUZZLES = [

  // ─── MATH ─────────────────────────────────────────────────────────────────
  {
    id: 'm1', category: 'Math', difficulty: 'Easy', type: 'open',
    question: 'What is 15% of 200?',
    answer: '30',
    explanation: '15% of 200 = (15/100) × 200 = 30',
    points: 10,
  },
  {
    id: 'm2', category: 'Math', difficulty: 'Easy', type: 'mcq',
    question: 'A train travels 120 km in 2 hours. What is its speed?',
    options: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
    answer: '60 km/h',
    explanation: 'Speed = Distance ÷ Time = 120 ÷ 2 = 60 km/h',
    points: 10,
  },
  {
    id: 'm3', category: 'Math', difficulty: 'Easy', type: 'mcq',
    question: 'What is the next number in the sequence: 2, 4, 8, 16, ___?',
    options: ['24', '28', '32', '36'],
    answer: '32',
    explanation: 'Each number is doubled: 2×2=4, 4×2=8, 8×2=16, 16×2=32',
    points: 10,
  },
  {
    id: 'm4', category: 'Math', difficulty: 'Easy', type: 'open',
    question: 'If a rectangle has length 8 and width 5, what is its area?',
    answer: '40',
    explanation: 'Area = length × width = 8 × 5 = 40',
    points: 10,
  },
  {
    id: 'm5', category: 'Math', difficulty: 'Medium', type: 'mcq',
    question: 'What is the value of x if 3x + 9 = 27?',
    options: ['4', '5', '6', '7'],
    answer: '6',
    explanation: '3x = 27 − 9 = 18, so x = 18 ÷ 3 = 6',
    points: 20,
  },
  {
    id: 'm6', category: 'Math', difficulty: 'Medium', type: 'open',
    question: 'A shop gives a 25% discount on an item priced at $80. What is the final price?',
    answer: '60',
    explanation: 'Discount = 25% of $80 = $20. Final price = $80 − $20 = $60',
    points: 20,
  },
  {
    id: 'm7', category: 'Math', difficulty: 'Medium', type: 'mcq',
    question: 'What is the sum of angles in a triangle?',
    options: ['90°', '180°', '270°', '360°'],
    answer: '180°',
    explanation: 'The interior angles of any triangle always add up to 180°.',
    points: 20,
  },
  {
    id: 'm8', category: 'Math', difficulty: 'Medium', type: 'open',
    question: 'If 5 workers build a wall in 6 days, how many days would 3 workers take?',
    answer: '10',
    explanation: 'Total work = 5×6 = 30 worker-days. 3 workers: 30 ÷ 3 = 10 days.',
    points: 20,
  },
  {
    id: 'm9', category: 'Math', difficulty: 'Hard', type: 'mcq',
    question: 'What is the 10th term of the arithmetic sequence: 3, 7, 11, 15, ...?',
    options: ['35', '39', '43', '47'],
    answer: '39',
    explanation: 'a(n) = a1 + (n−1)d = 3 + (10−1)×4 = 3 + 36 = 39',
    points: 40,
  },
  {
    id: 'm10', category: 'Math', difficulty: 'Hard', type: 'open',
    question: 'A circle has radius 7. What is its area? (Use π = 22/7, give whole number)',
    answer: '154',
    explanation: 'Area = πr² = (22/7) × 7 × 7 = 22 × 7 = 154',
    points: 40,
  },
  {
    id: 'm11', category: 'Math', difficulty: 'Hard', type: 'mcq',
    question: 'If log₂(x) = 5, what is x?',
    options: ['10', '25', '32', '64'],
    answer: '32',
    explanation: 'log₂(x) = 5 means x = 2⁵ = 32',
    points: 40,
  },
  {
    id: 'm12', category: 'Math', difficulty: 'Hard', type: 'open',
    question: 'What is 2³ + 3² + 4¹?',
    answer: '21',
    explanation: '2³ = 8, 3² = 9, 4¹ = 4. Sum = 8 + 9 + 4 = 21',
    points: 40,
  },

  // ─── PHYSICS ──────────────────────────────────────────────────────────────
  {
    id: 'p1', category: 'Physics', difficulty: 'Easy', type: 'mcq',
    question: 'What is the SI unit of force?',
    options: ['Joule', 'Watt', 'Newton', 'Pascal'],
    answer: 'Newton',
    explanation: 'Force is measured in Newtons (N), named after Isaac Newton.',
    points: 10,
  },
  {
    id: 'p2', category: 'Physics', difficulty: 'Easy', type: 'mcq',
    question: 'What happens to an object in free fall (ignoring air resistance)?',
    options: ['It accelerates at 9.8 m/s²', 'It moves at constant speed', 'It decelerates', 'It stops instantly'],
    answer: 'It accelerates at 9.8 m/s²',
    explanation: 'Near Earth\'s surface, gravity accelerates all objects at ~9.8 m/s² regardless of mass.',
    points: 10,
  },
  {
    id: 'p3', category: 'Physics', difficulty: 'Easy', type: 'open',
    question: 'A car accelerates from 0 to 60 m/s in 10 seconds. What is its acceleration? (m/s²)',
    answer: '6',
    explanation: 'a = (v − u) / t = (60 − 0) / 10 = 6 m/s²',
    points: 10,
  },
  {
    id: 'p4', category: 'Physics', difficulty: 'Medium', type: 'mcq',
    question: 'Which type of lens converges (brings together) light rays?',
    options: ['Concave lens', 'Convex lens', 'Plane mirror', 'Prism'],
    answer: 'Convex lens',
    explanation: 'A convex (converging) lens bends light rays inward to meet at a focal point.',
    points: 20,
  },
  {
    id: 'p5', category: 'Physics', difficulty: 'Medium', type: 'mcq',
    question: 'According to Ohm\'s Law, if Voltage = 12V and Resistance = 4Ω, what is the Current?',
    options: ['2A', '3A', '4A', '8A'],
    answer: '3A',
    explanation: 'I = V / R = 12 / 4 = 3 Amperes',
    points: 20,
  },
  {
    id: 'p6', category: 'Physics', difficulty: 'Medium', type: 'open',
    question: 'An object of mass 5 kg is on a surface. What is its weight? (g=10 m/s², answer in N)',
    answer: '50',
    explanation: 'Weight = mass × g = 5 × 10 = 50 N',
    points: 20,
  },
  {
    id: 'p7', category: 'Physics', difficulty: 'Hard', type: 'mcq',
    question: 'What does the Second Law of Thermodynamics state?',
    options: ['Energy cannot be created or destroyed', 'Entropy of a closed system always increases', 'Every action has an equal reaction', 'Force equals mass times acceleration'],
    answer: 'Entropy of a closed system always increases',
    explanation: 'The 2nd Law of Thermodynamics says disorder (entropy) in an isolated system always increases over time.',
    points: 40,
  },
  {
    id: 'p8', category: 'Physics', difficulty: 'Hard', type: 'open',
    question: 'A 10 kg object is moving at 4 m/s. What is its kinetic energy? (in Joules)',
    answer: '80',
    explanation: 'KE = ½mv² = ½ × 10 × 4² = ½ × 10 × 16 = 80 J',
    points: 40,
  },
  {
    id: 'p9', category: 'Physics', difficulty: 'Hard', type: 'mcq',
    question: 'Which phenomenon explains why a straw appears bent in a glass of water?',
    options: ['Reflection', 'Refraction', 'Diffraction', 'Diffusion'],
    answer: 'Refraction',
    explanation: 'Refraction is the bending of light as it passes from one medium (air) to another (water).',
    points: 40,
  },
  {
    id: 'p10', category: 'Physics', difficulty: 'Easy', type: 'mcq',
    question: 'What is the speed of light in a vacuum?',
    options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
    answer: '3 × 10⁸ m/s',
    explanation: 'Light travels at approximately 3 × 10⁸ metres per second in a vacuum.',
    points: 10,
  },

  // ─── SCIENCE ──────────────────────────────────────────────────────────────
  {
    id: 's1', category: 'Science', difficulty: 'Easy', type: 'mcq',
    question: 'What gas do plants absorb from the air during photosynthesis?',
    options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
    answer: 'Carbon Dioxide',
    explanation: 'Plants absorb CO₂ and release O₂ during photosynthesis using sunlight and water.',
    points: 10,
  },
  {
    id: 's2', category: 'Science', difficulty: 'Easy', type: 'mcq',
    question: 'What is the chemical symbol for water?',
    options: ['H₂O₂', 'HO', 'H₂O', 'OH₂'],
    answer: 'H₂O',
    explanation: 'Water consists of 2 Hydrogen atoms and 1 Oxygen atom — H₂O.',
    points: 10,
  },
  {
    id: 's3', category: 'Science', difficulty: 'Easy', type: 'mcq',
    question: 'Which organ pumps blood around the human body?',
    options: ['Liver', 'Kidney', 'Lungs', 'Heart'],
    answer: 'Heart',
    explanation: 'The heart is a muscular organ that pumps blood through the circulatory system.',
    points: 10,
  },
  {
    id: 's4', category: 'Science', difficulty: 'Medium', type: 'mcq',
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Cell Wall'],
    answer: 'Mitochondria',
    explanation: 'Mitochondria produce ATP (energy) for the cell, earning the nickname "powerhouse of the cell."',
    points: 20,
  },
  {
    id: 's5', category: 'Science', difficulty: 'Medium', type: 'mcq',
    question: 'What is the atomic number of Carbon?',
    options: ['4', '6', '8', '12'],
    answer: '6',
    explanation: 'Carbon (C) has 6 protons in its nucleus, giving it atomic number 6.',
    points: 20,
  },
  {
    id: 's6', category: 'Science', difficulty: 'Medium', type: 'mcq',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
    answer: 'Mars',
    explanation: 'Mars appears red due to iron oxide (rust) on its surface.',
    points: 20,
  },
  {
    id: 's7', category: 'Science', difficulty: 'Medium', type: 'open',
    question: 'How many chromosomes does a typical human cell have?',
    answer: '46',
    explanation: 'Human cells contain 46 chromosomes arranged in 23 pairs.',
    points: 20,
  },
  {
    id: 's8', category: 'Science', difficulty: 'Hard', type: 'mcq',
    question: 'What is the pH level of pure water at 25°C?',
    options: ['5', '6', '7', '8'],
    answer: '7',
    explanation: 'Pure water is neutral with a pH of 7. Below 7 is acidic, above 7 is alkaline.',
    points: 40,
  },
  {
    id: 's9', category: 'Science', difficulty: 'Hard', type: 'mcq',
    question: 'Which process converts glucose into energy without oxygen?',
    options: ['Aerobic respiration', 'Photosynthesis', 'Anaerobic respiration', 'Transpiration'],
    answer: 'Anaerobic respiration',
    explanation: 'Anaerobic respiration breaks down glucose without oxygen, producing lactic acid or ethanol.',
    points: 40,
  },
  {
    id: 's10', category: 'Science', difficulty: 'Hard', type: 'mcq',
    question: 'Which type of bond involves sharing electrons between atoms?',
    options: ['Ionic bond', 'Covalent bond', 'Hydrogen bond', 'Metallic bond'],
    answer: 'Covalent bond',
    explanation: 'Covalent bonds form when atoms share electron pairs to achieve stable electron configurations.',
    points: 40,
  },
  {
    id: 's11', category: 'Science', difficulty: 'Easy', type: 'mcq',
    question: 'What force keeps planets in orbit around the Sun?',
    options: ['Magnetism', 'Electricity', 'Gravity', 'Nuclear force'],
    answer: 'Gravity',
    explanation: 'Gravity is the attractive force between masses that keeps planets in orbit around the Sun.',
    points: 10,
  },
  {
    id: 's12', category: 'Science', difficulty: 'Medium', type: 'open',
    question: 'At what temperature does water boil at sea level? (°C)',
    answer: '100',
    explanation: 'Water boils at 100°C (212°F) at standard atmospheric pressure at sea level.',
    points: 20,
  },

  // ─── LOGIC / IQ ───────────────────────────────────────────────────────────
  {
    id: 'l1', category: 'Logic', difficulty: 'Easy', type: 'mcq',
    question: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
    options: ['Yes', 'No', 'Cannot be determined', 'Only sometimes'],
    answer: 'Yes',
    explanation: 'By transitive logic: Bloops → Razzies → Lazzies, therefore all Bloops are Lazzies.',
    points: 10,
  },
  {
    id: 'l2', category: 'Logic', difficulty: 'Easy', type: 'mcq',
    question: 'What comes next in the pattern? △ □ △ □ △ ___',
    options: ['△', '○', '□', '◇'],
    answer: '□',
    explanation: 'The pattern alternates: triangle, square, triangle, square... so next is □.',
    points: 10,
  },
  {
    id: 'l3', category: 'Logic', difficulty: 'Easy', type: 'open',
    question: 'A farmer has 17 sheep. All but 9 die. How many sheep does he have left?',
    answer: '9',
    explanation: '"All but 9 die" means 9 survive. The answer is 9.',
    points: 10,
  },
  {
    id: 'l4', category: 'Logic', difficulty: 'Medium', type: 'mcq',
    question: 'Complete the analogy: Book is to Library as Painting is to ___?',
    options: ['Artist', 'Brush', 'Museum', 'Canvas'],
    answer: 'Museum',
    explanation: 'Books are stored/displayed in Libraries; Paintings are stored/displayed in Museums.',
    points: 20,
  },
  {
    id: 'l5', category: 'Logic', difficulty: 'Medium', type: 'open',
    question: 'I have 6 eggs. I broke 2, cooked 2, and ate 2. How many eggs do I have left?',
    answer: '6',
    explanation: 'The same 2 eggs were broken, then cooked, then eaten. You still have 6 − 2 = ... wait: the broken ones were cooked and eaten, so 6 − 2 = 4 unbroken. Actually: you started with 6, broke 2 (these were cooked and eaten). You still have 6 total — 4 intact eggs remain.',
    points: 20,
  },
  {
    id: 'l6', category: 'Logic', difficulty: 'Medium', type: 'mcq',
    question: 'Which number should come next? 1, 4, 9, 16, 25, ___',
    options: ['30', '36', '49', '35'],
    answer: '36',
    explanation: 'These are perfect squares: 1², 2², 3², 4², 5², 6² = 36',
    points: 20,
  },
  {
    id: 'l7', category: 'Logic', difficulty: 'Medium', type: 'mcq',
    question: 'If FISH is coded as EHRG, what does BIRD become?',
    options: ['AHQC', 'CHSE', 'AHQD', 'BIQD'],
    answer: 'AHQC',
    explanation: 'Each letter is shifted back by 1: B→A, I→H, R→Q, D→C = AHQC',
    points: 20,
  },
  {
    id: 'l8', category: 'Logic', difficulty: 'Hard', type: 'mcq',
    question: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
    options: ['0°', '7.5°', '15°', '30°'],
    answer: '7.5°',
    explanation: 'At 3:15, the minute hand is at 90°. The hour hand moves 0.5° per minute, so at 3:15 it is at 90° + (15×0.5°) = 97.5°. Difference = 97.5° − 90° = 7.5°',
    points: 40,
  },
  {
    id: 'l9', category: 'Logic', difficulty: 'Hard', type: 'mcq',
    question: 'Three boxes contain apples, oranges, and a mix. All labels are wrong. You pick one fruit from the "Mix" box. What is the minimum picks to correctly label all boxes?',
    options: ['1', '2', '3', '4'],
    answer: '1',
    explanation: 'Pick from "Mix" box. Since all labels are wrong, "Mix" is either apples or oranges. One pick tells you exactly what it contains, letting you deduce all others.',
    points: 40,
  },
  {
    id: 'l10', category: 'Logic', difficulty: 'Hard', type: 'open',
    question: 'What is the missing number? 2, 3, 5, 7, 11, 13, ___',
    answer: '17',
    explanation: 'These are prime numbers: 2, 3, 5, 7, 11, 13, 17...',
    points: 40,
  },
  {
    id: 'l11', category: 'Logic', difficulty: 'Easy', type: 'mcq',
    question: 'Which is the odd one out: Cat, Dog, Rose, Elephant?',
    options: ['Cat', 'Dog', 'Rose', 'Elephant'],
    answer: 'Rose',
    explanation: 'Rose is a plant; all others are animals.',
    points: 10,
  },
  {
    id: 'l12', category: 'Logic', difficulty: 'Hard', type: 'mcq',
    question: 'If you have a 3-litre jug and a 5-litre jug, how can you measure exactly 4 litres?',
    options: ['Fill 5L, pour into 3L, empty 3L, pour remaining into 3L, fill 5L, pour until 3L full', 'Fill 3L twice into 5L, remainder is 1L', 'Fill 5L, pour 1L out', 'Cannot be done'],
    answer: 'Fill 5L, pour into 3L, empty 3L, pour remaining into 3L, fill 5L, pour until 3L full',
    explanation: 'Fill 5L → pour into 3L (5L has 2L left) → empty 3L → pour 2L into 3L → fill 5L → pour into 3L until full (only 1L fits) → 5L jug has exactly 4L.',
    points: 40,
  },
  {
    id: 'l13', category: 'Logic', difficulty: 'Medium', type: 'open',
    question: 'What 4-digit number reads the same upside down and backwards? Hint: it\'s between 1000–2000.',
    answer: '1881',
    explanation: '1881 rotated 180° still reads 1881.',
    points: 20,
  },
  {
    id: 'l14', category: 'Logic', difficulty: 'Easy', type: 'mcq',
    question: 'How many months have 28 days?',
    options: ['1', '2', '4', '12'],
    answer: '12',
    explanation: 'All 12 months have at least 28 days. February has exactly 28 (or 29 in leap years).',
    points: 10,
  },
];

// Get puzzles filtered by category and/or difficulty
export const getPuzzles = (category = 'All', difficulty = 'All') => {
  return PUZZLES.filter(p =>
    (category === 'All' || p.category === category) &&
    (difficulty === 'All' || p.difficulty === difficulty)
  );
};

// Get today's daily puzzle (deterministic by date)
export const getDailyPuzzle = () => {
  const hardPuzzles = PUZZLES.filter(p => p.difficulty === 'Hard');
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return { ...hardPuzzles[dayOfYear % hardPuzzles.length], isDaily: true };
};

export const CATEGORIES = ['All', 'Math', 'Physics', 'Science', 'Logic'];
export const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export const CATEGORY_META = {
  Math:    { icon: '🔢', color: '#00CFFF', desc: 'Arithmetic, algebra, geometry & more' },
  Physics: { icon: '⚡', color: '#7A5CFF', desc: 'Forces, motion, energy & matter' },
  Science: { icon: '🔬', color: '#00FF99', desc: 'Biology, chemistry & earth science' },
  Logic:   { icon: '🧠', color: '#FF9500', desc: 'IQ patterns, deduction & reasoning' },
};
