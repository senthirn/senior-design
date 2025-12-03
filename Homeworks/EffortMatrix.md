# Effort Matrix - MealMatch Project

## Effort Distribution by Phase

| Phase | Backend Hours | Frontend Hours | Integration Hours | Testing Hours | Documentation Hours | Total Hours |
|-------|---------------|----------------|-------------------|---------------|---------------------|-------------|
| Phase 1: Planning & Setup | 8 | 4 | 0 | 0 | 16 | 28 |
| Phase 2: Backend Development | 80 | 0 | 0 | 10 | 10 | 100 |
| Phase 3: Frontend Development | 0 | 80 | 0 | 10 | 5 | 95 |
| Phase 4: Integration & Testing | 10 | 10 | 20 | 20 | 5 | 65 |
| Phase 5: Deployment | 12 | 8 | 8 | 10 | 12 | 50 |
| **TOTAL** | **110** | **102** | **28** | **50** | **48** | **338** |

---

## Detailed Task Effort Matrix

| Task ID | Task Name | Assigned Role | Estimated Hours | Actual Hours | Variance | Status |
|---------|-----------|---------------|-----------------|--------------|----------|--------|
| 1.1 | Requirements gathering | Team Lead | 16 | 16 | 0 | Complete |
| 1.2 | Tech stack setup | Full Stack Dev | 8 | 8 | 0 | Complete |
| 1.3 | Database design | Backend Dev | 16 | 14 | -2 | Complete |
| 2.1 | Database implementation | Backend Dev | 24 | 20 | -4 | Complete |
| 2.2 | Authentication system | Backend Dev | 24 | 22 | -2 | Complete |
| 2.3 | User management API | Backend Dev | 16 | 14 | -2 | Complete |
| 2.4 | Meal management API | Backend Dev | 32 | 28 | -4 | Complete |
| 2.5 | Restaurant management API | Backend Dev | 24 | 24 | 0 | Complete |
| 2.6 | Shelter management API | Backend Dev | 24 | 26 | +2 | Complete |
| 2.7 | API testing and documentation | Backend Dev | 16 | 12 | -4 | Complete |
| 3.1 | Frontend project setup | Frontend Dev | 8 | 6 | -2 | Complete |
| 3.2 | Authentication UI | Frontend Dev | 24 | 20 | -4 | Complete |
| 3.3 | Home and landing page | Frontend Dev | 16 | 14 | -2 | Complete |
| 3.4 | Meal search interface | Frontend Dev | 24 | 22 | -2 | Complete |
| 3.5 | Google Maps integration | Frontend Dev | 24 | 28 | +4 | Complete |
| 3.6 | Restaurant dashboard | Frontend Dev | 32 | 30 | -2 | Complete |
| 3.7 | Shelter dashboard | Frontend Dev | 24 | 24 | 0 | Complete |
| 3.8 | Shelter search interface | Frontend Dev | 16 | 14 | -2 | Complete |
| 3.9 | Responsive design and polish | Frontend Dev | 24 | 22 | -2 | Complete |
| 4.1 | Frontend-Backend integration | Full Stack Dev | 16 | 18 | +2 | Complete |
| 4.2 | End-to-end testing | Full Stack Dev | 16 | 16 | 0 | Complete |
| 4.3 | Bug fixes and optimization | Full Stack Dev | 24 | 20 | -4 | Complete |
| 5.1 | Backend deployment | Backend Dev | 8 | 10 | +2 | Complete |
| 5.2 | Frontend deployment | Frontend Dev | 8 | 6 | -2 | Complete |
| 5.3 | Database migration to production | Backend Dev | 4 | 3 | -1 | Complete |
| 5.4 | Production testing | Full Stack Dev | 8 | 8 | 0 | Complete |
| 5.5 | Documentation and handoff | Team Lead | 12 | 14 | +2 | Complete |
| | **TOTAL** | | **338** | **325** | **-13** | |

---

## Effort Distribution by Team Member

| Team Member Role | Planned Hours | Actual Hours | Variance | % of Total Project | Efficiency |
|------------------|---------------|--------------|----------|-------------------|------------|
| Backend Developer | 110 | 105 | -5 | 32.3% | 104.8% |
| Frontend Developer | 102 | 98 | -4 | 30.2% | 104.1% |
| Full Stack Developer | 78 | 82 | +4 | 25.2% | 95.1% |
| Team Lead | 48 | 40 | -8 | 12.3% | 120.0% |
| **TOTAL** | **338** | **325** | **-13** | **100%** | **104.0%** |

*Note: Efficiency = (Planned Hours / Actual Hours) × 100%. Higher percentage indicates completing work faster than estimated.*

---

## Team Roles and Responsibilities

| Team Member Role | Primary Responsibilities | Secondary/Support Responsibilities | Skills Required |
|------------------|-------------------------|-----------------------------------|-----------------|
| **Team Lead** | Project planning, requirements gathering, timeline management, documentation, stakeholder communication | Integration testing, quality assurance | Project management, documentation, communication |
| **Backend Developer** | API development, database design/implementation, server configuration, backend deployment | API documentation, unit testing | Node.js, Express, PostgreSQL, PostGIS, REST APIs |
| **Frontend Developer** | UI/UX design, React component development, client-side logic, frontend deployment | Frontend testing, responsive design | React, JavaScript, CSS, HTML, UI/UX design |
| **Full Stack Developer** | System integration, end-to-end testing, performance optimization, DevOps | Support both frontend and backend teams | Full stack development, testing, DevOps |

---

## Workload Distribution Chart
```
Backend Developer:     ████████████████████████████████░░░░ (105 hours)
Frontend Developer:    ██████████████████████████████░░░░░░ (98 hours)
Full Stack Developer:  ████████████████████████░░░░░░░░░░░░ (82 hours)
Team Lead:             ████████████░░░░░░░░░░░░░░░░░░░░░░░░ (40 hours)

Total Project Effort: 325 hours
```

---

## Task Dependencies

| Task | Depends On | Blocks | Critical Path |
|------|-----------|--------|---------------|
| Database Design | Requirements complete | Database implementation | Yes |
| Database Implementation | Database design | All backend APIs | Yes |
| Authentication System | Database implementation | All protected endpoints | Yes |
| Meal Management API | Authentication system | Meal search UI | Yes |
| Restaurant API | Authentication system | Restaurant dashboard | No |
| Shelter API | Authentication system | Shelter dashboard | No |
| Frontend Setup | Tech stack selected | All frontend components | Yes |
| Auth UI | Frontend setup, Auth API | User-specific features | Yes |
| Meal Search UI | Frontend setup, Meal API | Integration testing | Yes |
| Google Maps | Frontend setup, API key | Map-based features | No |
| Integration | All backend + frontend | Production deployment | Yes |
| Backend Deployment | All backend complete | Frontend deployment | Yes |
| Frontend Deployment | Backend deployed | Production testing | Yes |

---

## Weekly Hour Breakdown

| Week | Backend Hours | Frontend Hours | Integration/Testing | Documentation | Total Weekly Hours |
|------|---------------|----------------|---------------------|---------------|--------------------|
| Week 1 | 8 | 4 | 0 | 16 | 28 |
| Week 2 | 48 | 0 | 0 | 4 | 52 |
| Week 3 | 44 | 0 | 0 | 6 | 50 |
| Week 4 | 20 | 26 | 0 | 0 | 46 |
| Week 5 | 0 | 44 | 0 | 2 | 46 |
| Week 6 | 4 | 24 | 26 | 6 | 60 |
| Week 7 | 13 | 6 | 8 | 16 | 43 |
| **Total** | **137** | **104** | **34** | **50** | **325** |
