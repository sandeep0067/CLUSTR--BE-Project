# Clustr / SkillSwap - Backend Viva Guide

**Tech Stack:** Node.js, Express, MongoDB (Mongoose), Socket.io, EJS, Passport.js, JWT, Bcrypt
**Main Server:** `backendproject/server.js` (port 5000)
**Secondary Server:** `backendproject/backend/server.js` (port 5000)
**Frontend:** `SkillSwap/` (React Vite)

---

## 1. MIDDLEWARE

Middleware functions have access to `req`, `res`, `next`. They execute during the request-response cycle.

### Request Flow
```
Client → App Middleware → Router Middleware → Route Handler → Response
              ↓
       Error → Error Handler (err, req, res, next)
```

### Types in Your Code

**a) Application-Level** (`app.use()`)
- `backendproject/backend/server.js:16-22`
  ```js
  app.use(cookieParser());
  app.use(session({ secret: '...', resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());
  ```
- `backendproject/server.js:119-131` - CORS middleware, body parser, static files

**b) Router-Level**
- `backendproject/backend/routes/userRoutes.js` - `/api/users/*`
- `backendproject/backend/routes/postRoutes.js` - `/api/posts/*`

**c) Error-Handling Middleware** (4 params)
- `backendproject/backend/middleware/errorMiddleware.js:1-16`
  ```js
  const errorHandler = (err, req, res, next) => {
      const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
      res.status(statusCode).json({ message: err.message, stack: err.stack });
  };
  ```
  Mounted LAST at `backendproject/backend/server.js:64-65`

**d) Third-Party Middleware**
| Package | Purpose |
|---------|---------|
| `cors` | Cross-origin requests |
| `express.json()` | Parse JSON bodies |
| `cookie-parser` | Parse cookies |
| `express-session` | Session management |
| `multer` | File uploads (`server.js:65-117`) |
| `passport` | Authentication |

**e) Built-in**
- `express.static()` - Serves `/uploads` folder
- `express.json()` - Parses JSON payloads

### Blocking vs Non-Blocking
Your code uses **non-blocking** throughout: `async/await` for DB ops, Promises in socket handlers.

---

## 2. EJS / HBS & SSR vs CSR

| SSR | CSR |
|-----|-----|
| HTML generated on server | HTML generated in browser |
| EJS, HBS, Pug | React, Vue, Angular |

### EJS in Your Code
**Setup:** `backendproject/backend/server.js:67-68`
```js
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
```

**Render:** `backendproject/backend/server.js:70-72`
```js
app.get('/', (req, res) => { res.render('index'); });
```

**Template:** `backendproject/backend/views/index.ejs`

### EJS Syntax
```ejs
<%= variable %>           <!-- Output -->
<%- include('partial') %> <!-- Include partial -->
<% if (x) { %> <% } %>   <!-- Logic -->
```

### HBS (Handlebars) - For Viva Knowledge
```html
<h1>{{title}}</h1>
{{#each users}} <li>{{name}}</li> {{/each}}
```
Setup: `app.set('view engine', 'hbs');`

---

## 3. DATABASES - SQL vs NoSQL

| SQL (PostgreSQL) | NoSQL (MongoDB) |
|------------------|-----------------|
| Tables, rows, columns | Documents, collections |
| ACID compliant | Flexible schema |
| JOINs, Foreign Keys | Embedded docs or references |

### MongoDB + Mongoose in Your Code

**Connection:** `backendproject/backend/config/db.js:1-19`
```js
const mongoose = require('mongoose');
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000, socketTimeoutMS: 5000, family: 4
  });
};
```

**Schema (ODM):** `backendproject/backend/models/User.js:1-100`
```js
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  followers: [{ type: String }],
  following: [{ type: String }],
}, { timestamps: true });
```

**Pre-save Hook:** `backendproject/backend/models/User.js:86-92`
```js
userSchema.pre('save', async function() {
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.password, salt);
    this.password = undefined;
  }
});
```

**Instance Method:** `backendproject/backend/models/User.js:94-96`
```js
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};
```

**Models:** User.js, Post.js, Conversation.js, Message.js, Community.js

### PostgreSQL (Know for Viva)
```js
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://...' });
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

---

## 4. SESSION MANAGEMENT & AUTHENTICATION

### Express-Sessions
**Setup:** `backendproject/backend/server.js:17-22`
```js
app.use(session({
  secret: process.env.SESSION_SECRET || 'clustr-secret',
  resave: false,           // Don't save unmodified
  saveUninitialized: false, // Don't create empty sessions
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));
```

### Passport.js Local Strategy
**File:** `backendproject/backend/config/passport.js:1-42`
```js
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: 'Invalid email or password' });
    const isMatch = await user.comparePassword(password);
    return isMatch ? done(null, user) : done(null, false);
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
```

**Initialized:** `backendproject/backend/server.js:23-24`
```js
app.use(passport.initialize());
app.use(passport.session());
```

### JWT
**Package installed** but `jwt.sign()` is NOT used anywhere. Only verification middleware exists.

**Verification Middleware:** `backendproject/backend/middleware/authMiddleware.js:1-22`
```js
const jwt = require('jsonwebtoken');
exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clustr-local');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
```

**IMPORTANT:** `protect` middleware is written but NOT imported/used on any route.

### Bcrypt
**File:** `backendproject/backend/models/User.js:86-96`
- Pre-save hook hashes with salt rounds = 10
- `comparePassword()` verifies with `bcrypt.compare()`

### Auth Routes (NO TOKEN RETURNED - just user object)
- `POST /api/users/register` - `backendproject/server.js:166-202`
- `POST /api/users/login` - `backendproject/server.js:204-218`

---

## 5. SOCKET.IO - FULL DUPLEX COMMUNICATION

### Full Duplex = Both sides can send/receive simultaneously without waiting.

### Server Setup
**Root server:** `backendproject/server.js:56-57, 326-330`
```js
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
```

**Secondary server:** `backendproject/backend/server.js:74-81`
```js
const server = http.createServer(app);
socketHandler.init(server);
```

### Socket Handler: `backendproject/backend/socket/socketHandler.js:1-49`
```js
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.receiverId).emit('receiveMessage', data);
  });

  socket.on('newPost', (post) => {
    socket.broadcast.emit('postUpdate', post);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
```

### Socket Events in Root `server.js:467-563`
```js
io.on('connection', (socket) => {
  socket.on('register', (data) => { ...socket.join(userId)... });
  socket.on('message:send', async (data) => {
    // saves to MongoDB, emits to sender and receiver
    io.to(message.from).emit('conversation:update', updatedThread);
    io.to(message.to).emit('conversation:update', updatedThread);
  });
  socket.on('disconnect', () => { ... });
});
```

### Key Socket.io Concepts
- `socket.emit()` - Send to triggering client
- `socket.broadcast.emit()` - Send to all EXCEPT sender
- `io.to(room).emit()` - Send to specific room
- `socket.join(room)` - Add socket to room
- `io.on('connection')` - Fires on every new connection

---

## 6. ROUTES - ALL OPEN (NO AUTH REQUIRED)

### Root `server.js` Routes
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/users/register` | Signup |
| POST | `/api/users/login` | Login |
| POST | `/api/auth/signup` | Signup (alt) |
| POST | `/api/auth/login` | Login (alt) |
| GET | `/api/users` | List all users |
| PATCH | `/api/users/:uid` | Update user |
| POST | `/api/users/:uid/follow/:targetUid` | Follow/unfollow |
| POST | `/api/users/:uid/saved-posts/:postId` | Save post |
| POST | `/api/uploads/post-media` | Upload file |
| GET | `/api/posts` | Get all posts |
| POST | `/api/posts` | Create post |
| PATCH | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| GET | `/api/conversations/:uid` | Get chats |
| PUT | `/api/conversations/:id` | Save chat |
| DELETE | `/api/conversations/:id` | Delete chat |
| GET | `/health` | Health check |

### `backend/server.js` Routes
| Method | Route | Router |
|--------|-------|--------|
| POST | `/api/users/register` | userRoutes |
| POST | `/api/users/login` | userRoutes |
| GET | `/api/users/:id` | userRoutes |
| PATCH | `/api/users/:id` | userRoutes |
| POST | `/api/users/:uid/follow/:targetUid` | userRoutes |
| POST | `/api/posts/create` | postRoutes |
| GET | `/api/posts/feed` | postRoutes |
| POST | `/api/messages/send` | messageRoutes |
| GET | `/api/messages/:user1/:user2` | messageRoutes |
| POST | `/api/communities/create` | communityRoutes |
| GET | `/api/communities/` | communityRoutes |

---

## 7. KEY FILES REFERENCE TABLE

| Topic | File | Lines |
|-------|------|-------|
| App middleware | `backend/server.js` | 16-50 |
| Router middleware | `backend/routes/*.js` | all |
| Error middleware | `backend/middleware/errorMiddleware.js` | 1-16 |
| EJS setup | `backend/server.js` | 67-72 |
| EJS template | `backend/views/index.ejs` | all |
| MongoDB connection | `backend/config/db.js` | 1-19 |
| Mongoose Schema | `backend/models/User.js` | all |
| Pre-save hook | `backend/models/User.js` | 86-92 |
| Instance method | `backend/models/User.js` | 94-96 |
| Session | `backend/server.js` | 17-22 |
| Passport | `backend/config/passport.js` | all |
| JWT verify | `backend/middleware/authMiddleware.js` | 1-22 |
| Bcrypt | `backend/models/User.js` | 86-96 |
| Socket.io handler | `backend/socket/socketHandler.js` | all |
| Socket events | `server.js` | 467-563 |
| Login handler | `server.js` | 204-218 |
| Signup handler | `server.js` | 166-202 |
| Post CRUD | `server.js` | 334-463 |
| Multer upload | `server.js` | 65-117 |
| CORS | `server.js` | 122-131 |
| Health check | `server.js` | 565-573 |

---

## 8. VIVA Q&A CHEAT SHEET

**Q: What middleware types do you use?**
> Application-level (session, cors, json parser), Router-level (route handlers), Error-handling (4 params), Third-party (multer, passport), and Built-in (static).

**Q: How does a request travel in Express?**
> Client → app.use() middleware → router middleware → route handler → response. If error occurs, it goes to error-handling middleware.

**Q: SSR vs CSR?**
> SSR generates HTML on server (EJS), better SEO. CSR generates in browser (React), better interactivity.

**Q: How to use EJS?**
> Install ejs, `app.set('view engine', 'ejs')`, `app.set('views', './views')`, create `.ejs` files, render with `res.render('file', {data})`.

**Q: SQL vs NoSQL?**
> SQL = structured tables, ACID, JOINs. NoSQL = flexible documents, horizontal scaling, embedded data.

**Q: How does Mongoose work?**
> Mongoose is an ODM. Define schemas, apply pre-save hooks (bcrypt hashing), add instance methods (comparePassword), then use `Model.find()`, `Model.create()` etc.

**Q: Explain session management.**
> We use `express-session` with a secret, resave:false, saveUninitialized:false. Sessions track user state server-side. Combined with Passport.js for authentication.

**Q: How does authentication work?**
> Register → bcrypt hash password via pre-save hook → store in MongoDB. Login → Passport LocalStrategy verifies email/password with `comparePassword()`. Sessions keep user logged in.

**Q: What about JWT?**
> `jsonwebtoken` is installed and `jwt.verify()` middleware exists, but `jwt.sign()` is not used and no routes apply the protect middleware. JWT is prepared but not wired.

**Q: Explain Socket.io.**
> Full duplex communication. Client connects, server emits `io.on('connection')`. Users join rooms with their userId. Private messages use `io.to(receiverId).emit()`. New posts broadcast with `socket.broadcast.emit()`.

**Q: Which routes are protected?**
> Currently NONE. The `protect` middleware exists but is not imported or applied to any route. All routes are open.

**Q: What is multer used for?**
> File upload middleware. Configured in `server.js:65-117` with diskStorage, file filter for images/videos/documents, 25MB limit. Mounted at `/api/uploads/post-media`.

**Q: What is the difference between your two servers?**
> Root `server.js` (ES modules) handles main API + Socket.io + file uploads. `backend/server.js` (CommonJS) has Passport sessions + EJS + modular routes + error middleware.

**Q: What would need JWT sign implementation?**
> In login handler, after credential check: `const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });` then return `{ token, user }`.

**Q: How to protect a route?**
> `const { protect } = require('../middleware/authMiddleware');` then `router.get('/profile', protect, controller.getProfile);`
