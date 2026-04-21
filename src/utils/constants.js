// Static data & constants

export const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps',
  'Legs', 'Core', 'Glutes', 'Calves', 'Forearms',
];

export const EXERCISES = {
  Chest: ['Bench Press', 'Incline Dumbbell Press', 'Push-ups', 'Cable Flyes', 'Dips'],
  Back: ['Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Seated Row', 'Deadlift'],
  Shoulders: ['Overhead Press', 'Lateral Raises', 'Face Pulls', 'Front Raises', 'Arnold Press'],
  Biceps: ['Barbell Curl', 'Hammer Curl', 'Preacher Curl', 'Concentration Curl'],
  Triceps: ['Tricep Pushdown', 'Overhead Extension', 'Close-grip Bench', 'Skull Crushers'],
  Legs: ['Squat', 'Leg Press', 'Lunges', 'Leg Curl', 'Leg Extension', 'Romanian Deadlift'],
  Core: ['Plank', 'Crunches', 'Russian Twist', 'Hanging Leg Raise', 'Ab Rollout'],
  Glutes: ['Hip Thrust', 'Glute Bridge', 'Bulgarian Split Squat', 'Cable Kickback'],
  Calves: ['Calf Raises', 'Seated Calf Raise', 'Donkey Calf Raise'],
  Forearms: ['Wrist Curl', 'Reverse Wrist Curl', 'Farmer Walk'],
};

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary (office job)', multiplier: 1.2 },
  { value: 'light', label: 'Light (1-3 days/week)', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate (3-5 days/week)', multiplier: 1.55 },
  { value: 'active', label: 'Active (6-7 days/week)', multiplier: 1.725 },
  { value: 'veryActive', label: 'Very Active (2x/day)', multiplier: 1.9 },
];

export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const BLOOD_TYPE_COMPATIBILITY = {
  'O-': { donatesTo: ['All'], receivesFrom: ['O-'] },
  'O+': { donatesTo: ['O+', 'A+', 'B+', 'AB+'], receivesFrom: ['O-', 'O+'] },
  'A-': { donatesTo: ['A-', 'A+', 'AB-', 'AB+'], receivesFrom: ['O-', 'A-'] },
  'A+': { donatesTo: ['A+', 'AB+'], receivesFrom: ['O-', 'O+', 'A-', 'A+'] },
  'B-': { donatesTo: ['B-', 'B+', 'AB-', 'AB+'], receivesFrom: ['O-', 'B-'] },
  'B+': { donatesTo: ['B+', 'AB+'], receivesFrom: ['O-', 'O+', 'B-', 'B+'] },
  'AB-': { donatesTo: ['AB-', 'AB+'], receivesFrom: ['O-', 'A-', 'B-', 'AB-'] },
  'AB+': { donatesTo: ['AB+'], receivesFrom: ['All'] },
};

export const COMMON_BLOOD_TESTS = [
  { name: 'Hemoglobin', unit: 'g/dL', normalMin: 12, normalMax: 17 },
  { name: 'White Blood Cells', unit: 'K/uL', normalMin: 4.5, normalMax: 11 },
  { name: 'Platelets', unit: 'K/uL', normalMin: 150, normalMax: 400 },
  { name: 'Glucose (Fasting)', unit: 'mg/dL', normalMin: 70, normalMax: 100 },
  { name: 'Cholesterol (Total)', unit: 'mg/dL', normalMin: 0, normalMax: 200 },
  { name: 'HDL Cholesterol', unit: 'mg/dL', normalMin: 40, normalMax: 60 },
  { name: 'LDL Cholesterol', unit: 'mg/dL', normalMin: 0, normalMax: 100 },
  { name: 'Triglycerides', unit: 'mg/dL', normalMin: 0, normalMax: 150 },
  { name: 'Vitamin D', unit: 'ng/mL', normalMin: 30, normalMax: 100 },
  { name: 'Iron', unit: 'ug/dL', normalMin: 60, normalMax: 170 },
  { name: 'Vitamin B12', unit: 'pg/mL', normalMin: 200, normalMax: 900 },
  { name: 'TSH', unit: 'mIU/L', normalMin: 0.4, normalMax: 4.0 },
];

export const VITAMINS = [
  { name: 'Vitamin A', emoji: '🥕', benefit: 'Vision, immune function' },
  { name: 'Vitamin B12', emoji: '🥩', benefit: 'Energy, nerve function' },
  { name: 'Vitamin C', emoji: '🍊', benefit: 'Immune support, skin health' },
  { name: 'Vitamin D', emoji: '☀️', benefit: 'Bone health, mood' },
  { name: 'Vitamin E', emoji: '🥜', benefit: 'Antioxidant, skin health' },
  { name: 'Vitamin K', emoji: '🥬', benefit: 'Blood clotting, bones' },
  { name: 'Iron', emoji: '💉', benefit: 'Blood oxygen transport' },
  { name: 'Calcium', emoji: '🦴', benefit: 'Bone & teeth health' },
  { name: 'Magnesium', emoji: '🍫', benefit: 'Muscle & nerve function' },
  { name: 'Zinc', emoji: '🫘', benefit: 'Immune function, healing' },
  { name: 'Omega-3', emoji: '🐟', benefit: 'Brain, heart health' },
  { name: 'Probiotics', emoji: '🦠', benefit: 'Gut health, digestion' },
  { name: 'Fiber', emoji: '🌾', benefit: 'Digestive health' },
  { name: 'Biotin', emoji: '💊', benefit: 'Hair, skin, nails' },
];

export const GUT_HEALTH_FACTORS = [
  { id: 'fiber', name: 'Fiber Intake', icon: '🌾' },
  { id: 'probiotics', name: 'Probiotics', icon: '🦠' },
  { id: 'water', name: 'Hydration', icon: '💧' },
  { id: 'sleep', name: 'Sleep Quality', icon: '😴' },
  { id: 'stress', name: 'Stress Level (low=good)', icon: '🧘' },
  { id: 'processed', name: 'Avoid Processed Food', icon: '🚫' },
];

export const COMMON_FOODS = [
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Brown Rice (1 cup)', calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { name: 'Egg (1 large)', calories: 72, protein: 6, carbs: 0.4, fat: 5 },
  { name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Oatmeal (1 cup)', calories: 154, protein: 5, carbs: 27, fat: 2.6 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Sweet Potato (medium)', calories: 103, protein: 2, carbs: 24, fat: 0.1 },
  { name: 'Greek Yogurt (1 cup)', calories: 100, protein: 17, carbs: 6, fat: 0.7 },
  { name: 'Avocado (half)', calories: 161, protein: 2, carbs: 9, fat: 15 },
  { name: 'Almonds (28g)', calories: 164, protein: 6, carbs: 6, fat: 14 },
  { name: 'Broccoli (1 cup)', calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { name: 'Bread (1 slice)', calories: 79, protein: 3, carbs: 15, fat: 1 },
  { name: 'Milk (1 cup)', calories: 149, protein: 8, carbs: 12, fat: 8 },
  { name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { name: 'Pasta (1 cup cooked)', calories: 220, protein: 8, carbs: 43, fat: 1.3 },
  { name: 'Steak (100g)', calories: 271, protein: 26, carbs: 0, fat: 18 },
  { name: 'Tuna Can', calories: 191, protein: 42, carbs: 0, fat: 1.4 },
  { name: 'White Rice (1 cup)', calories: 206, protein: 4, carbs: 45, fat: 0.4 },
  { name: 'Protein Shake', calories: 150, protein: 30, carbs: 5, fat: 2 },
  { name: 'Peanut Butter (2 tbsp)', calories: 188, protein: 7, carbs: 7, fat: 16 },
];

export const DIETARY_PREFERENCES = [
  'No Restrictions', 'Halal', 'Vegetarian', 'Vegan', 'Keto', 
  'Paleo', 'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'Mediterranean',
];

export const FITNESS_GOALS = [
  { value: 'lose', label: 'Lose Weight', emoji: '📉', description: 'Calorie deficit for fat loss' },
  { value: 'maintain', label: 'Maintain Weight', emoji: '⚖️', description: 'Stay at current weight' },
  { value: 'gain', label: 'Build Muscle', emoji: '💪', description: 'Calorie surplus for muscle gain' },
];
