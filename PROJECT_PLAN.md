# 🧗‍♂️ Hapik Climbing App - Parent Authentication & Climber Management

## 📋 **Project Overview**
Transform the current single-user climbing app into a multi-user system where parents can sign up, add climbers, and track performance across all Industry City walls.

## 🎯 **Today's Goal (6-8 hours)**
Build a complete parent authentication system with climber management and enhanced analytics dashboard.

---

## 🏗️ **Phase 1: Parent Authentication System (2-3 hours)**

### **What We're Building:**
- User registration page (`/auth/register`)
- User login page (`/auth/login`)
- User session management
- Protected routes (only logged-in users can access climbing features)

### **Technical Implementation:**
- **Authentication**: Firebase Auth (email/password)
- **State Management**: React Context for user sessions
- **Protected Routes**: Middleware to check authentication
- **Database**: Store user data in Firebase Firestore

### **Files to Create/Modify:**
- `src/contexts/AuthContext.tsx` - User authentication context
- `src/app/auth/register/page.tsx` - Registration page
- `src/app/auth/login/page.tsx` - Login page
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/lib/authService.ts` - Firebase auth functions

### **User Flow:**
1. Parent visits app
2. Clicks "Sign Up" or "Login"
3. Creates account with email/password
4. Gets redirected to climber management

---

## 👥 **Phase 2: Climber Management System (2-3 hours)**

### **What We're Building:**
- Parent dashboard to manage climbers
- Add new climber functionality
- Edit/delete climber profiles
- Switch between climbers for timing

### **Technical Implementation:**
- **Data Structure**: Climbers stored in Firestore under user account
- **State Management**: Climber selection context
- **UI Components**: Climber management interface

### **Files to Create/Modify:**
- `src/contexts/ClimberContext.tsx` - Climber management context
- `src/app/dashboard/page.tsx` - Parent dashboard
- `src/components/ClimberManager.tsx` - Add/edit climbers
- `src/components/ClimberSelector.tsx` - Switch between climbers
- `src/data/types.ts` - Add Climber and User interfaces

### **Data Models:**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface Climber {
  id: string;
  userId: string; // Parent's user ID
  name: string;
  createdAt: Date;
}

interface ClimbRecord {
  id: string;
  climberId: string; // Now references climber, not student name
  wallId: string;
  wallName: string;
  timeInSeconds: number;
  timestamp: Date;
  sessionId: string;
}
```

---

## 📊 **Phase 3: Enhanced Analytics Dashboard (2-3 hours)**

### **What We're Building:**
- Manager view showing ALL climber data
- Performance analytics per wall
- Averages and trends across all users
- Industry City specific insights

### **Technical Implementation:**
- **Data Aggregation**: Combine data from all climbers
- **Charts**: Enhanced Chart.js visualizations
- **Filtering**: By date, wall, climber, etc.

### **Files to Modify:**
- `src/app/manager/page.tsx` - Enhanced with all-climber data
- `src/data/store.ts` - Updated analytics functions
- `src/components/AnalyticsCharts.tsx` - New chart components

### **New Analytics Features:**
- Total climbs across all users
- Most popular walls
- Average times per wall
- Top performing climbers
- Weekly/monthly trends

---

## 🔧 **Technical Stack & Dependencies**

### **Current Dependencies:**
- Next.js 15.4.6
- React 19.1.0
- Firebase 12.1.0
- Chart.js + react-chartjs-2
- Tailwind CSS

### **New Dependencies to Add:**
- `firebase/auth` - Authentication
- `firebase/firestore` - User and climber data

### **Firebase Collections:**
- `users` - Parent user accounts
- `climbers` - Climber profiles
- `climbs` - Climbing records (existing, but updated structure)

---

## 🚀 **Implementation Order**

### **Step 1: Setup Authentication Infrastructure**
1. Create AuthContext and auth service
2. Set up Firebase Auth configuration
3. Create basic login/register pages

### **Step 2: User Management**
1. Implement user registration
2. Implement user login
3. Add protected routes

### **Step 3: Climber Management**
1. Create ClimberContext
2. Build climber management UI
3. Integrate with existing climbing system

### **Step 4: Data Migration & Analytics**
1. Update existing climb records to use climber IDs
2. Enhance manager dashboard
3. Test all functionality

---

## 🧪 **Testing Checklist**

### **Authentication:**
- [ ] User can register new account
- [ ] User can login with existing account
- [ ] Protected routes redirect to login
- [ ] User session persists across page reloads

### **Climber Management:**
- [ ] Parent can add new climber
- [ ] Parent can edit climber details
- [ ] Parent can delete climber
- [ ] Climber selection works for timing

### **Climbing System:**
- [ ] Can time climbs for selected climber
- [ ] Climb records are saved with climber ID
- [ ] Existing functionality still works

### **Analytics:**
- [ ] Manager dashboard shows all climber data
- [ ] Charts display correctly
- [ ] Data filtering works

---

## 📁 **File Structure After Implementation**

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── manager/page.tsx
│   └── ...
├── components/
│   ├── ProtectedRoute.tsx
│   ├── ClimberManager.tsx
│   ├── ClimberSelector.tsx
│   └── ...
├── contexts/
│   ├── AuthContext.tsx
│   └── ClimberContext.tsx
├── lib/
│   ├── authService.ts
│   ├── firebase.ts
│   └── ...
└── data/
    ├── store.ts (updated)
    └── types.ts (updated)
```

---

## 🎯 **Success Criteria**

**By end of today, we'll have:**
✅ Parents can create accounts and log in  
✅ Parents can add multiple climbers to their account  
✅ Parents can time climbs for any climber  
✅ All climbing data is organized by climber  
✅ Manager dashboard shows comprehensive analytics  
✅ Industry City specific wall data  
✅ Performance averages and trends  

---

## 🆘 **If You Need to Start a New Chat**

**Share this document with the new AI and say:**
> "I'm building a climbing app with parent authentication. Here's my project plan. I need help continuing from where I left off. Can you look at my current codebase and help me implement the next phase?"

**The AI should:**
1. Read this PROJECT_PLAN.md file
2. Examine your current codebase
3. Identify what's already implemented
4. Help you continue with the next phase

---

## 📝 **Notes & Decisions Made**

- **Authentication Method**: Firebase Auth (email/password)
- **Database**: Firebase Firestore for user/climber data
- **State Management**: React Context for auth and climber selection
- **UI Framework**: Continue using existing Tailwind CSS styling
- **Charts**: Enhance existing Chart.js implementation

---

*Last Updated: [Current Date]*
*Project Status: In Progress*
*Next Phase: Phase 1 - Parent Authentication System*

