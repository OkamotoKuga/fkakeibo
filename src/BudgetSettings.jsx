import React, { useState, useEffect } from "react";

const BudgetSettings = ({ budget, onBudgetChange }) => {
  const [localBudget, setLocalBudget] = useState({
    balance: 0,
    targetAmount: 0,
    targetDate: "",
    monthlyIncome: 0,
    ...budget,
  });

  useEffect(() => {
    setLocalBudget({ ...localBudget, ...budget });
  }, [budget]);

  const handleChange = (field, value) => {
    const newBudget = { ...localBudget, [field]: value };
    setLocalBudget(newBudget);
    onBudgetChange(newBudget);
  };

  return (
    <div className="budget-settings">
      <h3>💰 予算設定</h3>
      <div className="budget-form">
        <div className="form-group">
          <label>現在の残高 (円)</label>
          <input
            type="number"
            value={localBudget.balance}
            onChange={(e) => handleChange("balance", Number(e.target.value))}
            placeholder="現在の残高を入力"
          />
        </div>

        <div className="form-group">
          <label>目標貯金額 (円)</label>
          <input
            type="number"
            value={localBudget.targetAmount}
            onChange={(e) =>
              handleChange("targetAmount", Number(e.target.value))
            }
            placeholder="目標貯金額を入力"
          />
        </div>

        <div className="form-group">
          <label>目標期日</label>
          <input
            type="date"
            value={localBudget.targetDate}
            onChange={(e) => handleChange("targetDate", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>月収 (円)</label>
          <input
            type="number"
            value={localBudget.monthlyIncome}
            onChange={(e) =>
              handleChange("monthlyIncome", Number(e.target.value))
            }
            placeholder="平均月収を入力"
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetSettings;
