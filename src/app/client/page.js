'use client';

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { supabase } from '../../lib/supabaseClient';

export default function ClientDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState('');
  
  // App State
  const [transactions, setTransactions] = useState([]);
  const [activeModal, setActiveModal] = useState(null); 
  const [systemAlert, setSystemAlert] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastLoginTime, setLastLoginTime] = useState(''); 

  // Transfer State
  const [transferAmount, setTransferAmount] = useState(''); 
  const [formattedAmount, setFormattedAmount] = useState(''); 
  const [transferDesc, setTransferDesc] = useState('');
  const [recipientAccount, setRecipientAccount] = useState(''); 
  const [routingNumber, setRoutingNumber] = useState(''); 
  const [fromAccount, setFromAccount] = useState('Main');
  const [successMsg, setSuccessMsg] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // Baselines
  const initialMain = 250000.00;
  const initialVault = 1500000.00;

  useEffect(() => {
    const isAuth = sessionStorage.getItem('client_authenticated');
    if (!isAuth) { window.location.href = '/client-login'; return; }
    
    const currentUser = sessionStorage.getItem('current_user') || 'Member';
    setUsername(currentUser);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setLastLoginTime(`${formattedDate} at ${formattedTime}`);

    setIsMounted(true); 
    fetchCloudTransactions(currentUser);
  }, []);

  const fetchCloudTransactions = async (user) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user)
      .order('id', { ascending: false });
    if (data) setTransactions(data);
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

  // Input Formatting Handlers
  const handleNumericInput = (e, setter) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, ''); 
    setter(numericValue);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    const number = Number(numericValue);
    setTransferAmount(numericValue); 
    setFormattedAmount(numericValue ? number.toLocaleString('en-US') : ''); 
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setIsTransferring(true);
    
    const amountVal = Number(transferAmount);
    if (!amountVal || amountVal <= 0) { setIsTransferring(false); return; }

    const availableFunds = fromAccount === 'Main' ? mainBalance : vaultBalance;
    if (amountVal > availableFunds) {
      setSuccessMsg('❌ ERROR: Insufficient funds.'); 
      setTimeout(() => setSuccessMsg(''), 4000); 
      setIsTransferring(false);
      return;
    }

    const newTx = {
      type: 'Debit',
      desc: transferDesc || `Transfer: Account ••••${recipientAccount.slice(-4)}`,
      amount: amountVal,
      status: 'pending',
      account: fromAccount,
      user_id: username,
      date: new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('transactions').insert([newTx]);

    if (!error) {
      fetchCloudTransactions(username);
      setTransferAmount(''); setFormattedAmount(''); setTransferDesc(''); setRecipientAccount(''); setRoutingNumber('');
      setSuccessMsg('✓ Transfer Initiated. Waiting for approval.'); 
      setTimeout(() => { setActiveModal(null); setSuccessMsg(''); }, 3000);
    } else {
      setSuccessMsg('❌ ERROR: Connection to vault failed.');
    }
    setIsTransferring(false);
  };

  const generatePDFStatement = () => {
    const doc = new jsPDF();
    doc.text("Apex Global Vault - Activity Statement", 14, 22);
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
    setSystemAlert(`Module "${feature}" is under secure maintenance.`);
    setTimeout(() => setSystemAlert(''), 3000);
  };

  // MODERNIZED CLASSIC CSS (Responsive & Sleek)
  const styles = `
    * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #e5e9ec; margin: 0; padding: 0; color: #333; -webkit-font-smoothing: antialiased; }
    
    /* Utility Bar */
    .utility-bar { background-color: #002d5b; color: white; display: flex; justify-content: space-between; align-items: center; padding: 8px 24px; font-size: 12px; font-weight: 500; height: 48px; }
    .brand { font-size: 16px; font-weight: 700; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px; }
    .brand-icon { width: 24px; height: 24px; background: white; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #002d5b; font-size: 14px; font-weight: bold; }
    .utility-links { display: flex; gap: 20px; align-items: center; }
    .u-link { background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 0; }
    .u-link:hover { text-decoration: underline; }
    .search-box { display: flex; align-items: center; background: white; border-radius: 4px; overflow: hidden; height: 28px; }
    .search-box input { padding: 0 10px; border: none; outline: none; font-size: 12px; width: 140px; }
    .search-box button { background: #6a9b2d; border: none; color: white; cursor: pointer; padding: 0 12px; height: 100%; font-weight: bold; }
    .mobile-nav-toggle { display: none; background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0; }

    /* Main Navigation */
    .main-nav { background-color: #12436d; display: flex; padding: 0 24px; border-bottom: 4px solid #002d5b; position: relative; }
    .nav-tab { padding: 14px 20px; color: #e2e8f0; font-size: 13px; font-weight: 600; cursor: pointer; border-right: 1px solid rgba(255,255,255,0.1); transition: all 0.2s; white-space: nowrap; }
    .nav-tab.active { background-color: #e5e9ec; color: #002d5b; border-top: 4px solid #6a9b2d; padding-top: 10px; }
    .nav-tab:hover:not(.active) { background-color: rgba(255,255,255,0.1); color: white; }

    /* Mobile Nav Overlay */
    .mobile-menu { position: fixed; top: 48px; left: 0; width: 100%; background: #12436d; z-index: 50; display: none; flex-direction: column; border-bottom: 4px solid #002d5b; box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
    .mobile-menu.open { display: flex; }
    .mobile-menu .nav-tab { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 16px 24px; }
    
    /* Container & Welcome */
    .container { max-width: 1080px; margin: 0 auto; padding: 24px 16px; }
    .welcome-banner { background: white; border: 1px solid #cbd5e1; border-radius: 6px; padding: 20px 24px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
    .welcome-banner h1 { color: #002d5b; margin: 0 0 4px 0; font-size: 24px; font-weight: 700; }
    .welcome-meta { font-size: 13px; color: #64748b; }
    .tax-promo { text-align: right; font-size: 13px; line-height: 1.5; border-left: 1px solid #e2e8f0; padding-left: 24px; }

    /* The Grid */
    .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }

    /* Widget Styling */
    .widget { background: white; border: 1px solid #cbd5e1; border-radius: 6px; margin-bottom: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.04); overflow: hidden; }
    .widget-header { background: #325a7f; color: white; padding: 12px 20px; font-size: 14px; font-weight: 600; display: flex; justify-content: space-between; align-items: center; }
    .widget-action { font-size: 12px; font-weight: normal; cursor: pointer; color: #cbd5e1; }
    .widget-action:hover { color: white; text-decoration: underline; }

    /* Section Subheaders */
    .section-bar { background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; border-top: 1px solid #e2e8f0; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; }
    .section-title { font-weight: 700; color: #002d5b; font-size: 14px; display: flex; align-items: center; gap: 8px; }
    .section-meta { font-size: 12px; color: #64748b; }

    /* Flexbox Account Rows (Responsive Table Alternative) */
    .account-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
    .account-row:hover { background-color: #f8fafc; }
    .account-row:last-child { border-bottom: none; }
    
    .acc-info { flex: 1; }
    .acc-link { color: #005a9c; font-weight: 600; font-size: 15px; text-decoration: none; cursor: pointer; display: block; }
    .acc-link:hover { text-decoration: underline; }
    .acc-desc { font-size: 12px; color: #64748b; margin-top: 4px; display: block; }
    
    .acc-action { margin: 0 24px; }
    .i-want-to { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 12px; font-size: 12px; font-weight: 500; color: #333; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
    .i-want-to:hover { background: #e2e8f0; border-color: #94a3b8; }
    
    .acc-balance { text-align: right; font-weight: 700; font-size: 16px; color: #0f172a; min-width: 120px; }

    /* General Buttons */
    .btn-green { background: #6a9b2d; color: white; border: none; padding: 10px 20px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; text-align: center; display: inline-block; width: 100%; box-shadow: 0 1px 2px rgba(0,0,0,0.1); }
    .btn-green:hover { background: #557c24; }
    
    .btn-action { background: #f8fafc; border: 1px solid #cbd5e1; color: #005a9c; font-weight: 600; padding: 14px; border-radius: 6px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; font-size: 14px; transition: all 0.2s; width: 100%; margin-bottom: 12px; }
    .btn-action:hover { border-color: #005a9c; background: #f0f7ff; }

    /* Specific Widget Content */
    .promo-content { padding: 20px; text-align: center; }
    .action-group { padding: 20px; background: #f8fafc; text-align: center; }
    
    /* Progress Bar */
    .goal-box { padding: 20px; border-bottom: 1px solid #e2e8f0; }
    .progress-track { width: 100%; height: 12px; background: #e2e8f0; border-radius: 6px; margin: 12px 0; overflow: hidden; border: 1px inset rgba(0,0,0,0.1); }
    .progress-fill { height: 100%; background: #005a9c; width: 65%; border-radius: 6px; }

    /* Track Money Layout */
    .track-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    .track-row.total { border-bottom: none; border-top: 2px solid #e2e8f0; font-weight: 700; padding-top: 16px; margin-top: 4px; }
    .txt-green { color: #166534; font-weight: 600; }
    .txt-red { color: #991b1b; font-weight: 600; }

    /* Modal Overlay (Mobile Optimized) */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 45, 91, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px; backdrop-filter: blur(2px); }
    .modal-content { background: white; width: 100%; max-width: 480px; border-radius: 6px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
    .modal-header { background: #002d5b; color: white; padding: 16px 20px; font-weight: 600; font-size: 16px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; }
    .modal-body { padding: 24px; }
    .input-group { margin-bottom: 16px; }
    .input-label { display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px; }
    .input-field { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 16px; background: #f8fafc; outline: none; transition: border-color 0.2s; }
    .input-field:focus { border-color: #005a9c; background: white; }

    /* Toast */
    .toast { position: fixed; bottom: 24px; right: 24px; background: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 16px 24px; border-radius: 6px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 9999; }

    /* AGGRESSIVE MOBILE RESPONSIVENESS */
    @media (max-width: 900px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }
    
    @media (max-width: 768px) {
      .utility-bar { padding: 8px 16px; }
      .utility-links { display: none; } /* Hide links, show hamburger */
      .mobile-nav-toggle { display: block; }
      .main-nav { display: none; } /* Hide desktop nav bar */
      
      .welcome-banner { flex-direction: column; align-items: flex-start; gap: 16px; padding: 16px; }
      .tax-promo { border-left: none; padding-left: 0; text-align: left; width: 100%; border-top: 1px solid #e2e8f0; padding-top: 16px; }
      
      .container { padding: 16px; }
      
      /* Reformat Account Rows for Mobile */
      .account-row { flex-wrap: wrap; padding: 16px; gap: 12px; }
      .acc-info { width: 100%; flex: none; }
      .acc-balance { width: 100%; text-align: left; font-size: 20px; }
      .acc-action { margin: 0; width: 100%; }
      .i-want-to { width: 100%; justify-content: center; padding: 10px; font-size: 14px; }
      
      .toast { left: 16px; right: 16px; bottom: 16px; text-align: center; }
    }
  `;

  if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: '#e5e9ec' }}></div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {systemAlert && <div className="toast">ℹ️ {systemAlert}</div>}

      {/* TRANSFER MODAL */}
      {activeModal === 'transfer' && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span>Transfer Funds</span>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '24px', lineHeight: 1 }}>×</button>
            </div>
            <div className="modal-body">
              {successMsg && <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '4px', backgroundColor: successMsg.includes('❌') ? '#fee2e2' : '#ecfccb', border: `1px solid ${successMsg.includes('❌') ? '#fca5a5' : '#bef264'}`, color: successMsg.includes('❌') ? '#991b1b' : '#3f6212', fontSize: '13px', fontWeight: '600' }}>{successMsg}</div>}
              <form onSubmit={handleTransferSubmit}>
                <div className="input-group">
                  <label className="input-label">Transfer From Account</label>
                  <select className="input-field" value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
                    <option value="Main">Classic Checking - ${mainBalance.toLocaleString()}</option>
                    <option value="Vault">High Yield Savings - ${vaultBalance.toLocaleString()}</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Destination Routing Number (9 Digits)</label>
                  <input type="text" maxLength={9} required className="input-field" value={routingNumber} onChange={(e) => handleNumericInput(e, setRoutingNumber)} placeholder="000000000" />
                </div>
                <div className="input-group">
                  <label className="input-label">Destination Account Number</label>
                  <input type="text" maxLength={17} required className="input-field" value={recipientAccount} onChange={(e) => handleNumericInput(e, setRecipientAccount)} placeholder="Enter account #" />
                </div>
                <div className="input-group">
                  <label className="input-label">Amount ($)</label>
                  <input type="text" required className="input-field" value={formattedAmount} onChange={handleAmountChange} placeholder="0.00" />
                </div>
                <div className="input-group">
                  <label className="input-label">Memo (Optional)</label>
                  <input type="text" className="input-field" value={transferDesc} onChange={(e) => setTransferDesc(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="button" onClick={() => setActiveModal(null)} style={{ flex: 1, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', padding: '12px', fontWeight: '600', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" disabled={isTransferring} style={{ flex: 2, backgroundColor: isTransferring ? '#94a3b8' : '#005a9c', color: 'white', border: 'none', padding: '12px', fontWeight: '600', borderRadius: '4px', cursor: isTransferring ? 'not-allowed' : 'pointer' }}>
                    {isTransferring ? 'Processing...' : 'Submit Transfer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div className="utility-bar">
        <div className="brand">
          <div className="brand-icon">A</div>
          APEX VAULT
        </div>
        <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>
        <div className="utility-links">
          <button className="u-link" onClick={handleLogout}>Log Off</button>
          <button className="u-link" onClick={() => triggerMockFeature('My Profile')}>👤 My Profile</button>
          <button className="u-link" onClick={() => triggerMockFeature('My Messages')}>✉️ My Messages</button>
          <button className="u-link" onClick={() => triggerMockFeature('Security Center')}>🔒 Security Center</button>
          <div className="search-box">
            <input type="text" placeholder="Search" />
            <button onClick={() => triggerMockFeature('Search')}>▶</button>
          </div>
        </div>
      </div>

      {/* MOBILE DROP DOWN NAV */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="nav-tab" onClick={() => { setActiveModal('transfer'); setMobileMenuOpen(false); }}>⇄ Transfers & Payments</div>
        <div className="nav-tab" onClick={() => { triggerMockFeature('My Accounts'); setMobileMenuOpen(false); }}>💳 My Accounts</div>
        <div className="nav-tab" onClick={() => { generatePDFStatement(); setMobileMenuOpen(false); }}>📄 Download Statements</div>
        <div className="nav-tab" onClick={() => { triggerMockFeature('Settings'); setMobileMenuOpen(false); }}>⚙️ Settings</div>
        <div className="nav-tab" onClick={handleLogout} style={{ color: '#fca5a5' }}>🚪 Log Off</div>
      </div>

      {/* DESKTOP MAIN NAV */}
      <div className="main-nav">
        <div className="nav-tab" onClick={() => triggerMockFeature('Our Products')}>Our Products ▼</div>
        <div className="nav-tab" onClick={() => triggerMockFeature('Advice Center')}>Advice Center ▼</div>
        <div className="nav-tab" onClick={() => triggerMockFeature('Why Join Us')}>Why Join Us</div>
        <div className="nav-tab active">My Accounts</div>
        <div className="nav-tab" onClick={() => triggerMockFeature('My Account Tools')}>My Account Tools ▼</div>
        <div className="nav-tab" onClick={() => triggerMockFeature('Claims')}>Claims ▼</div>
        <div className="nav-tab" onClick={() => generatePDFStatement()}>My Offers</div>
      </div>

      <div className="container">
        
        {/* WELCOME AREA */}
        <div className="welcome-banner">
          <div>
            <h1>Welcome</h1>
            <div className="welcome-meta">Apex Number - {username} &nbsp;|&nbsp; Last visit: {lastLoginTime}</div>
          </div>
          <div className="tax-promo">
            <strong style={{ color: '#002d5b' }}>Make tax time less taxing.</strong><br/>
            Find forms, tips and more.<br/>
            <button onClick={() => triggerMockFeature('Tax Center')} style={{ background: 'none', border: 'none', color: '#005a9c', cursor: 'pointer', padding: 0, marginTop: '4px', fontWeight: '600' }}>» Explore Tax Center</button>
          </div>
        </div>

        <div className="dashboard-grid">
          
          {/* LEFT COLUMN: Accounts List */}
          <div>
            <div className="widget">
              <div className="widget-header">
                <span>My Accounts Summary</span>
                <span className="widget-action" onClick={() => triggerMockFeature('Customize')}>⚙ Customize</span>
              </div>
              
              {/* Banking Section */}
              <div className="section-bar">
                <span className="section-title"><span style={{ color: '#6a9b2d' }}>➖</span> Banking (3)</span>
                <span className="section-meta">Balance / Available</span>
              </div>
              
              {/* Flexbox Account Rows (Mobile Friendly) */}
              <div className="account-row">
                <div className="acc-info">
                  <span className="acc-link" onClick={() => triggerMockFeature('Checking Details')}>Classic Checking</span>
                  <span className="acc-desc">Primary Operations</span>
                </div>
                <div className="acc-action">
                  <button className="i-want-to" onClick={() => setActiveModal('transfer')}>I want to</button>
                </div>
                <div className="acc-balance">${mainBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
              </div>

              <div className="account-row">
                <div className="acc-info">
                  <span className="acc-link" onClick={() => triggerMockFeature('Savings Details')}>High Yield Savings</span>
                  <span className="acc-desc">Secure Asset Vault</span>
                </div>
                <div className="acc-action">
                  <button className="i-want-to" onClick={() => setActiveModal('transfer')}>I want to</button>
                </div>
                <div className="acc-balance">${vaultBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
              </div>

              <div className="account-row">
                <div className="acc-info">
                  <span className="acc-link" onClick={() => triggerMockFeature('Credit Card Details')}>World MasterCard</span>
                  <span className="acc-desc">55**-****-7210</span>
                </div>
                <div className="acc-action">
                  <button className="i-want-to" onClick={() => triggerMockFeature('Pay Card')}>I want to</button>
                </div>
                <div className="acc-balance" style={{ color: '#64748b' }}>$11,325.96</div>
              </div>

              {/* Insurance Section */}
              <div className="section-bar" style={{ borderTop: 'none' }}>
                <span className="section-title"><span style={{ color: '#6a9b2d' }}>➖</span> Insurance (2)</span>
                <span className="section-meta">Balance / Amount Owed</span>
              </div>

              <div className="account-row">
                <div className="acc-info">
                  <span className="acc-link" onClick={() => triggerMockFeature('Renters Insurance')}>Renter's Insurance</span>
                  <span className="acc-desc">Policy: ***2315</span>
                </div>
                <div className="acc-action">
                  <button className="i-want-to" onClick={() => triggerMockFeature('Insurance Options')}>I want to</button>
                </div>
                <div className="acc-balance">$0.00</div>
              </div>

              <div className="account-row">
                <div className="acc-info">
                  <span className="acc-link" onClick={() => triggerMockFeature('Auto Insurance')}>Motor Home</span>
                  <span className="acc-desc">Policy: ***7500</span>
                </div>
                <div className="acc-action">
                  <button className="i-want-to" onClick={() => triggerMockFeature('Insurance Options')}>I want to</button>
                </div>
                <div className="acc-balance">$0.00</div>
              </div>

              {/* Investments Section */}
              <div className="section-bar" style={{ borderTop: 'none' }}>
                <span className="section-title"><span style={{ color: '#6a9b2d' }}>➖</span> Investments</span>
              </div>
              <div style={{ padding: '20px', fontSize: '13px', color: '#475569', backgroundColor: '#fff' }}>
                Proven performance and value — that's why you should consider investing with Apex.
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                  <div><strong style={{ color: '#002d5b' }}>MUTUAL FUNDS</strong><br/><span style={{ color: '#64748b' }}>Proven performance with no sales fees</span></div>
                  <button onClick={() => triggerMockFeature('Mutual Funds')} style={{ background: 'none', border: 'none', color: '#6a9b2d', fontWeight: 'bold', cursor: 'pointer' }}>Learn More</button>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', paddingBottom: '12px' }}>
                  <div><strong style={{ color: '#002d5b' }}>BROKERAGE</strong><br/><span style={{ color: '#64748b' }}>Make online trades for as low as $5.95</span></div>
                  <button onClick={() => triggerMockFeature('Brokerage')} style={{ background: 'none', border: 'none', color: '#6a9b2d', fontWeight: 'bold', cursor: 'pointer' }}>Learn More</button>
                </div>
                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                  <button className="btn-green" onClick={() => triggerMockFeature('Add Account')} style={{ width: 'auto' }}>Add a Non-Apex Account</button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Interactive Widgets */}
          <div>
            
            {/* Promo Widget */}
            <div className="widget">
              <div className="widget-header"><span>Member Advantages</span><span className="widget-action">?</span></div>
              <div className="promo-content">
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#002d5b' }}>It's easy to find out how much life insurance you may need.</h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Our new life insurance calculator can help.</p>
                <button className="btn-green" onClick={() => triggerMockFeature('Calculator')}>Check It Out</button>
              </div>
            </div>

            {/* My Goals Widget */}
            <div className="widget">
              <div className="widget-header"><span>My Goals</span><span className="widget-action">✕</span></div>
              <div className="goal-box">
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#002d5b', marginBottom: '16px' }}>Achievement starts with a goal.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontSize: '28px' }}>🌴</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#475569' }}>Retirement Fund</div>
                    <div className="progress-track"><div className="progress-fill"></div></div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>65%</div>
                </div>
                <button className="btn-green" style={{ marginTop: '20px' }} onClick={() => triggerMockFeature('Goals Setup')}>Get Started With My Goals</button>
              </div>
            </div>

            {/* Pay Bills / Transfer Funds Widget */}
            <div className="widget">
              <div className="widget-header"><span>Pay Bills & Transfer Funds</span><span className="widget-action">? ✕</span></div>
              <div className="action-group">
                <p style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Pay Bills or schedule a transfer between accounts.</p>
                <button className="btn-action" onClick={() => triggerMockFeature('Bill Pay')}>
                  📅 Pay Bills
                </button>
                <button className="btn-action" onClick={() => setActiveModal('transfer')}>
                  🔄 Transfer Funds
                </button>
                <button onClick={() => triggerMockFeature('Advanced Bill Pay')} style={{ background: 'none', border: 'none', color: '#005a9c', fontSize: '12px', marginTop: '8px', cursor: 'pointer', fontWeight: '600' }}>» Advanced Bill Pay</button>
              </div>
            </div>

            {/* Track Money Widget */}
            <div className="widget">
              <div className="widget-header"><span>Track Your Money</span><span className="widget-action">? EXPAND ✕</span></div>
              <div style={{ padding: '20px', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', marginBottom: '16px', fontWeight: '500' }}>01/01/2026 - Present</div>
                
                <div className="track-row">
                  <span>Money In</span>
                  <span className="txt-green">+ ${totalIn.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="track-row">
                  <span>Money Out</span>
                  <span className="txt-red">- ${totalOut.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
                <div className="track-row total">
                  <span>Total</span>
                  <span style={{ color: '#002d5b' }}>${(totalIn - totalOut).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button onClick={() => generatePDFStatement()} style={{ background: 'none', border: 'none', color: '#6a9b2d', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>» Go to Track Your Money</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}