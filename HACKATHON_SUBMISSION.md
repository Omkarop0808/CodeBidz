# CodeBidz Hackathon Submission

**Team Name:** [Your Team Name]  
**Project:** Online Auction System  
**Unstop Profile:** [Your Unstop Link]  
**Live Demo:** https://auction.ihavetech.com  
**GitHub:** https://github.com/theavnishkumar/online-auction-system

---

## 🎯 Project Overview

A production-ready, full-stack real-time auction platform that enables users to create auctions, bid in real-time, and manage everything through an intuitive interface with a powerful admin panel.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite 6** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **Redux Toolkit** - Global state management for authentication
- **TanStack React Query** - Server state management and caching
- **Socket.io Client** - Real-time WebSocket connections
- **React Router v7** - Client-side routing with View Transitions API

### Backend
- **Node.js + Express 5** - Latest Express with improved performance
- **MongoDB + Mongoose** - NoSQL database with ODM
- **Socket.io** - WebSocket server for real-time bidding
- **JWT + bcrypt** - Secure authentication with httpOnly cookies
- **Cloudinary** - Cloud image storage and CDN
- **Resend** - Transactional email service
- **Compression** - gzip compression for API responses

### Infrastructure & DevOps
- **AWS EC2** - Backend hosting with PM2 process management
- **Vercel** - Frontend deployment with serverless functions
- **GitHub Actions** - CI/CD pipeline for automated deployment
- **MongoDB Atlas** - Cloud database hosting

---

## 👥 Admin & Bidder Panel Features

### Admin Panel Features
✅ **System-wide Dashboard** - Total users, auctions, bids, and revenue statistics  
✅ **User Management** - Search, sort, filter, and paginate all users  
✅ **Role Management** - Change user roles (User/Admin)  
✅ **User Actions** - Delete users, toggle user status  
✅ **Recent Activity** - Track recent signups and auction activity  
✅ **Advanced Search** - Search users by name, email, or role  
✅ **Sorting & Filtering** - Sort by date, name, role with pagination  
✅ **Security Tracking** - View login history with IP, location, and device info

### Bidder Panel Features
✅ **User Dashboard** - Personal statistics and recent auction activity  
✅ **Browse Auctions** - Paginated auction listings with category filtering  
✅ **Real-time Bidding** - Live bidding with instant updates across all users  
✅ **Create Auctions** - Upload images, set prices, dates, and categories  
✅ **My Auctions** - View and manage your created auctions  
✅ **My Bids** - Track all auctions you've bid on  
✅ **Live Countdown** - Real-time countdown timers for auction expiry  
✅ **Active Users** - See who's viewing the same auction in real-time  
✅ **Winner Detection** - Automatic winner assignment when auction ends  
✅ **Profile Management** - Update profile and change password securely  
✅ **Login History** - View all login attempts with security details

---

## 🚀 One Unique Feature: Real-Time Bidding with Race Condition Prevention

### What Makes It Special?

Our real-time bidding system goes beyond basic WebSocket implementation with **atomic database updates** that prevent race conditions when multiple users bid simultaneously.

### How It Works:

1. **Socket.io Room Architecture**
   - Each auction has its own isolated room
   - Users join/leave rooms dynamically
   - Live active user count updates instantly

2. **Atomic MongoDB Updates**
   ```javascript
   // Prevents race conditions with conditional update
   findOneAndUpdate(
     { _id: auctionId, currentPrice: { $lt: bidAmount } },
     { $push: { bids: newBid }, $set: { currentPrice: bidAmount } }
   )
   ```
   - Only one bid succeeds if multiple users bid the same amount
   - Ensures data integrity and fair bidding

3. **Instant Broadcast**
   - Successful bids broadcast to all users in the room
   - Toast notifications for other users' actions
   - Live auction data updates without page refresh

4. **Security Features**
   - JWT authentication for Socket connections
   - Sellers cannot bid on their own auctions
   - Bid range validation (currentPrice + 1 to currentPrice + 10)

5. **User Experience**
   - See who's viewing the auction in real-time
   - Live countdown timers
   - Optimistic UI updates with error handling
   - Automatic reconnection with up to 10 attempts

### Why It's Impressive:

- **Production-Ready**: Handles concurrent users without data corruption
- **Scalable**: Room-based architecture supports unlimited auctions
- **Secure**: Multiple layers of validation and authentication
- **Fast**: Sub-second bid updates across all connected clients
- **Reliable**: Automatic reconnection and error recovery

---

## 💡 Additional Important Features

### Security & Authentication
- **httpOnly Cookies** - XSS protection by keeping tokens out of JavaScript
- **bcrypt Password Hashing** - Industry-standard password security (10 rounds)
- **JWT Token Expiration** - Automatic session timeout after 7 days
- **Login Tracking** - IP address, geo-location, device, and browser tracking
- **Input Sanitization** - XSS-safe HTML email templates
- **CORS Configuration** - Secure cross-origin resource sharing
- **Environment Validation** - Startup validation of all required variables

### Performance Optimizations
- **React Query Caching** - Intelligent server state caching and synchronization
- **Hover Prefetching** - Preload data on mouse hover for instant navigation
- **View Transitions API** - Smooth page animations (250ms cross-fade)
- **gzip Compression** - 70% bandwidth reduction on API responses
- **MongoDB Indexes** - Optimized queries on frequently accessed fields
- **CDN Integration** - Cloudinary CDN for fast global image delivery
- **Code Splitting** - Lazy loading for optimal bundle size

### User Experience
- **Auto-login on Refresh** - Seamless session restoration from cookies
- **Real-time Notifications** - Toast notifications for all user actions
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Category Filtering** - 13 categories (Electronics, Fashion, Art, etc.)
- **Pagination** - Efficient browsing of large datasets
- **Empty States** - Helpful messages when no data is available
- **Loading States** - Skeleton screens and spinners for better UX

### Email System
- **Contact Form** - Users can send messages to admin
- **Dual Email Delivery** - Admin receives message, user receives confirmation
- **XSS-Safe Templates** - HTML email templates with input sanitization
- **Resend Integration** - Reliable transactional email delivery

### Deployment & DevOps
- **CI/CD Pipeline** - GitHub Actions for automated deployment
- **PM2 Process Management** - Zero-downtime restarts and monitoring
- **Graceful Shutdown** - Proper cleanup of DB connections and HTTP server
- **Environment-based Config** - Separate dev/production configurations
- **Vercel Serverless** - Frontend deployed on Vercel edge network
- **AWS EC2 Hosting** - Backend on EC2 with auto-scaling capability

### Data Management
- **Auction Lifecycle** - Create → Active → Expired → Winner Assigned
- **Bid History** - Complete audit trail of all bids
- **User Statistics** - Dashboard with personal auction metrics
- **Admin Analytics** - Platform-wide statistics and insights
- **TTL Indexes** - Automatic cleanup of old login records (6 months)

### Developer Experience
- **Clean Architecture** - Service layer pattern with separation of concerns
- **Comprehensive Documentation** - Architecture guide, API docs, learning guide
- **Code Organization** - Modular structure with clear responsibilities
- **Error Handling** - Consistent error responses and user feedback
- **Type Safety** - JSDoc comments for better IDE support

---

## 📊 Key Metrics

- **20+ Features** - Complete auction platform functionality
- **7 Database Models** - User, Product, Bid, Login schemas
- **15+ API Endpoints** - RESTful API with full CRUD operations
- **6 Socket Events** - Real-time bidding and user presence
- **3 User Roles** - Guest, User, Admin with role-based access
- **13 Categories** - Comprehensive auction categorization
- **100% Responsive** - Mobile-first design approach
- **Sub-second Response** - Optimized API and database queries

---

## 🎓 Learning Resources

This project includes comprehensive documentation:
- **ARCHITECTURE.md** - Complete system architecture and data flow
- **LEARNING_GUIDE.md** - Step-by-step learning path for developers
- **TEST_ALL_FEATURES.md** - Feature testing guide (2-minute walkthrough)
- **Backend README** - API documentation and server architecture
- **Frontend README** - Component structure and state management

---

## 🏆 Why This Project Stands Out

1. **Production-Ready Code** - Not a tutorial project, but a deployable application
2. **Modern Tech Stack** - Latest versions of all libraries (React 19, Express 5, Tailwind v4)
3. **Real-Time Architecture** - Proper WebSocket implementation with race condition prevention
4. **Security First** - Multiple layers of security following industry best practices
5. **Scalable Design** - Service layer pattern, modular architecture, easy to extend
6. **Great UX** - Smooth animations, real-time updates, responsive design, fast performance
7. **Complete Documentation** - Extensive guides for learning and contribution
8. **CI/CD Pipeline** - Automated deployment with GitHub Actions

---

## 📝 Installation & Setup

```bash
# Clone repository
git clone https://github.com/theavnishkumar/online-auction-system.git
cd online-auction-system

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Configure environment variables (see .env.example files)

# Start backend (Terminal 1)
cd server && npm run dev

# Start frontend (Terminal 2)
cd client && npm run dev

# Access application at http://localhost:5173
```

---

## 🔗 Important Links

- **Live Demo:** https://auction.ihavetech.com
- **GitHub Repository:** https://github.com/theavnishkumar/online-auction-system
- **Architecture Guide:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Learning Guide:** [LEARNING_GUIDE.md](./LEARNING_GUIDE.md)
- **API Documentation:** [server/README.md](./server/README.md)

---

**Built with ❤️ by [Your Team Name]**  
*A complete, production-ready auction platform demonstrating modern full-stack development practices*
