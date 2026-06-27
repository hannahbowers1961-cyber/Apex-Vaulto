'use client';

import { useState, useEffect, useRef } from 'react'; 
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { supabase } from '../../lib/supabaseClient';

export default function ClientDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [userEmail, setUserEmail] = useState(''); 
  const [currentView, setCurrentView] = useState('dashboard'); 
  
  // --- COMPLIANCE LOCK ---
  const [isRestricted, setIsRestricted] = useState(true); 

  const currentViewRef = useRef(currentView);
  useEffect(() => { currentViewRef.current = currentView; }, [currentView]);
  
  // App & Data State
  const [transactions, setTransactions] = useState([]);
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
    const tableRows = transactions.map(t => [t.date, t.desc, t.account || 'Main', t.status.toUpperCase(), `${t.type === 'Credit' ? '+' : '-'}$${Number(t.amount).toLocaleString()}`]);
    autoTable(doc, { startY: 30, head: [["Date", "Description", "Account", "Status", "Amount"]], body: tableRows, theme: 'grid' });
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
    const handleBackButton = (e) => {
      e.preventDefault();
      if (currentViewRef.current !== 'dashboard') {
        setCurrentView('dashboard');
        window.history.pushState(null, '', window.location.href);
      } else {
        if (window.confirm("Are you sure you want to securely log out?")) {
          handleLogout();
        } else {
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);

    return () => window.removeEventListener('popstate', handleBackButton);
  }, []);

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
    @keyframes spin { 0deg { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    
    /* Desktop Header */
    .desktop-header { background: white; border-bottom: 1px solid var(--border-light); width: 100%; }
    .top-utility-bar { display: flex; justify-content: space-between; align-items: center; padding: 16px 40px; max-width: 1400px; margin: 0 auto; gap: 16px; flex-wrap: wrap; }
    .brand-logo { font-size: 22px; font-weight: 800; color: var(--brand-red); letter-spacing: -1px; display: flex; align-items: center; gap: 4px; white-space: nowrap; }
    .brand-logo span { color: var(--brand-blue); }
    
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
    .mobile-top-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; width: 100%; gap: 16px; }
    .mobile-search { flex: 1; background: rgba(255,255,255,0.2); border-radius: 20px; padding: 8px 16px; display: flex; align-items: center; margin: 0; }
    .mobile-search input { background: transparent; border: none; color: white; width: 100%; outline: none; }
    .mobile-search input::placeholder { color: rgba(255,255,255,0.8); }
    
    /* Modern Header Bell Style */
    .mobile-bell-btn { background: none; border: none; color: white; font-size: 22px; cursor: pointer; padding: 4px; position: relative; display: flex; align-items: center; justify-content: center; }
    .mobile-bell-badge { position: absolute; top: 2px; right: 2px; width: 8px; height: 8px; background-color: var(--brand-red); border-radius: 50%; border: 1px solid var(--hero-blue); }

    .mobile-greeting { font-size: 24px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.5px; word-break: break-word; }
    
    .mobile-pills { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: none; -ms-overflow-style: none; }
    .mobile-pills::-webkit-scrollbar { display: none; }
    .pill { background: white; color: var(--hero-blue); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; white-space: nowrap; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

    /* Desktop Hero - HEIGHT & PADDING REDUCED */
    .desktop-hero-container { max-width: 1400px; margin: 0 auto; padding: 16px 40px 0 40px; width: 100%; }
    .desktop-hero { background: var(--hero-blue); border-radius: 12px; padding: 24px 40px; color: white; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 25px -5px rgba(0,69,165,0.3); flex-wrap: wrap; gap: 24px; }
    .hero-text { flex: 1; min-width: 250px; }
    .hero-text h1 { margin: 0 0 4px 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; word-break: break-word; }
    .hero-text p { margin: 0; font-size: 16px; color: rgba(255,255,255,0.9); }
    
    /* Responsive Promo Card - HEIGHT REDUCED */
    .promo-card { background: white; color: var(--text-main); padding: 16px 24px; border-radius: 8px; width: 100%; max-width: 350px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); flex-shrink: 0; }
    .promo-card h3 { margin: 0 0 4px 0; font-size: 16px; color: var(--text-main); }
    .promo-card p { margin: 0 0 12px 0; font-size: 13px; color: var(--text-muted); line-height: 1.4; }
    .btn-red { background: var(--brand-red); color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; cursor: pointer; }

    /* Layout */
    .main-container { max-width: 1400px; margin: 0 auto; padding: 16px 40px 80px 40px; width: 100%; }
    
    /* Action Row - BUTTON SPACING MASSIVELY INCREASED */
    .action-row { display: flex; justify-content: flex-start; gap: 32px; margin-bottom: 32px; flex-wrap: wrap; align-items: center; }
    
    .btn-blue-outline { background: white; color: var(--hero-blue); border: 1px solid var(--hero-blue); padding: 10px 24px; border-radius: 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
    .btn-blue-outline:hover { background: var(--hero-blue); color: white; }
    .btn-blue-solid { background: var(--hero-blue); color: white; border: 1px solid var(--hero-blue); padding: 10px 24px; border-radius: 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
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
    
    /* Transactions - Desktop Table */
    .filter-pills { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
    .f-pill { background: white; border: 1px solid var(--border-light); padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500; cursor: pointer; color: var(--text-muted); transition: all 0.2s; white-space: nowrap; }
    .f-pill.active { background: var(--hero-blue); color: white; border-color: var(--hero-blue); }
    
    .table-wrapper { overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch; }
    .tx-table { width: 100%; border-collapse: collapse; min-width: 500px; }
    .tx-table th { padding: 12px 16px; text-align: left; font-size: 13px; color: var(--text-muted); border-bottom: 1px solid var(--border-light); font-weight: 500; white-space: nowrap; }
    .tx-table td { padding: 16px; border-bottom: 1px solid var(--border-light); font-size: 14px; }
    .tx-desc { font-weight: 600; color: var(--text-main); min-width: 150px; }
    .status-badge { font-size: 12px; padding: 4px 8px; border-radius: 4px; font-weight: 600; background: var(--bg-gray); white-space: nowrap; }

    /* Transactions - Mobile Stacked Cards */
    .mobile-tx-list { display: flex; flex-direction: column; }
    .m-tx-card { border-bottom: 1px solid var(--border-light); padding: 16px 0; display: flex; flex-direction: column; gap: 8px; }
    .m-tx-card:last-child { border-bottom: none; }
    .m-tx-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .m-tx-desc { font-weight: 600; color: var(--text-main); font-size: 15px; line-height: 1.3; word-break: break-word; }
    .m-tx-amount { font-weight: 700; font-size: 16px; white-space: nowrap; flex-shrink: 0; }
    .m-tx-date { font-size: 13px; color: var(--text-muted); }

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

    /* Mobile Bottom Nav */
    .bottom-nav { display: none; position: fixed; bottom: 0; left: 0; width: 100%; background: white; border-top: 1px solid var(--border-light); z-index: 100; justify-content: space-around; padding: 12px 0 24px 0; box-shadow: 0 -4px 6px -1px rgba(0,0,0,0.05); }
    .b-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--text-muted); font-size: 10px; font-weight: 600; cursor: pointer; flex: 1; }
    .b-nav-item.active { color: var(--hero-blue); }
    .b-nav-icon { font-size: 20px; }

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
      .show-desktop, .desktop-header, .desktop-hero-container, .action-row { display: none; }
      .show-mobile { display: block; }
      .mobile-header, .bottom-nav { display: flex; }
      .mobile-header { flex-direction: column; }
      
      .main-container { padding: 16px 16px 100px 16px; }
      .us-card { padding: 16px; }
      
      .acc-right { width: 100%; margin-top: 8px; }
      .acc-balance { font-size: 28px; }
      
      .toast { bottom: 100px; white-space: normal; text-align: center; }
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

      {/* --- OTP VERIFICATION MODAL --- */}
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
          <div className="brand-logo">Global <span>Vault</span></div>
          <div className="search-bar">
            <span style={{ color: '#0045a5' }}>🔍</span>
            <input type="text" placeholder="G.V. Smart Assistant" />
          </div>
          <div className="top-actions">
            <span onClick={() => setActiveModal('notifications')}>
              Notifications <b style={{ color: '#e31837' }}>{isRestricted ? '3' : '2'}</b>
            </span>
            <span onClick={() => changeView('profile')}>Profile & settings</span>
            <span onClick={() => triggerMockFeature('Help')}>Need help?</span>
            <span onClick={handleLogout}>Log out</span>
          </div>
        </div>
        <div className="main-nav">
          <div className="nav-container">
            <div className={`nav-tab ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => changeView('dashboard')}>Dashboard</div>
            <div className={`nav-tab ${currentView === 'transactions' ? 'active' : ''}`} onClick={() => changeView('transactions')}>Activity</div>
            <div className="nav-tab" onClick={() => handleSecureAction(() => setActiveModal('transfer'))}>Transfer & pay</div>
            <div className={`nav-tab ${currentView === 'security' ? 'active' : ''}`} onClick={() => changeView('security')}>Security & limits</div>
            <div className="nav-tab" onClick={() => generatePDFStatement()}>Products & offers</div>
          </div>
        </div>
      </div>

      {/* --- MOBILE HEADER --- */}
      <div className="mobile-header show-mobile">
        <div className="mobile-top-row">
          <div className="mobile-search">
            <span>🔍</span>
            <input type="text" placeholder="Smart Assistant" />
            <span>🎤</span>
          </div>
          {/* MODERN INTERACTIVE TOP-RIGHT CORNER BELL ICON */}
          <button className="mobile-bell-btn" onClick={() => setActiveModal('notifications')}>
            🔔
            {isRestricted && <span className="mobile-bell-badge"></span>}
          </button>
        </div>
        <div className="mobile-greeting">{username}.</div>
        {/* REORDERED & RESTRICTED MOBILE PILLS */}
        <div className="mobile-pills">
          <div className="pill" onClick={() => handleSecureAction(() => setActiveModal('transfer'))}>Send | Zelle®</div>
          <div className="pill" onClick={() => handleSecureAction(() => triggerMockFeature('Deposit Check'))}>Deposit check</div>
          <div className="pill" onClick={() => handleSecureAction(() => triggerMockFeature('Rewards'))}>Rewards</div>
        </div>
      </div>

      {/* --- DESKTOP HERO --- */}
      {currentView === 'dashboard' && (
        <div className="desktop-hero-container show-desktop">
          <div className="desktop-hero">
            <div className="hero-text">
              <h1>Good morning, {username.split(' ')[0] || 'User'}.</h1>
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
          <div className="action-row show-desktop">
            <button className="btn-blue-solid" onClick={() => handleSecureAction(() => setActiveModal('transfer'))}>Zelle® ›</button>
            <button className="btn-blue-solid" onClick={() => handleSecureAction(() => triggerMockFeature('Bill Pay'))}>Pay bills ›</button>
            <button className="btn-blue-outline" onClick={() => generatePDFStatement()}>View statements</button>
            <button className="btn-blue-outline" onClick={() => triggerMockFeature('More')}>•••</button>
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
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Global Vault</div>
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
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Global Vault</div>
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
                    <tr key={t.id}>
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
                  <div className="m-tx-card" key={t.id}>
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

        {/* VIEW: PROFILE */}
        {currentView === 'profile' && (
          <div className="dashboard-grid">
            <div className="us-card">
              <h2 className="card-title" style={{ marginBottom: '24px' }}>Profile details</h2>
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Legal Name</label>
                  <input type="text" className="input-field" value={username} disabled />
                </div>
                <div className="input-group">
                  <label className="input-label">Social Security Number</label>
                  <input type="password" className="input-field" value="123456789" disabled />
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

            <div className="us-card">
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
        )}

        {/* VIEW: SECURITY */}
        {currentView === 'security' && (
          <div className="dashboard-grid">
            <div>
              <div className="us-card">
                <h2 className="card-title" style={{ marginBottom: '24px' }}>Change password</h2>
                <div className="form-grid">
                  <div className="input-group" style={{ gridColumn: '1 / -1', marginBottom: '0' }}>
                    <label className="input-label">Current password</label>
                    <input type="password" className="input-field" placeholder="••••••••" />
                  </div>
                  <div className="input-group" style={{ marginBottom: '0' }}>
                    <label className="input-label">New password</label>
                    <input type="password" className="input-field" />
                  </div>
                  <div className="input-group" style={{ marginBottom: '0' }}>
                    <label className="input-label">Confirm password</label>
                    <input type="password" className="input-field" />
                  </div>
                </div>
                <button className="btn-blue-solid" style={{ marginTop: '24px', width: '100%', maxWidth: '200px' }} onClick={() => triggerMockFeature('Update Password')}>Update password</button>
              </div>

              <div className="us-card">
                <h2 className="card-title" style={{ marginBottom: '24px' }}>Recent logins</h2>
                {mockLoginHistory.map((log) => (
                  <div key={log.id} style={{ padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)' }}>{log.device}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{log.date} • {log.location}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="us-card">
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

              <div className="us-card">
                <h2 className="card-title" style={{ marginBottom: '24px' }}>Two-Factor Authentication</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: 1.5 }}>Secure your account using an authenticator app or SMS.</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-light)', borderRadius: '8px', flexWrap: 'wrap', gap: '12px' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px' }}>SMS Authentication</span>
                  <span style={{ color: '#166534', fontWeight: '700', fontSize: '12px', background: '#dcfce7', padding: '4px 10px', borderRadius: '12px' }}>ENABLED</span>
                </div>
              </div>
              
              {/* MOBILE ONLY LOGOUT BUTTON */}
              <div className="show-mobile" style={{ marginTop: '32px' }}>
                <button onClick={handleLogout} style={{ width: '100%', padding: '16px', background: 'transparent', border: '2px solid #e31837', color: '#e31837', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Log Out Securely
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* --- MOBILE BOTTOM NAV --- */}
      <div className="bottom-nav show-mobile">
        <div className={`b-nav-item ${currentView === 'dashboard' ? 'active' : ''}`} onClick={() => changeView('dashboard')}>
          <span className="b-nav-icon">⌂</span>
          <span>Activity</span>
        </div>
        <div className={`b-nav-item ${currentView === 'transactions' ? 'active' : ''}`} onClick={() => changeView('transactions')}>
          <span className="b-nav-icon">⇄</span>
          <span>Ledger</span>
        </div>
        <div className="b-nav-item" onClick={() => handleSecureAction(() => setActiveModal('transfer'))}>
          <span className="b-nav-icon" style={{ fontSize: '28px', color: 'var(--brand-red)', marginTop: '-8px' }}>⊕</span>
          <span>Transfer</span>
        </div>
        <div className={`b-nav-item ${currentView === 'profile' ? 'active' : ''}`} onClick={() => changeView('profile')}>
          <span className="b-nav-icon">👤</span>
          <span>Profile</span>
        </div>
        <div className={`b-nav-item ${currentView === 'security' ? 'active' : ''}`} onClick={() => changeView('security')}>
          <span className="b-nav-icon">🔒</span>
          <span>Security</span>
        </div>
      </div>
    </>
  );
}