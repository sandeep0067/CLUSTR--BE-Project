# Clustr — Learn & Teach Together

A skill-sharing social platform built with **React + Vite + Tailwind CSS**.

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build
```

## 📁 Project Structure

```
clustr/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── MainLayout.jsx     # Root layout with Outlet
│   │   │   ├── Navbar.jsx         # Top sticky navbar
│   │   │   ├── LeftSidebar.jsx    # Profile mini + nav links
│   │   │   └── RightSidebar.jsx   # Messages, Events, Top Teachers
│   │   ├── feed/
│   │   │   ├── StoriesBar.jsx     # Horizontal stories row
│   │   │   ├── Composer.jsx       # Post creation box
│   │   │   ├── SortBar.jsx        # Feed filter tabs
│   │   │   └── PostCard.jsx       # Individual post card
│   │   └── shared/
│   │       └── index.jsx          # VerifiedIcon, PostTypeBadge, Avatar, NavBadge
│   ├── data/
│   │   └── mockData.js            # All mock data (posts, users, messages, events)
│   ├── hooks/
│   │   └── usePosts.js            # useToggle, usePosts (like/save state)
│   ├── pages/
│   │   ├── FeedPage.jsx           # Main feed page
│   │   ├── ProfilePage.jsx        # User profile page
│   │   ├── ExplorePage.jsx        # Explore / discover page
│   │   └── MessagesPage.jsx       # Messages page
│   ├── App.jsx                    # Router setup
│   ├── main.jsx                   # ReactDOM entry
│   └── index.css                  # Tailwind directives + scrollbar styles
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🎨 Design System

| Token         | Value              |
|---------------|--------------------|
| Font (body)   | Plus Jakarta Sans  |
| Font (display)| Bricolage Grotesque|
| Brand blue    | `#1A6BFF`          |
| Background    | `#F4F2EE`          |
| Card white    | `#FFFFFF`          |
| Border        | `#E8E4DC`          |
| Text          | `#1A1814`          |
| Muted text    | `#6B6560`          |

## ✨ Post Types

| Type    | Badge                  | CTA button          |
|---------|------------------------|---------------------|
| query   | 🙋 Seeking to Learn    | 🎓 I Can Teach This |
| teach   | 🎓 Available to Teach  | 🙋 I Want to Learn  |
| discuss | 💬 Discussion           | Join Discussion     |
| learn   | 📚 Want to Learn        | 🎓 I Can Teach This |