import { messages } from "./messageData.js";

const messageMap = document.getElementById("message-map");
const messagePanel = document.getElementById("message-panel");
const messageContent = document.getElementById("message-content");
const coordDisplayEnabled = false;

// Displays a dot's message in the message panel
function displayMessage(messageDot) {
    const friendName = messageDot.dataset.friendName;
    const message = messageDot.dataset.message;
    messageContent.innerHTML = `<strong>${friendName}</strong><br><br>${message.replace(/\n/g, "<br>")}`;
};

// Darken a hex color. Used for dot stroke color
function darkenHexColor(hex, factor = 0.7) {
    if (!/^#([A-Fa-f0-9]{6})$/.test(hex)) return hex; // Validate hex format
    const r = Math.floor(parseInt(hex.substr(1,2),16) * factor);
    const g = Math.floor(parseInt(hex.substr(3,2),16) * factor);
    const b = Math.floor(parseInt(hex.substr(5,2),16) * factor);
    const toHex = v => v.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
    dot.setAttribute("class", "message-dot");
    dot.setAttribute("fill", msg.dotColor);
    dot.setAttribute("stroke", darkenHexColor(msg.dotColor));
    dot.setAttribute("data-friend-name", msg.friendName)
    dot.setAttribute("data-message", msg.message);

    // Adds event listener to message dot to display message on click
    dot.addEventListener("click", () => {
        displayMessage(dot);
    })

    // Append the dot to the message map
    messageMap.appendChild(dot);
});

