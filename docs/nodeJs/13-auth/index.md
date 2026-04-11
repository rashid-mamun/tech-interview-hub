---
sidebar_position: 1
title: ''
---



## 133. What is the difference between authentication and authorization?

- **Authentication (প্রমাণীকরণ):** আপনি কে? — Identity verify।
- **Authorization (অনুমতি):** আপনি কী করতে পারবেন? — Permission check।

```javascript
// Authentication — token verify
async function authenticate(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthenticated' });
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
}

// Authorization — role check
function authorize(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    };
}

// Use করুন
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);
```

### What is the difference between session-based auth and token-based auth?
| | Session-based | Token-based (JWT) |
|---|---|---|
| **State** | Server এ session store | Token এ সব (stateless) |
| **Revocation** | Session delete করুন | Token expire পর্যন্ত valid |
| **Scale** | Sticky session বা shared store | যেকোনো server validate করে |
| **Best For** | Traditional web app | SPA, Mobile, Microservices |

---

## 134. How do you implement JWT authentication in Node.js?

```javascript
const jwt = require('jsonwebtoken');

// JWT Structure: header.payload.signature
// Header: { alg: 'HS256', typ: 'JWT' }
// Payload: { userId: 1, role: 'user', iat: ..., exp: ... }
// Signature: HMACSHA256(base64(header) + '.' + base64(payload), secret)

// Sign
const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m', algorithm: 'HS256', jwtid: uuid() }
);

// Verify middleware
function verifyJWT(req, res, next) {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'No token' });
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
```javascript
// HMAC (HS256) — symmetric, same key sign+verify
const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256' });

// RSA (RS256) — asymmetric, private key sign, public key verify
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
// Service B শুধু public key দিয়ে verify করতে পারে, sign করতে পারে না
// Microservices এ RS256 বেশি secure
```

---

## 135. What is OAuth 2.0 and how do you implement it in Node.js?

```javascript
// Authorization Code + PKCE Flow
const { generatePKCE, exchangeCode } = require('./oauth-utils');

// Step 1: Authorization URL তৈরি
app.get('/auth/google', (req, res) => {
    const { codeVerifier, codeChallenge } = generatePKCE();
    req.session.codeVerifier = codeVerifier;

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: 'http://localhost:3000/auth/callback',
        response_type: 'code',
        scope: 'openid email profile',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: generateState()
    });
    res.redirect(`https://accounts.google.com/o/oauth2/auth?${params}`);
});

// Step 2: Callback — code → token exchange
app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            code_verifier: req.session.codeVerifier,
            redirect_uri: 'http://localhost:3000/auth/callback',
            grant_type: 'authorization_code',
        })
    });
    const { access_token, id_token } = await tokenResponse.json();
    const user = jwt.decode(id_token);  // User info from OIDC
    await saveOrUpdateUser(user);
    const appToken = jwt.sign({ userId: user.sub }, process.env.JWT_SECRET);
    res.json({ token: appToken });
});
```

---

## 136. What is Passport.js and how does it work?

```javascript
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

// Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user || !await bcrypt.compare(password, user.password)) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// JWT Strategy
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    const user = await User.findById(payload.userId);
    return user ? done(null, user) : done(null, false);
}));

// Session serialize/deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Routes
app.post('/login', passport.authenticate('local', { session: false }),
    (req, res) => {
        const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
        res.json({ token });
    }
);
app.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user);
});
```

---

## 137. How do you implement refresh token rotation in Node.js?

```javascript
// Refresh token rotation
async function login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = crypto.randomBytes(64).toString('hex'); // Opaque token

    // DB তে refresh token store
    await RefreshToken.create({
        token: await bcrypt.hash(refreshToken, 10),
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ accessToken });
}

async function refreshTokens(req, res) {
    const rawToken = req.cookies.refreshToken;
    if (!rawToken) return res.status(401).json({ error: 'No refresh token' });

    const stored = await RefreshToken.findOne({ userId: req.body.userId, expiresAt: { $gt: new Date() } });
    if (!stored || !await bcrypt.compare(rawToken, stored.token)) {
        // Reuse detected — revoke all tokens!
        await RefreshToken.deleteMany({ userId: req.body.userId });
        return res.status(401).json({ error: 'Refresh token reuse detected' });
    }

    // Rotate — পুরনো delete, নতুন তৈরি
    await stored.deleteOne();
    const newAccessToken = jwt.sign({ userId: stored.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = crypto.randomBytes(64).toString('hex');

    await RefreshToken.create({ token: await bcrypt.hash(newRefreshToken, 10), userId: stored.userId, expiresAt: new Date(Date.now() + 30 * 86400000) });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });
    res.json({ accessToken: newAccessToken });
}
```

---

## 138. What is session management in Node.js and how do you implement it securely?

```javascript
const session = require('express-session');
const RedisStore = require('connect-redis').default;

app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    name: 'sessionId',      // Default 'connect.sid' এড়ান
    resave: false,
    saveUninitialized: false,
    rolling: true,          // Activity এ TTL reset
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24h
    }
}));

// Session fixation prevention — login এ regenerate
app.post('/login', async (req, res) => {
    const user = await verifyCredentials(req.body);
    req.session.regenerate((err) => { // নতুন session ID
        req.session.userId = user.id;
        req.session.role = user.role;
        res.json({ message: 'Logged in' });
    });
});
```

---

## 139. What is RBAC (Role-Based Access Control) and how do you implement it?

```javascript
// Role hierarchy + permission system
const PERMISSIONS = {
    'user':      ['read:own_profile', 'update:own_profile', 'read:posts'],
    'moderator': ['read:own_profile', 'update:own_profile', 'read:posts', 'delete:posts'],
    'admin':     ['*'], // All permissions
};

function hasPermission(userRole, required) {
    const perms = PERMISSIONS[userRole] || [];
    return perms.includes('*') || perms.includes(required);
}

// Middleware
function requirePermission(permission) {
    return (req, res, next) => {
        if (!hasPermission(req.user.role, permission)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}

// Resource-level — user শুধু নিজের post edit করতে পারবে
async function canEditPost(req, res, next) {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    req.post = post;
    next();
}
```

---

## 140. What is multi-factor authentication (MFA) and how do you implement it in Node.js?

```javascript
const { totp } = require('otplib');

// Setup MFA
app.post('/auth/mfa/setup', authenticate, async (req, res) => {
    const secret = totp.generateSecret(); // Random secret
    const otpauth = totp.keyuri(req.user.email, 'MyApp', secret);

    await User.update(req.user.id, { mfaSecret: secret, mfaEnabled: false });

    // QR code generate (user authenticator app এ scan করবে)
    const qrCode = await QRCode.toDataURL(otpauth);
    res.json({ qrCode, secret });
});

// Verify and enable
app.post('/auth/mfa/verify', authenticate, async (req, res) => {
    const user = await User.findById(req.user.id);
    const valid = totp.verify({ token: req.body.code, secret: user.mfaSecret });
    if (!valid) return res.status(400).json({ error: 'Invalid OTP' });

    await User.update(req.user.id, { mfaEnabled: true });
    res.json({ message: 'MFA enabled' });
});

// Login with MFA
app.post('/auth/login', async (req, res) => {
    const user = await verifyCredentials(req.body);
    if (user.mfaEnabled) {
        const valid = totp.verify({ token: req.body.totpCode, secret: user.mfaSecret });
        if (!valid) return res.status(401).json({ error: 'Invalid MFA code' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    res.json({ token });
});
```

---

## 141. How do you implement social login (Google, GitHub) in a Node.js application?

```javascript
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Existing user খুঁজুন
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Email দিয়ে existing account link করুন
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                await user.update({ googleId: profile.id });
            } else {
                // নতুন user তৈরি
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    emailVerified: true // Google verified
                });
            }
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

app.get('/auth/google', passport.authenticate('google'));
app.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET);
        res.redirect(`/app?token=${token}`);
    }
);
```

---

## 142. How do you protect API endpoints from unauthorized access?

```javascript
// JWT middleware — reusable
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
        || req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'Authentication required' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// API Key authentication (internal/partner API)
const apiKeyMiddleware = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(401).json({ error: 'API key required' });

    const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const validKey = await ApiKey.findOne({ keyHash, active: true });
    if (!validKey) return res.status(401).json({ error: 'Invalid API key' });

    await validKey.update({ lastUsedAt: new Date() });
    req.organization = validKey.organizationId;
    next();
};

// IP whitelist (internal service)
const ipWhitelist = ['10.0.0.0/8', '192.168.0.0/16'];
const ipWhitelistMiddleware = (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!isInWhitelist(clientIp, ipWhitelist)) {
        return res.status(403).json({ error: 'Access denied from this IP' });
    }
    next();
};
```
