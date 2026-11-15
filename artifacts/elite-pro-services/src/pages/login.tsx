import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Link } from 'wouter';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const previousTitle = document.title;
    const previousLanguage = document.documentElement.lang;
    const previousDirection = document.documentElement.dir;
    document.title = 'Log in | Elite Pro Services';
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    return () => {
      document.title = previousTitle;
      document.documentElement.lang = previousLanguage;
      document.documentElement.dir = previousDirection;
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('Client access uses email verification codes. Password sign-in is not enabled, and your password was not sent.');
  };

  const handlePasswordRecovery = () => {
    setMessage('Password reset is not used here. Continue with email verification instead.');
  };

  return (
    <main className="login-screen">
      <div className="login-glow login-glow--purple" aria-hidden="true" />
      <div className="login-glow login-glow--blue" aria-hidden="true" />
      <div className="login-noise" aria-hidden="true" />

      <section className="login-card" aria-labelledby="login-title">
        <header className="login-heading">
          <div className="login-mark" aria-hidden="true"><span>E</span></div>
          <h1 id="login-title">Welcome Back</h1>
          <p>Login to continue to your account.</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-sr-only" htmlFor="login-email">Email</label>
            <div className="login-input-wrap">
              <Mail size={20} aria-hidden="true" />
              <input
                id="login-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setMessage('');
                }}
                placeholder="Email"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-sr-only" htmlFor="login-password">Password</label>
            <div className="login-input-wrap">
              <Lock size={20} aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setMessage('');
                }}
                placeholder="Password"
                autoComplete="current-password"
                required
              />
              <button
                className="login-password-toggle"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className="login-options">
            <label className="login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <button type="button" className="login-text-button" onClick={handlePasswordRecovery}>
              Forgot password?
            </button>
          </div>

          <button className="login-submit" type="submit">
            <span>Login</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <p className="login-status" role="status" aria-live="polite">{message}</p>
          {message && (
            <Link className="login-email-link" href="/#newsletter">
              Continue with email verification <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
        </form>

        <footer className="login-signup">
          <p>
            Don&apos;t have an account?{' '}
            <Link className="login-text-button login-signup-link" href="/#newsletter">
              Sign up
            </Link>
          </p>
        </footer>
      </section>
    </main>
  );
}
