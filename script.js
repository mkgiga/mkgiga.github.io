/**
 * Simple string tag function that returns a HTML Element.
 * @param {string} strings 
 * @param  {...any} values 
 * @returns {HTMLElement}
 */
function html(strings, ...values) {
    const template = document.createElement("template");
    let html = strings[0];

    for (let i = 0; i < values.length; i++) {
        html += values[i] + strings[i + 1];
    }

    template.innerHTML = html;
    return template.content.firstElementChild;
}

function createProjectCard({
  name = "wizzy.js",
  description = "A WYSIWYG (What you see is what you get) editor for web applications.",
  icons = ["html", "css", "js"],
  link = "https://github.com/mkgiga/wizzy",
}) {
    const el = html`
        <div class="project-card">
            <h3>${name}</h3>
            <p>${description}</p>
            <ul class="tech-stack"></ul>
            <a href="${link}" target="_blank">View on GitHub</a>
        </div>
    `;
    
    const techStack = el.querySelector(".tech-stack");

    for (const icon of icons) {
        const { devicon, label } = icon;
        const li = html`
            <li>
                <span class="devicon-${devicon}"></span>
                <span class="tech-stack-label">${label}</span>
            </li>
        `;
        techStack.appendChild(li);
    }

    return el;
}

function initLocaleButtons() {
    const localeButtons = document.querySelectorAll(".locale-button");

    for (const button of localeButtons) {
        const targetLocale = button.getAttribute("target-locale");

        button.addEventListener("click", () => {
            setLocale(targetLocale);
        });
    }

}

const localeFile = await fetch("./locale.json");
const locale = await localeFile.json();
const projects = await (async () => {
    const fetched = await fetch("./projects.json");
    const projectsObject = await fetched.json();
    return projectsObject.projects;
})();

function setLocale(code = 'sv') {
    
    if (!locale[code]) {
        setLocale("en");
        return;
    }

    const localeElements = document.querySelectorAll("[locale-key]");

    for (const el of localeElements) {
        const key = el.getAttribute("locale-key");
        el.textContent = locale[code][key];
    }
}

async function main() {
    const projectsContainer = document.querySelector(".project-showcase");

    for (const project of projects) {
        const card = createProjectCard(project);
        projectsContainer.appendChild(card);
    }

    initLocaleButtons();
    
    // Check user's browser locale
    const userLocale = navigator.language.split("-")[0];
    setLocale(userLocale);
}

await main();