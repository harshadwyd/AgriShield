import { Detection, EducationalContent, DetectionResult } from '../types';

export const mockDetectionResults: { [key: string]: DetectionResult } = {
  aphids: {
    name: 'Aphids',
    scientific_name: 'Aphis gossypii',
    confidence: 92.5,
    severity: 'High',
    description: 'Small, soft-bodied insects that feed on plant sap. They reproduce rapidly and can cause significant damage to crops by weakening plants and transmitting viral diseases.',
    symptoms: [
      'Yellowing or curling leaves',
      'Stunted plant growth',
      'Sticky honeydew on leaves',
      'Presence of ants',
      'Sooty mold development'
    ],
    treatments: {
      organic: [
        {
          name: 'Neem Oil Spray',
          dosage: '50ml per 10L water',
          frequency: 'Every 7 days',
          safety: 'Safe for beneficial insects when applied in evening',
          effectiveness: 4,
          cost: 'Low'
        },
        {
          name: 'Insecticidal Soap',
          dosage: '30ml per 5L water',
          frequency: 'Every 5 days',
          safety: 'Non-toxic to humans and pets',
          effectiveness: 4,
          cost: 'Low'
        }
      ],
      chemical: [
        {
          name: 'Imidacloprid',
          dosage: '1ml per liter water',
          frequency: 'Once every 2 weeks',
          safety: 'Wear protective gear. Avoid during flowering',
          effectiveness: 5,
          cost: 'Medium'
        }
      ],
      preventive: [
        'Use reflective mulch to deter aphids',
        'Plant companion crops like marigolds',
        'Regular inspection of crops',
        'Remove weeds that harbor aphids',
        'Use sticky yellow traps'
      ]
    }
  },
  blight: {
    name: 'Late Blight',
    scientific_name: 'Phytophthora infestans',
    confidence: 88.3,
    severity: 'High',
    description: 'A devastating plant disease that affects tomatoes and potatoes. It thrives in cool, wet conditions and can destroy entire crops within days if left untreated.',
    symptoms: [
      'Dark, water-soaked spots on leaves',
      'White, fuzzy growth on leaf undersides',
      'Brown, rotting areas on stems and fruits',
      'Rapid spread during humid weather',
      'Unpleasant odor from infected parts'
    ],
    treatments: {
      organic: [
        {
          name: 'Copper Fungicide',
          dosage: '2g per liter water',
          frequency: 'Every 10 days',
          safety: 'Avoid spraying during rain. Wear gloves',
          effectiveness: 3,
          cost: 'Medium'
        },
        {
          name: 'Baking Soda Solution',
          dosage: '5g per liter water + 2ml liquid soap',
          frequency: 'Every 7 days',
          safety: 'Safe for organic farming',
          effectiveness: 2,
          cost: 'Low'
        }
      ],
      chemical: [
        {
          name: 'Metalaxyl + Mancozeb',
          dosage: '2.5g per liter water',
          frequency: 'Every 14 days',
          safety: 'Use protective equipment. Pre-harvest interval: 7 days',
          effectiveness: 5,
          cost: 'High'
        }
      ],
      preventive: [
        'Ensure proper air circulation',
        'Avoid overhead watering',
        'Remove and destroy infected plant debris',
        'Practice crop rotation',
        'Use resistant varieties'
      ]
    }
  },
  whitefly: {
    name: 'Whitefly',
    scientific_name: 'Bemisia tabaci',
    confidence: 85.7,
    severity: 'Medium',
    description: 'Small, white flying insects that cluster on the undersides of leaves. They feed on plant sap and can transmit viral diseases, particularly affecting vegetable crops.',
    symptoms: [
      'Clouds of small white insects when disturbed',
      'Yellowing and wilting of leaves',
      'Sticky honeydew on plant surfaces',
      'Reduced plant vigor',
      'Virus transmission symptoms'
    ],
    treatments: {
      organic: [
        {
          name: 'Yellow Sticky Traps',
          dosage: '1 trap per 10 plants',
          frequency: 'Replace every 2 weeks',
          safety: 'Non-toxic monitoring method',
          effectiveness: 3,
          cost: 'Low'
        },
        {
          name: 'Neem Oil + Soap',
          dosage: '40ml neem + 20ml soap per 5L water',
          frequency: 'Every 5 days',
          safety: 'Apply during cooler hours',
          effectiveness: 4,
          cost: 'Low'
        }
      ],
      chemical: [
        {
          name: 'Thiamethoxam',
          dosage: '0.5ml per liter water',
          frequency: 'Every 10 days',
          safety: 'Highly toxic to bees. Use with caution',
          effectiveness: 5,
          cost: 'High'
        }
      ],
      preventive: [
        'Use reflective mulch',
        'Install fine mesh screens',
        'Regular monitoring with sticky traps',
        'Remove weeds around crops',
        'Quarantine new plants'
      ]
    }
  },
  leafspot: {
    name: 'Bacterial Leaf Spot',
    scientific_name: 'Xanthomonas campestris',
    confidence: 91.2,
    severity: 'Medium',
    description: 'A bacterial disease that causes dark spots on leaves, stems, and fruits. It spreads rapidly in warm, humid conditions and can significantly reduce crop yield.',
    symptoms: [
      'Small, dark brown spots on leaves',
      'Yellow halos around spots',
      'Leaf drop in severe cases',
      'Fruit lesions and cracking',
      'Stunted plant growth'
    ],
    treatments: {
      organic: [
        {
          name: 'Copper Hydroxide',
          dosage: '3g per liter water',
          frequency: 'Every 7-10 days',
          safety: 'Wear protective gear. Avoid copper buildup',
          effectiveness: 4,
          cost: 'Medium'
        },
        {
          name: 'Compost Tea',
          dosage: '1:10 dilution',
          frequency: 'Weekly application',
          safety: 'Completely safe and beneficial',
          effectiveness: 3,
          cost: 'Low'
        }
      ],
      chemical: [
        {
          name: 'Streptomycin Sulfate',
          dosage: '200ppm solution',
          frequency: 'Every 5-7 days',
          safety: 'Antibiotic - use sparingly to prevent resistance',
          effectiveness: 5,
          cost: 'High'
        }
      ],
      preventive: [
        'Use certified disease-free seeds',
        'Improve air circulation between plants',
        'Avoid overhead irrigation',
        'Remove infected plant debris',
        'Practice 3-year crop rotation'
      ]
    }
  },
  thrips: {
    name: 'Thrips',
    scientific_name: 'Frankliniella occidentalis',
    confidence: 87.8,
    severity: 'Medium',
    description: 'Tiny, slender insects that feed on plant cells by puncturing and sucking. They cause silvering of leaves and can transmit tospoviruses to plants.',
    symptoms: [
      'Silver or bronze streaks on leaves',
      'Black specks (thrips excrement)',
      'Distorted or curled leaves',
      'Reduced plant vigor',
      'Premature leaf drop'
    ],
    treatments: {
      organic: [
        {
          name: 'Blue Sticky Traps',
          dosage: '1 trap per 5 plants',
          frequency: 'Replace every 2 weeks',
          safety: 'Non-toxic monitoring and control',
          effectiveness: 3,
          cost: 'Low'
        },
        {
          name: 'Predatory Mites',
          dosage: '50-100 mites per plant',
          frequency: 'One-time release',
          safety: 'Biological control - completely safe',
          effectiveness: 4,
          cost: 'Medium'
        }
      ],
      chemical: [
        {
          name: 'Spinosad',
          dosage: '1ml per liter water',
          frequency: 'Every 7 days',
          safety: 'Low toxicity to mammals, avoid bee exposure',
          effectiveness: 4,
          cost: 'Medium'
        }
      ],
      preventive: [
        'Remove weeds that harbor thrips',
        'Use reflective mulches',
        'Maintain proper plant spacing',
        'Regular monitoring with sticky traps',
        'Quarantine new plants'
      ]
    }
  },
  powdery_mildew: {
    name: 'Powdery Mildew',
    scientific_name: 'Erysiphe cichoracearum',
    confidence: 94.1,
    severity: 'Low',
    description: 'A fungal disease that appears as white, powdery spots on leaves and stems. It thrives in warm, dry conditions with high humidity and can reduce photosynthesis.',
    symptoms: [
      'White, powdery coating on leaves',
      'Yellowing of affected leaves',
      'Stunted growth',
      'Premature leaf drop',
      'Reduced fruit quality'
    ],
    treatments: {
      organic: [
        {
          name: 'Milk Spray',
          dosage: '1 part milk to 9 parts water',
          frequency: 'Every 3-4 days',
          safety: 'Completely safe and edible',
          effectiveness: 3,
          cost: 'Low'
        },
        {
          name: 'Potassium Bicarbonate',
          dosage: '5g per liter water',
          frequency: 'Weekly application',
          safety: 'Safe for organic production',
          effectiveness: 4,
          cost: 'Low'
        }
      ],
      chemical: [
        {
          name: 'Myclobutanil',
          dosage: '1ml per liter water',
          frequency: 'Every 14 days',
          safety: 'Systemic fungicide - follow label instructions',
          effectiveness: 5,
          cost: 'High'
        }
      ],
      preventive: [
        'Ensure good air circulation',
        'Avoid overhead watering',
        'Remove infected plant parts',
        'Plant resistant varieties',
        'Maintain proper plant spacing'
      ]
    }
  }
};

// Enhanced treatment options database
export const treatmentDatabase = {
  'Neem Oil': {
    name: 'Neem Oil',
    type: 'organic',
    baseConcentration: 2.0, // percentage
    costPerLiter: 15.50,
    description: 'Natural pesticide and fungicide derived from neem tree',
    effectiveAgainst: ['aphids', 'whitefly', 'thrips', 'spider mites'],
    mixingRatio: 0.02, // 2% concentration
    waterRatio: 0.98,
    safetyNotes: 'Apply during cooler hours to avoid leaf burn',
    shelfLife: '2 years when stored properly'
  },
  'Copper Fungicide': {
    name: 'Copper Fungicide',
    type: 'organic',
    baseConcentration: 1.5,
    costPerLiter: 22.00,
    description: 'Broad-spectrum fungicide for bacterial and fungal diseases',
    effectiveAgainst: ['blight', 'leaf spot', 'bacterial diseases'],
    mixingRatio: 0.015,
    waterRatio: 0.985,
    safetyNotes: 'Wear protective equipment. Avoid copper buildup in soil',
    shelfLife: '3 years'
  },
  'Insecticidal Soap': {
    name: 'Insecticidal Soap',
    type: 'organic',
    baseConcentration: 3.0,
    costPerLiter: 12.75,
    description: 'Gentle, non-toxic insecticide safe for beneficial insects',
    effectiveAgainst: ['aphids', 'whitefly', 'soft-bodied insects'],
    mixingRatio: 0.03,
    waterRatio: 0.97,
    safetyNotes: 'Safe for humans and pets. Test on small area first',
    shelfLife: '1 year'
  },
  'Spinosad': {
    name: 'Spinosad',
    type: 'biological',
    baseConcentration: 0.8,
    costPerLiter: 45.00,
    description: 'Biological insecticide derived from soil bacteria',
    effectiveAgainst: ['thrips', 'caterpillars', 'leaf miners'],
    mixingRatio: 0.008,
    waterRatio: 0.992,
    safetyNotes: 'Low toxicity to mammals. Avoid application during bee activity',
    shelfLife: '2 years'
  },
  'Bacillus thuringiensis': {
    name: 'Bacillus thuringiensis (Bt)',
    type: 'biological',
    baseConcentration: 1.2,
    costPerLiter: 28.50,
    description: 'Biological insecticide targeting caterpillars and larvae',
    effectiveAgainst: ['caterpillars', 'moth larvae', 'beetle larvae'],
    mixingRatio: 0.012,
    waterRatio: 0.988,
    safetyNotes: 'Completely safe for humans, pets, and beneficial insects',
    shelfLife: '2 years when refrigerated'
  },
  'Horticultural Oil': {
    name: 'Horticultural Oil',
    type: 'organic',
    baseConcentration: 2.5,
    costPerLiter: 18.25,
    description: 'Refined petroleum oil for controlling soft-bodied insects',
    effectiveAgainst: ['scale insects', 'aphids', 'mites'],
    mixingRatio: 0.025,
    waterRatio: 0.975,
    safetyNotes: 'Do not apply in hot weather or to drought-stressed plants',
    shelfLife: '3 years'
  },
  'Diatomaceous Earth': {
    name: 'Diatomaceous Earth',
    type: 'organic',
    baseConcentration: 5.0,
    costPerLiter: 8.50,
    description: 'Natural powder made from fossilized algae',
    effectiveAgainst: ['crawling insects', 'slugs', 'snails'],
    mixingRatio: 0.05,
    waterRatio: 0.95,
    safetyNotes: 'Use food-grade DE only. Avoid inhalation',
    shelfLife: 'Indefinite when kept dry'
  },
  'Pyrethrin': {
    name: 'Pyrethrin',
    type: 'organic',
    baseConcentration: 1.0,
    costPerLiter: 35.75,
    description: 'Natural insecticide derived from chrysanthemum flowers',
    effectiveAgainst: ['flying insects', 'aphids', 'thrips'],
    mixingRatio: 0.01,
    waterRatio: 0.99,
    safetyNotes: 'Fast-acting but breaks down quickly in sunlight',
    shelfLife: '2 years'
  }
};

export const mockEducationalContent: EducationalContent[] = [
  {
    id: '1',
    title: 'Organic Pest Management Fundamentals',
    type: 'video',
    category: 'Pest Management',
    thumbnail: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: 'https://example.com/video1',
    duration: 1200,
    downloadable: true,
    languages: ['en', 'hi'],
    description: 'Learn the basics of organic pest control methods that are safe for your crops and the environment. This comprehensive guide covers natural predators, beneficial insects, and eco-friendly treatments.'
  },
  {
    id: '2',
    title: 'Disease Prevention in Vegetable Crops',
    type: 'pdf',
    category: 'Disease Prevention',
    url: 'https://example.com/guide1.pdf',
    downloadable: true,
    languages: ['en', 'hi', 'mr'],
    description: 'Comprehensive guide on preventing common diseases in tomatoes, peppers, and other vegetables. Includes seasonal care tips and early detection methods.'
  },
  {
    id: '3',
    title: 'Seasonal Crop Care Calendar',
    type: 'pdf',
    category: 'Seasonal Care',
    url: 'https://example.com/calendar.pdf',
    downloadable: true,
    languages: ['en', 'hi'],
    description: 'Month-by-month guide for crop care activities throughout the farming season. Perfect for planning your agricultural activities.'
  },
  {
    id: '4',
    title: 'Integrated Pest Management (IPM) Strategies',
    type: 'video',
    category: 'Pest Management',
    thumbnail: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: 'https://example.com/video2',
    duration: 900,
    downloadable: true,
    languages: ['en'],
    description: 'Advanced IPM techniques for sustainable pest control. Learn how to combine biological, cultural, and chemical methods effectively.'
  },
  {
    id: '5',
    title: 'Soil Health and Nutrition Management',
    type: 'video',
    category: 'Organic Farming',
    thumbnail: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: 'https://example.com/video3',
    duration: 1500,
    downloadable: true,
    languages: ['en', 'hi'],
    description: 'Understanding soil health indicators and how to maintain optimal nutrition for your crops through organic methods.'
  },
  {
    id: '6',
    title: 'Water Management in Agriculture',
    type: 'pdf',
    category: 'Seasonal Care',
    url: 'https://example.com/water-guide.pdf',
    downloadable: true,
    languages: ['en', 'hi', 'mr'],
    description: 'Efficient irrigation techniques and water conservation methods for sustainable farming practices.'
  },
  {
    id: '7',
    title: 'Companion Planting Guide',
    type: 'pdf',
    category: 'Organic Farming',
    url: 'https://example.com/companion-planting.pdf',
    downloadable: true,
    languages: ['en'],
    description: 'Learn which plants grow well together and how companion planting can naturally reduce pests and diseases.'
  },
  {
    id: '8',
    title: 'Post-Harvest Handling and Storage',
    type: 'video',
    category: 'Seasonal Care',
    thumbnail: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800',
    url: 'https://example.com/video4',
    duration: 800,
    downloadable: true,
    languages: ['en', 'hi'],
    description: 'Best practices for handling and storing your harvest to maximize quality and minimize losses.'
  }
];

export const mockWeatherData = {
  temperature: 28,
  humidity: 65,
  condition: 'Partly Cloudy',
  icon: '⛅',
  recommendation: 'Good conditions for spraying treatments. Low wind and moderate humidity make it ideal for applying organic solutions.'
};