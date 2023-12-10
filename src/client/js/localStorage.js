import { updateUI, countdown } from "./generateInfo.js";

export async function checkStorage() {
    try {
        const projectData = await getStorageData();

        if (!projectData) {
            console.log("No local storage data");
            return;
        }

        updateUI(projectData); // Fill in the UI with saved trip info
        countdown(projectData); // Calculate remaining days till departure
    } catch (error) {
        console.log(error);
    }
}

// Check if local Storage has saved trip
export async function getStorageData() {
    const projectData = JSON.parse(localStorage.getItem("projectData"));
    return projectData;
}
