// Footer
document.querySelector("#currentyear").textContent =
    new Date().getFullYear();

document.querySelector("#lastModified").textContent =
    `Last Modification: ${document.lastModified}`;

// Retrieve submitted form data
const params = new URLSearchParams(window.location.search);

const details = document.querySelector("#application-details");

// Display all required fields
const fields = [
    ["First Name", "firstName"],
    ["Last Name", "lastName"],
    ["Email Address", "email"],
    ["Mobile Number", "phone"],
    ["Organization", "organization"],
    ["Application Timestamp", "timestamp"]
];

// Check that the page has received form information
if (!params.has("firstName")) {
    details.textContent = "No application information was provided.";
} else {
    fields.forEach(([label, parameter]) => {
        const term = document.createElement("dt");
        const description = document.createElement("dd");

        term.textContent = label;

        let value = params.get(parameter) || "Not provided";

        if (parameter === "timestamp" && params.get(parameter)) {
            const date = new Date(value);

            if (!Number.isNaN(date.getTime())) {
                value = date.toLocaleString("en-ZW", {
                    dateStyle: "full",
                    timeStyle: "short"
                });
            }
        }

        description.textContent = value;

        details.append(term, description);
    });
}