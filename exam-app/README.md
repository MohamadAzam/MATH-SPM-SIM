# SPM Math/Add Math Exam Simulator

A comprehensive SPM Mathematics and Additional Mathematics exam simulator built with Next.js and Material Tailwind. This application provides a realistic exam experience with random question generation, timed interface, and detailed performance analysis.

## 🌟 Features

### ✅ Complete Exam Simulation
- **10 Random Questions**: Each exam session generates exactly 10 random questions
- **Mixed Question Types**: Support for both Multiple Choice Questions (MCQ) and subjective questions
- **Question Shuffling**: Options are randomized using `array.sort(() => Math.random() - 0.5)` as specified
- **Topic Coverage**: All major SPM Math/Add Math topics included

### ⏱️ Timed Exam Experience  
- **90-minute Timer**: Realistic SPM exam duration
- **Visual Warnings**: 15-minute warning with color changes and alerts
- **Auto-Submit**: Exam automatically submits when time expires
- **Full-Screen Mode**: Immersive exam environment

### 📊 Comprehensive Results Analysis
- **Automatic Grading**: Real-time scoring with SPM grading scale (A+ to G)
- **Weak Areas Analysis**: Identifies topics needing improvement
- **Bahasa Malaysia Explanations**: All explanations start with "Ini cara dapat jawapan:"
- **Detailed Review**: Question-by-question answer review with explanations

### 🎨 Professional UI/UX
- **Material Tailwind Components**: Consistent, modern design
- **Responsive Design**: Works on desktop and mobile devices
- **Progress Tracking**: Visual indicators for answered questions
- **Navigation System**: Easy movement between questions

### 💾 Smart Data Management
- **Local Storage**: Saves exam progress automatically
- **Exam History**: Tracks previous attempts
- **Export Results**: Download detailed performance reports
- **State Recovery**: Resume interrupted exams

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MohamadAzam/MATH-SPM-SIM.git
   cd MATH-SPM-SIM/exam-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Gemini API (Optional)**
   - Create a `.env.local` file in the exam-app directory
   - Add your Gemini API key:
     ```
     NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
     ```
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

## 📱 How to Use

### Starting an Exam
1. Visit the exam simulator homepage
2. Click "Jana Soalan Baru" to generate fresh questions
3. Review the exam instructions
4. Click "Mula Peperiksaan" to begin

### During the Exam
- **Answer Questions**: Use radio buttons for MCQ, text area for subjective
- **Navigate**: Use "Sebelumnya"/"Seterusnya" buttons or click question numbers
- **Monitor Time**: Timer shows remaining time with visual warnings
- **Full Screen**: Click the full screen button for immersive experience
- **Submit**: Click "Hantar Peperiksaan" when ready

### Viewing Results
- **Overall Score**: See percentage score and SPM grade
- **Statistics**: View detailed performance metrics
- **Weak Areas**: Identify topics needing improvement  
- **Detailed Review**: Click "Tunjukkan" to see answer explanations
- **Export**: Download results for record keeping
- **Retake**: Click "Cuba Lagi" for a new attempt

## 🏗️ Project Structure

```
exam-app/
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/exam/     # Exam-related components
│   │   ├── ExamGenerator.tsx    # Question generation & startup
│   │   ├── ExamInterface.tsx    # Main exam container
│   │   ├── QuestionDisplay.tsx  # Individual question renderer
│   │   ├── TimerComponent.tsx   # Countdown timer with warnings
│   │   └── ResultsReport.tsx    # Results analysis & review
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   │   ├── constants.ts        # Exam configuration constants
│   │   ├── examHelpers.ts      # Core exam logic utilities
│   │   └── geminiApi.ts        # API integration with fallback
│   └── tailwind.config.ts  # Tailwind CSS configuration
```

## 🧠 AI Integration

### Gemini API Integration
- **Smart Question Generation**: Uses Google's Gemini Pro model
- **SPM-Focused Prompts**: Generates questions based on 2021-2025 syllabus
- **Fallback System**: 10 pre-built questions if API unavailable
- **Error Handling**: Graceful degradation without API key

### Question Format
Questions are generated with this structure:
```typescript
{
  id: string,
  type: 'mcq' | 'subjective',
  topic: string,
  difficulty: 'easy' | 'medium' | 'hard',
  question: string,
  options?: string[], // for MCQ only
  correctAnswer: string,
  explanation: string, // in Bahasa Malaysia
  marks: number
}
```

## 🔧 Configuration

### Exam Settings (constants.ts)
- **Total Questions**: 10 per exam
- **Duration**: 90 minutes
- **Warning Time**: Last 15 minutes
- **Difficulty Distribution**: 3 easy, 5 medium, 2 hard
- **Topics**: Algebra, Geometry, Trigonometry, Statistics, etc.

### Grading Scale
Standard SPM grading: A+ (90-100%), A (80-89%), A- (70-79%), B+ (65-69%), B (60-64%), C+ (55-59%), C (50-54%), D (45-49%), E (40-44%), G (0-39%)

## 🛠️ Technology Stack

- **Framework**: Next.js 15.4.7 with App Router
- **Styling**: Tailwind CSS + Material Tailwind
- **Language**: TypeScript
- **AI Integration**: Google Gemini Pro API
- **Icons**: Lucide React
- **State Management**: React Hooks + Local Storage
- **Build Tool**: Turbopack (dev), Webpack (production)

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🎯 Key Features Implementation

### Question Randomization
- Implements exact requirement: `array.sort(() => Math.random() - 0.5)`
- Shuffles both question order and MCQ options
- Ensures different experience each attempt

### Timing System
- Accurate countdown timer with second precision
- Visual progress bar showing remaining time
- Color-coded warnings (blue → orange → red)
- Automatic submission on time expiry

### Responsive Design
- Mobile-first approach with Material Tailwind
- Adapts to different screen sizes
- Touch-friendly interface for mobile users
- Maintains functionality across devices

### Bahasa Malaysia Support
- All explanations start with "Ini cara dapat jawapan:"
- Interface text in Bahasa Malaysia
- Culturally appropriate messaging and feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For questions or support, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ for SPM students in Malaysia**
