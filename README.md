# Releans Project

![Project Logo](https://releans.com/img/logos/logo-57.png)

Welcome to the Releans Project! This repository houses a dynamic web application built using Laravel and React. It serves as a platform for Inventory Management System.

## Features

- **Feature 1: Full Notification**  
  This feature provides comprehensive notification functionality, including real-time updates, customizable alerts, and user-friendly notifications. Stay informed about important events and changes within the application effortlessly
- **Feature 2:** Stock Tracking
- **Feature 3:** Order Fulfillment
- **Feature 4:** Reporting
- **Feature 5:** Product Catalog Management
- **Feature 6:** Authentication and Authorization Use Passport

## Installation

Follow these steps to set up and run the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Ahmad-Altamimi1/Releans_Project.git
   ```

2. **Install dependencies:**

   - **Frontend:** Navigate to the `frontend` directory and install dependencies using npm or yarn.

   ```bash
   cd frontend
   npm install
   # or
   yarn install
   ```

   - **Backend:** Navigate to the `backend` directory and install Laravel dependencies using Composer.

   ```bash
   cd backend
   composer install

   ```

3. **Environment setup:**

   ```bash

   ```

cp .env.example .env

php artisan key:generate

# Step 3: Configure Frontend URLs in your environment

# Add the following line to your `.env` file:

# FRONTEND_URLS="Your front end URL"

# For example in this case:

```bash

FRONTEND_URLS=http://localhost:3000

```

4. **Run migrations and seeders:**

   ````

   ```bash
   php artisan migrate:fresh --seed

   ````

5. **Create Personal Access Client:**
   ```bash
   php artisan passport:client --personal
   ```
6. **Start the development servers:**

   - **Frontend:** Run the React development server.

   ```bash
   npm start
   # or
   yarn start
   ```

   - **Backend:** Start the Laravel development server.

   ```bash
   php artisan serve
   ```

7. **Access the application:**
   Open your browser and navigate to `http://localhost:3000` to view the application.
