
/******** Imports ********/

import { saveData, getData, removeData } from "./storage.js";

/******** Currency Formatting ********/

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

function formatMoney(amount) {
    return currencyFormatter.format(amount);
}

/******** Budget Calculator ********/

const budgetForm = document.querySelector("#budget-form");
const budgetResults = document.querySelector("#budget-results");

if (budgetForm && budgetResults) {
    budgetForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const income = Number(document.querySelector("#monthly-income").value);

        const expenseIds = [
            "housing",
            "food",
            "transport",
            "utilities",
            "other-expenses"
        ];

        const expenses = expenseIds.map((id) => {
            return Number(document.getElementById(id).value);
        });

        const totalExpenses = expenses.reduce(
            (total, expense) => total + expense,
            0
        );

        const balance = income - totalExpenses;

        const expensePercentage = income > 0
            ? (totalExpenses / income) * 100
            : 0;

        let advice = "";

        if (balance > 0) {
            advice = "Great! You have money remaining after your expenses.";
        } else if (balance === 0) {
            advice = "Your income exactly covers your expenses. Consider building a savings buffer.";
        } else {
            advice = "Your expenses exceed your income. Review your spending and identify areas to reduce costs.";
        }

        budgetResults.innerHTML = `
            <div class="result-item">
                <span>Monthly Income</span>
                <strong>${formatMoney(income)}</strong>
            </div>

            <div class="result-item">
                <span>Total Expenses</span>
                <strong>${formatMoney(totalExpenses)}</strong>
            </div>

            <div class="result-item result-highlight ${balance < 0 ? "result-negative" : ""}">
                <span>Remaining Balance</span>
                <strong>${formatMoney(balance)}</strong>
            </div>

            <div class="result-item">
                <span>Income Used</span>
                <strong>${expensePercentage.toFixed(1)}%</strong>
            </div>

            <div class="budget-advice">
                <h4>💡 Financial Tip</h4>
                <p>${advice}</p>
            </div>
        `;
    });

    budgetForm.addEventListener("reset", () => {
        budgetResults.innerHTML = `
            <p class="result-placeholder">
                Enter your income and expenses,
                then select Calculate Budget
                to see your results.
            </p>
        `;
    });
}

/******** Savings Calculator ********/

const savingsForm = document.querySelector("#savings-form");
const savingsResults = document.querySelector("#savings-results");

function displaySavingsResults(target, current, months) {
    const remaining = Math.max(target - current, 0);
    const monthlySavings = remaining / months;

    const progress = target > 0
        ? Math.min((current / target) * 100, 100)
        : 0;

    const advice = remaining === 0
        ? "Congratulations! You have already reached your savings target."
        : `To reach your goal, aim to save ${formatMoney(monthlySavings)} every month.`;

    savingsResults.innerHTML = `
        <div class="result-item">
            <span>Savings Target</span>
            <strong>${formatMoney(target)}</strong>
        </div>

        <div class="result-item">
            <span>Current Savings</span>
            <strong>${formatMoney(current)}</strong>
        </div>

        <div class="result-item">
            <span>Amount Remaining</span>
            <strong>${formatMoney(remaining)}</strong>
        </div>

        <div class="result-item result-highlight">
            <span>Monthly Savings Needed</span>
            <strong>${formatMoney(monthlySavings)}</strong>
        </div>

        <div class="progress-container">
            <label for="savings-progress">
                Savings Progress: ${progress.toFixed(1)}%
            </label>

            <progress id="savings-progress"
                value="${progress}"
                max="100">
                ${progress.toFixed(1)}%
            </progress>
        </div>

        <div class="budget-advice">
            <h4>🎯 Your Savings Plan</h4>
            <p>${advice}</p>
        </div>
    `;
}

if (savingsForm && savingsResults) {

    const savedSavings = getData("financialCompassSavings");

    if (
        savedSavings &&
        Number.isFinite(savedSavings.target) &&
        Number.isFinite(savedSavings.current) &&
        Number.isInteger(savedSavings.months) &&
        savedSavings.target > 0 &&
        savedSavings.current >= 0 &&
        savedSavings.months >= 1 &&
        savedSavings.months <= 600
    ) {
        document.querySelector("#savings-target").value =
            savedSavings.target;

        document.querySelector("#current-savings").value =
            savedSavings.current;

        document.querySelector("#savings-months").value =
            savedSavings.months;

        displaySavingsResults(
            savedSavings.target,
            savedSavings.current,
            savedSavings.months
        );
    }

    savingsForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const target = Number(
            document.querySelector("#savings-target").value
        );

        const current = Number(
            document.querySelector("#current-savings").value
        );

        const months = Number(
            document.querySelector("#savings-months").value
        );

        if (
            !Number.isFinite(target) ||
            !Number.isFinite(current) ||
            !Number.isInteger(months) ||
            target <= 0 ||
            current < 0 ||
            months < 1 ||
            months > 600
        ) {
            return;
        }

        const savingsData = { target, current, months };

        saveData("financialCompassSavings", savingsData);

        displaySavingsResults(target, current, months);
    });

    savingsForm.addEventListener("reset", () => {
        removeData("financialCompassSavings");

        savingsResults.innerHTML = `
            <p class="result-placeholder">
                Enter your savings target,
                current savings, and timeframe
                to calculate your plan.
            </p>
        `;
    });
}

/******** Financial Goal Form ********/

const goalsForm = document.querySelector("#goals-form");
const goalDate = document.querySelector("#goal-date");

if (goalsForm && goalDate) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    goalDate.min = `${year}-${month}-${day}`;
}
