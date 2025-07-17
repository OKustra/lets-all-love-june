# Let's All Love June!
This project was created with love for my partner June for their birthday as an interactive birthday card. Happy birthday, June!

Thank you to all the friends who submitted responses to help make this happen. This is my first webpage ever and my first public GitHub project!

**IMPORTANT:** Works best in Chromium-based browsers and in landscape mode. Due to the nature of how I decided to lay out the interface, it does not work very well on mobile devices or other small screens. This page is also known not to work properly on Firefox.

<img width="480" height="270" alt="Page preview containing SVG map and birthday message to June" src="https://github.com/user-attachments/assets/e9de57d7-c6af-448a-a7ce-d83938635d0d">

# Technical Stuff/How It Works
The map is comprised of multiple vector groups "frankensteined" together into a single SVG. Thank you to [amCharts](https://www.amcharts.com/svg-maps/) for the SVG maps, and [Boxy SVG](https://boxy-svg.com/) for the SVG editor.

The map's HTML was then copied and pasted wholesale into the page, so I could manipulate and interact with it via the DOM.

The message dots are \<circle\> elements nested under the SVG and populated via script. The dots get their data via [messageData.js](https://github.com/OKustra/lets-all-love-june/blob/main/data/messageData.js), which stores an array of message objects containing the sender's name, dot color, coordinates, message, and more.

When clicked, the dot is filled with color and displays a birthday message on the panel to the side (on landscape) or bottom (portrait) of the screen. Some responders provided songs and characters that remind them of June, which are then populated under their respective tabs. The tabs can be clicked to reveal a list of collected music, or a collected collage of static/animated images of characters.

Not every responder provided songs or characters. For those who did, their related message data object contains a property with either a single integer ID or an array of IDs. These IDs are used as lookup keys in [lookupData.js](https://github.com/OKustra/lets-all-love-june/blob/main/data/lookupData.js), and the entries are processed and added to the Music and Character tabs.

Tab content is *not* created and destroyed every time a tab is switched. Instead, a tab's content is hidden by default, and the "active" class determines if it is visible or not via CSS property "display: none". This is especially useful for the images tab, which would have to load and unload several megabytes of images every time a tab is switched.
