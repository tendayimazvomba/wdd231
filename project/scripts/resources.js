
/******** Page Elements ********/

const resourcesGrid = document.querySelector("#resources-grid");
const resourcesCount = document.querySelector("#resources-count");
const resourcesError = document.querySelector("#resources-error");
const searchInput = document.querySelector("#resource-search");
const categoryFilter = document.querySelector("#category-filter");

const lessonDialog = document.querySelector("#lesson-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogContent = document.querySelector("#dialog-content");
const closeDialogButton = document.querySelector("#close-dialog");

/******** Application Data ********/

let allResources = [];

const categoryNames = {
    budgeting: "Budgeting",
    saving: "Saving",
    banking: "Banking Basics",
    credit: "Credit Management",
    planning: "Financial Planning"
};

/******** Create Text Element ********/

function createTextElement(tag, className, value) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    element.textContent = value;

    return element;
}

/******** Create Resource Cards ********/

function createResourceCard(resource) {
    const card = document.createElement("article");
    card.className = "resource-card";

    const icon = createTextElement(
        "span",
        "resource-icon",
        resource.icon
    );
    icon.setAttribute("aria-hidden", "true");

    const category = createTextElement(
        "span",
        "resource-category",
        categoryNames[resource.category]
    );

    const title = createTextElement(
        "h3",
        "resource-title",
        resource.title
    );

    const summary = createTextElement(
        "p",
        "resource-summary",
        resource.summary
    );

    const metadata = document.createElement("div");
    metadata.className = "resource-meta";

    const level = createTextElement(
        "span",
        "resource-level",
        `📖 ${resource.level}`
    );

    const duration = createTextElement(
        "span",
        "resource-duration",
        `⏱ ${resource.duration} min read`
    );

    metadata.append(level, duration);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "button button-blue resource-button";
    button.textContent = "Read Lesson →";

    button.setAttribute(
        "aria-label",
        `Read lesson: ${resource.title}`
    );

    button.addEventListener("click", () => {
        openLesson(resource);
    });

    card.append(
        icon,
        category,
        title,
        summary,
        metadata,
        button
    );

    return card;
}

/******** Display Resource Cards ********/

function displayResources(resources) {
    resourcesGrid.replaceChildren();

    const fragment = document.createDocumentFragment();

    resources.forEach((resource) => {
        fragment.appendChild(createResourceCard(resource));
    });

    resourcesGrid.appendChild(fragment);

    const count = resources.length;

    resourcesCount.textContent =
        `${count} lesson${count === 1 ? "" : "s"} found`;

    if (count === 0) {
        const message = createTextElement(
            "p",
            "no-results",
            "No lessons match your search. Try another keyword or category."
        );

        resourcesGrid.appendChild(message);
    }
}

/******** Search and Filter ********/

function filterResources() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredResources = allResources.filter((resource) => {
        const matchesCategory =
            selectedCategory === "all" ||
            resource.category === selectedCategory;

        const searchableText = [
            resource.title,
            resource.summary,
            resource.category,
            categoryNames[resource.category],
            resource.level,
            ...resource.content
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    displayResources(filteredResources);
}

/******** Lesson Dialog ********/

function openLesson(resource) {
    dialogTitle.textContent = resource.title;

    dialogContent.replaceChildren();

    const metadata = createTextElement(
        "p",
        "dialog-meta",
        `${categoryNames[resource.category]} • ${resource.level} • ${resource.duration} min read`
    );

    const summary = createTextElement(
        "p",
        "dialog-summary",
        resource.summary
    );

    dialogContent.append(metadata, summary);

    resource.content.forEach((paragraph) => {
        const paragraphElement = createTextElement(
            "p",
            "lesson-paragraph",
            paragraph
        );

        dialogContent.appendChild(paragraphElement);
    });

    lessonDialog.showModal();
}

closeDialogButton.addEventListener("click", () => {
    lessonDialog.close();
});

/******** Close Dialog on Backdrop ********/

lessonDialog.addEventListener("click", (event) => {
    if (event.target === lessonDialog) {
        lessonDialog.close();
    }
});

/******** Fetch JSON Data ********/

async function loadResources() {
    try {
        const response = await fetch("data/resources.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load lessons. HTTP status: ${response.status}`
            );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid lesson data format.");
        }

        allResources = data;

        filterResources();

    } catch (error) {
        console.error("Error loading resources:", error);

        resourcesCount.textContent = "Lessons unavailable";

        resourcesError.hidden = false;
        resourcesError.textContent =
            "Sorry, we could not load the financial lessons. Please refresh the page and try again.";
    }
}

/******** Event Listeners ********/

searchInput.addEventListener("input", filterResources);

categoryFilter.addEventListener("change", filterResources);

/******** URL Category Filter ********/

const urlParams = new URLSearchParams(window.location.search);
const requestedCategory = urlParams.get("category");

if (
    requestedCategory &&
    Object.hasOwn(categoryNames, requestedCategory)
) {
    categoryFilter.value = requestedCategory;
}

/******** Initialise ********/

loadResources();
