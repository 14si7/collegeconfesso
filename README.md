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
- **Node.js** with **Express** for server framework
- **Apollo Server** for GraphQL API
- **MongoDB** with Mongoose for data storage
- **Apollo Federation** for microservices schema stitching
- **JWT** for authentication
- **bcryptjs** for secret code hashing

### Development Tools
- **Vite** for fast development and building
- **TypeScript** for enhanced developer experience
- **ESLint & Prettier** for code quality
- **Cross-env** for Windows compatibility

## 📁 Project Structure

```
COLLEGECONFESSO/
├── comment-service/
│   ├── models/
│   ├── node_modules/
│   ├── .env
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── resolvers.js
│   └── schema.js
├── confession-service/
│   ├── models/
│   ├── node_modules/
│   ├── .env
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── resolvers.js
│   └── schema.js
├── frontend/
│   ├── client/
│   ├── server/
│   ├── .gitignore
│   ├── components.json
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── vite.config.ts
├── gateway-service/
│   ├── node_modules/
│   ├── .env
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── user-service/
│   ├── logs/
│   ├── models/
│   ├── node_modules/
│   ├── .env
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   ├── resolvers.js
│   ├── schema.js
│   ├── .gitignore
│   ├── LICENSE
│   └── README.md
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

2. **Install dependencies for all services**
```
cd comment-service && npm install
cd ../confession-service && npm install
cd ../gateway-service && npm install
cd ../user-service && npm install
cd ../frontend && npm install
```
3. **Start the development server**
```
cd frontend && npx cross-env NODE_ENV=development tsx server/index.ts
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




## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 To-Do / Future Enhancements

- [ ] Real-time GraphQL subscriptions for comment updates
- [ ] UUser profiles and confession history
- [ ] Confession categories and tags
- [ ] Advanced search filters (date, category)
- [ ] Report/moderation system
- [ ] Rate limiting and input sanitization
- [ ] Kubernetes/Docker Compose for service orchestration
- [ ] Monitoring with Prometheus/Grafana

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Apollo GraphQL** for excellent GraphQL client
- **React Team** for the amazing frontend framework
- **Vite** for lightning-fast development experience
- **MongoDB** for flexible NoSQL database
- **Node.js** and **Express** for reliable backend framework


---

**Made with ❤️ for anonymous confession sharing**

*Remember: This is a safe space for sharing thoughts anonymously. Please be respectful and supportive of others' experiences.*
