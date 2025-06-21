const messageMap = document.getElementById("message-map");
const messageDotList = document.querySelectorAll(".message-dot");

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

