import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import BudgetSettings from './BudgetSettings';
import BudgetAnalysis from './BudgetAnalysis';

function formatYen(num) {
  return num.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
}

export default function App() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ type: '支出', amount: '', memo: '', date: new Date() });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [budget, setBudget] = useState({
    balance: 0,
    targetAmount: 0,
    targetDate: '',
    monthlyIncome: 0
  });

  // データの読み込み
  useEffect(() => {
    const savedRecords = localStorage.getItem('kakeibo-records');
    const savedBudget = localStorage.getItem('kakeibo-budget');
    
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
    
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    }
  }, []);

  // データの保存
  useEffect(() => {
    localStorage.setItem('kakeibo-records', JSON.stringify(records));
  }, [records]);

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
    localStorage.setItem('kakeibo-budget', JSON.stringify(newBudget));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setForm({ ...form, date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount)) return;
    setRecords([
      ...records,
      { ...form, amount: Number(form.amount), id: Date.now() }
    ]);
    setForm({ ...form, amount: '', memo: '', date: selectedDate });
  };

  const total = records.reduce((acc, r) => acc + (r.type === '収入' ? r.amount : -r.amount), 0);

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>🏠 家計簿アプリ</h1>
      
      <BudgetSettings budget={budget} onBudgetChange={handleBudgetChange} />
      <BudgetAnalysis budget={budget} records={records} />
      
      <div style={{ marginTop: 30, marginBottom: 20 }}>
        <h2>📅 収支記録</h2>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          locale="ja-JP"

          tileClassName={({ date, view }) => {
            if (view === 'month') {
              const isToday = new Date().toDateString() === date.toDateString();
              const isSelected = selectedDate && date.toDateString() === new Date(selectedDate).toDateString();
              const hasRecord = records.some(r => r.date && new Date(r.date).toDateString() === date.toDateString());
              return [
                isToday ? 'react-calendar__tile--now' : '',
                isSelected ? 'react-calendar__tile--active' : '',
                hasRecord ? 'react-calendar__tile--hasRecord' : ''
              ].join(' ');
            }
            return '';
          }}
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const sum = records
                .filter(r => r.date && new Date(r.date).toDateString() === date.toDateString())
                .reduce((acc, r) => acc + (r.type === '収入' ? r.amount : -r.amount), 0);
              return sum !== 0 ? (
                <div className="calendar-record">{sum > 0 ? '+' : ''}{sum.toLocaleString()}</div>
              ) : null;
            }
            return null;
          }}
        />
      </div>
      
      <div style={{ marginTop: 20 }}>
        <h3>📝 新規記録</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="支出">支出</option>
          <option value="収入">収入</option>
        </select>
        <input
          name="amount"
          type="number"
          placeholder="金額"
          value={form.amount}
          onChange={handleChange}
          style={{ width: 80, marginLeft: 8 }}
        />
        <input
          name="memo"
          type="text"
          placeholder="メモ"
          value={form.memo}
          onChange={handleChange}
          style={{ width: 120, marginLeft: 8 }}
        />
        <input
          name="date"
          type="hidden"
          value={form.date instanceof Date ? form.date.toISOString() : form.date}
        />
        <button type="submit" style={{ marginLeft: 8 }}>追加</button>
      </form>
      <div style={{ marginBottom: 10 }}>合計: <b>{formatYen(total)}</b></div>
      <table border="1" cellPadding="4" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr><th>日付</th><th>種別</th><th>金額</th><th>メモ</th></tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td>{r.date ? new Date(r.date).toLocaleDateString('ja-JP') : ''}</td>
              <td>{r.type}</td>
              <td style={{ textAlign: 'right' }}>{formatYen(r.amount)}</td>
              <td>{r.memo}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
