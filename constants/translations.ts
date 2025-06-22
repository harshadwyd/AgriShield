export const translations = {
  en: {
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    skip: 'Skip',
    done: 'Done',
    retry: 'Retry',
    
    // Onboarding
    onboarding: {
      slide1: {
        title: 'AI-Powered Detection',
        subtitle: 'Smart Crop Analysis',
        description: 'Take a photo of your crops and get instant AI-powered analysis for diseases and pests with high accuracy.'
      },
      slide2: {
        title: 'Smart Treatment Guide',
        subtitle: 'Expert Recommendations',
        description: 'Get personalized treatment recommendations with organic, chemical, and preventive solutions tailored to your crops.'
      },
      slide3: {
        title: 'Learn & Grow',
        subtitle: 'Educational Resources',
        description: 'Access comprehensive guides, video tutorials, and expert knowledge to improve your farming practices.'
      },
      getStarted: 'Get Started'
    },
    
    // Home Screen
    home: {
      greeting: {
        morning: 'Good Morning, Farmer!',
        afternoon: 'Good Afternoon, Farmer!',
        evening: 'Good Evening, Farmer!',
        night: 'Good Night, Farmer!'
      },
      subtitle: 'Protect your crops with AI-powered analysis',
      totalScans: 'Total Scans',
      issuesFound: 'Issues Found',
      todaysRecommendation: "Today's Recommendation",
      quickActions: 'Quick Actions',
      recentActivity: 'Recent Activity',
      viewAll: 'View All',
      weatherDetails: {
        temperature: 'Temperature',
        humidity: 'Humidity'
      }
    },
    
    // Detection Screen
    detect: {
      title: 'Capture Crop Image',
      subtitle: 'Position the affected area in the frame',
      reviewTitle: 'Review & Analyze',
      analysisQuestion: 'What would you like to detect?',
      pestDetection: 'Pest Detection',
      pestDescription: 'Identify insects and other pests',
      diseaseDetection: 'Disease Detection',
      diseaseDescription: 'Identify fungal, bacterial, and viral diseases',
      analyzeImage: 'Analyze Image',
      analyzing: 'Analyzing your crop...',
      processingSteps: {
        processing: '🔍 Processing image...',
        analyzing: '🤖 Running AI analysis...',
        generating: '📊 Generating recommendations...'
      },
      results: 'Detection Results',
      confidence: 'Confidence',
      description: 'Description',
      symptoms: 'Symptoms',
      treatments: 'Treatment Options',
      organic: '🌿 Organic Solutions',
      chemical: '🧪 Chemical Treatments',
      preventive: '🛡️ Preventive Measures',
      scanAnother: 'Scan Another Crop',
      cameraPermission: {
        title: 'Camera Permission Required',
        description: 'We need access to your camera to detect crop diseases and pests.',
        grant: 'Grant Permission'
      },
      treatmentDetails: {
        dosage: 'Dosage',
        frequency: 'Frequency',
        safety: 'Safety'
      }
    },
    
    // History Screen
    history: {
      title: 'Detection History',
      subtitle: 'detections',
      summary: 'Detection Summary',
      highRisk: 'High Risk',
      mediumRisk: 'Medium Risk',
      lowRisk: 'Low Risk',
      filters: {
        all: 'All',
        pests: 'Pests',
        diseases: 'Diseases'
      },
      sortBy: 'Sort by:',
      sortOptions: {
        date: 'Date',
        severity: 'Severity'
      },
      treatmentStatus: {
        applied: 'Treatment Applied',
        pending: 'Treatment Pending'
      },
      empty: {
        title: 'No Detections Yet',
        description: 'Start scanning your crops to build your detection history'
      }
    },
    
    // Learn Screen
    learn: {
      title: 'Learn & Grow',
      subtitle: 'Expand your farming knowledge with expert resources',
      featured: 'Featured Content',
      searchPlaceholder: 'Search guides and videos...',
      categories: {
        all: 'All Categories',
        pestManagement: 'Pest Management',
        diseasePrevention: 'Disease Prevention',
        organicFarming: 'Organic Farming',
        seasonalCare: 'Seasonal Care'
      },
      contentTypes: {
        all: 'All',
        videos: 'Videos',
        guides: 'Guides'
      },
      resources: 'Resources',
      languages: 'languages',
      download: 'Download',
      downloaded: 'Downloaded',
      empty: {
        title: 'No Content Found',
        description: 'Try adjusting your search or filters to find relevant content'
      }
    },
    
    // Settings Screen
    settings: {
      title: 'Settings',
      subtitle: 'Customize your AgriShield experience',
      sections: {
        userPreferences: 'User Preferences',
        appSettings: 'App Settings',
        dataManagement: 'Data Management',
        support: 'Support & Information'
      },
      language: 'Language',
      units: 'Measurement Units',
      notifications: 'Notifications',
      notificationsDesc: 'Receive treatment reminders and tips',
      theme: 'Theme',
      dataUsage: 'Data Usage',
      detectionHistory: 'Detection History',
      detectionHistoryDesc: 'detections stored',
      downloadedContent: 'Downloaded Content',
      downloadedContentDesc: 'Manage offline guides and videos',
      clearData: 'Clear All Data',
      clearDataDesc: 'Delete all detection history',
      help: 'Help & FAQ',
      helpDesc: 'Get answers to common questions',
      contact: 'Contact Support',
      contactDesc: 'Get help from our team',
      privacy: 'Privacy Policy',
      privacyDesc: 'How we protect your data',
      version: 'Version',
      copyright: '© 2024 AgriShield. All rights reserved.',
      
      // Options
      languages: {
        english: 'English',
        hindi: 'हिंदी (Hindi)',
        marathi: 'मराठी (Marathi)'
      },
      units: {
        metric: 'Metric (kg, L)',
        imperial: 'Imperial (lbs, gal)'
      },
      themes: {
        light: 'Light',
        dark: 'Dark',
        auto: 'Auto'
      },
      dataUsageOptions: {
        low: 'Low - Save data',
        medium: 'Medium - Balanced',
        high: 'High - Best quality'
      },
      
      // Dialogs
      clearHistoryDialog: {
        title: 'Clear History',
        message: 'Are you sure you want to delete all detection history? This action cannot be undone.',
        clear: 'Clear'
      }
    },
    
    // Tab Navigation
    tabs: {
      home: 'Home',
      detect: 'Detect',
      history: 'History',
      learn: 'Learn',
      settings: 'Settings'
    },
    
    // Action Cards
    actions: {
      scanNow: 'Scan Now',
      history: 'History',
      tutorials: 'Tutorials',
      guides: 'Guides',
      myCrops: 'My Crops',
      support: 'Support'
    },
    
    // Severity Levels
    severity: {
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    
    // Confidence Levels
    confidence: {
      veryHigh: 'Very High',
      high: 'High',
      good: 'Good',
      fair: 'Fair',
      low: 'Low'
    }
  },
  
  hi: {
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    cancel: 'रद्द करें',
    ok: 'ठीक है',
    yes: 'हाँ',
    no: 'नहीं',
    save: 'सेव करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    back: 'वापस',
    next: 'अगला',
    skip: 'छोड़ें',
    done: 'पूर्ण',
    retry: 'पुनः प्रयास',
    
    // Onboarding
    onboarding: {
      slide1: {
        title: 'AI-संचालित पहचान',
        subtitle: 'स्मार्ट फसल विश्लेषण',
        description: 'अपनी फसलों की तस्वीर लें और उच्च सटीकता के साथ बीमारियों और कीटों के लिए तत्काल AI-संचालित विश्लेषण प्राप्त करें।'
      },
      slide2: {
        title: 'स्मार्ट उपचार गाइड',
        subtitle: 'विशेषज्ञ सिफारिशें',
        description: 'अपनी फसलों के अनुकूल जैविक, रासायनिक और निवारक समाधानों के साथ व्यक्तिगत उपचार सिफारिशें प्राप्त करें।'
      },
      slide3: {
        title: 'सीखें और बढ़ें',
        subtitle: 'शैक्षिक संसाधन',
        description: 'अपनी खेती की प्रथाओं को बेहतर बनाने के लिए व्यापक गाइड, वीडियो ट्यूटोरियल और विशेषज्ञ ज्ञान तक पहुंच प्राप्त करें।'
      },
      getStarted: 'शुरू करें'
    },
    
    // Home Screen
    home: {
      greeting: {
        morning: 'सुप्रभात, किसान जी!',
        afternoon: 'नमस्कार, किसान जी!',
        evening: 'शुभ संध्या, किसान जी!',
        night: 'शुभ रात्रि, किसान जी!'
      },
      subtitle: 'AI-संचालित विश्लेषण के साथ अपनी फसलों की सुरक्षा करें',
      totalScans: 'कुल स्कैन',
      issuesFound: 'समस्याएं मिलीं',
      todaysRecommendation: 'आज की सिफारिश',
      quickActions: 'त्वरित कार्य',
      recentActivity: 'हाल की गतिविधि',
      viewAll: 'सभी देखें',
      weatherDetails: {
        temperature: 'तापमान',
        humidity: 'आर्द्रता'
      }
    },
    
    // Detection Screen
    detect: {
      title: 'फसल की तस्वीर लें',
      subtitle: 'प्रभावित क्षेत्र को फ्रेम में रखें',
      reviewTitle: 'समीक्षा और विश्लेषण',
      analysisQuestion: 'आप क्या पहचानना चाहते हैं?',
      pestDetection: 'कीट पहचान',
      pestDescription: 'कीड़े और अन्य कीटों की पहचान करें',
      diseaseDetection: 'रोग पहचान',
      diseaseDescription: 'फंगल, बैक्टीरियल और वायरल रोगों की पहचान करें',
      analyzeImage: 'तस्वीर का विश्लेषण करें',
      analyzing: 'आपकी फसल का विश्लेषण हो रहा है...',
      processingSteps: {
        processing: '🔍 तस्वीर प्रोसेस हो रही है...',
        analyzing: '🤖 AI विश्लेषण चल रहा है...',
        generating: '📊 सिफारिशें तैयार हो रही हैं...'
      },
      results: 'पहचान परिणाम',
      confidence: 'विश्वास',
      description: 'विवरण',
      symptoms: 'लक्षण',
      treatments: 'उपचार विकल्प',
      organic: '🌿 जैविक समाधान',
      chemical: '🧪 रासायनिक उपचार',
      preventive: '🛡️ निवारक उपाय',
      scanAnother: 'दूसरी फसल स्कैन करें',
      cameraPermission: {
        title: 'कैमरा अनुमति आवश्यक',
        description: 'फसल की बीमारियों और कीटों का पता लगाने के लिए हमें आपके कैमरे तक पहुंच की आवश्यकता है।',
        grant: 'अनुमति दें'
      },
      treatmentDetails: {
        dosage: 'खुराक',
        frequency: 'आवृत्ति',
        safety: 'सुरक्षा'
      }
    },
    
    // History Screen
    history: {
      title: 'पहचान इतिहास',
      subtitle: 'पहचान',
      summary: 'पहचान सारांश',
      highRisk: 'उच्च जोखिम',
      mediumRisk: 'मध्यम जोखिम',
      lowRisk: 'कम जोखिम',
      filters: {
        all: 'सभी',
        pests: 'कीट',
        diseases: 'रोग'
      },
      sortBy: 'इसके अनुसार क्रमबद्ध करें:',
      sortOptions: {
        date: 'दिनांक',
        severity: 'गंभीरता'
      },
      treatmentStatus: {
        applied: 'उपचार लागू',
        pending: 'उपचार लंबित'
      },
      empty: {
        title: 'अभी तक कोई पहचान नहीं',
        description: 'अपना पहचान इतिहास बनाने के लिए अपनी फसलों को स्कैन करना शुरू करें'
      }
    },
    
    // Learn Screen
    learn: {
      title: 'सीखें और बढ़ें',
      subtitle: 'विशेषज्ञ संसाधनों के साथ अपना खेती का ज्ञान बढ़ाएं',
      featured: 'विशेष सामग्री',
      searchPlaceholder: 'गाइड और वीडियो खोजें...',
      categories: {
        all: 'सभी श्रेणियां',
        pestManagement: 'कीट प्रबंधन',
        diseasePrevention: 'रोग निवारण',
        organicFarming: 'जैविक खेती',
        seasonalCare: 'मौसमी देखभाल'
      },
      contentTypes: {
        all: 'सभी',
        videos: 'वीडियो',
        guides: 'गाइड'
      },
      resources: 'संसाधन',
      languages: 'भाषाएं',
      download: 'डाउनलोड',
      downloaded: 'डाउनलोड हो गया',
      empty: {
        title: 'कोई सामग्री नहीं मिली',
        description: 'प्रासंगिक सामग्री खोजने के लिए अपनी खोज या फिल्टर को समायोजित करने का प्रयास करें'
      }
    },
    
    // Settings Screen
    settings: {
      title: 'सेटिंग्स',
      subtitle: 'अपने AgriShield अनुभव को अनुकूलित करें',
      sections: {
        userPreferences: 'उपयोगकर्ता प्राथमिकताएं',
        appSettings: 'ऐप सेटिंग्स',
        dataManagement: 'डेटा प्रबंधन',
        support: 'सहायता और जानकारी'
      },
      language: 'भाषा',
      units: 'माप इकाइयां',
      notifications: 'सूचनाएं',
      notificationsDesc: 'उपचार अनुस्मारक और सुझाव प्राप्त करें',
      theme: 'थीम',
      dataUsage: 'डेटा उपयोग',
      detectionHistory: 'पहचान इतिहास',
      detectionHistoryDesc: 'पहचान संग्रहीत',
      downloadedContent: 'डाउनलोड की गई सामग्री',
      downloadedContentDesc: 'ऑफलाइन गाइड और वीडियो प्रबंधित करें',
      clearData: 'सभी डेटा साफ़ करें',
      clearDataDesc: 'सभी पहचान इतिहास हटाएं',
      help: 'सहायता और FAQ',
      helpDesc: 'सामान्य प्रश्नों के उत्तर प्राप्त करें',
      contact: 'सहायता संपर्क',
      contactDesc: 'हमारी टीम से सहायता प्राप्त करें',
      privacy: 'गोपनीयता नीति',
      privacyDesc: 'हम आपके डेटा की सुरक्षा कैसे करते हैं',
      version: 'संस्करण',
      copyright: '© 2024 AgriShield. सभी अधिकार सुरक्षित।',
      
      // Options
      languages: {
        english: 'English',
        hindi: 'हिंदी (Hindi)',
        marathi: 'मराठी (Marathi)'
      },
      units: {
        metric: 'मेट्रिक (kg, L)',
        imperial: 'इंपीरियल (lbs, gal)'
      },
      themes: {
        light: 'हल्का',
        dark: 'गहरा',
        auto: 'स्वचालित'
      },
      dataUsageOptions: {
        low: 'कम - डेटा बचाएं',
        medium: 'मध्यम - संतुलित',
        high: 'उच्च - सर्वोत्तम गुणवत्ता'
      },
      
      // Dialogs
      clearHistoryDialog: {
        title: 'इतिहास साफ़ करें',
        message: 'क्या आप वाकई सभी पहचान इतिहास हटाना चाहते हैं? यह क्रिया पूर्ववत नहीं की जा सकती।',
        clear: 'साफ़ करें'
      }
    },
    
    // Tab Navigation
    tabs: {
      home: 'होम',
      detect: 'पहचान',
      history: 'इतिहास',
      learn: 'सीखें',
      settings: 'सेटिंग्स'
    },
    
    // Action Cards
    actions: {
      scanNow: 'अभी स्कैन करें',
      history: 'इतिहास',
      tutorials: 'ट्यूटोरियल',
      guides: 'गाइड',
      myCrops: 'मेरी फसलें',
      support: 'सहायता'
    },
    
    // Severity Levels
    severity: {
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कम'
    },
    
    // Confidence Levels
    confidence: {
      veryHigh: 'बहुत उच्च',
      high: 'उच्च',
      good: 'अच्छा',
      fair: 'ठीक',
      low: 'कम'
    }
  },
  
  mr: {
    // Common
    loading: 'लोड होत आहे...',
    error: 'त्रुटी',
    success: 'यश',
    cancel: 'रद्द करा',
    ok: 'ठीक आहे',
    yes: 'होय',
    no: 'नाही',
    save: 'सेव्ह करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    back: 'परत',
    next: 'पुढे',
    skip: 'वगळा',
    done: 'पूर्ण',
    retry: 'पुन्हा प्रयत्न करा',
    
    // Onboarding
    onboarding: {
      slide1: {
        title: 'AI-चालित ओळख',
        subtitle: 'स्मार्ट पीक विश्लेषण',
        description: 'आपल्या पिकांचा फोटो घ्या आणि उच्च अचूकतेसह रोग आणि कीटकांसाठी तत्काळ AI-चालित विश्लेषण मिळवा.'
      },
      slide2: {
        title: 'स्मार्ट उपचार मार्गदर्शक',
        subtitle: 'तज्ञ शिफारसी',
        description: 'आपल्या पिकांसाठी अनुकूल सेंद्रिय, रासायनिक आणि प्रतिबंधात्मक उपायांसह वैयक्तिक उपचार शिफारसी मिळवा.'
      },
      slide3: {
        title: 'शिका आणि वाढा',
        subtitle: 'शैक्षणिक संसाधने',
        description: 'आपल्या शेतीच्या पद्धती सुधारण्यासाठी सर्वसमावेशक मार्गदर्शक, व्हिडिओ ट्यूटोरियल आणि तज्ञ ज्ञानात प्रवेश मिळवा.'
      },
      getStarted: 'सुरुवात करा'
    },
    
    // Home Screen
    home: {
      greeting: {
        morning: 'सुप्रभात, शेतकरी!',
        afternoon: 'नमस्कार, शेतकरी!',
        evening: 'शुभ संध्याकाळ, शेतकरी!',
        night: 'शुभ रात्री, शेतकरी!'
      },
      subtitle: 'AI-चालित विश्लेषणासह आपल्या पिकांचे संरक्षण करा',
      totalScans: 'एकूण स्कॅन',
      issuesFound: 'समस्या आढळल्या',
      todaysRecommendation: 'आजची शिफारस',
      quickActions: 'त्वरित कृती',
      recentActivity: 'अलीकडील क्रियाकलाप',
      viewAll: 'सर्व पहा',
      weatherDetails: {
        temperature: 'तापमान',
        humidity: 'आर्द्रता'
      }
    },
    
    // Detection Screen
    detect: {
      title: 'पिकाचा फोटो घ्या',
      subtitle: 'प्रभावित भाग फ्रेममध्ये ठेवा',
      reviewTitle: 'पुनरावलोकन आणि विश्लेषण',
      analysisQuestion: 'तुम्हाला काय ओळखायचे आहे?',
      pestDetection: 'कीटक ओळख',
      pestDescription: 'कीड आणि इतर कीटकांची ओळख करा',
      diseaseDetection: 'रोग ओळख',
      diseaseDescription: 'बुरशी, जीवाणू आणि विषाणूजन्य रोगांची ओळख करा',
      analyzeImage: 'फोटोचे विश्लेषण करा',
      analyzing: 'आपल्या पिकाचे विश्लेषण होत आहे...',
      processingSteps: {
        processing: '🔍 फोटो प्रक्रिया होत आहे...',
        analyzing: '🤖 AI विश्लेषण चालू आहे...',
        generating: '📊 शिफारसी तयार होत आहेत...'
      },
      results: 'ओळख परिणाम',
      confidence: 'विश्वास',
      description: 'वर्णन',
      symptoms: 'लक्षणे',
      treatments: 'उपचार पर्याय',
      organic: '🌿 सेंद्रिय उपाय',
      chemical: '🧪 रासायनिक उपचार',
      preventive: '🛡️ प्रतिबंधात्मक उपाय',
      scanAnother: 'दुसरे पीक स्कॅन करा',
      cameraPermission: {
        title: 'कॅमेरा परवानगी आवश्यक',
        description: 'पिकांचे रोग आणि कीटक शोधण्यासाठी आम्हाला आपल्या कॅमेऱ्यात प्रवेशाची आवश्यकता आहे.',
        grant: 'परवानगी द्या'
      },
      treatmentDetails: {
        dosage: 'डोस',
        frequency: 'वारंवारता',
        safety: 'सुरक्षा'
      }
    },
    
    // History Screen
    history: {
      title: 'ओळख इतिहास',
      subtitle: 'ओळख',
      summary: 'ओळख सारांश',
      highRisk: 'उच्च जोखीम',
      mediumRisk: 'मध्यम जोखीम',
      lowRisk: 'कमी जोखीम',
      filters: {
        all: 'सर्व',
        pests: 'कीटक',
        diseases: 'रोग'
      },
      sortBy: 'यानुसार क्रमवारी लावा:',
      sortOptions: {
        date: 'दिनांक',
        severity: 'गंभीरता'
      },
      treatmentStatus: {
        applied: 'उपचार लागू',
        pending: 'उपचार प्रलंबित'
      },
      empty: {
        title: 'अद्याप कोणतीही ओळख नाही',
        description: 'आपला ओळख इतिहास तयार करण्यासाठी आपली पिके स्कॅन करणे सुरू करा'
      }
    },
    
    // Learn Screen
    learn: {
      title: 'शिका आणि वाढा',
      subtitle: 'तज्ञ संसाधनांसह आपले शेती ज्ञान वाढवा',
      featured: 'वैशिष्ट्यीकृत सामग्री',
      searchPlaceholder: 'मार्गदर्शक आणि व्हिडिओ शोधा...',
      categories: {
        all: 'सर्व श्रेणी',
        pestManagement: 'कीटक व्यवस्थापन',
        diseasePrevention: 'रोग प्रतिबंध',
        organicFarming: 'सेंद्रिय शेती',
        seasonalCare: 'हंगामी काळजी'
      },
      contentTypes: {
        all: 'सर्व',
        videos: 'व्हिडिओ',
        guides: 'मार्ग दर्शक'
      },
      resources: 'संसाधने',
      languages: 'भाषा',
      download: 'डाउनलोड',
      downloaded: 'डाउनलोड झाले',
      empty: {
        title: 'कोणतीही सामग्री सापडली नाही',
        description: 'संबंधित सामग्री शोधण्यासाठी आपला शोध किंवा फिल्टर समायोजित करण्याचा प्रयत्न करा'
      }
    },
    
    // Settings Screen
    settings: {
      title: 'सेटिंग्ज',
      subtitle: 'आपला AgriShield अनुभव सानुकूलित करा',
      sections: {
        userPreferences: 'वापरकर्ता प्राधान्ये',
        appSettings: 'अॅप सेटिंग्ज',
        dataManagement: 'डेटा व्यवस्थापन',
        support: 'सहाय्य आणि माहिती'
      },
      language: 'भाषा',
      units: 'मापन एकके',
      notifications: 'सूचना',
      notificationsDesc: 'उपचार स्मरणपत्रे आणि सुचवणे प्राप्त करा',
      theme: 'थीम',
      dataUsage: 'डेटा वापर',
      detectionHistory: 'ओळख इतिहास',
      detectionHistoryDesc: 'ओळख संग्रहीत',
      downloadedContent: 'डाउनलोड केलेली सामग्री',
      downloadedContentDesc: 'ऑफलाइन मार्गदर्शक आणि व्हिडिओ व्यवस्थापित करा',
      clearData: 'सर्व डेटा साफ करा',
      clearDataDesc: 'सर्व ओळख इतिहास हटवा',
      help: 'मदत आणि FAQ',
      helpDesc: 'सामान्य प्रश्नांची उत्तरे मिळवा',
      contact: 'सहाय्य संपर्क',
      contactDesc: 'आमच्या टीमकडून मदत मिळवा',
      privacy: 'गोपनीयता धोरण',
      privacyDesc: 'आम्ही आपल्या डेटाचे संरक्षण कसे करतो',
      version: 'आवृत्ती',
      copyright: '© 2024 AgriShield. सर्व हक्क राखीव.',
      
      // Options
      languages: {
        english: 'English',
        hindi: 'हिंदी (Hindi)',
        marathi: 'मराठी (Marathi)'
      },
      units: {
        metric: 'मेट्रिक (kg, L)',
        imperial: 'इंपीरियल (lbs, gal)'
      },
      themes: {
        light: 'हलका',
        dark: 'गडद',
        auto: 'स्वयंचलित'
      },
      dataUsageOptions: {
        low: 'कमी - डेटा वाचवा',
        medium: 'मध्यम - संतुलित',
        high: 'उच्च - सर्वोत्तम गुणवत्ता'
      },
      
      // Dialogs
      clearHistoryDialog: {
        title: 'इतिहास साफ करा',
        message: 'तुम्हाला खरोखर सर्व ओळख इतिहास हटवायचा आहे का? ही क्रिया पूर्ववत केली जाऊ शकत नाही.',
        clear: 'साफ करा'
      }
    },
    
    // Tab Navigation
    tabs: {
      home: 'होम',
      detect: 'ओळख',
      history: 'इतिहास',
      learn: 'शिका',
      settings: 'सेटिंग्ज'
    },
    
    // Action Cards
    actions: {
      scanNow: 'आता स्कॅन करा',
      history: 'इतिहास',
      tutorials: 'ट्यूटोरियल',
      guides: 'मार्गदर्शक',
      myCrops: 'माझी पिके',
      support: 'सहाय्य'
    },
    
    // Severity Levels
    severity: {
      high: 'उच्च',
      medium: 'मध्यम',
      low: 'कमी'
    },
    
    // Confidence Levels
    confidence: {
      veryHigh: 'खूप उच्च',
      high: 'उच्च',
      good: 'चांगला',
      fair: 'ठीक',
      low: 'कमी'
    }
  }
};

export type Language = 'en' | 'hi' | 'mr';
export type TranslationKey = keyof typeof translations.en;

export const getTranslation = (language: Language, key: string): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if translation not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if no translation found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};