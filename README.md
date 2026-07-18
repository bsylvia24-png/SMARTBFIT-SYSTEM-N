# Smart Fit Fashion Technology Platform

Smart Fit is an AI-powered luxury fashion tech application that bridges body-scan sizing calculations with verified clothing sellers to eliminate online sizing errors.

## Tech Stack
* **Frontend**: React (Vite), Tailwind CSS, TypeScript, React Router, Framer Motion
* **Backend**: Node.js, Express.js, MongoDB (Mongoose)
* **Auth**: JWT Authentication, bcrypt password hashing
* **Asset Storage**: Cloudinary (integrated for products and profiles)

---

## Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/smartfit
   JWT_SECRET=your_super_secure_jwt_secret_token
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web app in your browser at `http://localhost:5173`.

---

## Features Built
1. **AI Fit Recommendation**: Form & file upload inputs evaluating body silhouettes to produce accurate sizing metrics.
2. **Fashion Marketplace**: Responsive catalog, color/size tags, and a drawer checkout panel.
3. **Dashboards**:
   - **User Dashboard**: Profiles, Saved Sizing metrics, Wishlists, and Order histories.
   - **Seller Dashboard**: Add/Edit/Delete products and track customer orders.
   - **Admin Dashboard**: Toggle boutique verification statuses and view platform statistics.
