'use client';

import { useState, useEffect, useRef } from 'react'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { supabase } from '../../lib/supabaseClient';

const BrandLogo = ({ size = 36, textColor = "#001e79" }) => (
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

export default function ClientDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState(''); 
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [timeGreeting, setTimeGreeting] = useState('Good morning');
  
  // --- COMPLIANCE LOCK ---
  const [isRestricted, setIsRestricted] = useState(true); 

  const currentViewRef = useRef(currentView);
  useEffect(() => { currentViewRef.current = currentView; }, [currentView]);
  
  // App & Data State
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 
  const [systemAlert, setSystemAlert] = useState('');
  const [lastLoginTime, setLastLoginTime] = useState(''); 
  const [isProcessing, setIsProcessing] = useState(true); 
  const [txFilter, setTxFilter] = useState('All');

  // Profile Update State
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('+1 (919) ***-**42'); 
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [updateOtp, setUpdateOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  // Password Update State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwdOtpModal, setShowPwdOtpModal] = useState(false);
  const [pwdUpdateOtp, setPwdUpdateOtp] = useState('');
  const [enteredPwdOtp, setEnteredPwdOtp] = useState('');

  // Transfer State
  const [transferType, setTransferType] = useState('external'); 
  const [transferAmount, setTransferAmount] = useState(''); 
  const [formattedAmount, setFormattedAmount] = useState(''); 
  const [transferDesc, setTransferDesc] = useState('');
  const [recipientName, setRecipientName] = useState(''); 
  const [recipientAccount, setRecipientAccount] = useState(''); 
  const [routingNumber, setRoutingNumber] = useState(''); 
  const [fromAccount, setFromAccount] = useState('Main');
  const [toAccount, setToAccount] = useState('Vault'); 
  const [successMsg, setSuccessMsg] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  
  // Database Balances
  const [baseBalance, setBaseBalance] = useState(0.00);
  const [baseSavingsBalance, setBaseSavingsBalance] = useState(0.00);

  // Baselines connected to state
  const initialMain = baseBalance; 
  const initialVault = baseSavingsBalance; 
  
  const mockLoginHistory = [
    { id: 1, date: new Date().toLocaleString(), device: navigator.userAgent?.includes('Mac') ? 'Mac OS - Safari' : 'Windows - Chrome', location: 'Current Session' },
    { id: 2, date: '06/22/2026, 08:14 AM', device: 'iOS - Safari', location: 'Mobile Network' },
    { id: 3, date: '06/18/2026, 14:32 PM', device: 'Mac OS - Chrome', location: 'Verified IP' }
  ];

  useEffect(() => {
    const isAuth = sessionStorage.getItem('client_authenticated');
    if (!isAuth) { window.location.href = '/client-login'; return; }
    
    const currentUser = sessionStorage.getItem('current_user') || 'Member';
    const displayName = sessionStorage.getItem('display_name') || currentUser.split('@')[0];
    
    setUsername(displayName); 
    setUserEmail(currentUser); 
    setProfileEmail(currentUser); 
    
    const now = new Date();
    setLastLoginTime(`${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`);

    const hour = now.getHours();
    if (hour < 12) setTimeGreeting('Good morning');
    else if (hour < 18) setTimeGreeting('Good afternoon');
    else setTimeGreeting('Good evening');

    setIsMounted(true); 
    fetchCloudTransactions(currentUser);
  }, []);

  const simulateNetworkLatency = async (callback) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800)); 
    await callback();
    setIsProcessing(false);
  };

  const fetchCloudTransactions = async (user) => {
    simulateNetworkLatency(async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('account_balance, savings_balance, full_name')
        .eq('email', user)
        .single();
        
      if (profile) {
        if (profile.account_balance !== null) setBaseBalance(profile.account_balance);
        if (profile.savings_balance !== null) setBaseSavingsBalance(profile.savings_balance);
        if (profile.full_name) setUsername(profile.full_name);
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user)
        .order('date', { ascending: false })
        .order('id', { ascending: false });
      if (data) setTransactions(data);
    });
  };

  const calculateBalance = (targetAccount, startingAmount) => {
    let balance = startingAmount;
    transactions.forEach(t => {
      const tAccount = t.account || 'Main'; 
      if (t.status === 'approved' && tAccount === targetAccount) {
        if (t.type === 'Credit') balance += Number(t.amount);
        if (t.type === 'Debit') balance -= Number(t.amount);
      }
    });
    return balance;
  };

  const mainBalance = calculateBalance('Main', initialMain);
  const vaultBalance = calculateBalance('Vault', initialVault);
  const totalAssets = mainBalance + vaultBalance;

  const totalIn = transactions.filter(t => t.type === 'Credit' && t.status === 'approved').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalOut = transactions.filter(t => t.type === 'Debit' && t.status === 'approved').reduce((acc, t) => acc + Number(t.amount), 0);

  const handleNumericInput = (e, setter) => { setter(e.target.value.replace(/[^0-9]/g, '')); };

  const handleAmountChange = (e) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    const number = Number(numericValue);
    setTransferAmount(numericValue); 
    setFormattedAmount(numericValue ? number.toLocaleString('en-US') : ''); 
  };

  // --- COMPLIANCE INTERCEPTOR ---
  const handleSecureAction = (actionCallback) => {
    if (isRestricted) {
      setActiveModal('restricted');
    } else {
      actionCallback();
    }
  };

  const handleSaveChanges = () => {
    if (profileEmail !== userEmail) {
      const code = Math.floor(10000000 + Math.random() * 90000000).toString(); 
      setUpdateOtp(code);
      setPendingEmail(profileEmail);
      
      console.log(`[MOCK EMAIL SERVER] To: ${userEmail} | Subject: Security Verification | Body: Your 8-digit code is: ${code}`);

      alert(`[SECURITY ALERT] You are attempting to change your email address.\n\nAn 8-digit verification code has been securely sent to your currently registered email: ${userEmail}\n\nPlease check your inbox to proceed.`);
      setShowOtpModal(true);
    } else {
      setSystemAlert('Profile details saved successfully.');
      setTimeout(() => setSystemAlert(''), 3000);
    }
  };

  const handleVerifyUpdate = async () => {
    if (enteredOtp === updateOtp) {
      const { error } = await supabase
        .from('profiles')
        .update({ email: pendingEmail })
        .eq('email', userEmail);
        
      if (!error) {
        await supabase.from('transactions').update({ user_id: pendingEmail }).eq('user_id', userEmail);

        setUserEmail(pendingEmail);
        sessionStorage.setItem('current_user', pendingEmail);
        setSystemAlert('Email address successfully verified and updated.');
        setShowOtpModal(false);
        setEnteredOtp('');
        setTimeout(() => setSystemAlert(''), 3000);
      } else {
        alert('Database error during update. Secure connection failed.');
      }
    } else {
      alert('Invalid security code. Please try again.');
    }
  };

  // --- PASSWORD UPDATE LOGIC ---
  const handlePasswordUpdateRequest = () => {
    if (!newPassword || !confirmPassword) {
      setSystemAlert('Please fill in both password fields.');
      setTimeout(() => setSystemAlert(''), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setSystemAlert('Passwords do not match.');
      setTimeout(() => setSystemAlert(''), 3000);
      return;
    }

    const code = Math.floor(10000000 + Math.random() * 90000000).toString(); 
    setPwdUpdateOtp(code);
    
    console.log(`[MOCK EMAIL SERVER] To: ${userEmail} | Subject: Security Verification | Body: Your 8-digit code is: ${code}`);

    alert(`[SECURITY ALERT] You are attempting to change your account password.\n\nAn 8-digit verification code has been securely sent to your registered email: ${userEmail}\n\nPlease check your inbox to proceed.`);
    setShowPwdOtpModal(true);
  };

  const handleVerifyPasswordUpdate = async () => {
    if (enteredPwdOtp === pwdUpdateOtp) {
      // Logic for actual Supabase auth update goes here in production
      setSystemAlert('Password successfully verified and updated.');
      setShowPwdOtpModal(false);
      setEnteredPwdOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSystemAlert(''), 3000);
    } else {
      alert('Invalid security code. Please try again.');
    }
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setIsTransferring(true);
    
    const amountVal = Number(transferAmount);
    if (!amountVal || amountVal <= 0) { setIsTransferring(false); return; }

    const availableFunds = fromAccount === 'Main' ? mainBalance : vaultBalance;
    if (amountVal > availableFunds) {
      setSuccessMsg('❌ ERROR: Insufficient funds available.'); 
      setTimeout(() => setSuccessMsg(''), 4000); 
      setIsTransferring(false);
      return;
    }

    if (transferType === 'internal') {
      if (fromAccount === toAccount) {
        setSuccessMsg('❌ ERROR: Please select different accounts.');
        setIsTransferring(false); return;
      }

      const today = new Date().toISOString().split('T')[0];
      const debitTx = { type: 'Debit', desc: `Transfer to ${toAccount === 'Main' ? 'Checking' : 'Savings'}`, amount: amountVal, status: 'approved', account: fromAccount, user_id: userEmail, date: today };
      const creditTx = { type: 'Credit', desc: `Transfer from ${fromAccount === 'Main' ? 'Checking' : 'Savings'}`, amount: amountVal, status: 'approved', account: toAccount, user_id: userEmail, date: today };

      await new Promise(resolve => setTimeout(resolve, 1000)); 
      const { error } = await supabase.from('transactions').insert([debitTx, creditTx]);

      if (!error) {
        const { data } = await supabase.from('transactions').select('*').eq('user_id', userEmail).order('date', { ascending: false }).order('id', { ascending: false });
        if (data) setTransactions(data);
        
        setTransferAmount(''); setFormattedAmount('');
        setSuccessMsg('✓ Transfer Complete.'); 
        setTimeout(() => { setActiveModal(null); setSuccessMsg(''); }, 2000);
      } else {
        setSuccessMsg('❌ ERROR: Secure connection failed.');
      }
    } else {
      const newTx = {
        type: 'Debit',
        desc: transferDesc || `Wire: ${recipientName} (••••${recipientAccount.slice(-4)})`,
        amount: amountVal,
        status: 'pending',
        account: fromAccount,
        user_id: userEmail,
        date: new Date().toISOString().split('T')[0]
      };

      await new Promise(resolve => setTimeout(resolve, 1500)); 
      const { error } = await supabase.from('transactions').insert([newTx]);

      if (!error) {
        const { data } = await supabase.from('transactions').select('*').eq('user_id', userEmail).order('date', { ascending: false }).order('id', { ascending: false });
        if (data) setTransactions(data);
        
        setTransferAmount(''); setFormattedAmount(''); setTransferDesc(''); setRecipientAccount(''); setRoutingNumber(''); setRecipientName('');
        setSuccessMsg('✓ Transfer Initiated. Waiting for network clearing.'); 
        setTimeout(() => { setActiveModal(null); setSuccessMsg(''); }, 3000);
      } else {
        setSuccessMsg('❌ ERROR: Secure connection failed.');
      }
    }
    
    setIsTransferring(false);
  };

  const generatePDFStatement = () => {
    const doc = new jsPDF();
    doc.text("Global Vault - Official Statement", 14, 22);
    const tableRows = transactions.map(t => [
      t.date, 
      t.desc, 
      t.account === 'Vault' ? 'Savings ...1195' : 'Checking ...8842', 
      t.status.toUpperCase(), 
      `${t.type === 'Credit' ? '+' : '-'}$${Number(t.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}`
    ]);
    autoTable(doc, { 
      startY: 30, 
      head: [["Date", "Description", "Account", "Status", "Amount"]], 
      body: tableRows, 
      theme: 'grid' 
    });
    doc.save(`Activity_Statement.pdf`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('client_authenticated'); 
    sessionStorage.removeItem('current_user');
    window.location.href = '/client-login';
  };

  const triggerMockFeature = (feature) => {
    setSystemAlert(`Module "${feature}" is secure and active.`);
    setTimeout(() => setSystemAlert(''), 3000);
  };

  const changeView = (view) => {
    if (view !== currentView) {
      simulateNetworkLatency(() => setCurrentView(view));
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (txFilter === 'All') return true;
    return t.status.toLowerCase() === txFilter.toLowerCase();
  });

  useEffect(() => {
    let inactivityTimer;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        alert("For your security, your session has expired due to 5 minutes of inactivity.");
        handleLogout();
      }, 300000); 
    };

    resetTimer(); 

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    activityEvents.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, []);

  const styles = `
    :root {
      --brand-blue: #0c2074;
      --hero-blue: #0045a5;
      --brand-red: #e31837;
      --bg-gray: #f4f5f7;
      --text-main: #1f2937;
      --text-muted: #6b7280;
      --border-light: #e5e7eb;
    }
    
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    html, body { background-color: var(--bg-gray); margin: 0; padding: 0; color: var(--text-main); -webkit-font-smoothing: antialiased; max-width: 100vw; overflow-x: hidden; }
    
    .loader-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(255,255,255,0.8); z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
    .spinner { border: 4px solid var(--border-light); border-top: 4px solid var(--brand-red); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 16px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    /* Desktop Header */
    .desktop-header { background: white; border-bottom: 1px solid var(--border-light); width: 100%; }
    .top-utility-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 40px; max-width: 1400px; margin: 0 auto; gap: 16px; flex-wrap: wrap; }
    
    /* Responsive Search */
    .search-bar { background: var(--bg-gray); border-radius: 24px; display: flex; align-items: center; padding: 8px 16px; width: 100%; max-width: 300px; flex: 1; min-width: 200px; }
    .search-bar input { background: transparent; border: none; outline: none; width: 100%; font-size: 14px; margin-left: 8px; }
    
    .top-actions { display: flex; align-items: center; gap: 24px; font-size: 14px; font-weight: 500; color: var(--text-main); flex-wrap: wrap; }
    .top-actions span { cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
    .top-actions span:hover { color: var(--hero-blue); }
    
    .main-nav { background: white; border-bottom: 1px solid var(--border-light); padding: 0 40px; width: 100%; overflow-x: auto; }
    .nav-container { max-width: 1400px; margin: 0 auto; display: flex; gap: 32px; min-width: max-content; }
    .nav-tab { padding: 16px 0; font-size: 15px; font-weight: 600; color: var(--text-muted); cursor: pointer; border-bottom: 3px solid transparent; transition: all 0.2s; white-space: nowrap; }
    .nav-tab.active { color: var(--hero-blue); border-bottom: 3px solid var(--hero-blue); }
    .nav-tab:hover:not(.active) { color: var(--text-main); }

    /* Mobile Header */
    .mobile-header { display: none; background: var(--hero-blue); color: white; padding: 20px 20px 0 20px; width: 100%; }
    .mobile-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; width: 100%; gap: 16px; padding-top: 8px; }
    .mobile-search { background: rgba(255,255,255,0.2); border-radius: 20px; padding: 6px 12px; display: flex; align-items: center; margin-bottom: 20px; width: 100%; }
    .mobile-search input { background: transparent; border: none; color: white; width: 100%; outline: none; margin: 0 8px; }
    .mobile-search input::placeholder { color: rgba(255,255,255,0.8); }
    
    /* Modern Header Bell Style */
    .mobile-bell-btn { background: none; border: none; color: white; font-size: 22px; cursor: pointer; padding: 4px; position: relative; display: flex; align-items: center; justify-content: center; }
    .mobile-bell-badge { position: absolute; top: 2px; right: 2px; width: 8px; height: 8px; background-color: var(--brand-red); border-radius: 50%; border: 1px solid var(--hero-blue); }
    
    .mobile-pills { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; -ms-overflow-style: none; }
    .mobile-pills::-webkit-scrollbar { display: none; }
    .pill { background: white; color: var(--hero-blue); padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

    /* Desktop Hero */
    .desktop-hero-container { max-width: 1400px; margin: 0 auto; padding: 16px 40px 0 40px; width: 100%; }
    .desktop-hero { background: var(--hero-blue); border-radius: 12px; padding: 24px 40px; color: white; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 25px -5px rgba(0,69,165,0.3); flex-wrap: wrap; gap: 24px; }
    .hero-text { flex: 1; min-width: 250px; }
    .hero-text h1 { margin: 0 0 4px 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; word-break: break-word; }
    .hero-text p { margin: 0; font-size: 16px; color: rgba(255,255,255,0.9); }
    
    /* Responsive Promo Card */
    .promo-card { background: white; color: var(--text-main); padding: 16px 24px; border-radius: 8px; width: 100%; max-width: 350px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); flex-shrink: 0; }
    .promo-card h3 { margin: 0 0 4px 0; font-size: 16px; color: var(--text-main); }
    .promo-card p { margin: 0 0 12px 0; font-size: 13px; color: var(--text-muted); line-height: 1.4; }
    .btn-red { background: var(--brand-red); color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; }

    /* Layout */
    .main-container { max-width: 1400px; margin: 0 auto; padding: 16px 40px 80px 40px; width: 100%; }
    
    /* Action Row - DESKTOP ONLY SPACING ENFORCED */
    .action-row { display: flex !important; justify-content: flex-start !important; gap: 12px !important; margin: 24px 0 32px 0 !important; flex-wrap: wrap !important; align-items: center !important; }
    .action-row button, .action-row a { margin: 0 !important; }
    
    .btn-blue-outline { background: white; color: var(--hero-blue); border: 1px solid var(--hero-blue); padding: 10px 24px; border-radius: 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; display: inline-block; }
    .btn-blue-outline:hover { background: var(--hero-blue); color: white; }
    .btn-blue-solid { background: var(--hero-blue); color: white; border: 1px solid var(--hero-blue); padding: 10px 24px; border-radius: 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; display: inline-block; }
    .btn-blue-solid:hover { background: var(--brand-blue); }

    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    
    /* Cards */
    .us-card { background: white; border-radius: 12px; border: 1px solid var(--border-light); padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.02); overflow: hidden; }
    .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
    .card-title { font-size: 20px; font-weight: 700; color: var(--text-main); margin: 0; }
    .card-meta { font-size: 13px; color: var(--hero-blue); display: flex; align-items: center; gap: 4px; cursor: pointer; white-space: nowrap; }
    
    .list-header { font-size: 12px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 16px; }
    .account-item { border: 1px solid var(--border-light); border-radius: 8px; padding: 20px; margin-bottom: 16px; display: flex; flex-direction: column; gap: 16px; transition: box-shadow 0.2s; cursor: pointer; }
    .account-item:hover { box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    
    .acc-inner { display: flex; justify-content: space-between; align-items: center; width: 100%; flex-wrap: wrap; gap: 16px; }
    .acc-left { display: flex; gap: 16px; align-items: center; }
    .acc-icon-box { width: 48px; height: 32px; background: linear-gradient(135deg, #0c2074, #0045a5); border-radius: 4px; position: relative; overflow: hidden; border: 1px solid rgba(0,0,0,0.1); flex-shrink: 0; }
    .acc-icon-box::after { content: 'Visa'; position: absolute; bottom: 2px; right: 4px; color: white; font-size: 8px; font-weight: bold; font-style: italic; }
    .acc-icon-box.red { background: linear-gradient(135deg, #e31837, #b01028); }
    .acc-icon-box.red::after { content: 'Vault'; }
    
    .acc-name { font-size: 16px; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .acc-number { font-size: 16px; color: var(--text-muted); font-weight: 400; }
    
    .acc-right { text-align: left; }
    .acc-balance { font-size: 24px; font-weight: 700; color: var(--text-main); word-break: break-word; }
    
    /* Cash Flow */
    .flow-row { display: flex; justify-content: space-between; margin-bottom: 16px; gap: 16px; flex-wrap: wrap; }
    .flow-block { flex: 1; min-width: 120px; }
    .flow-label { font-size: 13px; color: var(--text-muted); font-weight: 500; margin-bottom: 4px; }
    .flow-val { font-size: 20px; font-weight: 700; word-break: break-word; }
    .val-in { color: #166534; }
    .val-out { color: var(--text-main); }
    
    /* Transactions */
    .filter-pills { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
    .f-pill { background: white; border: 1px solid var(--border-light); padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; cursor: pointer; color: var(--text-muted); transition: all 0.2s; white-space: nowrap; }
    .f-pill.active { background: var(--hero-blue); color: white; border-color: var(--hero-blue); }
    
    .table-wrapper { overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
    .tx-table { width: 100%; border-collapse: collapse; min-width: 500px; }
    .tx-table th { padding: 12px 16px; text-align: left; font-size: 13px; color: var(--text-muted); border-bottom: 1px solid var(--border-light); font-weight: 500; white-space: nowrap; }
    .tx-table td { padding: 16px; border-bottom: 1px solid var(--border-light); font-size: 14px; }
    .tx-desc { font-weight: 600; color: var(--text-main); min-width: 150px; }
    .status-badge { font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 600; background: var(--bg-gray); white-space: nowrap; }
    
    /* Clickable Rows for Transaction Details */
    .clickable-row { cursor: pointer; transition: background-color 0.2s; }
    .clickable-row:hover { background-color: #f8fafc; }

    /* Transactions - Mobile Stacked Cards */
    .mobile-tx-list { display: flex; flex-direction: column; }
    .m-tx-card { border-bottom: 1px solid var(--border-light); padding: 16px 0; display: flex; flex-direction: column; gap: 8px; }
    .m-tx-card:last-child { border-bottom: none; }
    .m-tx-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .m-tx-desc { font-weight: 600; color: var(--text-main); font-size: 14px; line-height: 1.3; word-break: break-word; }
    .m-tx-amount { font-weight: 700; font-size: 15px; white-space: nowrap; flex-shrink: 0; }
    .m-tx-date { font-size: 12px; color: var(--text-muted); }

    /* Forms */
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .input-group { margin-bottom: 20px; width: 100%; }
    .input-label { display: block; font-size: 14px; font-weight: 600; color: var(--text-main); margin-bottom: 8px; }
    .input-field { width: 100%; padding: 12px 16px; border: 1px solid var(--border-light); border-radius: 8px; font-size: 16px; transition: border-color 0.2s; outline: none; }
    .input-field:focus { border-color: var(--hero-blue); box-shadow: 0 0 0 1px var(--hero-blue); }
    .input-field:disabled { background: var(--bg-gray); color: var(--text-muted); }

    /* Modal */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; backdrop-filter: blur(2px); box-sizing: border-box; }
    .modal-content { background: white; width: 100%; max-width: 500px; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-height: 90vh; overflow-y: auto; position: relative; margin: 0 auto; }
    .modal-header { padding: 20px 24px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: white; z-index: 10; }
    .modal-header h2 { margin: 0; font-size: 18px; color: var(--text-main); }
    
    .modal-toggle { display: flex; gap: 8px; margin-bottom: 24px; background: #f4f5f7; padding: 4px; border-radius: 8px; }
    .modal-toggle-btn { flex: 1; padding: 10px; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; transition: all 0.2s; }
    .modal-toggle-btn.active { background: white; font-weight: 600; color: #1f2937; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .modal-toggle-btn.inactive { background: transparent; color: #6b7280; font-weight: 500; }

    .toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%); background: #1f2937; color: white; padding: 16px 24px; border-radius: 8px; font-weight: 500; font-size: 14px; z-index: 9999; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.2); white-space: nowrap; max-width: 90vw; }

    /* Mobile Bottom Nav Restructured */
    .bottom-nav { display: none; position: fixed; bottom: 0; left: 0; width: 100%; background: #f8fafc; border-top: 1px solid var(--border-light); z-index: 100; justify-content: space-between; padding: 10px 16px 16px 16px; box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.05); }
    .b-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #64748b; font-size: 10px; font-weight: 600; cursor: pointer; flex: 1; text-align: center; }
    .b-nav-item.active { color: var(--hero-blue); }
    .b-nav-icon { font-size: 20px; font-weight: normal; }

    /* --- RESPONSIVE BREAKPOINTS --- */
    .show-desktop { display: block; }
    .show-mobile { display: none; }
    
    @media (max-width: 1024px) {
      .top-utility-bar { padding: 16px 24px; }
      .main-nav { padding: 0 24px; }
      .desktop-hero-container { padding: 16px 24px 0 24px; }
      .main-container { padding: 16px 24px 80px 24px; }
    }

    @media (max-width: 900px) {
      .dashboard-grid { grid-template-columns: 1fr; }
      .desktop-hero { flex-direction: column; text-align: left; align-items: stretch; }
      .promo-card { max-width: 100%; }
      .form-grid { grid-template-columns: 1fr; }
    }
    
    @media (max-width: 850px) {
      /* ENFORCING DISPLAY NONE WITH !IMPORTANT TO PREVENT DOUBLE RENDERING */
      .show-desktop, .desktop-header, .desktop-hero-container, .action-row { display: none !important; }
      .show-mobile { display: block; }
      .mobile-header, .bottom-nav { display: flex; }
      .mobile-header { flex-direction: column; }
      
      .main-container { padding: 16px 16px 80px 16px; }
      .us-card { padding: 16px; }
      
      .acc-right { width: 100%; margin-top: 8px; }
      .acc-balance { font-size: 22px; }
      .acc-name { font-size: 15px; }
      .acc-number { font-size: 14px; }
      .card-title { font-size: 18px; }
      
      .mobile-greeting { font-size: 20px; margin-bottom: 12px; }
      
      .toast { bottom: 80px; white-space: normal; text-align: center; }
    }
  `;

  if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: '#f4f5f7' }}></div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {isProcessing && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <div style={{ color: '#1f2937', fontWeight: '600' }}>Processing...</div>
        </div>
      )}
      
      {systemAlert && <div className="toast">ℹ️ {systemAlert}</div>}

      {/* --- COMPLIANCE RESTRICTION MODAL --- */}
      {activeModal === 'restricted' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: '#fee2e2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <h2 style={{ fontSize: '24px', color: '#1f2937', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>Account Restricted</h2>
            <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.5', margin: '0 0 32px 0' }}>
              For your security, your account has been temporarily restricted. To restore full functionality, including transfers and bill pay, please visit a local branch in person with a valid government-issued ID.
            </p>
            <button className="btn-blue-solid" style={{ width: '100%', marginBottom: '12px' }} onClick={() => { setActiveModal(null); triggerMockFeature('Branch Locator'); }}>Find a branch</button>
            <button className="btn-blue-outline" style={{ width: '100%' }} onClick={() => setActiveModal(null)}>Dismiss</button>
          </div>
        </div>
      )}

      {/* --- NOTIFICATIONS LIST MODAL --- */}
      {activeModal === 'notifications' && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px', backgroundColor: '#f8fafc' }}>
            <div className="modal-header" style={{ backgroundColor: 'white' }}>
              <h2>Notifications</h2>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {isRestricted && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ color: '#dc2626', marginTop: '2px', fontSize: '20px' }}>⚠</div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#991b1b', fontSize: '15px', marginBottom: '4px' }}>Account Restricted</div>
                    <div style={{ fontSize: '13px', color: '#7f1d1d', lineHeight: '1.5' }}>Action required. Please visit a branch in person to verify your identity and restore access to transfers and bill pay.</div>
                  </div>
                </div>
              )}
              
              <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ color: '#2563eb', marginTop: '2px', fontSize: '20px' }}>📄</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px', marginBottom: '4px' }}>Monthly Statement Ready</div>
                  <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>Your account statement for the previous month is now available to view or download.</div>
                </div>
              </div>

              <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ color: '#16a34a', marginTop: '2px', fontSize: '20px' }}>🔒</div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px', marginBottom: '4px' }}>New Login Detected</div>
                  <div style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>A secure login was detected from a new device. If this was you, no action is needed.</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* --- TRANSACTION DETAILS MODAL --- */}
      {activeModal === 'txDetails' && selectedTx && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button onClick={() => { setActiveModal(null); setSelectedTx(null); }} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '32px', fontWeight: '700', color: selectedTx.type === 'Credit' ? '#166534' : '#1f2937' }}>
                  {selectedTx.type === 'Credit' ? '+' : '-'}${Number(selectedTx.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
                  {selectedTx.status === 'approved' ? 'Completed' : selectedTx.status.charAt(0).toUpperCase() + selectedTx.status.slice(1)}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Date</span>
                  <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px' }}>{selectedTx.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Description</span>
                  <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px', textAlign: 'right' }}>{selectedTx.desc}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Type</span>
                  <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px' }}>{selectedTx.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Account</span>
                  <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px' }}>
                    {selectedTx.account === 'Vault' ? 'Savings Vault ...1195' : 'Checking ...8842'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px' }}>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Transaction ID</span>
                  <span style={{ fontWeight: '500', color: '#1f2937', fontSize: '14px' }}>TXN-{selectedTx.id.toString().padStart(6, '0')}</span>
                </div>
              </div>
              
              <button className="btn-blue-solid" style={{ width: '100%', marginTop: '24px' }} onClick={() => { setActiveModal(null); setSelectedTx(null); }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- EMAIL OTP VERIFICATION MODAL --- */}
      {showOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Security Verification</h2>
              <button onClick={() => setShowOtpModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '24px' }}>
                We sent a verification code to your currently registered email (<b>{userEmail}</b>). Please enter it below to authorize changing your email to {pendingEmail}.
              </p>
              <div className="input-group">
                <label className="input-label">8-Digit Security Code</label>
                <input type="text" className="input-field" value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} placeholder="Enter code" />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setShowOtpModal(false)} className="btn-blue-outline" style={{ flex: 1, padding: '14px', minWidth: '120px' }}>Cancel</button>
                <button type="button" onClick={handleVerifyUpdate} className="btn-blue-solid" style={{ flex: 1, padding: '14px', minWidth: '150px' }}>
                  Verify & Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PASSWORD OTP VERIFICATION MODAL --- */}
      {showPwdOtpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Security Verification</h2>
              <button onClick={() => setShowPwdOtpModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '24px' }}>
                We sent a verification code to your registered email (<b>{userEmail}</b>). Please enter it below to authorize changing your account password.
              </p>
              <div className="input-group">
                <label className="input-label">8-Digit Security Code</label>
                <input type="text" className="input-field" value={enteredPwdOtp} onChange={(e) => setEnteredPwdOtp(e.target.value)} placeholder="Enter code" />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setShowPwdOtpModal(false)} className="btn-blue-outline" style={{ flex: 1, padding: '14px', minWidth: '120px' }}>Cancel</button>
                <button type="button" onClick={handleVerifyPasswordUpdate} className="btn-blue-solid" style={{ flex: 1, padding: '14px', minWidth: '150px' }}>
                  Verify & Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ENHANCED TRANSFER MODAL */}
      {activeModal === 'transfer' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Transfer money</h2>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#6b7280' }}>×</button>
            </div>
            <div style={{ padding: '24px' }}>
              
              <div className="modal-toggle">
                <button type="button" className={`modal-toggle-btn ${transferType === 'external' ? 'active' : 'inactive'}`} onClick={() => setTransferType('external')}>Send to someone</button>
                <button type="button" className={`modal-toggle-btn ${transferType === 'internal' ? 'active' : 'inactive'}`} onClick={() => setTransferType('internal')}>Between my accounts</button>
              </div>

              {successMsg && <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '4px', backgroundColor: successMsg.includes('❌') ? '#fee2e2' : '#e6ffed', color: successMsg.includes('❌') ? '#991b1b' : '#166534', fontSize: '14px', fontWeight: '500' }}>{successMsg}</div>}
              
              <form onSubmit={handleTransferSubmit}>
                <div className="input-group">
                  <label className="input-label">Transfer from</label>
                  <select className="input-field" value={fromAccount} onChange={(e) => { 
                    setFromAccount(e.target.value); 
                    if (transferType === 'internal' && e.target.value === toAccount) setToAccount(e.target.value === 'Main' ? 'Vault' : 'Main');
                  }}>
                    <option value="Main">Checking ...8842 - ${mainBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</option>
                    <option value="Vault">Savings ...1195 - ${vaultBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</option>
                  </select>
                </div>
                
                {transferType === 'internal' ? (
                  <div className="input-group">
                    <label className="input-label">Transfer to</label>
                    <select className="input-field" value={toAccount} onChange={(e) => setToAccount(e.target.value)}>
                      <option value="Main" disabled={fromAccount === 'Main'}>Checking ...8842</option>
                      <option value="Vault" disabled={fromAccount === 'Vault'}>Savings ...1195</option>
                    </select>
                  </div>
                ) : (
                  <>
                    <div className="input-group">
                      <label className="input-label">Recipient Name</label>
                      <input type="text" required className="input-field" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
                    </div>

                    <div className="form-grid" style={{ marginBottom: '20px', gap: '16px' }}>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Routing #</label>
                        <input type="text" maxLength={11} required className="input-field" value={routingNumber} onChange={(e) => handleNumericInput(e, setRoutingNumber)} />
                      </div>
                      <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Account #</label>
                        <input type="text" maxLength={17} required className="input-field" value={recipientAccount} onChange={(e) => handleNumericInput(e, setRecipientAccount)} />
                      </div>
                    </div>
                  </>
                )}

                <div className="input-group">
                  <label className="input-label">Amount</label>
                  <input type="text" required className="input-field" value={formattedAmount} onChange={handleAmountChange} placeholder="$ 0.00" />
                </div>
                
                {transferType === 'external' && (
                  <div className="input-group">
                    <label className="input-label">Memo (Optional)</label>
                    <input type="text" className="input-field" value={transferDesc} onChange={(e) => setTransferDesc(e.target.value)} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '32px', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setActiveModal(null)} className="btn-blue-outline" style={{ flex: 1, padding: '14px', minWidth: '120px' }}>Cancel</button>
                  <button type="submit" disabled={isTransferring} className="btn-blue-solid" style={{ flex: 2, padding: '14px', minWidth: '150px' }}>
                    {isTransferring ? 'Processing...' : 'Make transfer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* --- DESKTOP HEADER --- */}
      <div className="desktop-header show-desktop">
        <div className="top-utility-bar">
          <div className="brand-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <BrandLogo size={36} textColor="#001e79" />
          </div>
          <div className="search-bar">
            <span style={{ color: '#0045a5' }}>🔍</span>
            <input type="text" placeholder="G.V. Smart Assistant" />
          </div>
          <div className="top-actions">
            <span onClick={() => setActiveModal('notifications')}>
              Notifications <b style={{ color: '#e31837' }}>{isRestricted ? '3' : '2'}</b>
            </span>
            <span onClick={() => changeView('settings')}>Profile & Security</span>
            <span onClick={() => triggerMockFeature('Help')}>Need help?</span>
            <span onClick={handleLogout}>Log out</span>
          </div>
        </div>
        <div className="main-nav">
          <div className="nav-container">
            <div className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => changeView('dashboard')}>Dashboard</div>
            <div className={`nav-tab ${currentView === 'transactions' ? 'active' : ''}`} onClick={() => changeView('transactions')}>Activity</div>
            <div className="nav-tab" onClick={() => handleSecureAction(() => setActiveModal('transfer'))}>Transfer & pay</div>
            <div className={`nav-tab ${currentView === 'settings' ? 'active' : ''}`} onClick={() => changeView('settings')}>Profile & Security</div>
            <div className="nav-tab" onClick={() => { setSystemAlert('Products & offers are currently unavailable.'); setTimeout(() => setSystemAlert(''), 3000); }}>Products & offers</div>
          </div>
        </div>
      </div>

      {/* --- MOBILE HEADER --- */}
      <div className="mobile-header show-mobile">
        <div className="mobile-top-row">
          <div className="brand-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <BrandLogo size={36} textColor="#ffffff" />
          </div>
          <button className="mobile-bell-btn" onClick={() => setActiveModal('notifications')}>
            🔔
            {isRestricted && <span className="mobile-bell-badge"></span>}
          </button>
        </div>
        <div className="mobile-search">
          <span>🔍</span>
          <input type="text" placeholder="Smart Assistant" />
          <span>🎤</span>
        </div>
        
        {/* CONDITIONALLY RENDERED: ONLY SHOWS ON DASHBOARD TAB */}
        {currentView === 'dashboard' && (
          <>
            <div className="mobile-greeting">{timeGreeting}, {username.split(' ')[0] || 'User'}</div>
            <div className="mobile-pills">
              <div className="pill" onClick={() => handleSecureAction(() => setActiveModal('transfer'))}>Send | Zelle®</div>
              <div className="pill" onClick={() => handleSecureAction(() => triggerMockFeature('Deposit Check'))}>Deposit check</div>
              <div className="pill" onClick={() => handleSecureAction(() => triggerMockFeature('Rewards'))}>Rewards</div>
            </div>
          </>
        )}
      </div>

      {/* --- DESKTOP HERO --- */}
      {currentView === 'dashboard' && (
        <div className="desktop-hero-container show-desktop">
          <div className="desktop-hero">
            <div className="hero-text">
              <h1>{timeGreeting}, {username.split(' ')[0] || 'User'}</h1>
              <p>We're looking forward to helping you today.</p>
            </div>
            <div className="promo-card">
              <h3>Private Wealth Market</h3>
              <p>Earn money while you save when you open a high yield Market account.</p>
              <button className="btn-red" onClick={() => triggerMockFeature('Market Account')}>Learn more ›</button>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="main-container">
        
        {currentView === 'dashboard' && (
          <div className="action-row show-desktop" style={{ gap: '12px' }}>
            <button className="btn-blue-solid" onClick={() => handleSecureAction(() => setActiveModal('transfer'))}>Zelle® ›</button>
            <button className="btn-blue-solid" onClick={() => handleSecureAction(() => triggerMockFeature('Bill Pay'))}>Pay bills ›</button>
            <button className="btn-blue-outline" onClick={() => generatePDFStatement()}>View statements</button>
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="dashboard-grid">
            
            {/* Left: Accounts List */}
            <div>
              <div className="card-header-flex">
                <h2 className="card-title">Accounts</h2>
                <span className="card-meta" onClick={() => triggerMockFeature('Settings')}>⚙ Account settings</span>
              </div>
              
              <div className="us-card" style={{ padding: '0', border: 'none', background: 'transparent', boxShadow: 'none' }}>
                <div className="list-header">CHECKING & SAVINGS</div>
                
                <div className="account-item" onClick={() => changeView('transactions')}>
                  <div className="acc-inner">
                    <div className="acc-left">
                      <div className="acc-icon-box"></div>
                      <div>
                        <div className="acc-name">Checking <span className="acc-number">...8842</span></div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>U.S. Bank</div>
                      </div>
                    </div>
                    <div className="acc-right">
                      <div className="acc-balance">${mainBalance.toLocaleString('en-US', {minimumFractionDigits: 2})} <span style={{fontSize: '18px', color: '#6b7280', verticalAlign: 'middle'}}>›</span></div>
                    </div>
                  </div>
                  <div style={{ width: '100%' }}>
                    <button className="btn-blue-outline" style={{ width: '100%', maxWidth: '200px' }} onClick={(e) => { e.stopPropagation(); handleSecureAction(() => { setTransferType('external'); setFromAccount('Main'); setActiveModal('transfer'); }); }}>Make a transfer ›</button>
                  </div>
                </div>

                <div className="account-item" onClick={() => changeView('transactions')}>
                  <div className="acc-inner">
                    <div className="acc-left">
                      <div className="acc-icon-box red"></div>
                      <div>
                        <div className="acc-name">Savings Vault <span className="acc-number">...1195</span></div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>U.S. Bank</div>
                      </div>
                    </div>
                    <div className="acc-right">
                      <div className="acc-balance">${vaultBalance.toLocaleString('en-US', {minimumFractionDigits: 2})} <span style={{fontSize: '18px', color: '#6b7280', verticalAlign: 'middle'}}>›</span></div>
                    </div>
                  </div>
                  <div style={{ width: '100%' }}>
                    <button className="btn-blue-outline" style={{ width: '100%', maxWidth: '200px' }} onClick={(e) => { e.stopPropagation(); handleSecureAction(() => { setTransferType('internal'); setFromAccount('Vault'); setToAccount('Main'); setActiveModal('transfer'); }); }}>Make a transfer ›</button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 20px', fontSize: '14px', color: '#6b7280', flexWrap: 'wrap', gap: '8px' }}>
                  <span>Total balance</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>${totalAssets.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>

            {/* Right: Cash Flow */}
            <div>
              <div className="card-header-flex">
                <span className="card-meta" style={{ marginLeft: 'auto', color: '#6b7280' }}>Last login: {lastLoginTime}</span>
              </div>
              <div className="us-card">
                <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#1f2937' }}>Cash flow last 30 days</h3>
                <div className="flow-row">
                  <div className="flow-block">
                    <div className="flow-label">Money in</div>
                    <div className="flow-val val-in">+{totalIn > 0 ? '$' : ''}{totalIn.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                  </div>
                  <div className="flow-block">
                    <div className="flow-label">Money out</div>
                    <div className="flow-val val-out">${totalOut.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
                  </div>
                </div>
                <button className="btn-blue-outline" style={{ width: '100%' }} onClick={() => changeView('transactions')}>Continue to Cash flow ›</button>
              </div>
            </div>

          </div>
        )}

        {/* VIEW: TRANSACTIONS (Activity) */}
        {currentView === 'transactions' && (
          <div className="us-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <h2 className="card-title">Transaction History</h2>
              <button className="btn-blue-outline" onClick={generatePDFStatement}>Export PDF</button>
            </div>
            
            <div className="filter-pills">
              <button className={`f-pill ${txFilter === 'All' ? 'active' : ''}`} onClick={() => { simulateNetworkLatency(() => setTxFilter('All')); }}>All</button>
              <button className={`f-pill ${txFilter === 'approved' ? 'active' : ''}`} onClick={() => { simulateNetworkLatency(() => setTxFilter('approved')); }}>Completed</button>
              <button className={`f-pill ${txFilter === 'pending' ? 'active' : ''}`} onClick={() => { simulateNetworkLatency(() => setTxFilter('pending')); }}>Pending</button>
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="table-wrapper show-desktop">
              <table className="tx-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Account</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 && (<tr><td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>No transactions found.</td></tr>)}
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="clickable-row" onClick={() => { setSelectedTx(t); setActiveModal('txDetails'); }}>
                      <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>{t.date}</td>
                      <td className="tx-desc">{t.desc}</td>
                      <td style={{ color: '#6b7280', whiteSpace: 'nowrap' }}>...{t.account === 'Vault' ? '1195' : '8842'}</td>
                      <td>
                        <span className="status-badge" style={{ color: t.status === 'approved' ? '#166534' : '#b45309', backgroundColor: t.status === 'approved' ? '#dcfce7' : '#fef3c7' }}>
                          {t.status === 'approved' ? 'Completed' : t.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: '600', color: t.type === 'Credit' ? '#166534' : '#e31837', whiteSpace: 'nowrap' }}>
                        {t.type === 'Credit' ? '+' : '-'}${Number(t.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE COMPACT LIST VIEW */}
            <div className="show-mobile">
              <div className="mobile-tx-list">
                {filteredTransactions.length === 0 && (<div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>No transactions found.</div>)}
                {filteredTransactions.map((t) => (
                  <div className="m-tx-card clickable-row" key={t.id} onClick={() => { setSelectedTx(t); setActiveModal('txDetails'); }}>
                    <div className="m-tx-row">
                      <div className="m-tx-desc">{t.desc}</div>
                      <div className="m-tx-amount" style={{ color: t.type === 'Credit' ? '#166534' : '#e31837' }}>
                        {t.type === 'Credit' ? '+' : '-'}${Number(t.amount).toLocaleString('en-US', {minimumFractionDigits: 2})}
                      </div>
                    </div>
                    <div className="m-tx-row">
                      <div className="m-tx-date">{t.date} • ...{t.account === 'Vault' ? '1195' : '8842'}</div>
                      <div className="status-badge" style={{ color: t.status === 'approved' ? '#166534' : '#b45309', backgroundColor: t.status === 'approved' ? '#dcfce7' : '#fef3c7' }}>
                        {t.status === 'approved' ? 'Completed' : t.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* MERGED VIEW: SETTINGS (Profile + Security) */}
        {currentView === 'settings' && (
          <div className="dashboard-grid">
            
            {/* LEFT COLUMN: Profile & Credentials */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div className="us-card" style={{ marginBottom: 0 }}>
                <h2 className="card-title" style={{ marginBottom: '24px' }}>Profile details</h2>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Legal Name</label>
                    <input type="text" className="input-field" value={username} disabled />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Social Security Number</label>
                    <input type="text" className="input-field" value="•••-••-678" disabled />
                  </div>
                  <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="input-label">Physical Address</label>
                    <input type="text" className="input-field" value="Restricted via KYC Compliance" disabled />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <input type="email" className="input-field" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Mobile Phone</label>
                    <input type="tel" className="input-field" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
                  </div>
                </div>
                <button className="btn-blue-solid" style={{ width: '100%', maxWidth: '200px' }} onClick={handleSaveChanges}>Save changes</button>
              </div>

              <div className="us-card" style={{ marginBottom: 0 }}>
                <h2 className="card-title" style={{ marginBottom: '24px' }}>Change password</h2>
                <div className="form-grid">
                  <div className="input-group" style={{ marginBottom: '0' }}>
                    <label className="input-label">New password</label>
                    <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                  <div className="input-group" style={{ marginBottom: '0' }}>
                    <label className="input-label">Confirm password</label>
                    <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                <button className="btn-blue-solid" style={{ marginTop: '24px', width: '100%', maxWidth: '200px' }} onClick={handlePasswordUpdateRequest}>Update password</button>
              </div>

              <div className="us-card" style={{ marginBottom: 0 }}>
                <h2 className="card-title" style={{ marginBottom: '24px' }}>Notifications</h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '15px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', flexShrink: 0 }} /> Email alerts for transfers
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '15px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', flexShrink: 0 }} /> SMS alerts for logins
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', fontSize: '15px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', flexShrink: 0 }} /> Monthly PDF statements
                </label>
                <button className="btn-blue-outline" style={{ width: '100%' }} onClick={() => triggerMockFeature('Save Preferences')}>Update preferences</button>
              </div>

            </div>

            {/* RIGHT COLUMN: Security & Limits */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div className="us-card" style={{ marginBottom: 0 }}>
                <h2 className="card-title" style={{ marginBottom: '24px' }}>Account limits</h2>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>ACCOUNT TIER</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--hero-blue)' }}>Private Wealth Elite</div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>DAILY TRANSFER LIMIT</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>$50,000.00</div>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '4px' }}>INTERNATIONAL WIRES</div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#166534', background: '#dcfce7', display: 'inline-block', padding: '4px 12px', borderRadius: '16px' }}>Authorized</div>
                </div>
              </div>

              <div className="us-card" style={{ marginBottom: 0 }}>
                <h2 className="card-title" style={{ marginBottom: '24px' }}>Two-Factor Authentication</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: 1.5 }}>Secure your account using an authenticator app or SMS.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-light)', borderRadius: '8px', flexWrap: 'wrap', gap: '12px' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>SMS Authentication</span>
                  <span style={{ color: '#166534', fontWeight: '700', fontSize: '12px', background: '#dcfce7', padding: '4px 10px', borderRadius: '12px' }}>ENABLED</span>
                </div>
              </div>

              <div className="us-card" style={{ marginBottom: 0 }}>
                <h2 className="card-title" style={{ marginBottom: '24px' }}>Recent logins</h2>
                {mockLoginHistory.map((log) => (
                  <div key={log.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>{log.device}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{log.date} • {log.location}</div>
                  </div>
                ))}
              </div>
              
              {/* MOBILE ONLY LOGOUT BUTTON */}
              <div className="show-mobile">
                <button onClick={handleLogout} style={{ width: '100%', padding: '16px', background: 'transparent', border: '2px solid #e31837', color: '#e31837', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Log Out Securely
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* --- RESTRUCTURED 4-ITEM MOBILE BOTTOM NAV --- */}
      <div className="bottom-nav show-mobile">
        <div className={`b-nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => changeView('dashboard')}>
          <span className="b-nav-icon">⌂</span>
          <span>Accounts</span>
        </div>
        <div className="b-nav-item" onClick={() => handleSecureAction(() => setActiveModal('transfer'))}>
          <span className="b-nav-icon">⇄</span>
          <span>Transfer & Pay</span>
        </div>
        <div className={`b-nav-item ${currentView === 'transactions' ? 'active' : ''}`} onClick={() => changeView('transactions')}>
          <span className="b-nav-icon">☰</span>
          <span>Activity</span>
        </div>
        <div className={`b-nav-item ${currentView === 'settings' ? 'active' : ''}`} onClick={() => changeView('settings')}>
          <span className="b-nav-icon">👤</span>
          <span>Profile & Security</span>
        </div>
      </div>
    </>
  );
}