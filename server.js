require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ============================================
// SCHEMAS
// ============================================

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  location: String,
  soilType: String,
  landSize: Number,
  role: { type: String, default: "farmer" },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", userSchema);

// Farmer Schema
const farmerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  location: String,
  soilType: String,
  landSize: Number,
  createdAt: { type: Date, default: Date.now }
});
const Farmer = mongoose.model("Farmer", farmerSchema);

// Crop Schema
const cropSchema = new mongoose.Schema({
  soilType: String,
  location: String,
  season: String,
  cropName: String,
  fertilizer: String,
  tips: String
});
const Crop = mongoose.model("Crop", cropSchema);

// Pest Schema
const pestSchema = new mongoose.Schema({
  pestName: String,
  cropAffected: String,
  symptoms: String,
  treatment: String,
  organicSolution: String,
  chemicalSolution: String,
  prevention: String
});
const Pest = mongoose.model("Pest", pestSchema);

// ============================================
// MULTER SETUP
// ============================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// ============================================
// AUTH ROUTES
// ============================================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, location, soilType, landSize } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = new User({
      name,
      email,
      password: hashedPassword,
      location: location || "",
      soilType: soilType || "",
      landSize: landSize || 0,
      role: "farmer"
    });
    await user.save();

    // Create Farmer (for dashboard)
    const farmer = new Farmer({
      name,
      email,
      password: hashedPassword,
      location: location || "",
      soilType: soilType || "",
      landSize: landSize || 0
    });
    await farmer.save();

    res.status(201).json({
      message: "Registration successful",
      token: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        soilType: user.soilType,
        landSize: user.landSize
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: user._id,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        soilType: user.soilType,
        landSize: user.landSize
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ============================================
// FARMER ROUTES
// ============================================
app.get("/api/farmers", async (req, res) => {
  const farmers = await Farmer.find();
  res.json(farmers);
});

app.post("/api/farmers", async (req, res) => {
  const farmer = new Farmer(req.body);
  await farmer.save();
  res.json(farmer);
});

app.delete("/api/farmers/:id", async (req, res) => {
  await Farmer.findByIdAndDelete(req.params.id);
  res.json({ message: "Farmer deleted" });
});

// ============================================
// CROP ROUTES
// ============================================
app.get("/api/crops", async (req, res) => {
  const crops = await Crop.find();
  res.json(crops);
});

app.post("/api/crops", async (req, res) => {
  const crop = new Crop(req.body);
  await crop.save();
  res.json(crop);
});

app.delete("/api/crops/:id", async (req, res) => {
  await Crop.findByIdAndDelete(req.params.id);
  res.json({ message: "Crop deleted" });
});

// ============================================
// PEST ROUTES
// ============================================
app.get("/api/pests", async (req, res) => {
  const pests = await Pest.find();
  res.json(pests);
});

app.post("/api/pests", async (req, res) => {
  const pest = new Pest(req.body);
  await pest.save();
  res.json(pest);
});

app.delete("/api/pests/:id", async (req, res) => {
  await Pest.findByIdAndDelete(req.params.id);
  res.json({ message: "Pest deleted" });
});

// ============================================
// HELPER FUNCTIONS FOR PEST DETECTION
// ============================================
const translationMap = {
  "உள்ளம் செத்தது": "dead heart",
  "வெள்ளை கதிர் தலை": "white ear head",
  "தண்டில் துளைகள்": "holes in stem",
  "இலைகளில் துளைகள்": "holes in leaves",
  "தாவரங்களில் கம்பளிப்பூச்சி": "caterpillar on plants",
  "இலை சேதம்": "leaf damage",
  "மஞ்சள் நிறமாதல்": "yellowing",
  "சுருண்ட இலைகள்": "curling leaves",
  "பிசுபிசுப்பான பொருள்": "sticky substance",
  "தாவரங்களில் எறும்புகள்": "ants on plants",
  "பழுப்பு புள்ளிகள்": "brown spots",
  "வாடுதல்": "wilting",
  "கம்பளிப்பூச்சி": "caterpillar",
  "எறும்புகள்": "ants",
  "புள்ளிகள்": "spots",
  "துளைகள்": "holes",
  "சேதம்": "damage",
  "நெல்": "rice",
  "கோதுமை": "wheat",
  "பருத்தி": "cotton",
  "மக்காச்சோளம்": "maize",
  "கோதுமை": "wheat",
  "சேலம்": "salem",
  "கோயம்புத்தூர்": "coimbatore"
};

const normalizeText = (text) => {
  if (!text) return "";
  let normalized = text.toString().toLowerCase();
  for (const [tam, eng] of Object.entries(translationMap)) {
    normalized = normalized.replace(new RegExp(tam, "gi"), eng);
  }
  normalized = normalized.replace(/[^a-z0-9\s]/g, " ");
  normalized = normalized.replace(/\s+/g, " ").trim();
  return normalized;
};

const termOverlap = (textA, textB) => {
  const termsA = new Set(normalizeText(textA).split(/\s+/).filter(Boolean));
  const termsB = new Set(normalizeText(textB).split(/\s+/).filter(Boolean));
  let overlap = 0;

  // Exact matches
  termsA.forEach(term => {
    if (termsB.has(term)) overlap += 2; // Higher weight for exact matches
  });

  // Partial matches and synonyms
  const synonymMap = {
    'yellow': ['yellowing', 'yellowed'],
    'hole': ['holes', 'perforated', 'damaged'],
    'leaf': ['leaves', 'foliage'],
    'curl': ['curling', 'curled'],
    'spot': ['spots', 'lesions', 'blotches'],
    'sticky': ['residue', 'honeydew', 'gooey'],
    'white': ['whitish', 'pale'],
    'brown': ['brownish', 'dark'],
    'dead': ['dying', 'necrotic'],
    'fold': ['folded', 'rolling'],
    'caterpillar': ['larva', 'worm', 'grub'],
    'ant': ['ants', 'insects'],
    'wilt': ['wilting', 'drooping'],
    'blast': ['blight', 'rot']
  };

  termsA.forEach(termA => {
    // Check for partial matches
    termsB.forEach(termB => {
      if (termA.includes(termB) || termB.includes(termA)) {
        if (termA !== termB) overlap += 1; // Partial match
      }
    });

    // Check synonyms
    Object.entries(synonymMap).forEach(([key, synonyms]) => {
      if (termA === key && synonyms.some(syn => termsB.has(syn))) {
        overlap += 1.5; // Synonym match
      }
      if (synonyms.includes(termA) && termsB.has(key)) {
        overlap += 1.5; // Reverse synonym match
      }
    });
  });

  return overlap;
};

app.post("/api/detect-pest", async (req, res) => {
  const { symptoms = "", cropName = "" } = req.body;

  const normalizedSymptoms = normalizeText(symptoms);
  const normalizedCropName = normalizeText(cropName);
  const allPests = await Pest.find();

  const scoredPests = allPests.map(p => {
    const pestCrop = normalizeText(p.cropAffected);
    const pestSymptoms = normalizeText(p.symptoms);
    const cropScore = normalizedCropName && (pestCrop === normalizedCropName ? 3 : termOverlap(normalizedCropName, pestCrop));
    const symptomScore = normalizedSymptoms && termOverlap(normalizedSymptoms, pestSymptoms);

    // Adjust scoring: give more weight to symptoms when user provides multiple symptoms
    const symptomCount = normalizedSymptoms ? normalizedSymptoms.split(/\s+/).filter(Boolean).length : 0;
    const symptomWeight = symptomCount > 1 ? 2 : 1;

    const totalScore = (cropScore || 0) * 1.5 + (symptomScore || 0) * symptomWeight;
    return { pest: p, totalScore, cropScore: cropScore || 0, symptomScore: symptomScore || 0 };
  }).sort((a, b) => b.totalScore - a.totalScore);

  if (scoredPests.length > 0 && scoredPests[0].totalScore > 0) {
    return res.json({ success: true, pest: scoredPests[0].pest, suggestions: scoredPests.slice(0, 3).map(s => s.pest) });
  }

  res.json({ success: false, message: "No matching pest found", suggestions: scoredPests.slice(0, 3).map(s => s.pest) });
});

app.post("/api/upload-pest", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const { cropName = "" } = req.body;

    if (!cropName.trim()) {
      return res.status(400).json({ success: false, message: "Crop name is required" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const normalizedCropName = normalizeText(cropName);
    const allPests = await Pest.find();

    // Score pests based on crop affection
    const scoredPests = allPests.map(p => {
      const pestCrop = normalizeText(p.cropAffected);
      // When detecting by image, prioritize crop matching
      const cropScore = normalizedCropName && (pestCrop === normalizedCropName ? 3 : termOverlap(normalizedCropName, pestCrop));
      const totalScore = (cropScore || 0) * 2;
      return { pest: p, totalScore, cropScore: cropScore || 0 };
    }).sort((a, b) => b.totalScore - a.totalScore);

    if (scoredPests.length > 0 && scoredPests[0].totalScore > 0) {
      return res.json({ 
        success: true, 
        imageUrl,
        pest: scoredPests[0].pest, 
        suggestions: scoredPests.slice(0, 3).map(s => s.pest) 
      });
    }

    // If no exact crop match, return suggestions based on all pests
    res.json({ 
      success: false, 
      message: "No matching pest found for this crop. Please review the suggestions below.",
      imageUrl,
      suggestions: scoredPests.slice(0, 3).map(s => s.pest) 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error processing image: " + err.message });
  }
});

// ============================================
// RECOMMENDATION
// ============================================
app.post("/recommend", async (req, res) => {
  const { soilType, location, season } = req.body;
  const crops = await Crop.find({ soilType, location, season });
  res.json({ success: true, crops });
});

// ============================================
// MONGODB CONNECTION
// ============================================
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/smartcrop")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// ============================================
// START SERVER
// ============================================
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));