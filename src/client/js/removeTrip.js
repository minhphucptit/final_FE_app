// Deletes existing trip
export async function removeTrip(e){
    e.preventDefault();
    console.log("remove")

    localStorage.clear()
    
    location.reload()
}

// Cleares the input fields
export async function clearInput(e){
    console.log("clear")

    document.querySelector("#destination").value = "";

    document.querySelector("#departure").value = "";

    document.querySelector("#comeback").value = "";

}
