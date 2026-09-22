const url = './data/members.json';

const membersContainer = document.querySelector('#members');
const gridButton = document.querySelector('#grid');
const listButton = document.querySelector('#list');

async function getMemberData() {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Unable to load member data.');
        }

        const data = await response.json();

        console.table(data);

        displayMembers(data);
    } catch (error) {
        console.error('Error loading member data:', error);

        membersContainer.innerHTML =
            '<p class="error-message">Unable to load the business directory.</p>';
    }
}

function displayMembers(members) {

    membersContainer.innerHTML = '';

    members.forEach((member) => {

        const card = document.createElement('section');
        const name = document.createElement('h2');
        const image = document.createElement('img');
        const address = document.createElement('p');
        const phone = document.createElement('p');
        const description = document.createElement('p');
        const membership = document.createElement('p');
        const website = document.createElement('a');

        name.textContent = member.name;

        image.setAttribute(
            'src',
            `images/${member.image}`
        );

        image.setAttribute(
            'alt',
            `${member.name} business`
        );

        image.setAttribute('loading', 'lazy');
        image.setAttribute('width', '300');
        image.setAttribute('height', '200');

        address.innerHTML =
            `<strong>Address:</strong> ${member.address}`;

        phone.innerHTML =
            `<strong>Phone:</strong> ${member.phone}`;

        description.textContent = member.description;

        membership.innerHTML =
            `<strong>Membership:</strong> ${getMembershipLevel(member.membership)}`;

        website.textContent = 'Visit Website';
        website.setAttribute('href', member.website);
        website.setAttribute('target', '_blank');
        website.setAttribute('rel', 'noopener');

        card.appendChild(name);
        card.appendChild(image);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(description);
        card.appendChild(membership);
        card.appendChild(website);

        membersContainer.appendChild(card);
    });
}

function getMembershipLevel(level) {

    if (level === 3) {
        return 'Gold';
    }

    if (level === 2) {
        return 'Silver';
    }

    return 'Member';
}


/* Grid and List Buttons */

gridButton.addEventListener('click', () => {
    membersContainer.classList.add('grid');
    membersContainer.classList.remove('list');
});

listButton.addEventListener('click', () => {
    membersContainer.classList.add('list');
    membersContainer.classList.remove('grid');
});


/* Footer Dates */

const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');

currentYear.textContent = new Date().getFullYear();

lastModified.textContent =
    `Last Modification: ${document.lastModified}`;


/* Load Member Data */

getMemberData();