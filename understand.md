# 🥛 SpectraCheck: Comprehensive Project Guide

Welcome to **SpectraCheck**! This document is designed to give anyone—from developers to business stakeholders—a complete understanding of what this project is, how it works, and the technology that powers it.

---

## 🎯 1. What is SpectraCheck?
SpectraCheck is a modern, low-cost platform designed to detect milk adulteration (like added water, urea, or starch). Traditional milk testing requires expensive laboratory equipment. SpectraCheck solves this by combining **smartphone cameras**, a simple **optical diffraction grating**, and **Artificial Intelligence (Machine Learning)** to analyze the spectral signature of milk samples in real-time.

It allows field agents, dairy farmers, and everyday consumers to perform lab-grade tests using just their phones, and instantly maps the results on a geographic dashboard to track adulteration trends across India.

---

## 🛠️ 2. The Technology Stack

This project is built using a modern, full-stack JavaScript/TypeScript architecture to ensure it is fast, scalable, and cross-platform compatible.

### Frontend (User Interface)
* **React.js & Vite**: The core framework for building the fast, interactive user interface. Vite is used for lightning-fast bundling.
* **TypeScript**: Ensures code reliability and prevents runtime bugs by enforcing strict typing.
* **Tailwind CSS**: Used for all styling. It allows for beautiful, responsive, and consistent UI design (including Dark Mode support).
* **Lucide React**: Provides clean, modern vector icons used throughout the app.
* **Capacitor**: A cross-platform native runtime. It takes this web application and wraps it into a native **Android APK**, allowing it to be installed on smartphones while sharing the exact same codebase.
* **Recharts**: Powers the dynamic "Spectrum Chart" visualization on the results page.

### Backend (Server & Database)
* **Node.js & Express**: A fast, lightweight server architecture that handles API requests, authentication, and communication with the database.
* **Prisma (ORM)**: The modern database toolkit used to define the schema and query the database efficiently.
* **PostgreSQL (Neon)**: A scalable, cloud-hosted relational database used to securely store user accounts, test history, and geographic data.
* **JWT & bcrypt**: Ensures secure user authentication and password hashing.

### Machine Learning / Inference (Simulated)
* **MobileNetV2 / EfficientNet-B0**: The theoretical AI models used for feature extraction from the spectral images.
* **Softmax Classifier**: Categorizes the spectrum into four classes: `PURE`, `WATER`, `UREA`, or `STARCH`.
*(Note: In the current demo phase, the AI inference is simulated deterministically based on the selected demo scenario to guarantee reliable presentations).*

### Infrastructure & Deployment
* **Frontend Hosting**: Vercel (or Netlify)
* **Backend Hosting**: Render
* **CI/CD**: GitHub Actions automatically compiles the Android APK (`build-android.yml`) and Vercel/Render automatically deploy the latest web changes whenever code is pushed to the `main` branch.

---

## ⚙️ 3. How the System Works (The User Flow)

Here is the exact journey a user takes when using SpectraCheck:

### Step 1: Preparation & Hardware Setup
The user places a small optical attachment (diffraction grating) over their smartphone camera lens. They place a milk sample in front of a consistent white light source. The grating splits the light passing through the milk into its core spectral colors (a rainbow).

### Step 2: Capture Spectrum
Using the SpectraCheck app, the user captures a photo of this spectrum. 
*(In the demo version, presenters can use the "Demo Sample Browser" to simulate uploading a perfect spectrum for Pure, Water, Urea, or Starch).*

### Step 3: AI Processing
1. **Image Preprocessing**: The app isolates the specific rainbow band from the photograph and normalizes the lighting.
2. **Feature Extraction**: The image is converted into a 1D intensity graph mapping wavelengths (400nm - 700nm). For example, Water absorbs specific red wavelengths, while Starch reflects differently.
3. **Classification**: The ML model analyzes these invisible peaks and troughs and matches them against known adulterant signatures.

### Step 4: Result Generation
The app instantly displays the result (e.g., "Urea Detected - 94% Confidence"). It visualizes the exact spectral curve on a graph so the user understands *why* the AI made that decision. 

### Step 5: Geographic Mapping
The result, along with the user's GPS location, is saved to the PostgreSQL database. It instantly appears on the central **Dashboard Map**. If an organized crime ring is adding Urea to milk in a specific city, health inspectors monitoring the dashboard will immediately see a cluster of red dots forming in that region and can take action.

---

## 📈 4. Core Features Summary
- 📸 **Camera/Upload Interface**: Seamlessly capture or upload spectrum images.
- 📊 **Dynamic Spectrum Visualization**: Beautiful charts showing original vs. processed wavelength data.
- 🗺️ **India-Wide Heatmap**: A geographic dashboard tracking pure vs. adulterated samples across the country.
- 📄 **PDF Reporting**: Instant generation of clean, printable A4 PDF reports for official record-keeping.
- 📱 **Cross-Device**: Works perfectly on Web, Mobile Browsers, and as an installable Android App.

---
> **To Developers:** If you are contributing to this project, ensure you run `npm run lint` and `npm run build` locally in the `client` folder before pushing to GitHub. The CI/CD pipelines have strict TypeScript checks and will fail if there are unused variables or imports!
