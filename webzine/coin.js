const coin = document.querySelector(".coin");
const slot = document.querySelector(".slot");
const coinArea = document.querySelector(".coin-area");
const statusText = document.querySelector(".status");

let dragging = false;
let startX = 0;
let startY = 0;

// function to check if coin is over the slot
function isOverSlot() {
    const c = coin.getBoundingClientRect();
    const s = slot.getBoundingClientRect();
    const coinCenter = c.left + c.width / 2;
    const slotCenter = s.left + s.width / 2;
    const closeSideways = Math.abs(coinCenter - slotCenter) < 50;
    const closeVertically = c.bottom > s.top - 90 && c.top < s.bottom;
    return closeSideways && closeVertically;
}

// send the coin back to the tray with a little slide
function returnCoin() {
    coin.style.transition = "transform 0.3s ease-out";
    coin.style.transform = "";
}

// function for picking up the coin and dragging it
coin.addEventListener("pointerdown", function (event) {
    if (coin.classList.contains("inserted")) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    coin.style.transition = "none";   // follow the mouse with no lag
    coin.classList.add("dragging");
    coin.setPointerCapture(event.pointerId); // keep tracking even if the mouse moves fast
});

// function that determines where the coin is while dragging 
coin.addEventListener("pointermove", function (event) {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    coin.style.transform = "translate(" + dx + "px, " + dy + "px)";
    slot.classList.toggle("ready", isOverSlot());
});

// 3. DROP
coin.addEventListener("pointerup", function () {
    if (!dragging) return;
    dragging = false;
    coin.classList.remove("dragging");
    slot.classList.remove("ready");

    if (!isOverSlot()) {
        returnCoin();
        return;
    }

    insertCoin();
});

function insertCoin() {
    coin.style.transition = "none";
    coin.style.transform = "";
    coinArea.appendChild(coin);       
    coin.classList.add("inserted");  
    statusText.textContent = "";
}

coin.addEventListener("animationend", function (event) {
    if (event.animationName !== "insert") return;

    slot.classList.add("accepted");

    setTimeout(function () {
        location.href = "about.html";
    }, 700);
});

// Keyboard users: focus the coin with Tab, press Enter to insert it.
coin.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !coin.classList.contains("inserted")) {
        event.preventDefault();
        insertCoin();
    }
});
