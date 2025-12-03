# Design Diagram Levels Explained

## D0: Context Diagram

**What it shows:**
The entire MealMatch platform as a single unit with three external actors:
- **Individuals** send location/search queries → receive meal listings and maps
- **Restaurants** send meal deals and updates → receive analytics
- **Shelters** send availability updates → receive management tools

It defines the system boundary and external interactions only.

---

## D1: Subsystem Diagram

**What it shows:**
The platform broken into 5 major subsystems:

1. **User Management** - Handles registration, authentication, and user profiles
2. **Meal Discovery** - Manages meal search, filtering, and recommendations
3. **Restaurant Portal** - Provides dashboard for restaurants to post meals
4. **Shelter Services** - Manages shelter availability and services
5. **Location Services** - Handles geospatial queries and mapping

Also shows:
- How subsystems connect to each other
- External dependencies (PostgreSQL + PostGIS, Google Maps API, JWT)

---

## D2: Component Diagram

**What it shows:**
Detailed breakdown of how each subsystem is implemented.

### Frontend Layer Components

**UI Components:**
- Individual React pages (Home.jsx, Login.jsx, MealSearch.jsx, etc.)
- Each page handles specific user interactions

**Map Module:**
- MealMap component - displays Google Maps
- Markers - color-coded pins (green = free, red = paid)
- InfoWindow - popup details when clicking markers

**Search Module:**
- Filters - location, radius, meal type inputs
- Results Display - renders meal cards
- Pagination - handles multiple result pages

**Services Layer:**
- authAPI - handles login/register API calls
- mealService - handles meal search/create API calls
- restaurantService - handles restaurant operations
- shelterService - handles shelter operations

### Backend Layer Components

**API Gateway (Express Server):**
- Routes incoming requests to correct controllers
- Applies middleware (authentication, rate limiting, CORS)
- Returns JSON responses

**Auth Module:**
- `register()` - Creates user account, hashes password, returns JWT token
- `login()` - Validates credentials, returns JWT token
- `refreshToken()` - Issues new access token
- `authenticateToken()` - Middleware that verifies JWT on protected routes
- `requireRole()` - Middleware that checks user has correct role

**Meal Module:**
- `searchMeals()` - Takes lat/lng/radius, uses PostGIS ST_DWithin to find meals within radius, calculates distance with ST_Distance, returns sorted results
- `createMeal()` - Validates meal data, inserts into database, returns meal ID
- `getMealById()` - Fetches single meal details
- `updateMeal()` - Modifies existing meal
- `deleteMeal()` - Soft deletes meal (sets is_active = false)
- `getRestaurantMeals()` - Gets all meals for a specific restaurant

**Shelter Module:**
- `getMyShelter()` - Returns shelter owned by current user
- `createShelter()` - Creates new shelter with PostGIS point for location
- `updateAvailability()` - Updates available bed count
- `updateShelter()` - Updates shelter information
- `getAllShelters()` - Public endpoint for searching shelters

**Restaurant Module:**
- `getMyRestaurant()` - Returns restaurant owned by current user
- `createRestaurant()` - Creates restaurant profile with location
- `updateRestaurant()` - Updates restaurant details

### Database Layer Components

**PostgreSQL Tables:**
- **users** - Stores accounts (id, email, password_hash, role, name)
- **meals** - Stores meal deals (id, restaurant_id, title, price, time_window, location)
- **restaurants** - Stores restaurant profiles (id, owner_id, name, address, location as PostGIS POINT)
- **shelters** - Stores shelter info (id, owner_id, name, total_beds, available_beds, services, location)

**PostGIS Functions:**
- `ST_MakePoint(lng, lat)` - Creates geographic point from coordinates
- `ST_DWithin(location, point, distance)` - Finds all points within distance radius
- `ST_Distance(location1, location2)` - Calculates distance between two points in meters

**Indexes:**
- Spatial index on all location columns for fast geospatial queries
- Standard indexes on foreign keys, email, active status

### External Services Components

**Google Maps API:**
- Provides map tiles for display
- Geocoding (address → coordinates)
- Reverse geocoding (coordinates → address)

**Supabase:**
- Hosts PostgreSQL database
- Provides connection pooling
- Handles database backups

**Railway:**
- Hosts backend Node.js server
- Auto-deploys on git push
- Manages environment variables

**Vercel:**
- Hosts frontend React application
- CDN distribution
- Auto-deploys on git push

---

## Key Technologies per Layer

| Layer | Components | Technology |
|-------|-----------|------------|
| **Frontend** | UI, Map, Search | React, Vite, React Router, Google Maps API |
| **Services** | API clients | Axios, Context API |
| **Backend** | Controllers, Middleware | Node.js, Express, JWT, bcrypt |
| **Database** | Tables, Queries | PostgreSQL, PostGIS |
| **Hosting** | Deployment | Vercel (frontend), Railway (backend), Supabase (database) |
