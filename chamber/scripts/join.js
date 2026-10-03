// Footer
document.querySelector("#currentyear").textContent =
    new Date().getFullYear();

document.querySelector("#lastModified").textContent =
    `Last Modification: ${document.lastModified}`;

// Record the time the form was loaded
document.querySelector("#timestamp").value =
    new Date().toISOString();

// Open the selected membership modal
const modalButtons = document.querySelectorAll("[data-modal]");

modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.modal;
        const modal = document.getElementById(modalId);

        if (modal) {
            modal.showModal();
        }
    });
});

// Close membership modals
const closeButtons = document.querySelectorAll(".close-modal");

closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
        button.closest("dialog").close();
    });
});