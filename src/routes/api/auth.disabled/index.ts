import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { initializeLucia, verifyUserCredentials, createUser, getUserById } from '../../../lib/auth';
import { authGuard, requireAuth } from '../../../middleware/auth-guard';
import type { Env, User } from '../../../types';

const auth = new Hono<{ Bindings: Env }>();

// Apply auth guard to all routes
auth.use('*', authGuard);

// Login endpoint
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json<{ email: string; password: string }>();
    
    if (!body.email || !body.password) {
      return c.json({
        error: 'Email and password are required',
      }, 400);
    }
    
    const user = await verifyUserCredentials(c.env, body.email, body.password);
    
    if (!user) {
      return c.json({
        error: 'Invalid email or password',
      }, 401);
    }
    
    const lucia = initializeLucia(c.env);
    const session = await lucia.createSession(user.id, {});
    const cookie = lucia.createSessionCookie(session.id);
    
    c.header('Set-Cookie', cookie.serialize());
    
    return c.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Logout endpoint
auth.post('/logout', requireAuth(), async (c) => {
  try {
    const lucia = initializeLucia(c.env);
    const sessionId = getCookie(c, lucia.sessionCookieName);
    
    if (sessionId) {
      await lucia.invalidateSession(sessionId);
    }
    
    const cookie = lucia.createBlankSessionCookie();
    c.header('Set-Cookie', cookie.serialize());
    
    return c.json({
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return c.json({
      error: 'Logout failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Get current user
auth.get('/me', requireAuth(), async (c) => {
  try {
    const user = c.get('user') as User;
    
    return c.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        created_at: user.created_at,
        last_login: user.last_login,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return c.json({
      error: 'Failed to get user info',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Register endpoint (admin only for now)
auth.post('/register', requireAuth(['admin']), async (c) => {
  try {
    const body = await c.req.json<{
      email: string;
      username: string;
      password: string;
      role?: 'admin' | 'analyst' | 'viewer';
    }>();
    
    if (!body.email || !body.username || !body.password) {
      return c.json({
        error: 'Email, username, and password are required',
      }, 400);
    }
    
    // Check if user already exists
    const existingUser = await c.env.CYDEX_DB
      .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
      .bind(body.email, body.username)
      .first();
    
    if (existingUser) {
      return c.json({
        error: 'User with this email or username already exists',
      }, 409);
    }
    
    const user = await createUser(
      c.env,
      body.email,
      body.username,
      body.password,
      body.role || 'viewer'
    );
    
    return c.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// Session validation endpoint
auth.get('/validate', async (c) => {
  const user = c.get('user') as User | null;
  const session = c.get('session');
  
  return c.json({
    authenticated: !!user,
    user: user ? {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    } : null,
    session: session ? {
      id: session.id,
      expires_at: session.expiresAt,
    } : null,
  });
});

export default auth;