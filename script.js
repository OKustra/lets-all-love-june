const messageMap = document.getElementById("message-map");
const messageDotList = document.querySelectorAll(".message-dot");
const coordDisplayEnabled = true;

// Get messageMap's coordinates under the mouse cursor
if (coordDisplayEnabled) {
    // Creates a div in body for displaying coordinates
    const coordDisplay = document.createElement("div");
    coordDisplay.setAttribute("id", "coord-display");
    coordDisplay.textContent = "x: 0, y: 0";
    document.body.appendChild(coordDisplay);
    // Add event listener for mouse movement to update coordinates
    messageMap.addEventListener("mousemove", (event) => {
        // Find mouse positions
        const mouseScreenPos = new DOMPoint(event.clientX, event.clientY);
        const mouseMapPos = mouseScreenPos.matrixTransform(messageMap.getScreenCTM().inverse());
        // Update coordinate display
        coordDisplay.textContent = `x: ${Math.round(mouseMapPos.x)}, y: ${Math.round(mouseMapPos.y)}`;
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

// Adds event listener to all message dots to display message on click
messageDotList.forEach(messageDot => {
    messageDot.addEventListener("click", () => {
        displayMessage(messageDot);
    });
});

// TODO: Displays a dot's message
function displayMessage(messageDot) {
    console.log(messageDot);
};

