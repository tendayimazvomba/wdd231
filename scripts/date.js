const today = new Date();

document.querySelector("#currentyear").textContent = today.getFullYear();

document.querySelector("#lastModified").textContent =
    `Last Modification: ${document.lastModified}`;