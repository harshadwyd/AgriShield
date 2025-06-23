# 🌱 AgriShield - Smart Farming Assistant

*AgriShield* is an intelligent farming assistant app that empowers farmers with AI-powered pest and disease detection, treatment calculations, and comprehensive farm management tools. Built with modern web technologies and powered by Supabase for seamless data management.

![image](https://github.com/user-attachments/assets/1d0ebe57-cf70-45b4-94c5-a4fd56ef333c)



[![Demo](https://img.shields.io/badge/Live%20Demo-View%20App-blue?style=flat-square)](https://your-demo-url.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

---

## 🚀 Features

### 🔍 *AI-Powered Detection*
- *Smart Scanning*: Advanced AI detection for pests and diseases
- *Real-time Analysis*: Instant identification with confidence scores
- *Risk Assessment*: Automatic risk level categorization (Low/Medium/High)
- *Scientific Accuracy*: Detailed species identification with scientific names
![image](https://github.com/user-attachments/assets/97c7c5d2-7444-40d3-bf4b-43d74e233dd5)


### 📊 *Treatment Calculator*
- *Dynamic Calculations*: Real-time treatment mixing ratios
- *Cost Optimization*: Automatic cost breakdown and budgeting
- *Multiple Treatments*: Support for organic and chemical solutions
- *Field Size Adaptation*: Scalable calculations for any farm size
  ![image](https://github.com/user-attachments/assets/14d2984a-1e24-4aa3-a629-82932fd6f388)


### 📈 *Comprehensive Dashboard*
- *Live Weather Integration*: Real-time weather data for your location
- *Daily Farming Tips*: Context-aware recommendations
- *Progress Tracking*: Scan history and treatment effectiveness
- *Achievement System*: Gamified learning and engagement
  ![image](https://github.com/user-attachments/assets/e0f9408c-902a-4e98-9f77-64e70d6c9e1c)


### 🏆 *Achievement & Learning Hub*
- *Progress Rewards*: Unlock achievements for farming milestones
- *Educational Content*: Videos, guides, and expert articles
- *Skill Development*: Track learning progress and expertise growth
- *Community Features*: Share insights with other farmers
![image](https://github.com/user-attachments/assets/864313b4-0293-4d02-b361-093c5ad6f12f)


### 🔄 *Real-time Synchronization*
- *Cross-Device Sync*: Access your data anywhere, anytime
- *Offline Support*: Continue working without internet connection
- *Live Updates*: Real-time notifications and data synchronization
- *Data Security*: Enterprise-grade security with Supabase
![image](https://github.com/user-attachments/assets/92b2b57b-c5db-4215-842a-b38d73cc5bee)

---

## 🛠️ Tech Stack

### *Frontend*
- *React/Next.js* - Modern React framework for optimal performance
- *Tailwind CSS* - Utility-first CSS framework for responsive design
- *Lucide React* - Beautiful, customizable icons
- *Recharts* - Powerful charting library for data visualization

### *Backend & Database*
- *Supabase* - Open-source Firebase alternative
- *PostgreSQL* - Robust relational database
- *Row Level Security* - Advanced data protection
- *Real-time Subscriptions* - Live data synchronization

### *AI & Detection*
- *Custom AI Models* - Trained on agricultural datasets
- *Image Processing* - Advanced computer vision algorithms
- *Confidence Scoring* - Accurate detection reliability metrics

### *Additional Libraries*
- *Three.js* - 3D visualizations and interactive elements
- *D3.js* - Advanced data visualization
- *Plotly* - Scientific plotting and analytics
- *Papa Parse* - CSV data processing

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

1. *Clone the repository*
   bash
   git clone https://github.com/yourusername/agrishield.git
   cd agrishield
   

2. *Install dependencies*
   bash
   npm install
   # or
   yarn install
   

3. *Set up Supabase*
   bash
   # Create a new project at https://supabase.com
   # Copy your project URL and anon key
   

4. *Configure environment variables*
   bash
   cp .env.example .env.local
   # Add your Supabase credentials
   

5. *Set up the database*
   bash
   # Run the SQL schema in your Supabase SQL editor
   # (Found in docs/database-schema.sql)
   

6. *Start the development server*
   bash
   npm run dev
   # or
   yarn dev
   

7. *Open your browser*
   
   Navigate to http://localhost:3000
   

---

## 📁 Project Structure


agrishield/
├── 📂 components/           # Reusable UI components
│   ├── 🔍 DetectionScanner.jsx
│   ├── 🧮 TreatmentCalculator.jsx
│   ├── 📊 Dashboard.jsx
│   └── 🏆 AchievementSystem.jsx
├── 📂 lib/                 # Core utilities and configurations
│   ├── 🗄️ supabase.js      # Database client and helpers
│   ├── 🔐 auth.js          # Authentication functions
│   └── 📁 storage.js       # File storage utilities
├── 📂 pages/               # Next.js pages and API routes
│   ├── 🏠 index.js         # Home dashboard
│   ├── 🔍 detect.js        # Detection scanner
│   ├── 📜 history.js       # Detection history
│   ├── 📚 learn.js         # Learning hub
│   └── ⚙️ settings.js      # User settings
├── 📂 hooks/               # Custom React hooks
│   ├── 🔄 useRealtimeData.js
│   └── 🏆 useAchievements.js
├── 📂 docs/                # Documentation
│   ├── 📋 database-schema.sql
│   ├── 🔧 api-documentation.md
│   └── 🚀 deployment-guide.md
└── 📂 public/              # Static assets
    ├── 🖼️ images/
    └── 📱 icons/


---

## 🔧 Configuration

### Environment Variables

Create a .env.local file in the root directory:

env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Third-party Services
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
NEXT_PUBLIC_AI_SERVICE_URL=your_ai_detection_service


### Database Setup

1. *Create Supabase Project*: Visit [supabase.com](https://supabase.com)
2. *Run Schema*: Execute the SQL in docs/database-schema.sql
3. *Enable RLS*: Set up Row Level Security policies
4. *Configure Storage*: Create buckets for image uploads

---

## 📱 Core Features Guide

### 🔍 *Detection System*
javascript
// Example: Performing a plant scan
const result = await scanPlant(imageFile);
// Returns: { pest_type, confidence, risk_level, treatment_options }


### 🧮 *Treatment Calculator*
javascript
// Example: Calculate treatment requirements
const treatment = calculateTreatment({
  field_size: 2.5,        // hectares
  concentration: 2.0,     // percentage
  treatment_type: 'neem_oil'
});
// Returns: { ingredients, quantities, total_cost }


### 🏆 *Achievement Tracking*
javascript
// Example: Update user progress
await updateAchievement(userId, 'scan_master', newScanCount);
// Automatically unlocks achievements and sends notifications


---

## 📊 API Reference

### Detection Endpoints
- POST /api/detect - Analyze plant image
- GET /api/history - Retrieve detection history
- PUT /api/detection/:id - Update treatment status

### User Management
- POST /api/auth/signup - Create new account
- POST /api/auth/signin - User authentication
- GET /api/profile - User profile data
- PUT /api/profile - Update user settings

### Analytics
- GET /api/stats - Usage statistics
- GET /api/achievements - User achievements
- POST /api/achievements - Update progress

Full API documentation available in [docs/api-documentation.md](docs/api-documentation.md)

---

## 🌱 Usage Examples

### Basic Plant Detection
javascript
import { DetectionScanner } from '../components/DetectionScanner';

function MyFarmApp() {
  return (
    <DetectionScanner
      onDetectionComplete={(result) => {
        console.log(`Detected: ${result.pest_type}`);
        console.log(`Confidence: ${result.confidence}%`);
        console.log(`Risk Level: ${result.risk_level}`);
      }}
    />
  );
}


### Treatment Calculation
javascript
import { TreatmentCalculator } from '../components/TreatmentCalculator';

function TreatmentPlanner() {
  return (
    <TreatmentCalculator
      defaultFieldSize={1.5}
      onCalculationUpdate={(treatment) => {
        console.log(`Neem Oil: ${treatment.neem_oil_liters}L`);
        console.log(`Total Cost: $${treatment.total_cost}`);
      }}
    />
  );
}


---

## 🤝 Contributing

We welcome contributions from the farming and developer communities! Here's how you can help:

### 🐛 *Bug Reports*
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Add screenshots if applicable

### 💡 *Feature Requests*
- Suggest new farming tools and features
- Propose AI model improvements
- Share user experience insights

### 🔧 *Code Contributions*
1. Fork the repository
2. Create a feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

### 📋 *Development Guidelines*
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure mobile responsiveness

Detailed contribution guidelines in [CONTRIBUTING.md](CONTRIBUTING.md)

---

## 📈 Roadmap

### 🎯 *Phase 1: Core Features* (Current)
- [x] AI-powered pest detection
- [x] Treatment calculator
- [x] User authentication
- [x] Detection history
- [x] Achievement system

### 🚀 *Phase 2: Advanced Features* (Q3 2025)
- [ ] Weather integration
- [ ] Crop planning tools
- [ ] Community marketplace
- [ ] Expert consultation
- [ ] Mobile app (React Native)

### 🌟 *Phase 3: AI Enhancement* (Q4 2025)
- [ ] Predictive analytics
- [ ] Satellite imagery integration
- [ ] IoT sensor connectivity
- [ ] Multi-language support
- [ ] Offline AI models

### 🌍 *Phase 4: Global Expansion* (2026)
- [ ] Regional crop databases
- [ ] Local expert networks
- [ ] Government integration
- [ ] Cooperative farming tools
- [ ] Supply chain management

---

## 📖 Documentation

### 📚 *User Guides*
- [Getting Started](docs/getting-started.md)
- [Detection Guide](docs/detection-guide.md)
- [Treatment Calculator](docs/calculator-guide.md)
- [Achievement System](docs/achievements-guide.md)

### 🔧 *Developer Resources*
- [API Documentation](docs/api-documentation.md)
- [Database Schema](docs/database-schema.sql)
- [Deployment Guide](docs/deployment-guide.md)
- [Testing Guide](docs/testing-guide.md)

### 🌱 *Farming Resources*
- [Pest Identification Guide](docs/pest-guide.md)
- [Treatment Best Practices](docs/treatment-guide.md)
- [Seasonal Farming Calendar](docs/farming-calendar.md)

---

## 🆘 Support

### 💬 *Community Support*
- *Discord*: Join our [farming community](https://discord.gg/agrishield)
- *GitHub Discussions*: Ask questions and share experiences
- *Reddit*: Visit r/AgriShield for community discussions

### 🐛 *Bug Reports*
- *GitHub Issues*: Report bugs and feature requests
- *Email*: support@agrishield.app for urgent issues

### 📧 *Contact*
- *General Inquiries*: hello@agrishield.app
- *Business Partnerships*: partners@agrishield.app
- *Press & Media*: press@agrishield.app

---

## 📄 License

This project is licensed under the *MIT License* - see the [LICENSE](LICENSE) file for details.

### 🔓 *Open Source Commitment*
AgriShield is committed to supporting the global farming community through open-source technology. Feel free to use, modify, and distribute this software to help farmers worldwide.

---

## 🙏 Acknowledgments

### 🌟 *Special Thanks*
- *Agricultural Experts* who provided domain knowledge
- *Farmers* who tested and provided valuable feedback
- *Open Source Community* for amazing tools and libraries
- *Supabase Team* for the excellent backend platform

### 🔬 *Research Partnerships*
- International Institute of Tropical Agriculture
- Agricultural Research Centers worldwide
- University agricultural programs
- Local farming cooperatives

### 💚 *Environmental Impact*
AgriShield promotes sustainable farming practices and helps reduce pesticide usage through precise detection and treatment recommendations, contributing to environmental conservation and food security.

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/agrishield?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/agrishield?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/agrishield)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/agrishield)
![GitHub last commit](https://img.shields.io/github/last-commit/yourusername/agrishield)

*Made with 💚 for farmers worldwide*

---

Built with passion for sustainable agriculture and modern technology. Happy farming! 🌾
