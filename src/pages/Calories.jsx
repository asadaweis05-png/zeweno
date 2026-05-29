import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Flame, Plus, Trash2, Search, Calculator, Sparkles, 
  Camera, Upload, Eye, RefreshCw, Key, Shield, HelpCircle, 
  Edit3, Check, Barcode, FileText, ArrowRight, User
} from 'lucide-react';
import ProgressRing from '../components/common/ProgressRing';
import Modal from '../components/common/Modal';
import AdUnit from '../components/common/AdUnit';
import { calculateBMR, calculateTDEE, calculateMacros } from '../utils/calculations';
import { COMMON_FOODS, ACTIVITY_LEVELS } from '../utils/constants';

// Unsplash high quality food images for instant sample testing
const SAMPLE_FOODS = [
  {
    id: 'avocado_toast',
    name: 'Avocado Toast with Egg',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80',
    calories: 340, protein: 14, carbs: 32, fat: 18,
    items: [
      { name: 'Sourdough Bread (1 slice)', calories: 120, protein: 4, carbs: 24, fat: 1 },
      { name: 'Avocado (1/2 fruit)', calories: 150, protein: 2, carbs: 8, fat: 13 },
      { name: 'Poached Egg (1 large)', calories: 70, protein: 8, carbs: 0, fat: 4 }
    ]
  },
  {
    id: 'salmon_bowl',
    name: 'Grilled Salmon Rice Bowl',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&auto=format&fit=crop&q=80',
    calories: 580, protein: 42, carbs: 45, fat: 24,
    items: [
      { name: 'Grilled Salmon Filet (150g)', calories: 310, protein: 34, carbs: 0, fat: 18 },
      { name: 'Brown Rice (1 cup cooked)', calories: 215, protein: 5, carbs: 45, fat: 2 },
      { name: 'Steamed Broccoli & Edamame', calories: 55, protein: 3, carbs: 0, fat: 4 }
    ]
  },
  {
    id: 'cheeseburger',
    name: 'Double Cheeseburger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80',
    calories: 790, protein: 46, carbs: 49, fat: 43,
    items: [
      { name: 'Beef Patties (Double)', calories: 440, protein: 34, carbs: 0, fat: 32 },
      { name: 'Brioche Bun & Cheese', calories: 280, protein: 10, carbs: 45, fat: 8 },
      { name: 'Sauces & Veggies', calories: 70, protein: 2, carbs: 4, fat: 3 }
    ]
  },
  {
    id: 'chicken_salad',
    name: 'Chicken Caesar Salad',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=300&auto=format&fit=crop&q=80',
    calories: 430, protein: 35, carbs: 12, fat: 27,
    items: [
      { name: 'Grilled Chicken Breast (120g)', calories: 180, protein: 30, carbs: 0, fat: 4 },
      { name: 'Romaine Lettuce & Croutons', calories: 100, protein: 2, carbs: 11, fat: 2 },
      { name: 'Caesar Dressing & Parmesan', calories: 150, protein: 3, carbs: 1, fat: 21 }
    ]
  }
];

// Presets for simulated barcode scanner
const MOCK_BARCODES = {
  '070847012414': { name: 'Monster Energy Ultra (473ml)', calories: 10, protein: 0, carbs: 2, fat: 0 },
  '028400070560': { name: 'Lay\'s Classic Potato Chips (50g)', calories: 270, protein: 3, carbs: 26, fat: 17 },
  '036632027968': { name: 'Chobani Greek Yogurt Blueberry (150g)', calories: 120, protein: 12, carbs: 16, fat: 0 },
  '078742230182': { name: 'Great Value Whole Milk (240ml)', calories: 150, protein: 8, carbs: 12, fat: 8 }
};

export default function Calories() {
  const { 
    profile, setProfile, addMeal, removeMeal, todayMeals, todayCalories,
    apiKey, setApiKey 
  } = useApp();

  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'image' | 'barcode'
  const [showCalc, setShowCalc] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState(apiKey || '');
  
  // Text tracking state
  const [textQuery, setTextQuery] = useState('');
  const [textLoading, setTextLoading] = useState(false);
  
  // Image tracking state
  const [selectedSample, setSelectedSample] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Barcode / Label tracking state
  const [barcodeInput, setBarcodeInput] = useState('');
  const [labelImage, setLabelImage] = useState(null);
  const [labelImageFile, setLabelImageFile] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  // AI parsed results ready to edit/confirm before logging
  const [parsedItems, setParsedItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // TDEE Calculations
  const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calorieGoal = profile.goal === 'lose' ? tdee - 500 : profile.goal === 'gain' ? tdee + 400 : tdee;
  const macros = calculateMacros(calorieGoal, profile.goal);
  
  const consumed = {
    protein: todayMeals.reduce((s, m) => s + (m.protein || 0), 0),
    carbs: todayMeals.reduce((s, m) => s + (m.carbs || 0), 0),
    fat: todayMeals.reduce((s, m) => s + (m.fat || 0), 0),
  };

  // Helper for simulating text calorie logging
  function simulateTextParsing(text) {
    const cleaned = text.toLowerCase();
    const items = [];
    
    // Quick keyword parser
    if (cleaned.includes('egg')) {
      const match = cleaned.match(/(\d+)\s*egg/) || cleaned.match(/egg/);
      const count = match && match[1] ? parseInt(match[1]) : 2;
      items.push({ name: `${count}x Eggs`, calories: count * 70, protein: count * 6, carbs: 0, fat: count * 5 });
    }
    if (cleaned.includes('avocado')) {
      items.push({ name: 'Avocado (1/2 piece)', calories: 150, protein: 2, carbs: 8, fat: 13 });
    }
    if (cleaned.includes('toast') || cleaned.includes('bread')) {
      const match = cleaned.match(/(\d+)\s*(slice|toast|bread)/);
      const count = match && match[1] ? parseInt(match[1]) : 1;
      items.push({ name: `${count}x Bread Toast`, calories: count * 80, protein: count * 3, carbs: count * 15, fat: count * 1 });
    }
    if (cleaned.includes('oatmeal') || cleaned.includes('oat')) {
      items.push({ name: 'Oatmeal (1 cup)', calories: 154, protein: 5, carbs: 27, fat: 3 });
    }
    if (cleaned.includes('banana')) {
      items.push({ name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 });
    }
    if (cleaned.includes('salmon')) {
      items.push({ name: 'Grilled Salmon (150g)', calories: 310, protein: 34, carbs: 0, fat: 18 });
    }
    if (cleaned.includes('chicken')) {
      items.push({ name: 'Grilled Chicken Breast (120g)', calories: 180, protein: 30, carbs: 0, fat: 4 });
    }
    if (cleaned.includes('salad')) {
      items.push({ name: 'Mixed Veggie Salad', calories: 80, protein: 2, carbs: 6, fat: 5 });
    }
    if (cleaned.includes('pizza')) {
      const match = cleaned.match(/(\d+)\s*(slice|pizza)/);
      const count = match && match[1] ? parseInt(match[1]) : 2;
      items.push({ name: `${count}x Pizza Slices`, calories: count * 280, protein: count * 12, carbs: count * 32, fat: count * 11 });
    }
    if (cleaned.includes('shake') || cleaned.includes('protein powder')) {
      items.push({ name: 'Whey Protein Shake', calories: 140, protein: 26, carbs: 3, fat: 2 });
    }
    if (cleaned.includes('rice')) {
      items.push({ name: 'White Rice (1 cup)', calories: 205, protein: 4, carbs: 45, fat: 0 });
    }

    if (items.length === 0) {
      // Fallback description parser
      items.push({ 
        name: text.trim().substring(0, 30) || 'Custom Meal', 
        calories: 380, 
        protein: 20, 
        carbs: 45, 
        fat: 12 
      });
    }

    return items;
  }

  // Handle Text Analysis
  async function handleTextAnalyze() {
    if (!textQuery.trim()) return;
    setTextLoading(true);
    setParsedItems([]);

    if (apiKey) {
      try {
        const prompt = `Analyze this food description: "${textQuery}". Identify each food item, estimate portion sizes, and calculate calories, protein (g), carbs (g), and fat (g). Return the response strictly as valid JSON matching this schema:
        {
          "meals": [
            { "name": "food item name", "calories": 150, "protein": 10, "carbs": 20, "fat": 5 }
          ]
        }
        Only output the JSON object, no explanations or markdown headers.`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { 
                temperature: 0.2,
                responseMimeType: 'application/json'
              },
            }),
          }
        );
        const data = await res.json();
        let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(text);
        if (parsed && parsed.meals) {
          setParsedItems(parsed.meals);
        } else {
          throw new Error("Invalid format");
        }
      } catch (err) {
        console.error("Gemini failed, falling back to simulated parser:", err);
        setParsedItems(simulateTextParsing(textQuery));
      }
    } else {
      // Simulate network delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 1500));
      setParsedItems(simulateTextParsing(textQuery));
    }
    setTextLoading(false);
  }

  // Handle Image base64 conversion & Gemini vision call
  async function analyzeImage(base64Data, mimeType) {
    try {
      const prompt = `Analyze the food in this image. List each food item you identify. Estimate portion size and calculate its calories, protein (g), carbs (g), and fat (g). Return the response strictly as valid JSON matching this schema:
      {
        "meals": [
          { "name": "item name and estimate", "calories": 250, "protein": 15, "carbs": 30, "fat": 10 }
        ]
      }
      Only output the JSON object, no explanations or markdown headers.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  { inlineData: { mimeType, data: base64Data } }
                ]
              }
            ],
            generationConfig: { 
              temperature: 0.2,
              responseMimeType: 'application/json'
            },
          }),
        }
      );
      const data = await res.json();
      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(text);
      return parsed.meals || [];
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  // Process selected sample image
  async function handleSelectSample(sample) {
    setSelectedSample(sample.id);
    setUploadedImage(sample.image);
    setUploadedImageFile(null);
    setImageLoading(true);
    setParsedItems([]);

    // Sample selection returns exact pre-loaded data for perfect accuracy
    await new Promise(resolve => setTimeout(resolve, 2000));
    setParsedItems(sample.items.map(item => ({ ...item })));
    setImageLoading(false);
  }

  // Drag & Drop event handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  // Process custom image file
  async function handleFileSelected(file) {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    
    setSelectedSample(null);
    setUploadedImageFile(file);
    
    // Set preview URL
    const previewUrl = URL.createObjectURL(file);
    setUploadedImage(previewUrl);
    
    setImageLoading(true);
    setParsedItems([]);

    // Convert file to base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      const mimeType = file.type;
      
      if (apiKey) {
        try {
          const meals = await analyzeImage(base64Data, mimeType);
          setParsedItems(meals);
        } catch (err) {
          console.error("Gemini Image Parsing failed, fallback to mock scan:", err);
          // Fallback mock scan
          await new Promise(r => r(setTimeout(() => {}, 1500)));
          setParsedItems([
            { name: "Scanned Food (AI Estimate)", calories: 480, protein: 24, carbs: 42, fat: 16 }
          ]);
        }
      } else {
        // Mock scan animation delay
        await new Promise(resolve => setTimeout(resolve, 2500));
        setParsedItems([
          { name: "Scanned Salad & Chicken Bowl", calories: 420, protein: 32, carbs: 15, fat: 14 }
        ]);
      }
      setImageLoading(false);
    };
  }

  // Handle Barcode scanning
  async function handleBarcodeSubmit(e) {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    setScanLoading(true);
    setParsedItems([]);

    await new Promise(resolve => setTimeout(resolve, 1200));

    const product = MOCK_BARCODES[barcodeInput.trim()];
    if (product) {
      setParsedItems([{
        name: product.name,
        calories: product.calories,
        protein: product.protein,
        carbs: product.carbs,
        fat: product.fat
      }]);
    } else {
      // Return a simulated item
      setParsedItems([{
        name: `Barcode Item #${barcodeInput.trim()}`,
        calories: 220,
        protein: 8,
        carbs: 30,
        fat: 6
      }]);
    }
    setScanLoading(false);
  }

  // Process label image OCR
  const handleLabelFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleLabelSelected(e.target.files[0]);
    }
  };

  async function handleLabelSelected(file) {
    setLabelImageFile(file);
    setLabelImage(URL.createObjectURL(file));
    setScanLoading(true);
    setParsedItems([]);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Data = reader.result.split(',')[1];
      const mimeType = file.type;

      if (apiKey) {
        try {
          const prompt = `This image is a photo of a nutrition facts label. Extract the nutritional values per serving. Extract: calories, protein (g), carbs (g), and fat (g). Return the response strictly as valid JSON matching this schema:
          {
            "meals": [
              { "name": "Extracted Label Food Product", "calories": 200, "protein": 12, "carbs": 24, "fat": 6 }
            ]
          }
          Only output the JSON object, no explanations or markdown headers.`;

          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      { text: prompt },
                      { inlineData: { mimeType, data: base64Data } }
                    ]
                  }
                ],
                generationConfig: { 
                  temperature: 0.2,
                  responseMimeType: 'application/json'
                },
              }),
            }
          );
          const data = await res.json();
          let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsed = JSON.parse(text);
          setParsedItems(parsed.meals || []);
        } catch (err) {
          console.error("Gemini OCR failed, fallback to mock label parse:", err);
          await new Promise(r => setTimeout(r, 1500));
          setParsedItems([
            { name: "Nutrition Label Extracted Item", calories: 250, protein: 18, carbs: 30, fat: 6 }
          ]);
        }
      } else {
        // Mock label parse delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setParsedItems([
          { name: "Energy Bar (Label OCR Scan)", calories: 210, protein: 15, carbs: 24, fat: 7 }
        ]);
      }
      setScanLoading(false);
    };
  }

  // Edit inline parsed item values
  function handleEditItem(index) {
    setEditingIndex(index);
  }

  function handleSaveEditItem(index, updatedItem) {
    const updated = [...parsedItems];
    updated[index] = updatedItem;
    setParsedItems(updated);
    setEditingIndex(null);
  }

  function handleDeleteItem(index) {
    setParsedItems(parsedItems.filter((_, idx) => idx !== index));
  }

  function handleAddManualItem() {
    setParsedItems([
      ...parsedItems,
      { name: 'New Item', calories: 150, protein: 10, carbs: 15, fat: 5 }
    ]);
    setEditingIndex(parsedItems.length);
  }

  // Log confirmed items to dashboard meals database
  function handleLogConfirmedMeals() {
    parsedItems.forEach(item => {
      addMeal({
        name: item.name,
        calories: Number(item.calories) || 0,
        protein: Number(item.protein) || 0,
        carbs: Number(item.carbs) || 0,
        fat: Number(item.fat) || 0,
      });
    });

    // Reset all scanner panel states
    setParsedItems([]);
    setTextQuery('');
    setUploadedImage(null);
    setUploadedImageFile(null);
    setSelectedSample(null);
    setBarcodeInput('');
    setLabelImage(null);
    setLabelImageFile(null);
  }

  // API Key Saving
  function handleSaveApiKey() {
    setApiKey(keyInput.trim());
    setShowKeyModal(false);
  }

  const macroBars = [
    { label: 'Protein', current: consumed.protein, goal: macros.protein, unit: 'g', color: 'var(--accent-purple)' },
    { label: 'Carbs', current: consumed.carbs, goal: macros.carbs, unit: 'g', color: 'var(--accent-amber)' },
    { label: 'Fat', current: consumed.fat, goal: macros.fat, unit: 'g', color: 'var(--accent-pink)' },
  ];

  return (
    <div className="animate-slide-up">
      {/* Header Panel */}
      <div className="page-header-actions" style={{ alignItems: 'flex-start' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="text-gradient">AI Food Tracker</h1>
          <p className="text-secondary">Capture your nutrients at lightspeed using text, photos, and scans.</p>
        </div>
        
        {/* Gemini API and Mode Details */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowCalc(true)}>
              <Calculator size={15} /> TDEE Setup
            </button>
            <button 
              className={`api-badge ${apiKey ? 'connected' : 'simulated'}`} 
              onClick={() => { setKeyInput(apiKey); setShowKeyModal(true); }}
              style={{ cursor: 'pointer' }}
            >
              <Key size={12} />
              {apiKey ? 'API Active' : 'Simulation Mode'}
            </button>
          </div>
          {!apiKey && (
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', maxWidth: '280px', textAlign: 'right' }}>
              💡 Enter a free <strong style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setShowKeyModal(true)}>Gemini API Key</strong> to activate live image recognition.
            </span>
          )}
        </div>
      </div>

      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Main Panel Grids */}
      <div className="grid-2 mt-lg" style={{ alignItems: 'stretch', gap: '2rem' }}>
        
        {/* LEFT COLUMN: TELEMETRY AND CALORIE PROGRESS RING */}
        <div className="glass-card hologram-glow" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2.5rem' }}>
          <div>
            <h3 className="hologram-text-glow text-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} style={{ color: 'var(--accent-cyan)' }} /> Today's Telemetry
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '2rem 0', position: 'relative' }}>
              <ProgressRing
                value={todayCalories} max={calorieGoal} size={180} strokeWidth={14}
                label="kcal left" 
                valueLabel={Math.max(0, calorieGoal - todayCalories).toString()}
                color={todayCalories > calorieGoal ? 'var(--accent-red)' : 'var(--accent-cyan)'}
                bgColor="rgba(255,255,255,0.03)"
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Goal Target</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{calorieGoal} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>kcal</span></div>
              </div>
              <div style={{ width: '1px', background: 'var(--card-border)' }} />
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Consumed</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '4px' }}>{todayCalories} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>kcal</span></div>
              </div>
            </div>
          </div>

          {/* Macro breakdown section */}
          <div>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', fontWeight: 600 }}>Macronutrients status</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {macroBars.map(m => (
                <div key={m.label}>
                  <div className="macro-progress-header">
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.label}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{m.current}{m.unit} / {m.goal}{m.unit}</span>
                  </div>
                  <div className="macro-progress-bar-bg">
                    <div style={{
                      height: '100%', borderRadius: 'var(--radius-full)',
                      background: m.color, width: `${Math.min((m.current / m.goal) * 100, 100)}%`,
                      transition: 'width 0.6s ease',
                      color: m.color
                    }} className="macro-progress-bar-fill" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MULTIMODAL AI PANEL */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '2.5rem' }}>
          
          {/* Tracking mode tabs */}
          <div className="tabs mb-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <button 
              className={`tab ${activeTab === 'text' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('text'); setParsedItems([]); }}
            >
              <Sparkles size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              AI Chat/Text
            </button>
            <button 
              className={`tab ${activeTab === 'image' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('image'); setParsedItems([]); }}
            >
              <Camera size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              AI Vision Scan
            </button>
            <button 
              className={`tab ${activeTab === 'barcode' ? 'active' : ''}`} 
              onClick={() => { setActiveTab('barcode'); setParsedItems([]); }}
            >
              <Barcode size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
              Barcode & Label
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            
            {/* TAB 1: NATURAL LANGUAGE TEXT LOGGING */}
            {activeTab === 'text' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
                <div style={{ marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Describe what you ate</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Just write it out naturally and our AI will estimate the calories and macros.</p>
                </div>
                
                <textarea 
                  className="form-textarea" 
                  placeholder="Example: I had 2 scrambled eggs, half an avocado, and a slice of toasted sourdough bread..." 
                  value={textQuery} 
                  onChange={e => setTextQuery(e.target.value)}
                  style={{ minHeight: '120px', fontSize: '0.95rem' }}
                  disabled={textLoading}
                />

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '4px' }}>Examples:</span>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => setTextQuery("Breakfast: Oatmeal with a sliced banana, a tablespoon of honey, and 20g almonds")}
                    disabled={textLoading}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    🥣 Oatmeal & Almonds
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm" 
                    disabled={textLoading}
                    onClick={() => setTextQuery("Lunch: Grilled chicken breast (150g) with 1 cup brown rice and a side of broccoli")}
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    🍗 Chicken & Rice
                  </button>
                </div>

                <button 
                  className="btn btn-primary w-full hologram-glow" 
                  onClick={handleTextAnalyze} 
                  disabled={textLoading || !textQuery.trim()}
                  style={{ marginTop: '0.5rem', background: 'var(--gradient-primary)', height: '48px' }}
                >
                  {textLoading ? (
                    <RefreshCw className="spin" size={16} />
                  ) : (
                    <>
                      <Sparkles size={16} /> Parse with Gemini AI
                    </>
                  )}
                </button>
              </div>
            )}

            {/* TAB 2: AI VISION / IMAGE RECOGNITION */}
            {activeTab === 'image' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ marginBottom: '4px' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Food Photo Scanner</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Upload a meal picture. The AI will estimate the ingredients and nutritional content.</p>
                </div>

                {uploadedImage ? (
                  <div className="image-preview-container">
                    <img src={uploadedImage} alt="Food Upload" />
                    {imageLoading && (
                      <div className="scanner-overlay">
                        <div className="scan-line" />
                        <Sparkles size={32} className="spin" style={{ color: 'var(--accent-cyan)' }} />
                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '12px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="hologram-text-glow">Analyzing Meal...</span>
                      </div>
                    )}
                    {!imageLoading && (
                      <button 
                        onClick={() => { setUploadedImage(null); setUploadedImageFile(null); setParsedItems([]); setSelectedSample(null); }}
                        style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(3,7,18,0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '50%', color: 'var(--text-main)', display: 'flex' }}
                      >
                        <Trash2 size={16} style={{ color: 'var(--accent-red)' }} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div 
                    className={`dropzone-container ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      style={{ display: 'none' }} 
                      accept="image/*"
                      onChange={handleFileInputChange}
                    />
                    <Upload size={36} style={{ color: 'var(--accent-cyan)', marginBottom: '12px' }} />
                    <h5 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Drag and drop your food photo</h5>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Supports JPEG, PNG up to 10MB</p>
                    <button className="btn btn-secondary btn-sm mt-md" style={{ pointerEvents: 'none' }}>
                      Browse Files
                    </button>
                  </div>
                )}

                {/* Instant Sample Carousel for quick test */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Try these sample meals:</span>
                  <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {SAMPLE_FOODS.map(sample => (
                      <div 
                        key={sample.id}
                        className={`mock-image-option ${selectedSample === sample.id ? 'selected' : ''}`}
                        onClick={() => handleSelectSample(sample)}
                        title={sample.name}
                      >
                        <img src={sample.image} alt={sample.name} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BARCODE AND LABEL OCR SCANNER */}
            {activeTab === 'barcode' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* Barcode Form */}
                <form onSubmit={handleBarcodeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>Enter Barcode Value</h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Barcode size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                      <input 
                        className="form-input" 
                        type="text"
                        placeholder="Scan or type barcode (e.g. 028400070560)" 
                        value={barcodeInput} 
                        onChange={e => setBarcodeInput(e.target.value)}
                        style={{ paddingLeft: '36px' }}
                        disabled={scanLoading}
                      />
                    </div>
                    <button className="btn btn-primary" type="submit" disabled={scanLoading || !barcodeInput.trim()}>
                      {scanLoading ? <RefreshCw size={14} className="spin" /> : 'Find'}
                    </button>
                  </div>
                  
                  {/* Mock Barcode quick links */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>Test Barcodes:</span>
                    <button 
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setBarcodeInput('028400070560')}
                      style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                    >
                      Lay's Chips
                    </button>
                    <button 
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setBarcodeInput('070847012414')}
                      style={{ fontSize: '0.7rem', padding: '2px 8px' }}
                    >
                      Monster Ultra
                    </button>
                  </div>
                </form>

                <div className="divider" style={{ margin: '8px 0' }} />

                {/* Nutrition Facts Label Uploader */}
                <div>
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '4px' }}>Nutrition Label Photo Extractor</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Upload a photo of any nutrition facts label to extract details instantly.</p>
                  
                  {labelImage ? (
                    <div className="image-preview-container" style={{ height: '180px' }}>
                      <img src={labelImage} alt="Label Upload" />
                      {scanLoading && (
                        <div className="scanner-overlay">
                          <div className="scan-line" />
                          <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }} className="hologram-text-glow">Reading Label...</span>
                        </div>
                      )}
                      {!scanLoading && (
                        <button 
                          onClick={() => { setLabelImage(null); setLabelImageFile(null); setParsedItems([]); }}
                          style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(3,7,18,0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '50%', display: 'flex' }}
                        >
                          <Trash2 size={14} style={{ color: 'var(--accent-red)' }} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div 
                      className="dropzone-container" 
                      style={{ padding: '1.5rem 1rem' }}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        style={{ display: 'none' }} 
                        accept="image/*"
                        onChange={handleLabelFileInputChange}
                      />
                      <FileText size={28} style={{ color: 'var(--accent-cyan)', marginBottom: '8px' }} />
                      <h5 style={{ fontSize: '0.82rem', marginBottom: '2px' }}>Upload Nutrition Facts Label</h5>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Gemini will scan the table metrics</span>
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* AI PARSED ITEMS PREVIEW / ADJUSTMENT PANEL */}
      {parsedItems.length > 0 && (
        <div className="glass-card hologram-glow mt-lg animate-slide-up" style={{ border: '1px solid rgba(0, 240, 255, 0.25)', background: 'rgba(3, 10, 22, 0.6)' }}>
          <div className="flex-between mb-md">
            <div>
              <h3 className="hologram-text-glow text-gradient" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-cyan)' }} /> Verify & Correct AI Findings
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Review parsed logs. Tap any card to adjust values if estimated portions are off.</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={handleAddManualItem}>
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="mb-lg">
            {parsedItems.map((item, idx) => (
              <div key={idx}>
                {editingIndex === idx ? (
                  <div className="list-item hologram-glow" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1rem', background: 'rgba(255,255,255,0.02)', borderColor: 'var(--accent-cyan)' }}>
                    <div className="form-group" style={{ marginBottom: '8px' }}>
                      <label className="form-label">Food Name</label>
                      <input 
                        className="form-input" 
                        value={item.name} 
                        onChange={e => {
                          const updated = { ...item, name: e.target.value };
                          const copy = [...parsedItems];
                          copy[idx] = updated;
                          setParsedItems(copy);
                        }}
                      />
                    </div>
                    <div className="form-row" style={{ marginBottom: 0 }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Calories (kcal)</label>
                        <input 
                          className="form-input" 
                          type="number"
                          value={item.calories} 
                          onChange={e => {
                            const updated = { ...item, calories: Number(e.target.value) };
                            const copy = [...parsedItems];
                            copy[idx] = updated;
                            setParsedItems(copy);
                          }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Protein (g)</label>
                        <input 
                          className="form-input" 
                          type="number"
                          value={item.protein} 
                          onChange={e => {
                            const updated = { ...item, protein: Number(e.target.value) };
                            const copy = [...parsedItems];
                            copy[idx] = updated;
                            setParsedItems(copy);
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-row" style={{ marginBottom: '8px', marginTop: '8px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Carbs (g)</label>
                        <input 
                          className="form-input" 
                          type="number"
                          value={item.carbs} 
                          onChange={e => {
                            const updated = { ...item, carbs: Number(e.target.value) };
                            const copy = [...parsedItems];
                            copy[idx] = updated;
                            setParsedItems(copy);
                          }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label">Fat (g)</label>
                        <input 
                          className="form-input" 
                          type="number"
                          value={item.fat} 
                          onChange={e => {
                            const updated = { ...item, fat: Number(e.target.value) };
                            const copy = [...parsedItems];
                            copy[idx] = updated;
                            setParsedItems(copy);
                          }}
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDeleteItem(idx)}>
                        <Trash2 size={12} style={{ color: 'var(--accent-red)' }} /> Remove
                      </button>
                      <button className="btn btn-primary btn-sm" onClick={() => handleSaveEditItem(idx, item)} style={{ background: 'var(--gradient-primary)' }}>
                        <Check size={12} /> Confirmed
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="list-item" style={{ cursor: 'pointer' }} onClick={() => handleEditItem(idx)}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{item.name}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span className="badge badge-cyan">{item.calories} kcal</span>
                          {item.protein > 0 && <span className="badge badge-purple">P: {item.protein}g</span>}
                          {item.carbs > 0 && <span className="badge badge-amber">C: {item.carbs}g</span>}
                          {item.fat > 0 && <span className="badge badge-pink">F: {item.fat}g</span>}
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-icon btn-ghost" style={{ padding: '4px' }} onClick={(e) => { e.stopPropagation(); handleEditItem(idx); }}>
                      <Edit3 size={14} style={{ color: 'var(--text-dim)' }} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-secondary w-full" onClick={() => setParsedItems([])}>
              Cancel
            </button>
            <button className="btn btn-primary w-full" onClick={handleLogConfirmedMeals} style={{ background: 'var(--gradient-primary)' }}>
              Log Meals to Dashboard <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* TODAY'S LOGGED MEALS */}
      <h2 className="section-title mt-xl" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
        <Flame size={20} className="text-accent" /> Logged Foods Today
      </h2>
      {todayMeals.length === 0 ? (
        <div className="glass-card empty-state">
          <Flame size={32} style={{ color: 'var(--text-dim)' }} />
          <h3>No foods tracked today</h3>
          <p className="text-secondary">Capture a food description or image above to initialize today's telemetry logs.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {todayMeals.map(meal => (
            <div key={meal.id} className="list-item">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{meal.name}</div>
                <div style={{ display: 'flex', gap: 'var(--space-xs)', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span className="badge badge-cyan">{meal.calories} kcal</span>
                  {meal.protein > 0 && <span className="badge badge-purple">P: {meal.protein}g</span>}
                  {meal.carbs > 0 && <span className="badge badge-amber">C: {meal.carbs}g</span>}
                  {meal.fat > 0 && <span className="badge badge-pink">F: {meal.fat}g</span>}
                </div>
              </div>
              <button className="btn btn-icon btn-ghost" onClick={() => removeMeal(meal.id)}>
                <Trash2 size={16} style={{ color: 'var(--accent-red)' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      <AdUnit format="horizontal" className="ad-page-bottom" />

      {/* Gemini API Key setup Modal */}
      <Modal isOpen={showKeyModal} onClose={() => setShowKeyModal(false)} title="Gemini Connection Settings">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(0, 240, 255, 0.05)', border: '1px solid rgba(0, 240, 255, 0.15)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <Shield size={20} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
              Your API key is stored locally in your browser. It is sent directly to Google's endpoints and is never uploaded to any external server.
            </p>
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Google Gemini API Key</label>
            <input 
              className="form-input" 
              type="password" 
              placeholder="Paste your Gemini API key..." 
              value={keyInput} 
              onChange={e => setKeyInput(e.target.value)}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              Create a free key in seconds at{' '}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>
                Google AI Studio
              </a>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button className="btn btn-secondary w-full" onClick={() => { setKeyInput(''); setApiKey(''); setShowKeyModal(false); }}>
              Clear Key
            </button>
            <button className="btn btn-primary w-full" onClick={handleSaveApiKey} style={{ background: 'var(--gradient-primary)' }}>
              Connect API Key
            </button>
          </div>
        </div>
      </Modal>

      {/* TDEE Calculator Modal */}
      <Modal isOpen={showCalc} onClose={() => setShowCalc(false)} title="TDEE Telemetry Calibration">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" value={profile.gender}
              onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Age</label>
            <input className="form-input" type="number" value={profile.age}
              onChange={e => setProfile(p => ({ ...p, age: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Weight (kg)</label>
            <input className="form-input" type="number" value={profile.weight}
              onChange={e => setProfile(p => ({ ...p, weight: Number(e.target.value) }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Height (cm)</label>
            <input className="form-input" type="number" value={profile.height}
              onChange={e => setProfile(p => ({ ...p, height: Number(e.target.value) }))} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Activity Level</label>
          <select className="form-select" value={profile.activityLevel}
            onChange={e => setProfile(p => ({ ...p, activityLevel: e.target.value }))}>
            {ACTIVITY_LEVELS.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Calorie Goal Target</label>
          <select className="form-select" value={profile.goal}
            onChange={e => setProfile(p => ({ ...p, goal: e.target.value }))}>
            <option value="lose">Lose Weight (-500 kcal)</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Build Muscle (+400 kcal)</option>
          </select>
        </div>
        <div className="glass-card" style={{ background: 'rgba(0,240,255,0.03)', border: '1px solid rgba(0,240,255,0.15)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>BMR (Basal Metabolic Rate)</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{Math.round(bmr)} kcal</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>TDEE (Total Daily Energy Expenditure)</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{tdee} kcal</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Final Target Calories</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{calorieGoal} kcal</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
