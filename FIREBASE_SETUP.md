# Firebase Setup for Hapik Climbing App

## 🚀 **What This Gives You:**

✅ **Real-time data sharing** between all phones  
✅ **Instant updates** when anyone adds a climb time  
✅ **No more lost data** - everything syncs automatically  
✅ **Professional database** instead of local storage  

## 📱 **How It Works:**

1. **Phone A times Emma** on Matrix wall → **Saves to Firebase**
2. **Phone B automatically sees** Emma's new time
3. **Phone C opens app** → **Loads all current data**
4. **All devices stay in sync** in real-time!

## 🔧 **Setup Steps:**

### **Step 1: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it: `hapik-climbing-app`
4. Enable Google Analytics (optional)
5. Click "Create project"

### **Step 2: Add Web App**
1. Click the web icon (`</>`)
2. App nickname: `Hapik Climbing Web`
3. Check "Also set up Firebase Hosting" (optional)
4. Click "Register app"
5. **Copy the config object** - you'll need this!

### **Step 3: Enable Firestore Database**
1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for now)
4. Select a location close to you
5. Click "Enable"

### **Step 4: Update Config**
1. Open `src/lib/firebase.ts`
2. Replace the placeholder config with your real Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### **Step 5: Deploy**
1. Commit and push your changes
2. Vercel will automatically redeploy
3. Your app will now use Firebase!

## 🔒 **Security Rules (Later)**

For now, Firestore is in "test mode" which allows anyone to read/write. For production, you'll want to add security rules.

## 📊 **Data Structure**

Your climbing data will be stored in Firestore like this:

```
climbs/
  ├── climb1: {
  │     studentName: "Emma",
  │     wallId: "wall3",
  │     timeInSeconds: 45.23,
  │     weekId: "aug11-15",
  │     timestamp: "2024-08-11T..."
  │   }
  ├── climb2: {
  │     studentName: "Thalia",
  │     wallId: "wall7",
  │     timeInSeconds: 32.15,
  │     weekId: "aug11-15",
  │     timestamp: "2024-08-11T..."
  │   }
  └── ...
```

## 🎯 **Benefits After Setup:**

- **Multiple phones can time simultaneously**
- **All data syncs instantly**
- **No more "disappearing" times**
- **Professional, scalable solution**
- **Easy to add more features later**

## 🆘 **Need Help?**

If you run into issues:
1. Check the browser console for error messages
2. Verify your Firebase config is correct
3. Make sure Firestore is enabled
4. Check that your app is deployed with the new code

Once this is set up, your Hapik climbing app will be a **real-time, multi-device solution** that camp directors will love! 🎉
