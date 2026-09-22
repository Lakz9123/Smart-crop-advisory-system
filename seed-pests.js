const mongoose = require("mongoose");
const Pest = require("./models/Pest");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/smart-crop-advisory";
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected to:", mongoURI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Pest data to seed
const pestData = [
  {
    pestName: "Stem Borer",
    cropAffected: "Rice",
    symptoms: "Dead heart, white ear head, holes in stem, holes in leaves, caterpillar on plants, caterpillars, broken stems",
    treatment: "Remove affected plants, apply neem oil spray, use pheromone traps",
    organicSolution: "Release Trichogramma wasps, apply neem oil, maintain field sanitation",
    chemicalSolution: "Apply chlorpyrifos or carbofuran as per recommended dosage",
    prevention: "Use resistant varieties, proper spacing, avoid excessive nitrogen fertilizer"
  },
  {
    pestName: "Brown Plant Hopper",
    cropAffected: "Rice",
    symptoms: "Yellowing leaves, yellow leaves, wilting, sticky residue, honeydew, ants on plants, hopper burn, plant collapse",
    treatment: "Drain water from fields, apply neem oil, use systemic insecticides",
    organicSolution: "Introduce natural predators like spiders, apply neem oil spray",
    chemicalSolution: "Use imidacloprid or thiamethoxam for control",
    prevention: "Avoid overuse of nitrogen fertilizers, maintain proper water management"
  },
  {
    pestName: "Rice Leaf Folder",
    cropAffected: "Rice",
    symptoms: "Folded leaves, white streaks, leaf damage, curling leaves, rolled leaves, longitudinal white stripes",
    treatment: "Hand picking of larvae, apply biological control agents",
    organicSolution: "Release parasitic wasps, apply neem oil, maintain field hygiene",
    chemicalSolution: "Apply chlorpyrifos or lambda-cyhalothrin",
    prevention: "Use resistant varieties, proper plant spacing, balanced fertilization"
  },
  {
    pestName: "Rice Blast",
    cropAffected: "Rice",
    symptoms: "Diamond-shaped lesions on leaves, neck blast, brown spots, lesions, leaf spots, panicle blast, rotten neck",
    treatment: "Remove infected plants, apply fungicides, improve drainage",
    organicSolution: "Use resistant varieties, apply compost, maintain proper spacing",
    chemicalSolution: "Apply tricyclazole or carbendazim fungicides",
    prevention: "Use certified seeds, avoid excessive nitrogen, proper water management"
  },
  {
    pestName: "Bacterial Blight",
    cropAffected: "Rice",
    symptoms: "Water-soaked lesions, yellow halos, wilting leaves, kresek disease, bacterial ooze, leaf blight",
    treatment: "Remove infected plants, apply copper-based bactericides",
    organicSolution: "Use resistant varieties, crop rotation, field sanitation",
    chemicalSolution: "Apply streptomycin or copper oxychloride",
    prevention: "Use certified seeds, avoid injury to plants, proper drainage"
  },
  {
    pestName: "Rice Tungro Disease",
    cropAffected: "Rice",
    symptoms: "Yellowing leaves, yellow leaves, stunted growth, reduced tillering, mottled leaves, leaf discoloration",
    treatment: "Remove infected plants, control vector insects",
    organicSolution: "Use resistant varieties, control green leafhoppers, field sanitation",
    chemicalSolution: "Apply insecticides to control leafhoppers",
    prevention: "Use certified seeds, avoid planting near infected fields"
  },
  {
    pestName: "Sheath Blight",
    cropAffected: "Rice",
    symptoms: "White mycelial growth on sheath, lesions on leaves, stem rot, white spots, irregular spots",
    treatment: "Improve field drainage, apply fungicides",
    organicSolution: "Use resistant varieties, maintain proper plant spacing, crop rotation",
    chemicalSolution: "Apply validamycin or carbendazim",
    prevention: "Avoid excessive nitrogen, proper water management, field sanitation"
  },
  {
    pestName: "False Smut",
    cropAffected: "Rice",
    symptoms: "Green smut balls, yellow smut balls, velvety spores, grain smut, false smut",
    treatment: "Remove infected panicles, apply fungicides",
    organicSolution: "Use resistant varieties, proper field sanitation",
    chemicalSolution: "Apply carbendazim or mancozeb",
    prevention: "Use certified seeds, avoid excessive nitrogen, proper plant spacing"
  },
  {
    pestName: "Rice Hispa",
    cropAffected: "Rice",
    symptoms: "Longitudinal white streaks, leaf scraping, skeletonized leaves, hispa beetle damage",
    treatment: "Hand picking of beetles, apply insecticides",
    organicSolution: "Use neem oil, maintain field hygiene, introduce natural enemies",
    chemicalSolution: "Apply malathion or quinalphos",
    prevention: "Use resistant varieties, proper spacing, avoid monocropping"
  },
  {
    pestName: "Green Leafhopper",
    cropAffected: "Rice",
    symptoms: "Hopper burn, yellowing leaves, wilting, virus transmission, tungro symptoms",
    treatment: "Apply systemic insecticides, control weed hosts",
    organicSolution: "Use resistant varieties, introduce natural predators",
    chemicalSolution: "Apply imidacloprid or buprofezin",
    prevention: "Avoid planting near infected fields, proper water management"
  },
  {
    pestName: "Cotton Bollworm",
    cropAffected: "Cotton",
    symptoms: "Holes in leaves, damaged bolls, caterpillar presence",
    treatment: "Hand picking, biological control, chemical sprays",
    organicSolution: "Release Trichogramma wasps, apply neem oil, pheromone traps",
    chemicalSolution: "Apply cypermethrin or deltamethrin",
    prevention: "Use Bt cotton varieties, proper spacing, field monitoring"
  },
  {
    pestName: "Aphids",
    cropAffected: "Cotton",
    symptoms: "Curled leaves, sticky residue, yellowing, stunted growth",
    treatment: "Spray water to dislodge aphids, apply insecticidal soap",
    organicSolution: "Introduce ladybugs, apply neem oil, maintain plant health",
    chemicalSolution: "Use imidacloprid or acetamiprid",
    prevention: "Plant resistant varieties, avoid nitrogen excess, monitor regularly"
  },
  {
    pestName: "Whitefly",
    cropAffected: "Cotton",
    symptoms: "Yellowing leaves, sticky honeydew, sooty mold, leaf drop",
    treatment: "Use yellow sticky traps, apply neem oil spray",
    organicSolution: "Introduce parasitic wasps, apply neem oil, maintain biodiversity",
    chemicalSolution: "Apply buprofezin or pyriproxyfen",
    prevention: "Avoid overuse of pesticides, plant trap crops, proper irrigation"
  },
  {
    pestName: "Maize Borer",
    cropAffected: "Maize",
    symptoms: "Holes in stems, broken stalks, sawdust-like frass",
    treatment: "Remove infested plants, apply biological control",
    organicSolution: "Release Trichogramma wasps, apply neem oil, crop rotation",
    chemicalSolution: "Use chlorpyrifos or lambda-cyhalothrin",
    prevention: "Use resistant varieties, proper spacing, timely planting"
  },
  {
    pestName: "Fall Armyworm",
    cropAffected: "Maize",
    symptoms: "Irregular holes in leaves, defoliation, caterpillar feeding",
    treatment: "Hand picking, biological control agents",
    organicSolution: "Introduce natural enemies, apply neem oil, pheromone traps",
    chemicalSolution: "Apply emamectin benzoate or spinosad",
    prevention: "Monitor fields regularly, use resistant varieties, crop rotation"
  },
  {
    pestName: "Corn Borer",
    cropAffected: "Maize",
    symptoms: "Shot holes in leaves, broken tassels, ear damage",
    treatment: "Remove damaged parts, apply insecticides",
    organicSolution: "Release parasitic wasps, apply neem oil, maintain sanitation",
    chemicalSolution: "Use carbaryl or permethrin",
    prevention: "Use Bt maize varieties, proper planting density, field scouting"
  },
  {
    pestName: "Wheat Rust",
    cropAffected: "Wheat",
    symptoms: "Orange or brown pustules on leaves, yellowing, premature leaf death",
    treatment: "Apply fungicides at early stages",
    organicSolution: "Use resistant varieties, crop rotation, field sanitation",
    chemicalSolution: "Apply propiconazole or tebuconazole",
    prevention: "Plant resistant varieties, avoid dense planting, proper fertilization"
  },
  {
    pestName: "Wheat Aphids",
    cropAffected: "Wheat",
    symptoms: "Clustered aphids on leaves, yellowing, stunted growth",
    treatment: "Spray water, apply insecticidal soap",
    organicSolution: "Introduce ladybugs, apply neem oil, maintain plant vigor",
    chemicalSolution: "Use imidacloprid or dimethoate",
    prevention: "Monitor regularly, use resistant varieties, avoid stress"
  },
  {
    pestName: "Powdery Mildew",
    cropAffected: "Wheat",
    symptoms: "White powdery coating on leaves, yellowing, reduced yield",
    treatment: "Improve air circulation, apply fungicides",
    organicSolution: "Use resistant varieties, proper spacing, sulfur sprays",
    chemicalSolution: "Apply triadimefon or myclobutanil",
    prevention: "Avoid overhead irrigation, proper plant nutrition, crop rotation"
  },
  {
    pestName: "Leaf Blight",
    cropAffected: "Wheat",
    symptoms: "Brown lesions on leaves, premature drying, yield loss",
    treatment: "Remove infected debris, apply fungicides",
    organicSolution: "Use resistant varieties, crop rotation, field sanitation",
    chemicalSolution: "Apply mancozeb or chlorothalonil",
    prevention: "Plant certified seeds, avoid wet conditions, balanced fertilization"
  }
];

// Seed function
const seedPests = async () => {
  try {
    await connectDB();

    // Clear existing pests
    await Pest.deleteMany({});
    console.log("Cleared existing pests");

    // Insert new pests
    const insertedPests = await Pest.insertMany(pestData);
    console.log(`Seeded ${insertedPests.length} pests successfully`);

    // List inserted pests
    console.log("\nInserted pests:");
    insertedPests.forEach(pest => {
      console.log(`- ${pest.pestName} (${pest.cropAffected})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding pests:", error);
    process.exit(1);
  }
};

// Run the seed function
seedPests();