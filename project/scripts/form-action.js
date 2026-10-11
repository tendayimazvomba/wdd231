
/******** URL Parameters ********/

const params = new URLSearchParams(window.location.search);

const name = params.get("name");
const goal = params.get("goal");
const amount = params.get("amount");
const date = params.get("date");
const reason = params.get("reason");

/******** Page Elements ********/

const confirmationHeading = document.querySelector(
    "#confirmation-heading"
);

const confirmationMessage = document.querySelector(
    "#confirmation-message"
);

const goalSummary = document.querySelector("#goal-summary");

/******** Formatting ********/

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
});

function formatDate(dateString) {
    const [year, month, day] = dateString.split("-").map(Number);
    const dateObject = new Date(year, month - 1, day);

    return dateObject.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

/******** Create Summary Row ********/

function createSummaryRow(label, value) {
    const row = document.createElement("div");
    row.classList.add("summary-row");

    const labelElement = document.createElement("span");
    labelElement.classList.add("summary-label");
    labelElement.textContent = label;

    const valueElement = document.createElement("strong");
    valueElement.classList.add("summary-value");
    valueElement.textContent = value;

    row.append(labelElement, valueElement);

    return row;
}

/******** Validate Submission ********/

const allowedGoals = [
    "Emergency Fund",
    "Education",
    "Business",
    "Home",
    "Debt Repayment",
    "Other"
];

const parsedAmount = Number(amount);

function isValidDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const parsed = new Date(year, month - 1, day);

    return parsed.getFullYear() === year &&
        parsed.getMonth() === month - 1 &&
        parsed.getDate() === day;
}

const validSubmission =
    typeof name === "string" &&
    name.trim().length >= 2 &&
    name.length <= 60 &&
    allowedGoals.includes(goal) &&
    amount !== null &&
    Number.isFinite(parsedAmount) &&
    parsedAmount > 0 &&
    isValidDate(date) &&
    typeof reason === "string" &&
    reason.trim().length > 0 &&
    reason.length <= 500;

/******** Display Submission ********/

if (validSubmission) {
    confirmationHeading.textContent = "Your Goal Is Taking Shape!";

    confirmationMessage.textContent =
        `Well done, ${name.trim()}! You have taken an important step by defining your financial goal.`;

    const summaryItems = [
        ["Your Name", name.trim()],
        ["Financial Goal", goal],
        ["Target Amount", currencyFormatter.format(parsedAmount)],
        ["Completion Date", formatDate(date)],
        ["Your Motivation", reason.trim()]
    ];

    summaryItems.forEach(([label, value]) => {
        goalSummary.appendChild(createSummaryRow(label, value));
    });

} else {
    confirmationHeading.textContent = "No Valid Goal Found";

    confirmationMessage.textContent =
        "We could not find a complete financial goal submission. Please return to Money Tools and complete the form.";

    goalSummary.replaceChildren();
}
