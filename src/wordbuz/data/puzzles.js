// ─── IQ & Knowledge Puzzle Bank with Multi-Language Support ──────────────────
// Default Language: 'so' (Somali), support 'en' (English), 'ar' (Arabic)
// Types: 'mcq' | 'open'
// Categories: 'Math' | 'Physics' | 'Science' | 'Logic'

export const PUZZLES = [
  // ─── MATH ─────────────────────────────────────────────────────────────────
  {
    id: 'm1',
    category: 'Math',
    difficulty: 'Easy',
    type: 'open',
    question: {
      so: 'Waa maxay 15% ee 200?',
      en: 'What is 15% of 200?',
      ar: 'ما هو 15٪ من 200؟'
    },
    answer: ['30', '٣٠'],
    explanation: {
      so: '15% ee 200 = (15/100) × 200 = 30',
      en: '15% of 200 = (15/100) × 200 = 30',
      ar: '15٪ من 200 = (15/100) × 200 = 30'
    },
    points: 10,
    timeLimit: 30 // Shorter timer to block second-phone typing
  },
  {
    id: 'm2',
    category: 'Math',
    difficulty: 'Easy',
    type: 'mcq',
    question: {
      so: 'Tareen wuxuu ku socdaa 120 km muddo 2 saac ah. Waa maxay xawaarihiisa?',
      en: 'A train travels 120 km in 2 hours. What is its speed?',
      ar: 'يسير قطار مسافة 120 كم في ساعتين. ما هي سرعته؟'
    },
    options: {
      so: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
      en: ['50 km/h', '60 km/h', '70 km/h', '80 km/h'],
      ar: ['50 كم/س', '60 كم/س', '70 كم/س', '80 كم/س']
    },
    answer: {
      so: '60 km/h',
      en: '60 km/h',
      ar: '60 كم/س'
    },
    explanation: {
      so: 'Xawaaraha = Masaafada ÷ Waqtiga = 120 ÷ 2 = 60 km/h',
      en: 'Speed = Distance ÷ Time = 120 ÷ 2 = 60 km/h',
      ar: 'السرعة = المسافة ÷ الزمن = 120 ÷ 2 = 60 كم/س'
    },
    points: 10,
    timeLimit: 40
  },
  {
    id: 'm3',
    category: 'Math',
    difficulty: 'Medium',
    type: 'open',
    question: {
      so: 'Soo saar qiimaha x haddii: 3x + 9 = 27',
      en: 'What is the value of x if: 3x + 9 = 27',
      ar: 'ما هي قيمة x إذا كان: 3x + 9 = 27'
    },
    answer: ['6', '٦'],
    explanation: {
      so: '3x = 27 − 9 = 18, markaas x = 18 ÷ 3 = 6',
      en: '3x = 27 − 9 = 18, so x = 18 ÷ 3 = 6',
      ar: '3x = 27 − 9 = 18، إذن x = 18 ÷ 3 = 6'
    },
    points: 20,
    timeLimit: 45
  },
  {
    id: 'm4',
    category: 'Math',
    difficulty: 'Medium',
    type: 'open',
    question: {
      so: 'Dukaanku wuxuu bixiyaa 25% qiimo dhimis ah shay jooga $80. Waa maxay qiimaha dambe?',
      en: 'A shop gives a 25% discount on an item priced at $80. What is the final price?',
      ar: 'يقدم متجر خصمًا بنسبة 25٪ على سلعة سعرها 80 دولارًا. ما هو السعر النهائي؟'
    },
    answer: ['60', '٦٠'],
    explanation: {
      so: 'Qiimo dhimista = 25% ee $80 = $20. Qiimaha dambe = $80 − $20 = $60',
      en: 'Discount = 25% of $80 = $20. Final price = $80 − $20 = $60',
      ar: 'الخصم = 25٪ من 80 دولارًا = 20 دولارًا. السعر النهائي = 80 - 20 = 60 دولارًا'
    },
    points: 20,
    timeLimit: 50
  },
  {
    id: 'm5',
    category: 'Math',
    difficulty: 'Hard',
    type: 'mcq',
    question: {
      so: 'Waa maxay term-ka 10-aad ee taxanahan xisaabeed: 3, 7, 11, 15, ...?',
      en: 'What is the 10th term of the arithmetic sequence: 3, 7, 11, 15, ...?',
      ar: 'ما الحد العاشر من المتتابعة الحسابية: 3، 7، 11، 15، ...؟'
    },
    options: {
      so: ['35', '39', '43', '47'],
      en: ['35', '39', '43', '47'],
      ar: ['35', '39', '43', '47']
    },
    answer: {
      so: '39',
      en: '39',
      ar: '39'
    },
    explanation: {
      so: 'a(n) = a1 + (n−1)d = 3 + (10−1)×4 = 3 + 36 = 39',
      en: 'a(n) = a1 + (n−1)d = 3 + (10−1)×4 = 3 + 36 = 39',
      ar: 'a(n) = a1 + (n−1)d = 3 + (10−1)×4 = 3 + 36 = 39'
    },
    points: 40,
    timeLimit: 60
  },

  // ─── PHYSICS ──────────────────────────────────────────────────────────────
  {
    id: 'p1',
    category: 'Physics',
    difficulty: 'Easy',
    type: 'mcq',
    question: {
      so: 'Waa maxay halbeega caalamiga ah ee xooga (Force)?',
      en: 'What is the SI unit of force?',
      ar: 'ما هي وحدة القياس العالمية للقوة؟'
    },
    options: {
      so: ['Joule', 'Watt', 'Newton', 'Pascal'],
      en: ['Joule', 'Watt', 'Newton', 'Pascal'],
      ar: ['جول', 'واط', 'نيوتن', 'باسكال']
    },
    answer: {
      so: 'Newton',
      en: 'Newton',
      ar: 'نيوتن'
    },
    explanation: {
      so: 'Xooga waxaa lagu cabiraa Newton (N), oo loogu magac daray Isaac Newton.',
      en: 'Force is measured in Newtons (N), named after Isaac Newton.',
      ar: 'تقاس القوة بالنيوتن (N)، نسبة إلى إسحاق نيوتن.'
    },
    points: 10,
    timeLimit: 30
  },
  {
    id: 'p2',
    category: 'Physics',
    difficulty: 'Medium',
    type: 'mcq',
    question: {
      so: 'Muraayada noocee ah ayaa kulmisa (converges) falaadhaha iftiinka?',
      en: 'Which type of lens converges light rays?',
      ar: 'أي نوع من العدسات يجمع (يُقرب) أشعة الضوء؟'
    },
    options: {
      so: ['Muraayada Qoolan (Concave)', 'Muraayada Qablan (Convex)', 'Muraayad Siman', 'Prism'],
      en: ['Concave lens', 'Convex lens', 'Plane mirror', 'Prism'],
      ar: ['عدسة مقعرة', 'عدسة محدبة', 'مرآة مستوية', 'موشور']
    },
    answer: {
      so: 'Muraayada Qablan (Convex)',
      en: 'Convex lens',
      ar: 'عدسة محدبة'
    },
    explanation: {
      so: 'Muraayada qablan (convex) waxay falaadhaha iftiinka u laabtaa dhanka gudaha si ay ugu kulmaan barta kulanka.',
      en: 'A convex lens bends light rays inward to meet at a focal point.',
      ar: 'العدسة المحدبة تكسر أشعة الضوء نحو الداخل لتلتقي في البؤرة.'
    },
    points: 20,
    timeLimit: 50
  },
  {
    id: 'p3',
    category: 'Physics',
    difficulty: 'Medium',
    type: 'open',
    question: {
      so: 'Sharciga Ohm, haddii Voltage = 12V iyo Iska caabin (Resistance) = 4Ω, waa maxay Korontada (Current)?',
      en: 'According to Ohm\'s Law, if Voltage = 12V and Resistance = 4Ω, what is the Current?',
      ar: 'وفقًا لقانون أوم، إذا كان الجهد = 12 فولت والمقاومة = 4 أوم، فما هو التيار؟'
    },
    answer: ['3', '٣', '3a', '3 a'],
    explanation: {
      so: 'Korontada (I) = V / R = 12 / 4 = 3 Amperes',
      en: 'Current (I) = V / R = 12 / 4 = 3 Amperes',
      ar: 'التيار (I) = الجهد / المقاومة = 12 / 4 = 3 أمبير'
    },
    points: 20,
    timeLimit: 40
  },
  {
    id: 'p4',
    category: 'Physics',
    difficulty: 'Hard',
    type: 'open',
    question: {
      so: 'Shay miisaankiisu yahay 10 kg ayaa ku socda xawaare 4 m/s. Waa maxay tamartiisa dhaqdhaqaaqa (Kinetic Energy)? (Joule)',
      en: 'A 10 kg object is moving at 4 m/s. What is its kinetic energy? (in Joules)',
      ar: 'جسم كتلته 10 كجم يتحرك بسرعة 4 م/ث. ما هي طاقته الحركية؟ (بالجول)'
    },
    answer: ['80', '٨٠'],
    explanation: {
      so: 'Tamarta Dhaqdhaqaaqa (KE) = ½mv² = ½ × 10 × 4² = ½ × 10 × 16 = 80 J',
      en: 'Kinetic Energy (KE) = ½mv² = ½ × 10 × 4² = ½ × 10 × 16 = 80 J',
      ar: 'الطاقة الحركية = ½mv² = ½ × 10 × ²4 = ½ × 10 × 16 = 80 جول'
    },
    points: 40,
    timeLimit: 50
  },

  // ─── SCIENCE ──────────────────────────────────────────────────────────────
  {
    id: 's1',
    category: 'Science',
    difficulty: 'Easy',
    type: 'mcq',
    question: {
      so: 'Waa maxay gaaska ay dhirtu ka nuugto hawada xilliga cuntada (Photosynthesis)?',
      en: 'What gas do plants absorb from the air during photosynthesis?',
      ar: 'ما هو الغاز الذي تمتصه النباتات من الهواء أثناء عملية البناء الضوئي؟'
    },
    options: {
      so: ['Ogsajiin', 'Naytarojiin', 'Kaarboon laba ogsaydh', 'Haydarojiin'],
      en: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      ar: ['الأكسجين', 'النيتروجين', 'ثاني أكسيد الكربون', 'الهيدروجين']
    },
    answer: {
      so: 'Kaarboon laba ogsaydh',
      en: 'Carbon Dioxide',
      ar: 'ثاني أكسيد الكربون'
    },
    explanation: {
      so: 'Dhirtu waxay qaadataa CO₂ waxayna sii daysaa Ogsajiin iyadoo isticmaalaysa iftiinka qoraxda iyo biyaha.',
      en: 'Plants absorb CO₂ and release Oxygen using sunlight and water.',
      ar: 'تمتص النباتات غاز ثاني أكسيد الكربون وتطلق الأكسجين باستخدام ضوء الشمس والماء.'
    },
    points: 10,
    timeLimit: 30
  },
  {
    id: 's2',
    category: 'Science',
    difficulty: 'Medium',
    type: 'mcq',
    question: {
      so: 'Waa maxay xarunta tamarta ee unugga (Powerhouse of the cell)?',
      en: 'What is the powerhouse of the cell?',
      ar: 'ما هو بيت الطاقة (المولد) في الخلية؟'
    },
    options: {
      so: ['Nucleus', 'Ribosome', 'Mitochondria', 'Cell Wall'],
      en: ['Nucleus', 'Ribosome', 'Mitochondria', 'Cell Wall'],
      ar: ['النواة', 'الريبوسوم', 'الميتوكوندريا', 'جدار الخلية']
    },
    answer: {
      so: 'Mitochondria',
      en: 'Mitochondria',
      ar: 'الميتوكوندريا'
    },
    explanation: {
      so: 'Mitochondria waxay soo saartaa ATP (tamar) unugga, taasoo keentay in loogu yeero "powerhouse of the cell."',
      en: 'Mitochondria produce ATP (energy) for the cell, earning the nickname "powerhouse of the cell."',
      ar: 'تنتج الميتوكوندريا ثلاثي فوسفات الأدينوسين (الطاقة) للخلية، ولذلك تسمى بيت الطاقة.'
    },
    points: 20,
    timeLimit: 40
  },
  {
    id: 's3',
    category: 'Science',
    difficulty: 'Hard',
    type: 'open',
    question: {
      so: 'Immisa koromosoom ayaa ku jira unugga caadiga ah ee bani\'aadamka?',
      en: 'How many chromosomes are in a typical human cell?',
      ar: 'كم عدد الكروموسومات الموجودة في الخلية البشرية النموذجية؟'
    },
    answer: ['46', '٤٦'],
    explanation: {
      so: 'Unugyada bani\'aadamka waxay ka kooban yihiin 46 koromosoom oo u habaysan 23 lammaane.',
      en: 'Human cells contain 46 chromosomes arranged in 23 pairs.',
      ar: 'تحتوي الخلايا البشرية على 46 كروموسومًا مرتبة في 23 زوجًا.'
    },
    points: 40,
    timeLimit: 30
  },

  // ─── LOGIC / IQ ───────────────────────────────────────────────────────────
  {
    id: 'l1',
    category: 'Logic',
    difficulty: 'Easy',
    type: 'mcq',
    question: {
      so: 'Haddii dhammaan "Bloops" ay yihiin "Razzies", dhammaan "Razzies" na ay yihiin "Lazzies", miyey xaqiiqo tahay in dhammaan "Bloops" ay yihiin "Lazzies"?',
      en: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
      ar: 'إذا كان كل البلووبس هم رازيس، وكل الرازيس هم لازيس، فهل كل البلووبس بالتأكيد هم لازيس؟'
    },
    options: {
      so: ['Haa', 'Maya', 'Lama go\'aamin karo', 'Miyay dhacdaa mararka qaar'],
      en: ['Yes', 'No', 'Cannot be determined', 'Only sometimes'],
      ar: ['نعم', 'لا', 'لا يمكن تحديده', 'أحياناً فقط']
    },
    answer: {
      so: 'Haa',
      en: 'Yes',
      ar: 'نعم'
    },
    explanation: {
      so: 'Silsilad ahaan: Bloops → Razzies → Lazzies, markaas Bloops kasta waa Lazzies.',
      en: 'By transitive logic: Bloops -> Razzies -> Lazzies, therefore all Bloops are Lazzies.',
      ar: 'منطقياً بالتعدي: البلووبس جزء من الرازيس والرازيس جزء من اللازيس، إذن البلووبس جزء من اللازيس.'
    },
    points: 10,
    timeLimit: 35
  },
  {
    id: 'l2',
    category: 'Logic',
    difficulty: 'Medium',
    type: 'open',
    question: {
      so: 'Beeraley wuxuu haystay 17 neef oo ari ah. Dhammaantood waa dhinteen 9 mooyee. Immisa neef ayaa u haray?',
      en: 'A farmer has 17 sheep. All but 9 die. How many sheep does he have left?',
      ar: 'راعٍ لديه 17 خروفاً. ماتت كلها باستثناء 9. كم خروفاً بقي لديه؟'
    },
    answer: ['9', '٩'],
    explanation: {
      so: '"Dhammaantood waa dhinteen 9 mooyee" waxay ka dhigan tahay in 9 kaliya ay badbaadeen.',
      en: '"All but 9 die" means 9 survived. The answer is 9.',
      ar: '"ماتت كلها باستثناء 9" تعني أن 9 خراف نجت وبقيت على قيد الحياة.'
    },
    points: 20,
    timeLimit: 30
  },
  {
    id: 'l3',
    category: 'Logic',
    difficulty: 'Hard',
    type: 'mcq',
    question: {
      so: 'Saacadu waxay muujinaysaa 3:15. Waa maxay xagasha u dhaxaysa tilmaamaha saacadda iyo daqiiqadda?',
      en: 'A clock shows 3:15. What is the angle between the hour and minute hands?',
      ar: 'تشير الساعة إلى 3:15. ما هي الزاوية بين عقرب الساعات وعقرب الدقائق؟'
    },
    options: {
      so: ['0°', '7.5°', '15°', '30°'],
      en: ['0°', '7.5°', '15°', '30°'],
      ar: ['0°', '7.5°', '15°', '30°']
    },
    answer: {
      so: '7.5°',
      en: '7.5°',
      ar: '7.5°'
    },
    explanation: {
      so: 'Markay tahay 3:15, tilmaamaha daqiiqaduhu wuxuu saaran yahay 90°. Tilmaamaha saacaduhu wuxuu dhaqaaqaa 0.5° daqiiqaddii, marka xagashiisu waa 90° + (15×0.5°) = 97.5°. Farqiga = 97.5° − 90° = 7.5°',
      en: 'At 3:15, the minute hand is at 90 degrees. The hour hand moves 0.5 degrees per minute, so it is at 90 + (15*0.5) = 97.5 degrees. The difference is 7.5 degrees.',
      ar: 'عند الساعة 3:15، يكون عقرب الدقائق عند 90 درجة. يتحرك عقرب الساعات بمقدار 0.5 درجة في الدقيقة، فيكون عند 97.5 درجة. الفرق = 7.5 درجة.'
    },
    points: 40,
    timeLimit: 50
  },
  {
    id: 'l4',
    category: 'Logic',
    difficulty: 'Medium',
    type: 'mcq',
    question: {
      so: 'Haddii shalay ay ahayd berri, maanta waxay noqon lahayd Jimce. Waa maxay maalinta maanta dhab ahaan ah?',
      en: 'If yesterday was tomorrow, today would be Friday. What is today really?',
      ar: 'إذا كان الأمس هو الغد، لكان اليوم هو الجمعة. ما هو اليوم في الواقع؟'
    },
    options: {
      so: ['Arbaco', 'Khamiis', 'Sabti', 'Axad'],
      en: ['Wednesday', 'Thursday', 'Saturday', 'Sunday'],
      ar: ['الأربعاء', 'الخميس', 'السبت', 'الأحد']
    },
    answer: {
      so: 'Arbaco',
      en: 'Wednesday',
      ar: 'الأربعاء'
    },
    explanation: {
      so: 'Haddii "shalay ay ahayd berri" taas oo ka dhigaysa maanta Jimce, markaas "berri" waa inay ahayd Khamiis (shalayta Jimcaha). Haddii berri ay tahay Khamiis, maanta waa Arbaco.',
      en: 'If "yesterday was tomorrow" making today Friday, then "tomorrow" must be Thursday (yesterday of Friday). If tomorrow is Thursday, today is Wednesday.',
      ar: 'إذا كان "الأمس هو الغد" مما يجعل اليوم الجمعة، فيجب أن يكون "الغد" هو الخميس (أمس الجمعة). إذا كان الغد هو الخميس، فاليوم هو الأربعاء.'
    },
    points: 20,
    timeLimit: 40
  },
  {
    id: 'm6',
    category: 'Math',
    difficulty: 'Hard',
    type: 'open',
    question: {
      so: 'Waa maxay xididka labajibbaaran (square root) ee 144 oo lagu dhuftay 3?',
      en: 'What is the square root of 144 multiplied by 3?',
      ar: 'ما هو الجذر التربيعي لـ 144 مضروباً في 3؟'
    },
    answer: ['36', '٣٦'],
    explanation: {
      so: '√144 = 12. Kadib 12 × 3 = 36.',
      en: '√144 = 12. Then 12 × 3 = 36.',
      ar: 'الجذر التربيعي لـ 144 هو 12. ثم 12 × 3 = 36.'
    },
    points: 40,
    timeLimit: 40
  }
];

// Helper to filter puzzles
export const getPuzzles = (category = 'All', difficulty = 'All') => {
  return PUZZLES.filter(p =>
    (category === 'All' || p.category === category) &&
    (difficulty === 'All' || p.difficulty === difficulty)
  );
};

// Deterministic daily puzzle
export const getDailyPuzzle = () => {
  const hardPuzzles = PUZZLES.filter(p => p.difficulty === 'Hard');
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return { ...hardPuzzles[dayOfYear % hardPuzzles.length], isDaily: true };
};

export const CATEGORIES = ['All', 'Math', 'Physics', 'Science', 'Logic'];
export const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export const CATEGORY_META = {
  Math: { icon: '🔢', color: '#00CFFF', desc: 'Arithmetic & equations' },
  Physics: { icon: '⚡', color: '#7A5CFF', desc: 'Energy, forces & motion' },
  Science: { icon: '🔬', color: '#00FF99', desc: 'Biology & chemistry unraveled' },
  Logic: { icon: '🧠', color: '#FF9500', desc: 'IQ, sequence & reasoning' },
};
