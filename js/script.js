const DATA_URL = "https://thekingofhearts777.github.io/UWPLATT-Computer3870-Assignment02-json-data/emoji.json";

async function loadJSON(url) {
    try {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return await resp.json();
    } catch (err) {
        console.error("Failed to load JSON:", err);
        alert("Could not load data. Check the console and URL.");
        return null;
    }
}

let sourceEmojis = [];
let viewEmojis = [];

function renderEmojis(list) {
    const container = document.querySelector('.container');
    container.innerHTML = "";
    for (const emoji of list) {
        const card = document.createElement("div");
        card.className = "card mb-4 shadow-sm m-3";

        let emojiUnicodetoString = String(emoji.unicode).split("U+").join("&#x") + ";";

        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${emoji.name}</h5>
                <p class="card-text display-1">${emojiUnicodetoString}</p>
                <p class="card-text"><small class="text-muted">Category: ${emoji.category}</small></p>
                <p class="card-text"><small class="text-muted">Description: ${emoji.description}</small></p>
            </div>
        `;
        container.appendChild(card);
    }
}

async function loadAndRender() {
    const data = await loadJSON(DATA_URL);
    if (!data) return;
    sourceEmojis = Array.isArray(data) ? data : (data.emojis ?? data.items ?? []);
    viewEmojis = [...sourceEmojis];
    renderEmojis(viewEmojis);

    // Create the category dropdown
    const emojiCategories = [...new Set(viewEmojis.map(emoji => emoji.category))];
    const categoryDropdown = document.getElementById("categories");

    for (const category of emojiCategories) {
        let newOption = document.createElement("option");
        newOption.value = category;
        newOption.textContent = category;

        categoryDropdown.appendChild(newOption);
    }
}

function sortByNameAsc() {
    viewEmojis = [...viewEmojis].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    renderEmojis(viewEmojis);
}
function sortByNameDesc() {
    viewEmojis = [...viewEmojis].sort((a, b) => (b.name || "").localeCompare(a.name || ""));
    renderEmojis(viewEmojis);
}

function filterByTerm(term) {
    const t = (term || "").trim().toLowerCase();
    if (t === "") {
        viewEmojis = [...sourceEmojis];
    } else {
        viewEmojis = sourceEmojis.filter(e =>
            ((e.name || "").toLowerCase().includes(t)) ||
            ((e.category || "").toLowerCase().includes(t)) ||
            ((e.description || "").toLowerCase().includes(t))
        );
    }
    renderEmojis(viewEmojis);
}

function filterByCategory(category) {
    viewEmojis = sourceEmojis.filter(e =>
        (e.category === category)
    );
    
    renderEmojis(viewEmojis);
}

document.getElementById("btnLoad")?.addEventListener("click", loadAndRender);
document.getElementById("btnAsc")?.addEventListener("click", sortByNameAsc);
document.getElementById("btnDesc")?.addEventListener("click", sortByNameDesc);

document.getElementById("btnFilter")?.addEventListener("click", () => {
    const term = document.getElementById("txtSearch")?.value ?? "";
    filterByTerm(term);
});

document.getElementById("txtSearch")?.addEventListener(
    "keydown", (e) => {
        if (e.code === "Enter") {
            filterByTerm(e.target.value)
        }
    }
);

// Spinner animation
async function playSpinner() {
    document.getElementById("info").style.display = "none";

    const spinner = document.getElementById("spinner");
    const data = await loadJSON(DATA_URL);
    if (!data) return;

    const emojis = (Array.isArray(data) ? data : (data.emojis ?? [])).slice(0, 6);
    const angleStep = 360 / emojis.length;

    emojis.forEach((emoji, i) => {
        const span = document.createElement("span");
        const emojiStr = String(emoji.unicode).split("U+").join("&#x") + ";";
        span.innerHTML = emojiStr;
        span.classList.add("emoji");
        span.style.transform = `rotate(${angleStep * i}deg) translateY(-90px) rotate(-${angleStep * i}deg)`;
        spinner.appendChild(span);
    });


    setTimeout(() => {
        spinner.classList.add("fade-out");
        setTimeout(() => {
            spinner.remove();
            document.getElementById("info").style.display = "block";
            loadAndRender();
        }, 1000);
    }, 3000);
}

playSpinner();