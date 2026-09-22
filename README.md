# Smart Crop Advisory System

A comprehensive agricultural advisory system that helps farmers detect crop pests and diseases, get treatment recommendations, and manage their farming operations.

## Features

### Pest Detection
- **Symptom-based detection**: Describe visible symptoms to identify pests
- **Image upload**: Upload leaf photos for visual pest identification
- **Comprehensive database**: 15+ common crop pests and diseases
- **Treatment recommendations**: Organic and chemical solutions
- **Prevention strategies**: Field-ready prevention tips

### Crop Management
- Add and manage different crops
- Soil type and location-based recommendations
- Seasonal crop planning
- Fertilizer guidance

### Admin Panel
- Manage farmers, crops, and pests
- Add new pests with detailed information
- User management
- Data analytics

## Supported Crops and Pests

### Rice
- Stem Borer
- Brown Plant Hopper
- Rice Leaf Folder
- Rice Blast (Disease)
- Bacterial Blight (Disease)

### Cotton
- Cotton Bollworm
- Aphids
- Whitefly

### Maize
- Maize Borer
- Fall Armyworm
- Corn Borer

### Wheat
- Wheat Rust (Disease)
- Wheat Aphids
- Powdery Mildew (Disease)
- Leaf Blight (Disease)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-crop-advisory
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/smartcrop
   PORT=5000
   JWT_SECRET=your_secret_key_here
   ```

5. **Seed the database with pest data**
   ```bash
   node seed-pests.js
   ```

6. **Start the backend server**
   ```bash
   npm start
   ```

7. **Start the frontend (in a new terminal)**
   ```bash
   cd client
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Pest Detection
- `POST /api/detect-pest` - Detect pest based on symptoms and crop
- `POST /api/upload-pest` - Upload image for pest detection

### Pest Management
- `GET /api/pests` - Get all pests
- `POST /api/pests` - Add new pest
- `DELETE /api/pests/:id` - Delete pest

### Crop Management
- `GET /api/crops` - Get all crops
- `POST /api/crops` - Add new crop
- `DELETE /api/crops/:id` - Delete crop

## Adding New Pests

You can add new pests through the Admin Panel or by modifying the `seed-pests.js` file and running it again.

Each pest entry should include:
- `pestName`: Name of the pest/disease
- `cropAffected`: Crop that is affected
- `symptoms`: Visible symptoms (comma-separated)
- `treatment`: General treatment steps
- `organicSolution`: Organic control methods
- `chemicalSolution`: Chemical control options
- `prevention`: Prevention strategies
- `imageUrl`: Optional image URL

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React.js, Axios, React Icons
- **Image Processing**: Multer for file uploads
- **Authentication**: JWT tokens
- **Styling**: CSS with responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.