# Torre Data Pipeline

A full-stack data engineering project that collects, processes, and analyzes professional profiles from Torre.ai API, built with modern web technologies.

## 🚀 Features

- **Data Collection Pipeline**: Automated collection of professional profiles from Torre.ai
- **Real-time Analytics**: Generate insights about skills, languages, and seniority distribution
- **Interactive Dashboard**: Modern SPA with real-time data visualization
- **Automated Processing**: Smart profile completion detection and batch processing
- **Data Quality Metrics**: Track processing rates and data completeness

## 🛠 Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **MongoDB** with **Mongoose** for data storage
- **Zod** for data validation
- **Object-Oriented Programming** patterns

### Frontend
- **React** with **TypeScript**
- **Vite** for fast development
- **TailwindCSS** for styling
- **Axios** for API communication
- **Responsive Design** for mobile/desktop

## 📊 Data Insights Generated

- **Top Skills Analysis**: Most demanded skills in the market
- **Language Distribution**: Multilingual capabilities analysis
- **Seniority Levels**: Junior/Mid/Senior/Lead distribution
- **Profile Completeness**: Ranking by completion scores
- **Data Quality Metrics**: Processing rates and verification status

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Torre.ai API  │───▶│   Backend API   │───▶│   MongoDB       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  React Frontend │
                       └─────────────────┘
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- npm or yarn

## 📡 API Endpoints

### People Collection
- `POST /api/people/search` - Search people by query
- `POST /api/data/collect/people` - Collect and store people data

### Profile Management
- `GET /api/data/profiles/pending/status` - Check pending profiles
- `POST /api/data/collect/profiles/pending` - Auto-collect pending profiles
- `POST /api/data/process/profiles` - Process collected profiles

### Analytics
- `GET /api/data/insights` - Get all data insights
- `GET /api/data/stats` - Get pipeline statistics

## 🎯 Usage Flow

1. **Collect People**: Search for professionals using queries like "javascript developer"
2. **Check Status**: View how many profiles are pending collection
3. **Collect Profiles**: Automatically fetch complete profiles (genomes)
4. **Process Data**: Extract structured insights from collected data
5. **View Analytics**: Explore generated insights in the dashboard

## 📱 Dashboard Features

- **Control Panel**: Execute pipeline operations with real-time feedback
- **Insights Cards**: Visual representation of data analytics
- **Status Tracking**: Monitor collection and processing progress
- **Responsive Design**: Works on desktop and mobile devices

## 🎨 Design

- **Minimalist Dark Theme**: Professional appearance
- **Custom Color Palette**: #000000, #222222, #1DCD9F, #169976
- **Modern Typography**: Inter font family
- **Smooth Interactions**: Loading states and transitions

## 🔧 Development

### Backend Structure
```
backend/src/
├── controllers/     # Request handlers
├── models/         # Data models (OOP + Mongoose)
├── services/       # Business logic
├── routes/         # API routes
├── schemas/        # Zod validation schemas
└── types/          # TypeScript interfaces
```

### Frontend Structure
```
frontend/src/
├── components/     # React components
├── services/       # API communication
├── types/          # TypeScript interfaces
└── App.tsx        # Main application
```

## 📈 Data Pipeline

1. **Collection**: Fetch data from Torre.ai API with rate limiting
2. **Validation**: Validate all data using Zod schemas
3. **Storage**: Store in MongoDB with optimized indexes
4. **Processing**: Extract insights and calculate metrics
5. **Visualization**: Display results in interactive dashboard

---

**Built with ❤️ for Torre Technical Challenge**

