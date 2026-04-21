// Health & Fitness Calculations

export function calculateBMR(gender, weight, height, age) {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.2));
}

export function calculateBMI(weight, heightCm) {
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'amber' };
  if (bmi < 25) return { label: 'Normal', color: 'green' };
  if (bmi < 30) return { label: 'Overweight', color: 'amber' };
  return { label: 'Obese', color: 'red' };
}

export function calculateMacros(calories, goal) {
  // goal: 'lose', 'maintain', 'gain'
  let proteinPct, carbsPct, fatPct;
  switch (goal) {
    case 'lose':
      proteinPct = 0.35; carbsPct = 0.35; fatPct = 0.30;
      break;
    case 'gain':
      proteinPct = 0.30; carbsPct = 0.45; fatPct = 0.25;
      break;
    default: // maintain
      proteinPct = 0.30; carbsPct = 0.40; fatPct = 0.30;
  }
  return {
    protein: Math.round((calories * proteinPct) / 4),
    carbs: Math.round((calories * carbsPct) / 4),
    fat: Math.round((calories * fatPct) / 9),
  };
}

export function stepsToCalories(steps, weightKg) {
  // Approx: 0.04 kcal per step per kg
  return Math.round(steps * 0.04 * (weightKg / 70));
}

export function stepsToDistance(steps) {
  // Average stride length ~0.762m
  return ((steps * 0.762) / 1000).toFixed(2);
}

export function calculateStreak(dates) {
  if (!dates || dates.length === 0) return 0;
  const sorted = [...dates].sort((a, b) => new Date(b) - new Date(a));
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  // Check if today or yesterday is the start
  const latestDate = new Date(sorted[0]);
  latestDate.setHours(0, 0, 0, 0);
  const diffDays = Math.floor((today - latestDate) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  if (diffDays === 1) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  for (const dateStr of sorted) {
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === checkDate.getTime()) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (d.getTime() < checkDate.getTime()) {
      break;
    }
  }
  return streak;
}

export function getWeekDays() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const result = [];
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - diff);

  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    result.push({
      label: days[i],
      date: d.toISOString().split('T')[0],
      isToday: d.toDateString() === today.toDateString(),
    });
  }
  return result;
}
