import { imageMain } from "../index.js";

export async function generate(event) {
    event.preventDefault();

    try {
        const data = await getData();
        await postData(data);
        const projectData = await getProjectData();
        await Client.clearInput();
    } catch (error) {
        console.log(error);
    }
}

export async function getData() {
    const destination = document.getElementById("destination").value.trim();
    const departure = encodeURIComponent(document.getElementById("departure").value);
    const comeback = encodeURIComponent(document.querySelector("#comeback").value);

    const d = new Date();
    
    if (!destination) {
        throw new Error("Please, fill in the destination");
    }

    if (!departure) {
        throw new Error("Please, fill in the departure date");
    }

    if (!comeback) {
        throw new Error("Please, fill in the return date");
    }

    if (Date.parse(departure) > Date.parse(comeback)) {
        throw new Error("The return date can't be before the end date");
    }

    if (Date.parse(d.toISOString().slice(0, 10)) > Date.parse(departure)) {
        throw new Error("The departure date can't be in the past.");
    }

    return { destination, departure, comeback };
}

export async function postData(data) {
    if (!data) {
        console.log("The input information is undefined");
        return;
    }

    try {
        const request = await fetch("http://localhost:8082/data", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({ data }),
        });
        const responseData = await request.json();
        return responseData;
    } catch (error) {
        console.log(error);
    }
}

export async function getProjectData() {
    try {
        const request = await fetch("http://localhost:8082/all");
        const data = await request.json();

        if (!data.geoData || !data.geoData.longitude) {
            throw new Error("The destination is incorrect, please choose another destination");
        }

        localStorage.setItem("projectData", JSON.stringify(data));
        const projectData = JSON.parse(localStorage.getItem("projectData"));
        updateUI(projectData);
        return projectData;
    } catch (error) {
        console.log(error);
    }
}

// Filling the user interface with information about the trip
export function updateUI(projectData) {
    if (!projectData) {
        return;
    }

    const list = document.querySelectorAll(".destination");
    list[0].innerText = `${projectData.geoData.city}, ${projectData.geoData.country}`;

    const pictureDiv = document.querySelector(".picture");
    const url = projectData.picture;

    if (projectData.picture !== "") {
        document.querySelector("img").src = url;
    } else {
        imageMain();
    }

    const formattedDates = changeDate(projectData);

    document.querySelector(".departure").innerText = `${formattedDates[0]} ${formattedDates[1]}, ${formattedDates[2]}`;
    document.querySelector(".comeback").innerText = `${formattedDates[3]} ${formattedDates[4]}, ${formattedDates[5]}`;

    if (projectData.lodging) {
        const lodgingButton = document.querySelector("#lodging");
        lodgingButton.style.display = "none";

        const addLodging = createInfoElement("addLodging", "Lodging:", projectData.lodging);
        insertAfter(addLodging, document.querySelector(".add-more-info"));
    }

    if (projectData.notes) {
        const notes = document.querySelector("#notes");
        notes.style.display = "none";

        const addNotes = createInfoElement("notes", "Notes:", projectData.notes);
        insertAfter(addNotes, document.querySelector(".add-more-info"));
    }

    countdown(projectData);
    return projectData;
}

function createInfoElement(className, label, content) {
    const element = document.createElement("div");
    element.classList.add(className);
    element.innerHTML = `<span>${label}</span><br> <p>${content}</p>`;
    return element;
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// To calculate the days left before the departure
export async function countdown(projectData) {

    let today = new Date().toISOString().slice(0, 10);
    if (projectData){
        let departure = projectData.inputData.departure;
        const milliseconds = Date.parse(departure) - Date.parse(today);
        var days = Math.floor( milliseconds / (1000 * 60 * 60 * 24));
        const countdown = document.querySelector(".countdown")
        countdown.classList.add("countdown")
        if (days === 1) {countdown.innerText = `Your trip is 1 day away.`
           return projectData;
        } else if (days === 0) {countdown.innerText = `Your trip is today!`
           return projectData;
        }else if (days < 0){countdown.innerText = `This trip expired!`
            return projectData;
        } else {countdown.innerText = `Your trip is ${days} days away.`
            return projectData;
        }
    } else {console.log("no project is stored");
    }
}
