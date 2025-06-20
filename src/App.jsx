import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';
import { IncomeExpenseChart, DailyTrendChart, MonthlyComparisonChart } from './Charts';

function formatYen(num) {
  return num.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' });
}

export default function App() {
  const [records, setRecords] = useState([
    // テストデータ
    { id: 1, type: '収入', amount: 250000, memo: '給与', date: new Date('2025-06-01') },
    { id: 2, type: '支出', amount: 80000, memo: '家賃', date: new Date('2025-06-01') },
    { id: 3, type: '支出', amount: 3500, memo: 'ランチ', date: new Date('2025-06-02') },
    { id: 4, type: '支出', amount: 12000, memo: '食材', date: new Date('2025-06-03') },
    { id: 5, type: '収入', amount: 5000, memo: 'フリマ', date: new Date('2025-06-04') },
    { id: 6, type: '支出', amount: 8000, memo: '交通費', date: new Date('2025-06-05') },
    { id: 7, type: '支出', amount: 15000, memo: '外食', date: new Date('2025-06-06') },
    { id: 8, type: '支出', amount: 2800, memo: 'コンビニ', date: new Date('2025-06-07') },
    { id: 9, type: '収入', amount: 3000, memo: 'ポイント', date: new Date('2025-06-08') },
    { id: 10, type: '支出', amount: 6500, memo: '映画', date: new Date('2025-06-09') },
    { id: 11, type: '支出', amount: 4200, memo: 'カフェ', date: new Date('2025-06-10') },
    { id: 12, type: '支出', amount: 25000, memo: '光熱費', date: new Date('2025-06-11') },
    { id: 13, type: '支出', amount: 9800, memo: '日用品', date: new Date('2025-06-12') },
    { id: 14, type: '収入', amount: 15000, memo: '副業', date: new Date('2025-06-13') },
    { id: 15, type: '支出', amount: 7200, memo: 'ガソリン', date: new Date('2025-06-14') },
    { id: 16, type: '支出', amount: 18000, memo: '服', date: new Date('2025-06-15') },
    { id: 17, type: '支出', amount: 5400, memo: 'ランチ', date: new Date('2025-06-16') },
    { id: 18, type: '収入', amount: 2500, memo: 'キャッシュバック', date: new Date('2025-06-17') },
    { id: 19, type: '支出', amount: 11000, memo: '美容院', date: new Date('2025-06-18') },
    { id: 20, type: '支出', amount: 3600, memo: 'コンビニ', date: new Date('2025-06-19') }
  ]);
  const [form, setForm] = useState({ type: '支出', amount: '', memo: '', date: new Date() });
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeView, setActiveView] = useState('calendar');

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

  const renderViewSelector = () => (
    <div style={{ marginBottom: 20, textAlign: 'center' }}>
      <button
        onClick={() => setActiveView('calendar')}
        style={{
          padding: '8px 16px',
          marginRight: '8px',
          backgroundColor: activeView === 'calendar' ? '#0078d7' : '#f0f0f0',
          color: activeView === 'calendar' ? 'white' : 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        カレンダー
      </button>
      <button
        onClick={() => setActiveView('charts')}
        style={{
          padding: '8px 16px',
          backgroundColor: activeView === 'charts' ? '#0078d7' : '#f0f0f0',
          color: activeView === 'charts' ? 'white' : 'black',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        グラフ
      </button>
    </div>
  );

  return (
    <div style={{ maxWidth: activeView === 'charts' ? 800 : 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>家計簿</h1>
      {renderViewSelector()}
      
      {activeView === 'calendar' && (
        <div style={{ marginBottom: 20 }}>
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
      )}

      {activeView === 'charts' && records.length > 0 && (
        <div>
          <IncomeExpenseChart records={records} />
          <DailyTrendChart records={records} />
          <MonthlyComparisonChart records={records} />
        </div>
      )}

      {activeView === 'charts' && records.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>データを入力するとグラフが表示されます</p>
        </div>
      )}
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
  );
}
