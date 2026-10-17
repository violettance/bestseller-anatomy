# 📚 Bestseller‑Anatomy

A static showcase of narrative analysis across bestselling fiction. The site displays precomputed, interactive charts and a sample book-analysis dashboard. Its manuscript analyzer reads plain-text files locally in the browser and does not require a backend.

## 🚀 Live Demo

👉 Analysis showcase: [https://bestseller-anatomy.vercel.app/](https://bestseller-anatomy.vercel.app/)

The demo has two main features:
- **Anatomy of a Bestseller** – Explore detailed insights and patterns from our analysis of successful novels, revealing the key elements that make stories resonate with readers

![Anatomy of a Bestseller](public/images/tab-1.png)

- **Analyze My Book** – Select a `.txt` manuscript to calculate word and sentence counts, estimated reading time, and chapter lengths in the browser. The manuscript is not uploaded. The example dashboard shown before analysis uses sample data.

![Analyze My Book](public/images/tab-2.png)

## 🔮 Coming Soon

### Predictive Analytics Engine
- **Bestseller Probability Score**: Get an AI-powered prediction of your manuscript's potential success
- **Success Factors Analysis**: Understand which elements contribute to or detract from your book's bestseller potential
- **Comparative Market Analysis**: See how your book compares to current market trends
- **Optimization Suggestions**: Receive data-driven recommendations to improve your manuscript's market potential

### Browser-only analysis
The local analyzer calculates basic structural statistics from a selected `.txt` file. It does not calculate qualitative measures such as emotion, tension, or literary quality. More advanced AI predictions would require a model that can run in the browser or an external service.

## 🔍 Project Architecture

### Planned analysis engine (not included in the current app)

The analysis engine is not included in this repository or required by the current static showcase. The research notes below describe the project’s analysis approach; they do not indicate a running backend.

#### Research Foundation
- Analyzed 80 contemporary bestsellers (≈ 8.3 M words)
- Developed proprietary scoring algorithms
- Implemented advanced NLP techniques

#### Technical Stack
| Category | Libraries/Tools | Purpose |
|----------|----------------|---------|
| Deep Learning & NLP | PyTorch, Transformers | BERT-based text analysis and inference |
| Scientific Computing | NumPy, SciPy | Numerical operations and statistical analysis |
| Data Processing | Pandas | Data manipulation and analysis |
| Classical ML & Statistics | scikit-learn, XGBoost | Model preparation, metrics, and feature importance |
| Feature Analysis | SHAP (SHapley Additive exPlanations) | Feature importance and model interpretation |
| Dimensionality Reduction | PCA, UMAP, t-SNE | High-dimensional data visualization and pattern discovery |
| Language Modeling | SpaCy, Gensim, NLTK | Tokenization, embeddings, word vectors |
| Visualization | Matplotlib, Plotly | Statistical plots, interactive visualizations, and analysis dashboard |
| System Tools | os, pathlib, json, re, time | File management, regex, debugging |
| Environment | Google Colab GPU | CUDA acceleration for processing |

#### Key Capabilities
- Chapter-level sentiment analysis
- Emotional arc tracking
- Pacing and tension measurement
- Style and readability metrics
- Temporal and sensory analysis

#### Output Metrics
- ~100 raw metrics per chapter
- ~200 derived features
- Statistical validation
- Pattern recognition
- Archetype identification

### Current static showcase

This repository contains the static web interface and its bundled chart data. It provides:

#### Features
- Precomputed chart data served from `public/charts/`
- Sample book dashboard data stored in the frontend
- Local `.txt` manuscript statistics, calculated in the browser without uploading the file
- Interactive visualizations
- Comprehensive dashboards
- Export capabilities

#### Technical Implementation

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Next.js 14, React 19 | User interface and interactions |
| Chart data | Local JSON files | Bundled with the site; no runtime database request |
| Sample dashboard | Local TypeScript data | Demonstration metrics only |
| Visualization | Plotly.js, Recharts | Interactive charts |

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Component Library**: Radix UI
- **Form Handling**: React Hook Form with Zod validation
- **Data Visualization**: Plotly.js, Recharts
- **Data**: Local JSON and TypeScript files; no backend required
- **State Management**: React Hooks
- **Date Handling**: date-fns

## 📦 Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd bestseller_anatomy
```

2. Install dependencies:
```bash
pnpm install
```

No environment variables are required for the current static showcase.

## 🏃‍♂️ Development

Run the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Build

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## 📁 Project Structure

```
bestseller_anatomy/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
│
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── tabs/             # Tab-related components
│   ├── book-dashboard.tsx    # Book analysis dashboard
│   ├── chart-viewer.tsx      # Data visualization components
│   ├── nav-tabs.tsx          # Navigation components
│   ├── podcast-player.tsx    # Audio content player
│   └── table-of-contents.tsx # Content navigation
│
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── public/              # Static assets
├── styles/              # Global styles and Tailwind configurations
│
├── next.config.mjs      # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── postcss.config.mjs   # PostCSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## 📊 Data Visualization

The web interface includes multiple visualization types for comprehensive analysis:

### Distribution Analysis
- **Scatter/Bubble Plots**: Readability vs. length distribution, cluster analysis
- **Box/Violin Plots**: Chapter length distribution, word count variance

### Progress Analysis
- **Line/Area Charts**: Emotional flow, pacing variations, peak points across chapters
- **Timeline/Step Charts**: Structural turning points (Disturbance, Doorways, Midpoint)
- **Progress Indicators**: Chapter-by-chapter advancement

### Comparative Analysis
- **Bar/Column Charts**: Genre-based average reading times, feature comparisons
- **Stacked/100% Stacked Bars**: Character traits, narrative POV, mood distributions
- **Donut/Pie Charts**: Sensory balance (visual-auditory-tactile ratios)

### Key Metrics
- **KPI Cards**: 
  - Readability scores
  - Word counts
  - Average chapter length
  - Key success metrics

### Interactive Features
- Zoom and pan capabilities
- Tooltip information
- Dynamic filtering
- Export functionality

## 📝 License

GNU General Public License v3.0 (GPL-3.0)

This project is licensed under the GPL-3.0 License. Commercial use is not permitted.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ℹ️ Note

This repository contains only the web interface code. The analysis engine that powers the metrics is proprietary and not included in this repository.
