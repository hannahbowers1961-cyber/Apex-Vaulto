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
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDesc, setTransferDesc] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [fromAccount, setFromAccount] = useState('Main');
  const [successMsg, setSuccessMsg] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // Baselines
  const mainAccountNo = "•••• •••• •••• 8842";
  const vaultAccountNo = "•••• •••• •••• 1195";
  const initialMain = 250000.00;
  const initialVault = 1500000.00;

  useEffect(() => {
    const isAuth = sessionStorage.getItem('client_authenticated');
    if (!isAuth) { window.location.href = '/client-login'; return; }
    
    const currentUser = sessionStorage.getItem('current_user') || 'Member';
    setUsername(currentUser);
    setIsMounted(true); 
    fetchCloudTransactions(currentUser);
  }, []);

  // CLOUD: Fetch live data from Supabase for THIS specific user
  const fetchCloudTransactions = async (user) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user)
      .order('id', { ascending: false });
    
    if (data) setTransactions(data);
    if (error) console.error("Error fetching cloud data:", error);
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
  const netWorth = mainBalance + vaultBalance;

  // CLOUD: Send new transfer request to Supabase
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

    const newTx = {
      type: 'Debit',
      desc: transferDesc || `Wire Transfer: ${recipientAccount}`,
      amount: amountVal,
      status: 'pending',
      account: fromAccount,
      user_id: username,
      date: new Date().toISOString().split('T')[0]
    };

    const { error } = await supabase.from('transactions').insert([newTx]);

    if (!error) {
      fetchCloudTransactions(username); // Refresh the list from the cloud
      setTransferAmount(''); setTransferDesc(''); setRecipientAccount('');
      setSuccessMsg('✓ Transfer logged securely. Awaiting manager verification.'); 
    } else {
      setSuccessMsg('❌ ERROR: Secure connection to vault failed.');
    }
    
    setIsTransferring(false);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const generatePDFStatement = () => {
    const doc = new jsPDF();
    doc.setFontSize(24); doc.setTextColor(17, 46, 69); doc.text("Apex Global Vault", 14, 22);
    doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.text("PRIVATE WEALTH MANAGEMENT", 14, 30);
    doc.setFontSize(12); doc.setTextColor(50, 50, 50); doc.text(`Official Account Statement`, 14, 45);
    doc.setFontSize(10);
    doc.text(`Account Holder: ${username}`, 14, 52);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, 14, 58);
    doc.text(`Total Verified Assets: $${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 14, 64);

    const tableColumn = ["Execution Date", "Description", "Source/Dest", "Status", "Amount"];
    const tableRows = transactions.map(t => [
      t.date, t.desc, t.account || 'Main', t.status.toUpperCase(),
      `${t.type === 'Credit' ? '+' : '-'}$${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    ]);

    autoTable(doc, {
      startY: 75, head: [tableColumn], body: tableRows, theme: 'striped',
      headStyles: { fillColor: [17, 46, 69] }, styles: { fontSize: 9 }, alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i); doc.setFontSize(8); doc.setTextColor(150);
      doc.text('CONFIDENTIAL: This document is secured by Apex Global Vault. Do not share.', doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    doc.save(`Apex_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('client_authenticated'); 
    sessionStorage.removeItem('current_user');
    window.location.href = '/client-login';
  };

  // UPGRADED PREMIUM CSS
  const styles = `
    * { box-sizing: border-box; }
    html, body { overflow-x: hidden; margin: 0; padding: 0; width: 100%; background-color: #f1f5f9; }
    
    .dash-wrapper { min-height: 100vh; font-family: 'Inter', Arial, sans-serif; color: #1e293b; overflow-x: hidden; width: 100%; }
    
    /* Modern Header */
    .dash-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 16px 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #dc2626; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    
    /* Grid Layout */
    .dash-main { width: 100%; max-width: 1200px; margin: 0 auto; padding: 32px 16px; display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    
    /* Premium Cards */
    .card { background-color: white; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.025); border: 1px solid #e2e8f0; transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .card:hover { box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); }
    .card-header { background-color: #f8fafc; padding: 20px 24px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
    .card-title { margin: 0; fontSize: 18px; color: #0f172a; font-weight: 700; letter-spacing: -0.5px; }
    
    /* Virtual Credit Card Styling */
    .credit-card { background: linear-gradient(135deg, #112e45 0%, #000000 100%); color: #fff; padding: 24px; border-radius: 16px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(17,46,69,0.4); margin-bottom: 24px; }
    .credit-card::after { content: ''; position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%; transform: translate(30%, -30%); }
    .cc-chip { width: 40px; height: 30px; background: linear-gradient(135deg, #ffd700, #b8860b); border-radius: 6px; margin-bottom: 24px; opacity: 0.9; }
    .cc-number { font-size: 20px; font-family: monospace; letter-spacing: 2px; margin-bottom: 16px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
    .cc-bottom { display: flex; justify-content: space-between; align-items: flex-end; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #cbd5e1; }
    
    /* Quick Actions Menu */
    .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .action-btn { background-color: #f1f5f9; border: 1px solid #e2e8f0; color: #334155; padding: 12px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 8px; transition: all 0.2s; }
    .action-btn:hover { background-color: #e2e8f0; color: #0f172a; border-color: #cbd5e1; transform: translateY(-2px); }
    
    /* Modern Inputs */
    .input-field { width: 100%; padding: 12px 16px; font-size: 14px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; background-color: #f8fafc; }
    .input-field:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); background-color: white; }
    
    /* Beautiful Table */
    .table-container { overflow-x: auto; width: 100%; -webkit-overflow-scrolling: touch; }
    .responsive-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; min-width: 500px; }
    .responsive-table th { padding: 16px 24px; background-color: white; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; }
    .responsive-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; }
    .responsive-table tr:hover td { background-color: #f8fafc; }
    
    /* Mobile Constraints */
    @media (max-width: 950px) {
      .dash-main { grid-template-columns: 1fr; }
      .dash-header { padding: 16px; flex-direction: column; gap: 16px; align-items: flex-start; }
      .cc-number { font-size: 18px; }
    }
  `;

  if (!isMounted) return <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'white', fontSize: '20px', letterSpacing: '2px' }}>INITIALIZING VAULT...</div></div>;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="dash-wrapper">
        
        <header className="dash-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#dc2626', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
              <svg style={{ width: '24px', height: '24px', color: 'white' }} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>Apex Global Vault</h1>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>SECURE CLIENT ENVIRONMENT</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontSize: '14px', fontWeight: '600' }}>
            <span style={{ color: '#cbd5e1' }}>Welcome back, <span style={{ color: 'white' }}>{username}</span></span>
            <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s' }}>Log Out</button>
          </div>
        </header>

        <main className="dash-main">
          
          {/* LEFT COLUMN: Balances & History */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="card">
              <div className="card-header"><h2 className="card-title">Portfolio Overview</h2></div>
              <div style={{ padding: '0 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ color: '#2563eb', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Liquid Capital (Main)</div>
                    <div style={{ color: '#64748b', fontSize: '13px', fontFamily: 'monospace' }}>{mainAccountNo}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>${mainBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div style={{ color: '#10b981', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>Available to trade</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
                  <div>
                    <div style={{ color: '#2563eb', fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Secure Asset Vault</div>
                    <div style={{ color: '#64748b', fontSize: '13px', fontFamily: 'monospace' }}>{vaultAccountNo}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>${vaultBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                    <div style={{ color: '#f59e0b', fontSize: '12px', marginTop: '4px', fontWeight: '600' }}>Interest Accruing</div>
                  </div>
                </div>
              </div>
              <div style={{ backgroundColor: '#0f172a', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <strong style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase' }}>Total Net Worth</strong>
                <strong style={{ fontSize: '20px' }}>${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Activity</h2>
                <button onClick={generatePDFStatement} style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px', fontSize: '13px', fontWeight: '600', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>
                  📄 Download PDF
                </button>
              </div>
              <div className="table-container">
                <table className="responsive-table">
                  <thead style={{ textAlign: 'left' }}>
                    <tr>
                      <th>Date</th>
                      <th>Details</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 && (<tr><td colSpan="4" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>No recent activity to display.</td></tr>)}
                    {transactions.map((t) => (
                      <tr key={t.id}>
                        <td style={{ color: '#64748b', fontSize: '13px' }}>{t.date}</td>
                        <td>
                          <div style={{ color: '#0f172a', fontWeight: '600', marginBottom: '4px' }}>{t.desc}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>Account: {t.account || 'Main'}</div>
                        </td>
                        <td>
                          <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', backgroundColor: t.status === 'approved' ? '#dcfce7' : t.status === 'rejected' ? '#fee2e2' : '#fef9c3', color: t.status === 'approved' ? '#166534' : t.status === 'rejected' ? '#991b1b' : '#854d0e' }}>
                            {t.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: '700', color: t.type === 'Credit' ? '#16a34a' : '#0f172a', fontSize: '15px' }}>
                          {t.type === 'Credit' ? '+' : '-'}${Number(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Cards & Transfers */}
          <div>
            
            {/* The New Premium Card Graphic */}
            <div className="credit-card">
              <div className="cc-chip"></div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Apex Black Obsidian</div>
              <div className="cc-number">4532  1194  8842  0021</div>
              <div className="cc-bottom">
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>CARDHOLDER</div>
                  <div style={{ color: 'white', marginTop: '2px' }}>{username}</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>EXPIRES</div>
                  <div style={{ color: 'white', marginTop: '2px' }}>12/28</div>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="quick-actions">
              <button className="action-btn">
                <span style={{ fontSize: '20px' }}>↗️</span> Send Money
              </button>
              <button className="action-btn">
                <span style={{ fontSize: '20px' }}>↙️</span> Deposit
              </button>
              <button className="action-btn">
                <span style={{ fontSize: '20px' }}>💳</span> Manage Cards
              </button>
              <button className="action-btn">
                <span style={{ fontSize: '20px' }}>⚙️</span> Settings
              </button>
            </div>

            {/* Upgraded Transfer Form */}
            <div className="card" style={{ padding: '24px' }}>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700' }}>Initiate Wire Transfer</h2>
              
              {successMsg && <div style={{ padding: '12px 16px', marginBottom: '20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', backgroundColor: successMsg.includes('❌') ? '#fee2e2' : '#dcfce7', color: successMsg.includes('❌') ? '#991b1b' : '#166534', border: `1px solid ${successMsg.includes('❌') ? '#fca5a5' : '#86efac'}` }}>{successMsg}</div>}

              <form onSubmit={handleTransferSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Source Account</label>
                  <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="input-field">
                    <option value="Main">Liquid Capital (Main) - ${mainBalance.toLocaleString()}</option>
                    <option value="Vault">Secure Vault - ${vaultBalance.toLocaleString()}</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Destination Routing / Account</label>
                  <input type="text" required placeholder="Enter 9-digit routing" value={recipientAccount} onChange={(e) => setRecipientAccount(e.target.value)} className="input-field" />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Transfer Amount</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontSize: '15px', fontWeight: '600' }}>$</span>
                    <input type="number" required placeholder="0.00" min="1" step="0.01" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="input-field" style={{ paddingLeft: '32px', fontSize: '16px', fontWeight: '600' }} />
                  </div>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px', fontWeight: '600' }}>Memo (Optional)</label>
                  <input type="text" placeholder="Reference note" value={transferDesc} onChange={(e) => setTransferDesc(e.target.value)} className="input-field" />
                </div>
                
                <button type="submit" disabled={isTransferring} style={{ width: '100%', backgroundColor: isTransferring ? '#94a3b8' : '#0f172a', color: 'white', padding: '14px', fontSize: '15px', fontWeight: '700', border: 'none', cursor: isTransferring ? 'not-allowed' : 'pointer', borderRadius: '8px', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  {isTransferring ? 'Processing...' : 'Authorize Transfer'}
                </button>
              </form>
            </div>
            
          </div>
        </main>
      </div>
    </>
  );
}