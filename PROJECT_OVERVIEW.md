# Smart Crop Advisory System - End-to-End Project Overview

## 1. Project Introduction
The **Smart Crop Advisory System** is a comprehensive agricultural web application designed to help farmers identify crop pests and diseases, receive actionable treatment recommendations, and manage their farming operations effectively. 

## 2. Technology Stack
This project follows the MERN (MongoDB, Express.js, React.js, Node.js) stack architecture.

### Backend
- **Node.js & Express.js**: Server environment and API framework.
- **MongoDB & Mongoose**: NoSQL database and ODM for schema modeling.
- **Multer**: Middleware for handling multipart/form-data, used for image uploads.
- **Bcrypt.js & JSONWebToken (JWT)**: Secure password hashing and user authentication.
- **Cors**: Cross-Origin Resource Sharing for frontend-backend communication.
- **Dotenv**: Environment variable management.

### Frontend
- **React.js**: User interface library (bootstrapped with Create React App).
- **React Router DOM**: Client-side routing for navigation.
- **Axios**: HTTP client for API requests.
- **Chart.js & Recharts**: Libraries for data visualization (Dashboard analytics).
- **React Icons**: Icon library for UI enhancement.
- **File-saver, JSPDF, HTML2Canvas, XLSX**: Utilities for exporting data (PDF, Excel, images).

## 3. Core Features & Capabilities

### 3.1 Authentication & Authorization
- Farmers and Admins can register and log in.
- Secure JWT token-based authentication.
- Passwords are encrypted using bcrypt.

### 3.2 Pest Detection Engine
- **Symptom-Based Detection**: Farmers can enter symptoms manually. The system features a custom NLP-like overlap scoring algorithm. It even includes a **Tamil-to-English translation map** to support local vernacular (e.g., translating "மஞ்சள் நிறமாதல்" to "yellowing").
- **Image-Based Detection**: Farmers can upload an image of the affected crop leaf. The image is processed on the backend, stored locally in the `uploads/` folder, and linked to potential pest matches.
- Matches are scored based on crop type and symptom severity to return the top recommendations.

### 3.3 Crop & Farm Management
- Farmers can track their land size, soil type, and location.
- **Crop Recommendations**: Based on soil type, location, and season.
- Provides fertilizer guidance and general farming tips.

### 3.4 Admin Panel & Dashboard
- View analytics using Charts.
- Manage Farmers (Create, Read, Delete).
- Manage Crops (Create, Read, Delete).
- Manage Pest Database (Create, Read, Delete).

## 4. Database Schema Structure
The MongoDB database uses four main schemas:
1. **User Schema**: General users (name, email, encrypted password, location, soil type, land size, role).
2. **Farmer Schema**: Duplicates user data specifically for farmer dashboard analytics.
3. **Crop Schema**: Crop details (soil type, location, season, cropName, fertilizer, tips).
4. **Pest Schema**: Pest intelligence (pestName, cropAffected, symptoms, treatment, organicSolution, chemicalSolution, prevention).

## 5. Supported Crops and Pests (Knowledge Base)
The application comes with a pre-seeded database of pests for major crops:
- **Rice**: Stem Borer, Brown Plant Hopper, Rice Leaf Folder, Rice Blast, Bacterial Blight, Rice Tungro Disease, Sheath Blight, False Smut, Rice Hispa, Green Leafhopper.
- **Cotton**: Cotton Bollworm, Aphids, Whitefly.
- **Maize**: Maize Borer, Fall Armyworm, Corn Borer.
- **Wheat**: Wheat Rust, Wheat Aphids, Powdery Mildew, Leaf Blight.

*(Seed script `seed-pests.js` automatically populates the MongoDB instance with this data).*

## 6. End-to-End API Architecture

### Authentication API
- `POST /api/auth/register` - Registers a new user/farmer.
- `POST /api/auth/login` - Authenticates a user and returns a JWT.
- `GET /api/auth/users` - Fetches all users.

### Pest Detection API
- `POST /api/detect-pest` - Analyzes text symptoms, calculates scores using term overlap/synonyms, and returns the top 3 matching pests.
- `POST /api/upload-pest` - Accepts an image upload via Multer, matches the crop, and returns pest suggestions.

### Data Management APIs
- **Farmers**: `GET`, `POST`, `DELETE` at `/api/farmers`
- **Crops**: `GET`, `POST`, `DELETE` at `/api/crops`
- **Pests**: `GET`, `POST`, `DELETE` at `/api/pests`
- **Recommendations**: `POST /recommend` (Returns crops based on soil, location, season).

## 7. Setup & Installation Guide

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally on `mongodb://127.0.0.1:27017` or cloud URI)

### Step-by-step Execution
1. **Clone & Install Backend Dependencies**:
   ```bash
   cd smart-crop-advisory
   npm install
   ```

2. **Install Frontend Dependencies**:
   ```bash
   cd client
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root folder with:
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/smartcrop
   PORT=5000
   JWT_SECRET=your_secure_secret_key
   ```

4. **Initialize the Database**:
   Run the seed script to populate the database with the predefined crops and pests.
   ```bash
   node seed-pests.js
   ```

5. **Start the Servers**:
   - **Backend** (Runs on port 5000):
     ```bash
     npm start
     # or
     node server.js
     ```
   - **Frontend** (Runs on port 3000):
     ```bash
     cd client
     npm start
     ```

6. **Access the Web App**: 
   Open `http://localhost:3000` in your browser.

## 8. Summary of Workflow
1. **User Onboarding**: A farmer registers with details like soil type and location.
2. **Dashboard**: The farmer logs in and sees a dashboard with crop recommendations tailored to their profile.
3. **Issue Detection**: If the farmer notices a sick plant, they navigate to the pest detection tool. They can either type symptoms (even in Tamil) or upload a photo of the affected leaf.
4. **Analysis**: The Node.js backend processes the input, compares it against the seeded MongoDB database, and scores the relevance.
5. **Advisory**: The frontend displays the detected pest, along with organic solutions, chemical treatments, and preventative measures.
6. **Admin oversight**: Administrators can monitor platform usage, manage the pest database, and maintain user records.
