# 🤫 Anonymous Confession Website

A beautiful, modern React-powered confession platform with GraphQL backend integration. Users can anonymously share their thoughts, comment on confessions, and search through content in a safe, supportive environment.

## ✨ Features

### 🔐 Authentication System
- **Password-less authentication** using username and secret code
- **JWT token-based** session management
- **Persistent login** with local storage
- **Protected routes** for authenticated operations

### 📝 Confession Management
- **Create confessions** anonymously with rich text support
- **Edit your own confessions** with real-time updates
- **Delete confessions** you've created
- **View all confessions** in a beautiful card-based layout

### 💬 Interactive Comments
- **Add comments** to any confession (authenticated users only)
- **View comments** in elegant modal dialogs
- **Real-time comment updates** with automatic refresh

### 🔍 Advanced Search
- **Search by content** - Find confessions by keywords
- **Search by username** - Filter by specific users
- **Real-time filtering** as you type
- **Search result counter** showing match statistics
- **Clear search** functionality with one click

### 🎨 Beautiful UI/UX
- **Dark/Light theme** toggle with system preference detection
- **Glass morphism effects** and modern gradients
- **Smooth animations** and transitions throughout
- **Responsive design** works on all devices
- **Loading states** and error handling
- **Toast notifications** for user feedback

### 🔄 Real-time Updates
- **Connection status** monitoring for backend availability
- **Auto-refresh** confessions every 30 seconds
- **Apollo Client** caching for optimal performance

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Apollo Client** for GraphQL state management
- **Wouter** for lightweight client-side routing
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible component primitives
- **Framer Motion** for smooth animations
- **React Hook Form** with Zod validation

### Backend Integration
- **GraphQL API** connection to microservices backend
- **JWT Authentication** with bearer token headers
- **Apollo Federation** gateway support
- **Real-time connection monitoring**

### Development Tools
- **Vite** for fast development and building
- **TypeScript** for enhanced developer experience
- **ESLint & Prettier** for code quality
- **Cross-env** for Windows compatibility

## 📁 Project Structure

```
confession-website/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui component library
│   │   │   ├── confession-card.tsx
│   │   │   ├── confession-form.tsx
│   │   │   ├── search-bar.tsx
│   │   │   ├── comments-modal.tsx
│   │   │   ├── navbar.tsx
│   │   │   └── theme-provider.tsx
│   │   ├── pages/          # Application pages
│   │   │   ├── home.tsx
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   └── not-found.tsx
│   │   ├── lib/            # Utilities and configurations
│   │   │   ├── apollo.ts   # GraphQL client setup
│   │   │   ├── auth.tsx    # Authentication context
│   │   │   └── utils.ts    # Helper functions
│   │   ├── hooks/          # Custom React hooks
│   │   ├── App.tsx         # Main application component
│   │   ├── main.tsx        # Application entry point
│   │   └── index.css       # Global styles and animations
│   └── index.html          # HTML template
├── server/                 # Express server for frontend hosting
│   ├── index.ts            # Server entry point
│   └── vite.ts             # Vite development integration
├── shared/                 # Shared TypeScript types
│   └── schema.ts           # Data models and validation
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **GraphQL Backend** running on port 4000

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/confession-website.git
cd confession-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5000`

### Important Notes

⚠️ **Backend Requirement**: This frontend is designed to connect to a GraphQL backend at `localhost:4000/graphql`. Make sure your backend server is running before using the application.

🔧 **Windows Users**: The project includes `cross-env` for Windows compatibility. If you encounter environment variable issues, the scripts are already configured to work on Windows.

## 📊 GraphQL API Integration

The application connects to a GraphQL microservices backend with the following operations:

### Authentication
```graphql
# Register a new user
mutation {
  register(username: "testuser", secretCode: "password123") {
    token
    user { id username }
  }
}

# Login existing user
mutation {
  login(username: "testuser", secretCode: "password123") {
    token
    user { id username }
  }
}
```

### Confessions
```graphql
# Get all confessions
query {
  confessions {
    id content createdAt
    user { username }
  }
}

# Create confession
mutation {
  createConfession(content: "My confession") {
    id content createdAt
    user { username }
  }
}

# Update confession
mutation {
  updateConfession(id: "ID", content: "Updated") {
    id content
  }
}

# Delete confession
mutation {
  deleteConfession(id: "ID") {
    id content
  }
}
```

### Comments
```graphql
# Get comments for confession
query {
  comments(confessionId: "ID") {
    id content createdAt
    user { username }
  }
}

# Create comment
mutation {
  createComment(confessionId: "ID", content: "Comment") {
    id content createdAt
    user { username }
  }
}
```

## 🎨 UI Components & Styling

### Design System
- **Color Palette**: Modern purple gradients with light/dark mode support
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: ARIA compliant components from Radix UI

### Key Components

**ConfessionCard**: Beautiful cards with glass morphism effects
**SearchBar**: Intuitive search with icons and clear functionality  
**CommentsModal**: Elegant modal dialogs for comment interactions
**ThemeProvider**: Seamless dark/light mode switching
**Navbar**: Responsive navigation with theme toggle

### Custom CSS Classes
```css
.glass-card          /* Glass morphism effect */
.gradient-text       /* Animated gradient text */
.gradient-bg         /* Animated background gradients */
.card-hover          /* Smooth hover animations */
.btn-hover           /* Button hover effects */
.float               /* Floating animations */
.glow                /* Subtle glow effects */
```

## 🔧 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database migrations (if using local DB)
npm run db:push
```

## 📱 Screenshots & Demo

*Note: Add screenshots of your application here showing:*

1. **Home Page** - Main confession feed with search bar
2. **Dark Mode** - Beautiful dark theme interface
3. **Login Page** - Clean authentication form
4. **Search Feature** - Real-time search functionality
5. **Comments Modal** - Interactive comment system
6. **Mobile View** - Responsive design on mobile devices

## 🚀 Deployment Options

### Option 1: Replit Deployments
Deploy the full-stack application directly on Replit with both frontend and backend.

### Option 2: Vercel + Backend Host
- Deploy frontend to Vercel
- Deploy GraphQL backend to Railway/Heroku
- Update GraphQL endpoint in production

### Option 3: GitHub Pages (Frontend Only)
- Build static frontend for GitHub Pages
- Host GraphQL backend separately
- Configure environment variables for production API endpoint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 To-Do / Future Enhancements

- [ ] Real-time notifications for new comments
- [ ] User profiles and confession history
- [ ] Image upload support for confessions
- [ ] Confession categories and tags
- [ ] Advanced search filters (date, category)
- [ ] Report/moderation system
- [ ] PWA support for mobile app experience
- [ ] Email notifications for interactions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Apollo GraphQL** for excellent GraphQL client
- **React Team** for the amazing frontend framework
- **Vite** for lightning-fast development experience

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/confession-website/issues) section
2. Create a new issue with detailed description
3. Join our community discussions

---

**Made with ❤️ for anonymous confession sharing**

*Remember: This is a safe space for sharing thoughts anonymously. Please be respectful and supportive of others' experiences.*
