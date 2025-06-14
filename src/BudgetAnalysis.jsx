import React from "react";

const BudgetAnalysis = ({ budget, records }) => {
  const calculateBudgetInfo = () => {
    if (!budget.targetDate || !budget.monthlyIncome) {
      return null;
    }

    const today = new Date();
    const targetDate = new Date(budget.targetDate);
    const monthsToTarget = Math.max(
      1,
      Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24 * 30))
    );
    const daysToTarget = Math.max(
      1,
      Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24))
    );

    // 今月の支出計算
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const thisMonthExpenses = records
      .filter((record) => {
        if (!record.date) return false;
        const recordDate = new Date(record.date);
        return (
          recordDate.getMonth() === currentMonth &&
          recordDate.getFullYear() === currentYear &&
          record.type === "支出"
        );
      })
      .reduce((total, record) => total + record.amount, 0);

    // 今月の収入計算
    const thisMonthIncome = records
      .filter((record) => {
        if (!record.date) return false;
        const recordDate = new Date(record.date);
        return (
          recordDate.getMonth() === currentMonth &&
          recordDate.getFullYear() === currentYear &&
          record.type === "収入"
        );
      })
      .reduce((total, record) => total + record.amount, 0);

    // 必要な月間貯金額
    const needToSaveTotal = Math.max(0, budget.targetAmount - budget.balance);
    const needToSavePerMonth = needToSaveTotal / monthsToTarget;

    // 使える金額計算
    const availablePerMonth = Math.max(
      0,
      budget.monthlyIncome - needToSavePerMonth
    );
    const availablePerDay = availablePerMonth / 30;

    // 今月の残り予算
    const remainingThisMonth = availablePerMonth - thisMonthExpenses;

    // 今月の残り日数
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const remainingDaysInMonth = Math.max(0, daysInMonth - today.getDate() + 1);

    // 今月の残り予算を残り日数で割った1日あたりの使用可能額
    const remainingDailyBudget =
      remainingDaysInMonth > 0 ? remainingThisMonth / remainingDaysInMonth : 0;

    return {
      monthsToTarget,
      daysToTarget,
      needToSavePerMonth,
      availablePerMonth,
      availablePerDay,
      thisMonthExpenses,
      thisMonthIncome,
      remainingThisMonth,
      remainingDaysInMonth,
      remainingDailyBudget,
    };
  };

  const analysis = calculateBudgetInfo();

  if (!analysis) {
    return (
      <div className="budget-analysis">
        <h3>📊 予算分析</h3>
        <div className="no-data">
          <p>予算設定（目標期日と月収）を完了してください</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return amount.toLocaleString("ja-JP", {
      style: "currency",
      currency: "JPY",
    });
  };

  return (
    <div className="budget-analysis">
      <h3>📊 予算分析</h3>

      <div className="analysis-grid">
        <div className="analysis-card primary">
          <h4>月間利用可能額</h4>
          <p className="amount">{formatCurrency(analysis.availablePerMonth)}</p>
          <small>
            目標達成のため月{formatCurrency(analysis.needToSavePerMonth)}
            の貯金が必要
          </small>
        </div>

        <div className="analysis-card">
          <h4>1日あたり利用可能額</h4>
          <p className="amount">
            {formatCurrency(Math.floor(analysis.availablePerDay))}
          </p>
          <small>月間予算を30日で割った額</small>
        </div>

        <div
          className={`analysis-card ${
            analysis.remainingThisMonth < 0 ? "warning" : "success"
          }`}
        >
          <h4>今月の残り予算</h4>
          <p className="amount">
            {formatCurrency(analysis.remainingThisMonth)}
          </p>
          <small>残り{analysis.remainingDaysInMonth}日</small>
        </div>

        <div className="analysis-card">
          <h4>今日から1日あたり</h4>
          <p className="amount">
            {formatCurrency(
              Math.max(0, Math.floor(analysis.remainingDailyBudget))
            )}
          </p>
          <small>残り予算を残り日数で割った額</small>
        </div>

        <div className="analysis-card">
          <h4>今月の支出</h4>
          <p className="amount expense">
            {formatCurrency(analysis.thisMonthExpenses)}
          </p>
          <small>今月の支出合計</small>
        </div>

        <div className="analysis-card">
          <h4>今月の収入</h4>
          <p className="amount income">
            {formatCurrency(analysis.thisMonthIncome)}
          </p>
          <small>今月の収入合計</small>
        </div>

        <div className="analysis-card">
          <h4>目標まで</h4>
          <p className="amount">{analysis.monthsToTarget}ヶ月</p>
          <small>({analysis.daysToTarget}日)</small>
        </div>

        <div className="analysis-card">
          <h4>目標貯金額まで</h4>
          <p className="amount">
            {formatCurrency(Math.max(0, budget.targetAmount - budget.balance))}
          </p>
          <small>残り必要額</small>
        </div>
      </div>

      {analysis.remainingThisMonth < 0 && (
        <div className="alert warning">
          ⚠️ 今月の予算を{formatCurrency(Math.abs(analysis.remainingThisMonth))}
          超過しています
        </div>
      )}

      {analysis.remainingDaysInMonth > 0 && analysis.remainingThisMonth > 0 && (
        <div className="alert info">
          💡 今月残り{analysis.remainingDaysInMonth}日、1日あたり
          {formatCurrency(Math.floor(analysis.remainingDailyBudget))}使えます
        </div>
      )}
    </div>
  );
};

export default BudgetAnalysis;
