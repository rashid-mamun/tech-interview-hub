---
sidebar_position: 1
title: 'Authentication and Authorization'
---

## 1. What is the difference between authentication and authorization?

- **Authentication (প্রমাণীকরণ):** আপনি কে? — এটি User-এর Identity verify করে (যেমন: Login করা, Password বা Token চেক করা)।
- **Authorization (অনুমতি):** আপনি কী করতে পারবেন? — এটি User-এর Permission/Role চেক করে (যেমন: Admin vs Regular User)।

**উদাহরণ:**
```javascript
// Authentication — JWT Token verify করে user খোঁজা
async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthenticated' });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
}

// Authorization — User role check করা
function authorize(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}

// Use case: শুধু Admin-ই delete করতে পারবে
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
```

### What is the difference between session-based auth and token-based auth?
| বৈশিষ্ট্য | Session-based Auth | Token-based Auth (JWT) |
|---|---|---|
| **State** | Server-এ session data (stateful) store থাকে। | সম্পূর্ণ Stateless, Token-এর ভেতরেই সব তথ্য থাকে। |
| **Revocation** | Server থেকে Session delete করলেই কাজ শেষ। | Token expire হওয়ার আগ পর্যন্ত revoke করা কঠিন। |
| **Scale** | Sticky session বা Redis (Shared Store) দরকার হয়। | যেকোনো server independently validate করতে পারে। |
| **Best For** | Traditional Server-rendered Web app | SPA (React/Vue), Mobile App, Microservices |

---

## 2. How do you implement JWT authentication in Node.js?

JWT (JSON Web Token) হলো একটি secure token format যা API authentication-এর জন্য সর্বাধিক ব্যবহৃত হয়।

**Implementation Example:**
```javascript
const jwt = require('jsonwebtoken');

// Token তৈরি (Sign) - Login করার সময়
const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m', algorithm: 'HS256' } // ১৫ মিনিট পর expire হবে
);

// Token যাচাই (Verify) - Protected route-এর জন্য Middleware
function verifyJWT(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'No token provided' });
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        const code = err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID';
        res.status(401).json({ error: code });
    }
}
```

### What is the difference between `jwt.sign` with a secret vs an RSA private key?
- **HS256 (Symmetric):** একটিমাত্র `secret` key দিয়ে Token Sign এবং Verify করা হয়। এটি Single Server architecture-এর জন্য ভালো।
- **RS256 (Asymmetric/RSA):** **Private Key** দিয়ে Sign করা হয়, এবং **Public Key** দিয়ে Verify করা হয়। এটি Microservices-এর জন্য Best Practice, কারণ Service B শুধু Public Key দিয়ে token verify করতে পারবে, কিন্তু নতুন token তৈরি (Sign) করতে পারবে না।

---

## 3. What is OAuth 2.0 and how do you implement it in Node.js?

OAuth 2.0 হলো একটি authorization framework যা ইউজারদের তাদের পাসওয়ার্ড না দিয়েই কোনো থার্ড-পার্টি অ্যাপ্লিকেশনকে তাদের ডেটা অ্যাক্সেস করার অনুমতি দেয় (যেমন: "Login with Google")।

**কিভাবে কাজ করে (Authorization Code Flow):**
1. User-কে Google-এর login page-এ redirect করা হয়।
2. Login সফল হলে Google একটি `code` সহ আমাদের redirect URI-তে পাঠায়।
3. Backend সেই `code`-টি Google-এর কাছে পাঠিয়ে `access_token` বা `id_token` নিয়ে আসে।

**Implementation (without Passport):**
```javascript
app.get('/auth/callback', async (req, res) => {
    const { code } = req.query;
    
    // Code দিয়ে Token exchange করা
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            redirect_uri: 'http://localhost:3000/auth/callback',
            grant_type: 'authorization_code',
        })
    });
    
    const { access_token, id_token } = await tokenResponse.json();
    const user = jwt.decode(id_token); // Google থেকে User info পেলাম
    
    // Database-এ save করে নিজেদের App-এর JWT তৈরি
    const appToken = jwt.sign({ userId: user.sub }, process.env.JWT_SECRET);
    res.json({ token: appToken });
});
```

---

## 4. What is Passport.js and how does it work?

Passport.js হলো Node.js-এর সবচেয়ে জনপ্রিয় authentication middleware। এটি বিভিন্ন "Strategies"-এর মাধ্যমে authentication process-কে modular এবং সহজ করে। (যেমন: Local Strategy, JWT Strategy, Google Strategy)।

**কীভাবে কাজ করে:**
```javascript
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

// ১. Strategy define করা
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            // Password verification (`bcrypt` ব্যবহার করে)
            if (!user || !await bcrypt.compare(password, user.password)) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            return done(null, user); // Success
        } catch (err) {
            return done(err);
        }
    }
));

// ২. Route-এ Middleware হিসেবে ব্যবহার করা
app.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    // passport req.user-এ verified user-কে দিয়ে দেয়
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
    res.json({ token });
});
```

---

## 5. How do you implement refresh token rotation in Node.js?

JWT Access Token-এর মেয়াদ সাধারণত কম (যেমন ১৫ মিনিট) থাকে security-র জন্য। Refresh Token-এর মেয়াদ বেশি (যেমন ৭-৩০ দিন) থাকে, যা দিয়ে নতুন Access Token নেওয়া যায়। **Refresh Token Rotation** মানে হলো, যখনই Refresh Token ব্যবহার করা হবে, তখন আগেরটিকে revoke করে সম্পূর্ণ নতুন একটি Refresh Token ইউজারকে দেওয়া। এটি security অনেক বাড়িয়ে দেয়।

**Implementation Flow:**
```javascript
async function refreshTokens(req, res) {
    const rawToken = req.cookies.refreshToken;
    if (!rawToken) return res.status(401).json({ error: 'No refresh token' });

    // Database থেকে token find করা
    const stored = await RefreshToken.findOne({ 
        userId: req.body.userId, 
        expiresAt: { $gt: new Date() } 
    });

    if (!stored || !await bcrypt.compare(rawToken, stored.token)) {
        // Warning: Token Reuse Detected!
        await RefreshToken.deleteMany({ userId: req.body.userId });
        return res.status(401).json({ error: 'Refresh token reuse detected. Login again.' });
    }

    // Rotation: পুরানো token delete এবং নতুন তৈরি
    await stored.deleteOne();
    
    const newAccessToken = jwt.sign({ userId: stored.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = crypto.randomBytes(64).toString('hex'); // Opaque String

    await RefreshToken.create({ 
        token: await bcrypt.hash(newRefreshToken, 10), // Database-এ hash করে রাখা
        userId: stored.userId, 
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
    });

    // HTTPOnly secure cookie-তে সেট করা
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken: newAccessToken });
}
```

---

## 6. What is session management in Node.js and how do you implement it securely?

Session Management হলো ইউজারের state বা identity সার্ভার-সাইডে (যেমন Memory বা Redis-এ) ধরে রাখার প্রক্রিয়া। Node.js-এ এটি সাধারণত `express-session` লাইব্রেরির মাধ্যমে করা হয়।

**Secure Implementation:**
```javascript
const session = require('express-session');
const RedisStore = require('connect-redis').default;

app.use(session({
    store: new RedisStore({ client: redisClient }), // Production-এ MemoryStore ব্যবহার করা যাবে না
    secret: process.env.SESSION_SECRET,
    name: 'sessionId',      // সিকিউরিটির জন্য default 'connect.sid' পরিবর্তন করা
    resave: false,
    saveUninitialized: false,
    rolling: true,          // User activity থাকলে Age reset হবে
    cookie: {
        httpOnly: true,     // XSS attack ঠেকানোর জন্য
        secure: process.env.NODE_ENV === 'production', // HTTPS only
        sameSite: 'strict', // CSRF attack প্রতিরোধ করে
        maxAge: 24 * 60 * 60 * 1000 // ২৪ ঘণ্টার সেশন
    }
}));

// Session Fixation Attack প্রতিরোধের উপায়:
app.post('/login', async (req, res) => {
    const user = await verifyCredentials(req.body);
    // Login-এর পর সম্পূর্ণ নতুন Session ID তৈরি করা
    req.session.regenerate((err) => { 
        req.session.userId = user.id;
        res.json({ message: 'Logged in securely' });
    });
});
```

---

## 7. What is RBAC (Role-Based Access Control) and how do you implement it?

RBAC হলো একটি authorization পদ্ধতি যেখানে ইউজারদের বিভিন্ন `Role` (যেমন: Admin, Manager, User) দেওয়া হয় এবং প্রতিটি Role-এর নির্দিষ্ট কিছু `Permission` থাকে।

**Implementation Approach:**
```javascript
// Role hierarchy এবং permissions ডিফাইন করা
const PERMISSIONS = {
    'user':      ['read:posts', 'create:posts'],
    'moderator': ['read:posts', 'create:posts', 'delete:posts'],
    'admin':     ['*'], // Everything
};

function hasPermission(userRole, required) {
    const perms = PERMISSIONS[userRole] || [];
    return perms.includes('*') || perms.includes(required);
}

// Middleware
function requirePermission(action) {
    return (req, res, next) => {
        if (!hasPermission(req.user.role, action)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}

// Route protect করা
app.delete('/posts/:id', 
    authenticate, 
    requirePermission('delete:posts'), 
    deletePost
);
```

---

## 8. What is multi-factor authentication (MFA) and how do you implement it in Node.js?

MFA হলো সিকিউরিটির একটি এক্সট্রা লেয়ার যেখানে পাসওয়ার্ড ছাড়াও ইউজারকে দ্বিতীয় কোনো প্রমাণ (যেমন SMS OTP বা Google Authenticator code) দিতে হয়। Node.js-এ Time-based One-Time Password (TOTP) ব্যবহার করে MFA তৈরি করা যায় `otplib` লাইব্রেরি দিয়ে।

**Implementation Flow:**
```javascript
const { totp } = require('otplib');
const QRCode = require('qrcode');

// ১. MFA Setup (User-এর জন্য App-এ)
app.post('/auth/mfa/setup', authenticate, async (req, res) => {
    const secret = totp.generateSecret(); 
    const otpauthUrl = totp.keyuri(req.user.email, 'MySecureApp', secret);

    await User.update(req.user.id, { mfaSecret: secret });

    // QR Code জেনারেট করে User-কে দেওয়া (যা সে ২FA App-এ স্ক্যান করবে)
    const qrImage = await QRCode.toDataURL(otpauthUrl);
    res.json({ qrCode: qrImage });
});

// ২. Login Verification
app.post('/auth/login', async (req, res) => {
    const user = await verifyCredentials(req.body);
    
    if (user.mfaEnabled) {
        if (!req.body.totpCode) return res.status(401).json({ error: 'MFA Code required' });
        
        const isValid = totp.verify({ token: req.body.totpCode, secret: user.mfaSecret });
        if (!isValid) return res.status(401).json({ error: 'Invalid MFA code' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
});
```

---

## 9. How do you implement social login (Google, GitHub) in a Node.js application?

সোশ্যাল লগিন implement করার জন্য `Passport.js` এবং এর স্ট্র্যাটেজিগুলো (যেমন: `passport-google-oauth20`) সবচেয়ে স্ট্যান্ডার্ড পদ্ধতি।

**Google Login Example:**
```javascript
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // নতুন ইউজার হলে ডাটাবেসে সেভ করা
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0].value
            });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

// Route handler
app.get('/auth/google', passport.authenticate('google'));

app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        // সফল হলে নিজেদের JWT Token দিয়ে Frontend-এ Redirect করা
        const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
        res.redirect(`https://myapp.com/dashboard?token=${token}`);
    }
);
```

---

## 10. How do you protect API endpoints from unauthorized access?

আপনার Node.js API-কে সিকিউর রাখার জন্য একাধিক লেয়ারে প্রটেকশন দেওয়া উচিত।

**Standard Protection Methods:**
```javascript
// ১. JWT Token যাচাই (Public API-এর জন্য)
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ২. API Key Verification (Partner বা Server-to-Server API-এর জন্য)
const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ error: 'API key required' });

    // Hashed key ডাটাবেসের সাথে মেলানো
    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const validKey = await ApiKey.findOne({ keyHash, active: true });
    
    if (!validKey) return res.status(401).json({ error: 'Forbidden' });
    next();
};

// ৩. IP Whitelisting (Internal Network-এর জন্য)
const ipWhitelist = ['10.0.0.0/8', '192.168.0.0/16'];
const ipWhitelistMiddleware = (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!ipWhitelist.includes(clientIp)) {
        return res.status(403).json({ error: 'Access denied from this network' });
    }
    next();
};

// প্রয়োগ
app.get('/api/admin/data', authMiddleware, ipWhitelistMiddleware, getAdminData);
```
