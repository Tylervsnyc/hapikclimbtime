# 🧗‍♀️ Hapik Climbing Timer App

A fun climbing timer app for camp directors to track student climbing times on different walls!

## 🚀 What This App Does

This app helps camp directors:
1. **Select Students** - Choose which student to time
2. **Pick Walls** - Select which climbing wall to climb
3. **Time Climbs** - Use a big timer to track climbing times
4. **Save Results** - Store times and see student progress
5. **View Stats** - See best times, averages, and improvement

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app pages
│   ├── page.tsx          # Main page (select student)
│   ├── walls/            # Walls selection page
│   │   └── page.tsx      # Choose which wall to climb
│   └── climb/            # Timer page
│       └── page.tsx      # Main climbing timer
├── data/                  # Data management
│   ├── types.ts          # TypeScript type definitions
│   └── store.ts          # Data storage (temporary)
└── globals.css           # App styling with Hapik red theme
```

## 🎨 Key Features

- **Mobile-First Design** - Works great on phones and tablets
- **Hapik Red Theme** - Uses your brand colors
- **Big Timer Display** - Easy to read from across the room
- **Student Tracking** - Keep track of 7 students
- **4 Climbing Walls** - Real wall photos with fun names:
  - **Slight of Hand** - A tricky wall that requires finesse and precision
  - **Kubrik** - A challenging wall with unique holds and angles  
  - **Matrix** - A complex wall with multiple route options
  - **Vines** - A natural-feeling wall with flowing movements
- **Statistics** - Best times, averages, and progress tracking

## 🛠️ How to Run

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm run dev
   ```

3. **Open Your Browser**
   - Go to `http://localhost:3000`
   - The app will open on the Director's Page

## 📱 How to Use

### 1. Director's Page
- Select a student from the dropdown
- Click "Time [Student] on the Walls!"
- See today's climbing statistics

### 2. Walls Selection
- Choose which wall the student will climb
- See the student's stats on each wall
- Click on a wall to start timing

### 3. Climbing Timer
- **Left Side**: Wall image and climbing route design
- **Right Side**: Big timer and start/stop controls
- **Timer Format**: Shows seconds as "0123" then "1:23" for minutes
- **Save Results**: After stopping, choose to save or discard the time

## 🎯 For Students Learning to Code

### What to Look For:
- **React Hooks**: `useState`, `useEffect`, `useRef`
- **Component Structure**: How pages are organized
- **State Management**: How data flows through the app
- **CSS Classes**: Tailwind CSS styling
- **TypeScript**: Type definitions in `types.ts`

### Key Learning Points:
1. **Components**: Each page is a React component
2. **Props & State**: How data is passed around
3. **Event Handling**: Buttons, forms, and user interactions
4. **Routing**: How pages connect to each other
5. **Data Flow**: How information moves through the app

## 🔮 Future Features (Coming Soon!)

- **Real Database**: Replace temporary storage with a proper database
- **Wall Photos**: Add real pictures of your climbing walls
- **Student Management**: Add/remove students easily
- **Session Tracking**: Track different camp sessions
- **Data Export**: Download climbing reports
- **More Statistics**: Progress charts and improvement tracking

## 🎨 Customization

### Change Wall Names:
Edit `src/data/store.ts` and update the `WALLS` array

### Change Student Names:
Edit `src/data/store.ts` and update the `STUDENTS` array

### Change Colors:
Edit `src/app/globals.css` and update the CSS variables

## 🐛 Troubleshooting

- **App won't start**: Make sure you're in the right folder and run `npm install`
- **Timer not working**: Check the browser console for errors
- **Data not saving**: The app uses localStorage - make sure cookies are enabled

## 🚀 Deployment

When you're ready to share the app:
1. Run `npm run build`
2. Deploy to Vercel, Netlify, or your preferred hosting service

---

**Happy Climbing! 🧗‍♂️**

Built with ❤️ and Next.js for Hapik Climbing Camp
