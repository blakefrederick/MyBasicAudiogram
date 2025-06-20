# MyBasicAudiogram - Hearing Test App

A web application for tracking hearing thresholds over time, built with Next.js, React, Web Audio API, and Chart.js.

## Very Important

Sudden hearing loss is a medical emergency. Seek immediate medical attention, as early treatment is critical. This application is for informational purposes only and should not be used for diagnosis. Accurate hearing assessments require a trained professional, specialized equipment, and a controlled clinical environment. Results from this app do not reflect your true hearing ability.

## Features

- **Hearing Test**: Test both ears across multiple frequencies (250Hz to 8000Hz)
- **Headphone Tracking**: Ensures consistent testing by tracking which headphones are used
- **Volume Calibration**: Calibrate system volume for consistent test results
- **Session History**: View and compare previous test results
- **Data Visualization**: Interactive audiogram charts to visualize hearing thresholds
- **Data Export**: Export session data in JSON or CSV format

## Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

1. **Headphone Selection**: Enter your headphone model for consistent testing
2. **Volume Calibration**: Set a reference volume level for accurate comparisons
3. **Frequency Testing**: For each frequency and ear:
   - Play a tone
   - Adjust the volume until you can barely hear it
   - Click "I Heard It" to record your threshold
4. **Results**: View your audiogram and compare with previous tests

## Very Important Reiteration

- This is NOT a medical diagnostic tool
- Consult a healthcare professional immediately about hearing concerns
- Always use the same headphones for consistent results
- Test in a quiet environment

## Technology Stack

- **Next.js** (App Router): React framework for the frontend
- **Web Audio API**: For generating sine tones at specific frequencies
- **Chart.js**: For audiogram visualization
- **localStorage**: For persisting test sessions

## Again, Important

- This is NOT a medical diagnostic tool
- Consult a healthcare professional immediately about hearing concerns
