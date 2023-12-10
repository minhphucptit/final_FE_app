import { updateUI } from "./generateInfo.js";

// Function to create input fields for lodging and notes
function createInputField(type, placeholder, className) {
    const input = document.createElement(type);
    input.classList.add(className);
    input.placeholder = placeholder;
    return input;
}

// Function to create and append a button
function createButton(text, className, onClick) {
    const button = document.createElement("button");
    button.innerHTML = text;
    button.classList.add(className);
    button.addEventListener("click", onClick);
    return button;
}

// Function to handle the common logic for saving lodging and notes
async function saveInfo(type, inputClassName) {
    const projectData = JSON.parse(localStorage.getItem("projectData"));
    const inputValue = document.querySelector(`.${inputClassName}`).value.trim();

    if (!inputValue) {
        return alert(`${type} info is empty`);
    }

    projectData[type] = inputValue;
    localStorage.setItem("projectData", JSON.stringify(projectData));
    updateUI(projectData);
    document.querySelector(`.div${type.capitalize()}`).style.display = "none";
}

// Function to handle the common logic for adding lodging and notes
async function addInfo(type, inputClassName, buttonText, onSave) {
    const oldItems = JSON.parse(localStorage.getItem("projectData"));

    if (!oldItems) {
        return alert("Create your trip first");
    }

    const infoButton = document.querySelector(`#${type}`);
    const parent = document.querySelector(".add-more-info");

    const divInfo = document.createElement("div");
    divInfo.classList.add(`div${type.capitalize()}`);

    const input = createInputField("textarea", `Enter your ${type} info`, inputClassName);
    const submit = createButton(buttonText, "save-info", () => onSave(type, inputClassName));

    divInfo.appendChild(input);
    divInfo.appendChild(submit);

    infoButton.style.display = "none";
    parent.insertBefore(divInfo, parent.firstChild);
}

// Functions to add lodging and notes
export async function lodging(e) {
    e.preventDefault();
    addInfo("lodging", "input-lodging", "Save Lodging", saveInfo);
}

export async function addNotes(e) {
    e.preventDefault();
    addInfo("notes", "input-notes", "Save Notes", saveInfo);
}

// Functions to save lodging and notes
export async function saveLodging(type, inputClassName) {
    saveInfo(type, inputClassName);
}

export async function saveNotes(type, inputClassName) {
    saveInfo(type, inputClassName);
}

// Helper function to capitalize the first letter of a string
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
