# MealMatch: A Food Security Platform

**Name**: Rohin Senthil

**Advisor**: Professor Nitin

**As of right now, no costs have been incurred. All free trials/services have been utilized.**

## Overview

MealMatch is a web-based platform designed to address food insecurity by connecting individuals in need with affordable meals, restaurant deals, and shelter services in their community. The platform serves as a bridge between three key user groups: individuals seeking assistance, restaurants offering discounted or free meals, and shelters providing meals and housing services.

---

## Problem Statement

Food insecurity affects millions of people who struggle to find information about available meal programs, discounted food options, and shelter services in their area. Current solutions are fragmented across multiple websites, phone hotlines, and word-of-mouth, making it difficult for people in need to quickly find help. Additionally, restaurants and shelters lack a centralized platform to advertise their services to those who need them most.

---

## Solution

MealMatch provides a unified, location-based search platform where:

- **Individuals** can search for free meals, discounted restaurant deals, and shelter services near their location
- **Restaurants** can post time-limited meal deals and promotions to reduce food waste while helping the community
- **Shelters** can advertise their services, update bed availability in real-time, and share meal schedules

---

## Key Features

### 1. Location-Based Search
Users can search for meals and shelters within a specified radius using GPS or manual coordinates

### 2. Interactive Map Integration
Google Maps integration displays all available resources visually with color-coded markers

### 3. Real-Time Updates
Restaurants can post meal deals with time windows; shelters can update bed availability instantly

### 4. Role-Based Dashboards
Separate interfaces for individuals, restaurants, and shelters with relevant features for each

### 5. Comprehensive Information
Detailed listings include meal times, dietary options, services offered, contact information, and directions

---

## Technology Stack

### Frontend
- React with Vite
- Responsive design for mobile and desktop
- React Router for navigation
- Google Maps API integration

### Backend
- Node.js with Express
- RESTful API architecture
- JWT-based authentication
- Role-based access control middleware

### Database
- PostgreSQL with PostGIS extension
- Geospatial queries for location-based search
- Hosted on Supabase

### Authentication & Security
- JWT-based secure authentication
- bcrypt password hashing
- Role-based access control (individual, restaurant, shelter)
- Rate limiting and CORS protection

### External Services
- Google Maps API for mapping and geocoding
- Supabase for database hosting and real-time features
- Railway for backend deployment
- Vercel for frontend deployment

---

## Impact

MealMatch aims to reduce food insecurity by making it easier for people to find assistance when they need it, while helping restaurants and shelters maximize their community impact. The platform reduces the time and effort required to locate food resources from hours to minutes.

### Expected Outcomes
- **Faster Access to Food**: Reduce search time from hours to minutes
- **Reduced Food Waste**: Help restaurants donate surplus food instead of discarding it
- **Increased Shelter Utilization**: Connect people with available shelter beds in real-time
- **Community Connection**: Bridge the gap between those in need and available resources
- **Data-Driven Insights**: Enable better resource allocation based on usage patterns

---

## Target Users

### 1. Individuals Seeking Assistance
- People experiencing food insecurity
- Those seeking affordable meal options
- Individuals needing shelter services
- Community members looking for discounted food

### 2. Restaurant Owners
- Restaurants with surplus food to donate
- Establishments offering community meal programs
- Food service providers wanting to reduce waste
- Businesses looking to give back to their community

### 3. Shelter Administrators
- Homeless shelters
- Emergency housing facilities
- Community service organizations
- Non-profit organizations providing meals and services

---

## Project Goals

1. **Accessibility**: Make food and shelter resources easily discoverable
2. **Efficiency**: Streamline the process of finding and offering assistance
3. **Real-Time Information**: Ensure availability data is current and accurate
4. **User-Friendly**: Create intuitive interfaces for all user types
5. **Scalability**: Build a system that can grow with community needs
6. **Privacy**: Protect user data and maintain dignity for those seeking help

---

## Success Metrics

- Number of meals discovered and claimed through the platform
- Reduction in time to find food resources
- Number of restaurants and shelters actively participating
- User satisfaction ratings
- Geographic coverage and accessibility
- Platform usage and engagement statistics

---

## Future Enhancements

- Mobile native applications (iOS/Android)
- Multi-language support for diverse communities
- SMS notifications for new meal availability
- Integration with food bank networks
- Volunteer coordination features
- Donation and fundraising capabilities
- Analytics dashboard for community impact tracking
