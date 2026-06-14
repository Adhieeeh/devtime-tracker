import React, { useState, useEffect } from 'react';

function App() {
  
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('devtime_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('30');
  const [taskDescription, setTaskDescription] = useState('');
  const [hoursSpent, setHoursSpent] = useState('');

  useEffect(() => {
    localStorage.setItem('devtime_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleAddSession = (e) => {
    e.preventDefault();
    if (!clientName.trim() || !projectName.trim() || !hoursSpent || !taskDescription.trim()) return;

    const rate = parseFloat(hourlyRate) || 0;
    const hours = parseFloat(hoursSpent) || 0;

    const newSession = {
      id: Date.now(),
      clientName,
      projectName,
      hourlyRate: rate,
      hoursSpent: hours,
      taskDescription,
      earnings: hours * rate,
      date: new Date().toLocaleDateString()
    };

    setSessions([newSession, ...sessions]);
    setTaskDescription('');
    setHoursSpent('');
  };

  const deleteSession = (id) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const copyInvoice = () => {
    if (sessions.length === 0) return;
    
    const totalHours = sessions.reduce((sum, s) => sum + s.hoursSpent, 0);
    const totalEarnings = sessions.reduce((sum, s) => sum + s.earnings, 0);

    let invoiceMarkdown = `#  INVOICE: ${projectName} (${clientName})\n`;
    invoiceMarkdown += `**Date Generated:** ${new Date().toLocaleDateString()}\n`;
    invoiceMarkdown += `**Total Hours Logged:** ${totalHours} hrs\n`;
    invoiceMarkdown += `**Total Amount Due:** $${totalEarnings.toFixed(2)}\n\n`;
    invoiceMarkdown += `###  Break Down of Logged Tasks:\n`;
    
    sessions.forEach(s => {
      invoiceMarkdown += `* [${s.date}] - **${s.hoursSpent} hrs** @ $${s.hourlyRate}/hr: ${s.taskDescription} *(Subtotal: $${s.earnings.toFixed(2)})*\n`;
    });

    navigator.clipboard.writeText(invoiceMarkdown);
    alert('Invoice Markdown copied to clipboard! 🎉');
  };

  const totalEarnings = sessions.reduce((sum, s) => sum + s.earnings, 0);

  return (
    <div style={{ maxWidth: '850px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif', color: '#1a202c' }}>
      <header style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ margin: '0', fontSize: '28px', color: '#319795' }}>⏱ DevTime</h1>
        <p style={{ margin: '5px 0 0 0', color: '#4a5568' }}>Track your freelance developer hours and instantly generate clean client invoices.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        
        {/* LEFT PANEL: Log Form */}
        <form onSubmit={handleAddSession} style={{ backgroundColor: '#f7fafc', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <h3 style={{ marginTop: '0', marginBottom: '20px', color: '#2d3748' }}>Log Work Session</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>Client Name</label>
              <input type="text" placeholder="e.g., Acme Corp" value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>Project Name</label>
              <input type="text" placeholder="e.g., Landing Page" value={projectName} onChange={(e) => setProjectName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>Hourly Rate ($)</label>
              <input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>Hours Spent</label>
              <input type="number" step="0.25" placeholder="e.g., 2.5" value={hoursSpent} onChange={(e) => setHoursSpent(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '5px' }}>Task Description</label>
            <textarea placeholder="What feature or bug did you resolve?" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', minHeight: '60px', resize: 'vertical' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#319795', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
            Log Hours ➕
          </button>
        </form>

        {/* RIGHT PANEL: Summary and Session Stream */}
        <div>
          {/* Dynamic Dashboard Earnings Panel */}
          <div style={{ backgroundColor: '#e6fffa', border: '1px solid #b2f5ea', padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#2c7a7b', uppercase: 'true' }}>Total Outstanding Due</span>
              <h2 style={{ margin: '0', fontSize: '28px', color: '#234e52' }}>${totalEarnings.toFixed(2)}</h2>
            </div>
            {sessions.length > 0 && (
              <button onClick={copyInvoice} style={{ padding: '8px 14px', backgroundColor: '#234e52', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                📋 Copy Invoice
              </button>
            )}
          </div>

          <h3 style={{ marginTop: '0', color: '#2d3748', marginBottom: '15px' }}>Time Sheet Entries</h3>
          {sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', border: '2px dashed #e2e8f0', borderRadius: '12px', color: '#a0aec0' }}>
              No time sheets logged yet. Fill out the session logger form to start.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sessions.map((session) => (
                <div key={session.id} style={{ padding: '15px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#fff', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                    <span>💼 {session.clientName} &bull; {session.projectName}</span>
                    <button onClick={() => deleteSession(session.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer' }}>Remove</button>
                  </div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#2d3748' }}>{session.taskDescription}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#4a5568' }}>⏱️ <strong>{session.hoursSpent} hrs</strong> (@ ${session.hourlyRate}/hr)</span>
                    <span style={{ color: '#2c7a7b', fontWeight: 'bold' }}>+${session.earnings.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;