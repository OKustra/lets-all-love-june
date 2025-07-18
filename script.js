import { messages } from "./data/messageData.js";
import { songIdToName } from "./data/lookupData.js";
import { characterIdLookup } from "./data/lookupData.js";

const messageMap = document.getElementById("message-map");
const messageTab = document.getElementById("message-tab");
const messageContent = document.getElementById("message-content");
const musicTab = document.getElementById("music-tab");
const characterTab = document.getElementById("character-tab");
const trackList = document.getElementById("track-list");
const gallery = document.getElementById("gallery");
const coordDisplayEnabled = false;

// Displays a dot's message in the message panel
function displayMessage(messageDot) {
    let compiledMessage = ""

    const friendName = messageDot.dataset.friendName;
    compiledMessage += `<strong>${friendName}</strong>`;

    const friendMessage = messageDot.dataset.message;
    compiledMessage += `<br><br>${friendMessage.replace(/\n/g, "<br>")}`

    // On first click, read songIds from dataset if they exist, then add each to a notification that songs have been collected
    if (messageDot.dataset.previouslyClicked == "false") {
        if (messageDot.dataset.songIds) {
        compiledMessage += `<br><br><span class="extra-text">Music added to collection!`

        const friendSongs = messageDot.dataset.songIds.split(","); // Transforms data into iterable array
        shuffleArray(friendSongs);

        friendSongs.forEach(songId => {
            compiledMessage += `<br><i>${songIdToName[songId]}</i>`
        });

        compiledMessage += `</span>`
        }
    }

    // On first click, read characterIds from dataset if they exist, then add each to a notification that images have been collected
    if (messageDot.dataset.previouslyClicked == "false") {
        if (messageDot.dataset.characterIds) {
        compiledMessage += `<br><br><span class="extra-text">Characters added to gallery!`

        const friendCharacters = messageDot.dataset.characterIds.split(","); // Transforms data into iterable array
        shuffleArray(friendCharacters);

        friendCharacters.forEach(characterId => {
            compiledMessage += `<br><i>${characterIdLookup[characterId].name}</i>`
        });

        compiledMessage += `</span>`
        }
    }

    messageContent.innerHTML = compiledMessage;
};

// Helper function to add songs to music content
function addSongs(songIds) {
    musicTab.classList.remove("hidden");

    songIds.forEach(id => {
        const songItem = document.createElement("li");
        songItem.textContent = songIdToName[id];

        trackList.appendChild(songItem);
    });
}

// Helper function to add characters to character content
function addCharacters(characterIds) {
    characterTab.classList.remove("hidden");

    characterIds.forEach(id => {
        const characterName = characterIdLookup[id].name;
        const imageURLs = characterIdLookup[id].imageURLs;

        shuffleArray(imageURLs);

        imageURLs.forEach(url => {
            const characterImg = document.createElement("img");
            characterImg.setAttribute("src", url);
            characterImg.setAttribute("title", characterName);
            characterImg.classList.add("gallery-item");
            gallery.appendChild(characterImg);
        });
    });
}

// Shuffles an array's contents via Fisher-Yates shuffle
function shuffleArray(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

// Darken a hex color. Used for dot stroke color
function darkenHexColor(hex, factor = 0.7) {
    if (!/^#([A-Fa-f0-9]{6})$/.test(hex)) return hex; // Validate hex format
    const r = Math.floor(parseInt(hex.substr(1,2),16) * factor);
    const g = Math.floor(parseInt(hex.substr(3,2),16) * factor);
    const b = Math.floor(parseInt(hex.substr(5,2),16) * factor);
    const toHex = v => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Deactivate all tabs and panel content, activate message tab and content
function resetActivation() {
    // Remove active from all tabs and panes
    document.querySelectorAll("#side-tabs .tab").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll("#tab-content-container .tab-content").forEach(pane => pane.classList.remove("active"));

    // Activate message tab and content pane
    messageTab.classList.add("active");
    messageContent.classList.add("active");
}

// Display messageMap's coordinates under the mouse cursor and allow copying them to clipboard
if (coordDisplayEnabled) {
    // Creates a div in body for displaying coordinates
    const coordDisplay = document.createElement("div");
    coordDisplay.setAttribute("id", "coord-display");
    coordDisplay.textContent = "0,0";
    document.body.appendChild(coordDisplay);
    // Add event listener for mouse movement to update coordinates
    messageMap.addEventListener("mousemove", (event) => {
        // Find mouse positions
        const mouseScreenPos = new DOMPoint(event.clientX, event.clientY);
        const mouseMapPos = mouseScreenPos.matrixTransform(messageMap.getScreenCTM().inverse());
        // Update coordinate display
        coordDisplay.textContent = `${Math.round(mouseMapPos.x)},${Math.round(mouseMapPos.y)}`;
        coordDisplay.style.left = event.pageX + 10 + 'px';
        coordDisplay.style.top = event.pageY + 10 + 'px';
    });
    // Add event listener for click to copy coordinates to clipboard
    messageMap.addEventListener("click", () => {
        navigator.clipboard.writeText(coordDisplay.textContent)
        .then(() => {
            coordDisplay.classList.add("copied");
            setTimeout(() => {
                coordDisplay.classList.remove("copied");
            }, 650);
        })
        .catch(err => {
            console.error("Clipboard copy failed: ", err);
        });
    });
};

// Generates message dots on map from messageData.js
messages.forEach(msg => {
    // Parses coordinates from the format "x,y"
    const [x,y] = msg.coordinates.split(",").map(Number);

    // Create SVG circle
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("class", "message-dot unclicked");
    dot.setAttribute("fill", msg.dotColor);
    dot.setAttribute("stroke", darkenHexColor(msg.dotColor));
    dot.setAttribute("data-friend-name", msg.friendName)
    dot.setAttribute("data-message", msg.message);
    dot.setAttribute("data-previously-clicked", false); // Changed to true on first click
    if (msg.songIds != undefined) {
        dot.setAttribute("data-song-ids", msg.songIds);
    }
    if (msg.characterIds != undefined) {
        dot.setAttribute("data-character-ids", msg.characterIds);
    }

    // Adds event listener to message dot to display message on click
    dot.addEventListener("click", () => {
        // Display the message from dot's dataset
        displayMessage(dot);
        // Add song(s) from dot's dataset
        if ((dot.dataset.previouslyClicked == "false") && (dot.dataset.songIds)) {
            const songList = dot.dataset.songIds.split(",");
            shuffleArray(songList);

            addSongs(songList);
        }
        // Add character(s) from dot's dataset
        if ((dot.dataset.previouslyClicked == "false") && (dot.dataset.characterIds)) {
            const characterList = dot.dataset.characterIds.split(",");
            shuffleArray(characterList);

            addCharacters(characterList);
        }
        // Mark the dot as clicked for future logic and to avoid duplicates
        dot.dataset.previouslyClicked = "true";
        dot.classList.remove("unclicked");

        // Reset tab and panel activation to Message tab and Message content respectively
        resetActivation();
    });

    // Append the dot to the message map
    messageMap.appendChild(dot);
});

// Tab switching logic
document.querySelectorAll("#side-tabs .tab").forEach(tabBtn => {
    tabBtn.addEventListener("click", () => {
        // Remove active from all tabs and panes
        document.querySelectorAll("#side-tabs .tab").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll("#tab-content-container .tab-content").forEach(pane => pane.classList.remove("active"));

        // Activate this tab and it's pane
        tabBtn.classList.add("active");
        const tabId = tabBtn.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
    });
});
