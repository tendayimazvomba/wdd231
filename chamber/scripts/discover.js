import places from "../data/places.mjs";

// ==========================================
// FOOTER INFORMATION
// ==========================================

const currentYear = document.querySelector("#currentyear");
const lastModified = document.querySelector("#lastModified");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (lastModified) {
    lastModified.textContent =
        `Last Modification: ${document.lastModified}`;
}


// ==========================================
// DISPLAY ATTRACTION CARDS
// ==========================================

const discoverCards = document.querySelector("#discover-cards");

function displayPlaces(placesList) {

    discoverCards.innerHTML = "";

    placesList.forEach((place, index) => {

        // Create card
        const card = document.createElement("article");
        card.classList.add("discover-card");
        card.style.gridArea = `area${index + 1}`;

        // Create title
        const title = document.createElement("h2");
        title.textContent = place.name;

        // Create figure
        const figure = document.createElement("figure");

        // Create image
        const image = document.createElement("img");
        image.src = `images/${place.image}`;
        image.alt = place.alt;
        image.width = 300;
        image.height = 200;
        image.loading = "lazy";
        image.decoding = "async";

        figure.appendChild(image);

        // Create address
        const address = document.createElement("address");
        address.textContent = place.address;

        // Create description
        const description = document.createElement("p");
        description.textContent = place.description;

        // Create Learn More button
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "Learn More";
        button.setAttribute(
            "aria-label",
            `Learn more about ${place.name}`
        );

        button.addEventListener("click", () => {
            window.open(
                place.url,
                "_blank",
                "noopener,noreferrer"
            );
        });

        // Add elements to card
        card.appendChild(title);
        card.appendChild(figure);
        card.appendChild(address);
        card.appendChild(description);
        card.appendChild(button);

        // Add card to container
        discoverCards.appendChild(card);
    });
}

// Generate all eight cards
displayPlaces(places);


// ==========================================
// VISITOR MESSAGE USING LOCAL STORAGE
// ==========================================

const visitMessage = document.querySelector("#visit-message");

const lastVisit = localStorage.getItem("bulawayo-last-visit");

const currentVisit = Date.now();

const millisecondsPerDay = 1000 * 60 * 60 * 24;

if (lastVisit === null) {

    visitMessage.textContent =
        "Welcome! Let us know if you have any questions.";

} else {

    const previousVisit = Number(lastVisit);
    const difference = currentVisit - previousVisit;

    if (!Number.isFinite(previousVisit) ||
        previousVisit <= 0 ||
        difference < 0) {

        visitMessage.textContent =
            "Welcome! Let us know if you have any questions.";

    } else if (difference < millisecondsPerDay) {

        visitMessage.textContent =
            "Back so soon! Awesome!";

    } else {

        const days = Math.floor(
            difference / millisecondsPerDay
        );

        const dayText = days === 1 ? "day" : "days";

        visitMessage.textContent =
            `You last visited ${days} ${dayText} ago.`;
    }
}

// Save current visit
localStorage.setItem(
    "bulawayo-last-visit",
    currentVisit.toString()
);