let activities = []
let img_urls = []
let activity_type = ["education", "recreational", "social", "diy", "charity", "cooking", "relaxation", "music", "busywork"]
const ACTIVITIES_N = 10; // Number of activities


const fetchActivity = async () => {
    let type = "?type=" + document.getElementById("type_select").value
    const response = await fetch("http://www.boredapi.com/api/activity" + type)
    return response.json()
}


const fetchImg = async (query) => {
    query_url = `https://api.pexels.com/v1/search?query=${query.replaceAll(" ", "%20")}&per_page=3`
    const response = await fetch(query_url, {
        headers: {
            Authorization: "lgYxd6Euv7tS6iEscLKyrZT5DpAWnAch2ZFcv9xrnZYXZi60uGfEEYZJ"
        }
    })
    return response.json()
}

const track = document.getElementById("track")



const getAllActivities = async () => {
    // track.innerHTML = ""
    for (let i = 0; i < ACTIVITIES_N; i++) {
        await fetchActivity().then((data) => activities.push(data["activity"]))

        await fetchImg(activities[i]).then((data) => {
            const url = randomChoice(data["photos"])["src"]["medium"]
            img_urls.push(url)
        })

        new_div = document.getElementById("block" + i)
        new_div.setAttribute("draggable", "false")


        const new_img = document.createElement("img")
        const img_url = img_urls[i]
        new_img.id = "img" + i
        new_img.setAttribute("src", img_url)
        new_img.setAttribute("class", "block_img")
        new_img.setAttribute("draggable", "false")
        new_div.appendChild(new_img)

        const new_p = document.createElement("p")
        new_p.innerHTML = activities[i]
        new_p.setAttribute("class", "block_text")
        new_div.appendChild(new_p)

        updateImgPos(current_percent, 0)
    }

    console.log(activities)
    console.log(img_urls)

}

// Runs when first open page
function init() {
    getAllActivities();

    const type_select = document.getElementById("type_optgroup")
    activity_type.forEach((type) => {
        let new_type = document.createElement("option")
        new_type.value = type
        new_type.innerHTML = type
        type_select.appendChild(new_type) 
    })

    for (let i = 0; i < ACTIVITIES_N; i++) {
        const new_div = document.createElement("div")
        new_div.id = "block" + i
        new_div.setAttribute("class", "block")
        track.appendChild(new_div)
    }
}
init()

function reset() {
    activities = []
    img_urls = []
    getAllActivities();

    // startX = 0;
    // current_percent = 0;
    // prev_percent = 0;
    // updateTrackPos(0, 0)
    for (let i = 0; i < ACTIVITIES_N; i++){
        document.getElementById("block" + i).innerHTML = ""
    }
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function onGenerateButtonClicked() {
    reset()
}

let startX = 0;
let current_percent = 0;
let prev_percent = 0;

function updateTrackPos(precent, anim_duration) {
    track.animate({
        transform: `translate(${precent}%, -50%)`
    }, {
        duration: anim_duration,
        fill: "forwards"
    })
}

function updateImgPos(percent, anim_duration) {
    for (let i = 0; i < img_urls.length; i++) {
        let offSet = (percent - (i/ACTIVITIES_N)*100)/2
        let img = document.getElementById("img" + i)
        img.animate({
            objectPosition: `${-offSet}% 0%`
        }, {
            duration: anim_duration,
            fill: "forwards"
        })
    }
}

window.onmousemove = e => {
    if (startX == 0) return // Return if mouse is not down
    let deltaX = startX - e.clientX    // How much the mouse has moved since mouseDown
    let percentX = -(deltaX / window.innerWidth * 100)  // Convert to percentage of screen width

    current_percent = percentX + prev_percent  // Take into account the previous percentage (when the user released the mouse)
    current_percent = Math.min(current_percent, 0)  // Clamp value
    current_percent = Math.max(current_percent, -50)

    updateTrackPos(current_percent, 1200)
    updateImgPos(current_percent, 1200)



}

window.onmousedown = e => {
    startX = e.clientX
}

window.onmouseup = e => {
    startX = 0;     // Reset mouse start position
    prev_percent = current_percent  // Store the percentage when mouseUp
}
