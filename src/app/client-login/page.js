'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ClientLogin() {
  const [loginMode, setLoginMode] = useState('password'); 
  
  // Login State
  const [usernameInput, setUsernameInput] = useState(''); 
  const [password, setPassword] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Background State for OTP translation
  const [resolvedEmail, setResolvedEmail] = useState('');
  const [resolvedName, setResolvedName] = useState('Member');

  // Enrollment State
  const [enrollAccount, setEnrollAccount] = useState('');
  const [enrollSSN, setEnrollSSN] = useState('');
  const [showEnrollAccount, setShowEnrollAccount] = useState(false);
  const [showEnrollSSN, setShowEnrollSSN] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Load remembered username on startup
  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_username');
    if (savedUsername) {
      setUsernameInput(savedUsername);
      setRememberMe(true);
    }
  }, []);

  // HELPER: Translate Username to Email & Get Full Name
  const lookupUserCredentials = async (input) => {
    let email = input.trim();
    let fullName = 'Member';
    const isEmail = email.includes('@');

    // IMPORTANT: Make sure this matches your table name EXACTLY (Profiles or profiles)
    let query = supabase.from('profiles').select('email, full_name');
    if (isEmail) query = query.eq('email', email);
    else query = query.eq('username', email);

    const { data: profile, error } = await query.single();
    
    if (error && !isEmail) {
      console.error("SUPABASE ERROR:", error);
      return { error: `Username not found. Please verify your details.` };
    }

    if (profile) {
      email = profile.email;
      if (profile.full_name) fullName = profile.full_name;
    }

    return { email, fullName };
  };

  // FLOW 1: MANAGER BYPASS (Instant Password Login)
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');

    if (!usernameInput || !password) {
      setError('Please enter your username/email and password.');
      setIsLoading(false); return;
    }

    const { email, fullName, error: lookupErr } = await lookupUserCredentials(usernameInput);
    if (lookupErr) { setError(lookupErr); setIsLoading(false); return; }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false); return;
    }

    if (rememberMe) localStorage.setItem('remembered_username', usernameInput);
    else localStorage.removeItem('remembered_username');

    if (data.session) {
      sessionStorage.setItem('client_authenticated', 'true');
      sessionStorage.setItem('current_user', email); 
      sessionStorage.setItem('display_name', fullName); 
      window.location.href = '/client';
    }
  };

  // FLOW 2: CLIENT OTP REQUEST (Send Secure Code)
  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');

    if (!usernameInput) {
      setError('Please enter your registered Email or Username.');
      setIsLoading(false); return;
    }

    const { email, fullName, error: lookupErr } = await lookupUserCredentials(usernameInput);
    if (lookupErr) { setError(lookupErr); setIsLoading(false); return; }

    setResolvedEmail(email);
    setResolvedName(fullName);

    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: { shouldCreateUser: false }
    });

    if (error) {
      setError('Unrecognized account. You must be pre-registered to receive a code.');
    } else {
      setLoginMode('otp_verify'); 
    }
    setIsLoading(false);
  };

  // FLOW 3: CLIENT OTP VERIFY (Submit the Secure Code)
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');

    // ALLOWS 6 TO 8 DIGITS NOW
    if (!otpToken || otpToken.length < 6) {
      setError('Please enter the full secure code sent to your email.');
      setIsLoading(false); return;
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: resolvedEmail, 
      token: otpToken,
      type: 'email'
    });

    if (error) {
      setError('Invalid or expired code. Please try again.');
      setIsLoading(false); return;
    }

    if (rememberMe) localStorage.setItem('remembered_username', usernameInput);
    else localStorage.removeItem('remembered_username');

    if (data.session) {
      sessionStorage.setItem('client_authenticated', 'true');
      sessionStorage.setItem('current_user', resolvedEmail);
      sessionStorage.setItem('display_name', resolvedName);
      window.location.href = '/client';
    }
  };

  // FLOW 4: ENROLLMENT MOCK SUBMIT
  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    
    if (!enrollAccount || !enrollSSN) {
      setError('Please fill out all required fields to continue.');
      setIsLoading(false); return;
    }

    setTimeout(() => {
      setError('Account verification pending. Please contact your Wealth Manager to finalize enrollment.');
      setIsLoading(false);
    }, 1500);
  };

  const styles = `
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: white; margin: 0; padding: 0; color: #1f2937; -webkit-font-smoothing: antialiased; }
    
    .login-top-nav { background-color: #0c2074; color: white; display: flex; justify-content: space-between; align-items: center; padding: 12px 40px; }
    .brand-logo { font-size: 24px; font-weight: 800; letter-spacing: -1px; display: flex; align-items: center; gap: 4px; }
    .brand-logo span { color: white; }
    .brand-logo .accent { color: #e31837; }
    .nav-links { display: flex; gap: 24px; font-size: 14px; font-weight: 500; }
    .nav-links a { color: white; text-decoration: none; cursor: pointer; transition: opacity 0.2s; }
    .nav-links a:hover { opacity: 0.8; text-decoration: underline; }

    .login-container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
    .enroll-container { max-width: 750px; margin: 40px auto; padding: 0 20px; }

    .fdic-banner { border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px 20px; display: flex; align-items: center; gap: 12px; margin-bottom: 40px; font-size: 14px; color: #1f2937; }
    .fdic-bold { font-weight: 800; font-size: 16px; color: #0c2074; letter-spacing: -0.5px; }
    .fdic-italic { font-style: italic; color: #4b5563; }

    .login-grid { display: grid; grid-template-columns: 5fr 4fr; gap: 80px; align-items: start; }

    h1 { font-size: 24px; font-weight: 700; color: #1f2937; margin: 0 0 32px 0; }
    
    .input-group { margin-bottom: 32px; position: relative; width: 100%; }
    .floating-label { display: block; font-size: 16px; color: #4b5563; margin-bottom: 4px; }
    .clean-input { width: 100%; border: none; border-bottom: 1px solid #9ca3af; padding: 8px 0; font-size: 16px; color: #1f2937; outline: none; transition: border-color 0.2s; background: transparent; }
    .clean-input:focus { border-bottom: 2px solid #1d4ed8; padding-bottom: 7px; }
    
    .show-toggle { position: absolute; right: 0; bottom: 8px; background: none; border: none; color: #4b5563; font-size: 14px; font-weight: 500; cursor: pointer; padding: 0; }
    .show-toggle:hover { color: #1d4ed8; text-decoration: underline; }

    .checkbox-row { display: flex; align-items: center; gap: 12px; margin-top: -16px; margin-bottom: 32px; }
    .checkbox-row input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; border: 1px solid #9ca3af; border-radius: 4px; }
    .checkbox-row label { font-size: 16px; color: #4b5563; cursor: pointer; }

    .error-msg { background: #fee2e2; color: #991b1b; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px; font-size: 14px; font-weight: 500; border-left: 4px solid #ef4444; }
    .success-msg { background: #dcfce7; color: #166534; padding: 12px 16px; border-radius: 4px; margin-bottom: 24px; font-size: 14px; font-weight: 500; border-left: 4px solid #22c55e; }

    .btn-solid { width: 100%; background-color: #2563eb; color: white; border: none; padding: 14px; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; display: flex; justify-content: center; align-items: center; gap: 8px; }
    .btn-solid:hover { background-color: #1d4ed8; }
    .btn-solid:disabled { background-color: #9ca3af; cursor: not-allowed; }

    .divider { display: flex; align-items: center; text-align: center; margin: 24px 0; color: #6b7280; font-size: 14px; font-weight: 600; }
    .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #d1d5db; }
    .divider::before { margin-right: 16px; }
    .divider::after { margin-left: 16px; }

    .btn-outline { width: 100%; background-color: transparent; color: #2563eb; border: 1px solid #2563eb; padding: 14px; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.2s; display: flex; justify-content: center; align-items: center; gap: 10px; }
    .btn-outline:hover { background-color: #eff6ff; }
    
    .forgot-link { display: inline-block; margin-top: 32px; color: #2563eb; font-size: 16px; font-weight: 600; text-decoration: none; display: flex; align-items: center; gap: 4px; }
    .forgot-link:hover { text-decoration: underline; }

    .passkey-card { background-color: #f8fafc; border-radius: 12px; padding: 40px; }
    .passkey-title { font-size: 22px; font-weight: 700; color: #1f2937; margin: 24px 0 16px 0; letter-spacing: -0.5px; }
    .passkey-desc { font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 24px; }
    .learn-more { color: #2563eb; font-weight: 600; font-size: 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; }
    .learn-more:hover { text-decoration: underline; }

    .spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    /* Enrollment Specific Styles */
    .enroll-header { font-size: 32px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0; letter-spacing: -0.5px; }
    .enroll-subheader { font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 24px 0; }
    .enroll-text { font-size: 16px; color: #4b5563; margin-bottom: 16px; line-height: 1.5; }
    .enroll-cancel-btn { background: none; border: none; color: #2563eb; font-size: 16px; font-weight: 600; cursor: pointer; padding: 12px; }
    .enroll-cancel-btn:hover { text-decoration: underline; }

    @media (max-width: 900px) {
      .login-grid { grid-template-columns: 1fr; gap: 48px; }
      .login-top-nav { padding: 16px 20px; flex-direction: column; gap: 16px; align-items: flex-start; }
      .nav-links { flex-wrap: wrap; gap: 16px; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <header className="login-top-nav">
        <div className="brand-logo">Global <span className="accent">Vault</span></div>
        <div className="nav-links">
          <a>Customer Service</a>
          <a>Locations</a>
        </div>
      </header>

      {/* --- STANDARD LOGIN VIEW --- */}
      {loginMode !== 'enroll' && (
        <main className="login-container">
          <div className="fdic-banner">
            <span className="fdic-bold">FDIC</span>
            <span className="fdic-italic">FDIC-Insured - Backed by the full faith and credit of the U.S. Government</span>
          </div>

          <div className="login-grid">
            
            {/* DYNAMIC LEFT COLUMN */}
            <div>
              <h1>Account login</h1>
              {error && <div className="error-msg">{error}</div>}

              {/* MODE 1: MANAGER PASSWORD LOGIN */}
              {loginMode === 'password' && (
                <form onSubmit={handlePasswordLogin}>
                  <div className="input-group">
                    <label className="floating-label">Username or Email</label>
                    <input type="text" className="clean-input" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} disabled={isLoading} />
                  </div>

                  <div className="checkbox-row">
                    <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    <label htmlFor="remember">Remember my username</label>
                  </div>

                  <div className="input-group">
                    <label className="floating-label">Password</label>
                    <input type={showPassword ? "text" : "password"} className="clean-input" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                    <button type="button" className="show-toggle" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  
                  <button type="submit" className="btn-solid" disabled={isLoading}>
                    {isLoading ? <><div className="spinner"></div> Authenticating...</> : 'Log in with password'}
                  </button>
                  <div className="divider">OR</div>
                  <button type="button" className="btn-outline" onClick={() => setLoginMode('otp_request')} disabled={isLoading}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                    </svg>
                    Use Secure Email Code
                  </button>
                  <a href="#" className="forgot-link">Forgot username or password <span>›</span></a>
                </form>
              )}

              {/* MODE 2: CLIENT OTP REQUEST */}
              {loginMode === 'otp_request' && (
                <form onSubmit={handleOtpRequest}>
                  <div style={{ marginBottom: '24px', fontSize: '15px', color: '#4b5563', lineHeight: 1.5 }}>
                    Enter your registered Email or Username. We will send a secure, single-use code to your inbox to verify your identity.
                  </div>
                  <div className="input-group">
                    <label className="floating-label">Username or Email</label>
                    <input type="text" className="clean-input" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} disabled={isLoading} />
                  </div>

                  <div className="checkbox-row">
                    <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    <label htmlFor="remember">Remember my username</label>
                  </div>

                  <button type="submit" className="btn-solid" disabled={isLoading}>
                    {isLoading ? <><div className="spinner"></div> Sending Secure Code...</> : 'Send Verification Code'}
                  </button>
                  <div className="divider">OR</div>
                  <button type="button" className="btn-outline" onClick={() => setLoginMode('password')} disabled={isLoading}>
                    Use Password Login
                  </button>
                </form>
              )}

              {/* MODE 3: CLIENT OTP VERIFICATION */}
              {loginMode === 'otp_verify' && (
                <form onSubmit={handleOtpVerify}>
                  <div className="success-msg">✓ Secure code dispatched to the registered email for {usernameInput}</div>
                  <div className="input-group">
                    <label className="floating-label">Enter Secure Code</label>
                    <input 
                      type="text" 
                      maxLength={8} /* UPGRADED TO ALLOW 8 DIGITS */
                      className="clean-input" 
                      value={otpToken} 
                      onChange={(e) => setOtpToken(e.target.value.replace(/[^0-9]/g, ''))} 
                      disabled={isLoading} 
                      placeholder="00000000" 
                      style={{ fontSize: '24px', letterSpacing: '4px', textAlign: 'center' }} 
                    />
                  </div>
                  <button type="submit" className="btn-solid" disabled={isLoading}>
                    {isLoading ? <><div className="spinner"></div> Verifying Identity...</> : 'Verify & Log In'}
                  </button>
                  <div className="divider">OR</div>
                  <button type="button" className="btn-outline" onClick={() => setLoginMode('otp_request')} disabled={isLoading}>
                    Request a New Code
                  </button>
                </form>
              )}

              {/* ENROLLMENT CALL-TO-ACTION */}
              <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ fontSize: '16px', color: '#4b5563', margin: '0 0 16px 0', fontWeight: '500' }}>New to Global Vault?</p>
                <button type="button" className="btn-outline" onClick={() => setLoginMode('enroll')} disabled={isLoading}>
                  Enroll in online banking
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div>
              <div className="passkey-card">
                <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 8L12 16V30C12 43.08 20.52 55.22 32 60C43.48 55.22 52 43.08 52 30V16L32 8Z" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M24 32L29 37L40 25" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="passkey-title">Enhanced Security Active</h2>
                <p className="passkey-desc">To protect your assets, Global Vault utilizes military-grade email verification. When you request a code, a secure, single-use token will be dispatched directly to your registered inbox.</p>
                <a href="#" className="learn-more">Learn about our security <span>›</span></a>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* --- ENROLLMENT VIEW --- */}
      {loginMode === 'enroll' && (
        <main className="enroll-container">
          <h1 className="enroll-header">Let's get started.</h1>
          <h2 className="enroll-subheader">Online and mobile banking enrollment</h2>

          <p className="enroll-text">
            We suggest enrolling using information from your checking or savings account, if you have one. If not, use a different type of account.
          </p>
          <p className="enroll-text" style={{ marginBottom: '40px' }}>
            <strong>Business account holders,</strong> be sure to enroll using your business account number so you have full access to our suite of robust business tools and capabilities.
          </p>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleEnrollSubmit}>
            <div className="input-group">
              <label className="floating-label">Card or account number</label>
              <input 
                type={showEnrollAccount ? "text" : "password"} 
                className="clean-input" 
                value={enrollAccount} 
                onChange={(e) => setEnrollAccount(e.target.value.replace(/[^0-9]/g, ''))} 
                disabled={isLoading}
              />
              <button type="button" className="show-toggle" onClick={() => setShowEnrollAccount(!showEnrollAccount)} disabled={isLoading}>
                {showEnrollAccount ? 'Hide' : 'Show'}
              </button>
            </div>

            <div className="input-group">
              <label className="floating-label">Last 4 digits of SSN</label>
              <input 
                type={showEnrollSSN ? "text" : "password"} 
                maxLength={4} 
                className="clean-input" 
                value={enrollSSN} 
                onChange={(e) => setEnrollSSN(e.target.value.replace(/[^0-9]/g, ''))} 
                disabled={isLoading}
              />
              <button type="button" className="show-toggle" onClick={() => setShowEnrollSSN(!showEnrollSSN)} disabled={isLoading}>
                {showEnrollSSN ? 'Hide' : 'Show'}
              </button>
            </div>

            <a href="#" className="forgot-link" style={{ fontSize: '14px', marginTop: '-16px', marginBottom: '40px' }}>
              I don't have a Social Security number.
            </a>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center' }}>
              <button type="button" className="enroll-cancel-btn" onClick={() => setLoginMode('password')} disabled={isLoading}>
                Cancel
              </button>
              <button type="submit" className="btn-solid" style={{ width: 'auto', padding: '12px 32px' }} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </form>
        </main>
      )}
    </>
  );
}