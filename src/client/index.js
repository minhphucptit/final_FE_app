import { generate, getData, postData, getProjectData, updateUI, countdown, changeDate } from "./js/generateInfo.js";
import { weatherForecast, newForecast, updateWeatherUI, dateFormat } from "./js/weatherForecast.js";
import { removeTrip, clearInput } from "./js/removeTrip.js";
import { lodging, saveLodging, saveNotes, addNotes } from "./js/add.js";
import { checkStorage, getStorageData } from "./js/localStorage.js"

import "./styles/main.scss";
import "./styles/header.scss";
import "./styles/newtrip.scss";
import "./styles/footer.scss";
import "./styles/media.scss";
import "./styles/weather.scss";
import "./styles/add-info.scss";
import img from "./images/travel.jpg";
import geoNames from "./images/geoNames.png";
import weatherbit from "./images/weatherbit.png";


// Installing service worker for production mode only

// Exporting main image for further use in other js files
export async function imageMain () {
    let picture = document.querySelector("#img");
    return picture.src = img
}

imageMain();

let image = document.querySelector("#geoNames");
image.src = geoNames
let weatherbitPic = document.querySelector("#weatherbit");
weatherbitPic.src = weatherbit
document.getElementById("new-save").addEventListener("click", generate);
document.querySelector("#lodging").addEventListener("click", lodging);
document.querySelector("#weather").addEventListener("click", weatherForecast);
document.querySelector("#remove").addEventListener("click", removeTrip);
document.querySelector("#new-remove").addEventListener("click", clearInput);
document.querySelector("#notes").addEventListener("click", addNotes);
window.addEventListener("load", checkStorage)

export {
    generate,
    getData,
    postData,
    getProjectData,
    checkStorage,
    updateUI,
    getStorageData,
    weatherForecast,
    newForecast,
    updateWeatherUI,
    removeTrip,
    clearInput,
    lodging,
    saveLodging,
    saveNotes,
    addNotes,
    dateFormat,
    changeDate
}
