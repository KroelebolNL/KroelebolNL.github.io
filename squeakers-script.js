const DISCORD_USER_ID = "416887610233847820";
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

// --- 1. LANYARD STATUS ---
async function updateStatus() {
    try {
        const response = await fetch(LANYARD_URL);
        const json = await response.json();
        const dot       = document.getElementById('status-dot');
        const text      = document.getElementById('discord-status-text');
        const label     = document.getElementById('status-label');
        const statusBox = document.querySelector('.status-box');

        if (json.success) {
            const data   = json.data;
            const status = data.discord_status;
            const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
            const currentColor = colors[status] || colors.offline;

            if (dot) {
                dot.style.backgroundColor = currentColor;
                dot.style.boxShadow = `0 0 10px ${currentColor}`;
            }
            if (label) label.textContent = status.toUpperCase();

            if (text) {
                text.classList.add('fade-out');
                setTimeout(() => {
                    if (data.listening_to_spotify && data.spotify) {
                        text.textContent = `Listening to ${data.spotify.song || data.spotify.track} by ${data.spotify.artist}`;
                        if (statusBox) {
                            statusBox.style.backgroundImage = `linear-gradient(rgba(10, 22, 40, 0.9), rgba(10, 22, 40, 0.9)), url('${data.spotify.album_art_url}')`;
                            statusBox.style.backgroundSize = 'cover';
                            statusBox.classList.add('is-listening');
                            statusBox.onclick = () => window.open(`https://open.spotify.com/track/${data.spotify.track_id}`, '_blank');
                        }
                    } else {
                        if (statusBox) {
                            statusBox.style.backgroundImage = 'none';
                            statusBox.classList.remove('is-listening');
                            statusBox.onclick = null;
                        }
                        const custom = data.activities.find(a => a.type === 4);
                        text.textContent = (custom && custom.state) ? `"${custom.state}"` : "Just vibing in the snow.";
                    }
                    text.classList.remove('fade-out');
                }, 400);
            }
        }
    } catch (e) { console.error(e); }
}

// --- 2. CLOCK (CST — America/Chicago) ---
function updateClock() {
    const now = new Date();
    const opts24 = { timeZone: 'America/Chicago', hour12: false, hour: '2-digit', minute: '2-digit' };
    const opts12 = { timeZone: 'America/Chicago', hour12: true,  hour: '2-digit', minute: '2-digit' };
    const time24 = new Intl.DateTimeFormat('nl-NL', opts24).format(now);
    const time12 = new Intl.DateTimeFormat('en-US', opts12).format(now);
    const clock24 = document.getElementById('clock-24');
    const clock12 = document.getElementById('clock-12');
    if (clock24) clock24.innerHTML = time24.replace(':', '<span>:</span>');
    if (clock12) clock12.textContent = time12;
}

// --- 3. GALLERY SLIDESHOW ---
// Add Squeakers' actual image paths here!
const galleryImages = [
    "./assets/images/squeakers-standing.jpg",
    "./assets/images/squeakers-pose.jpg",
    "./assets/images/squeakers-chill.jpg",
    "./assets/images/squeakers-beautiful.jpg"
];
let currentGalleryIndex = 0;
const galleryTarget = document.getElementById('gallery-target');

function cycleGallery() {
    if (!galleryTarget || galleryImages.length <= 1) return;
    galleryTarget.classList.add('fade-out');
    setTimeout(() => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        galleryTarget.src = galleryImages[currentGalleryIndex];
        galleryTarget.onload = () => galleryTarget.classList.remove('fade-out');
    }, 500);
}

// --- 4. THOUGHTS CYCLE ---
const thoughtList = [
    '"The coldest winters make the warmest hearts."',
    '"Somewhere between lost and found is exactly where I am."',
    '"Not all who wander are lost — some are just exploring."',
    '"Stars can\'t shine without darkness."',
    '"Be the energy you want to attract."',
    '"Silence is a source of great strength."',
    '"You are enough, even on the days you don\'t feel like it."',
    '"Chase the moon, not the noise."',
    '"Even the smallest snowflake makes a difference in a storm."',
    '"Be weird. Be random. Be who you are."',
    '"The best view comes after the hardest climb."',
    '"Stay soft. The world needs your gentleness."',
    '"Every day is a second chance."',
    '"Good things take time. Be patient with yourself."',
    '"The wolf doesn\'t concern himself with the opinion of sheep."',
    '"Let the frost settle. Peace will find you."',
    '"Ask me anything. I don\'t bite... usually."'
];
let currentThoughtIndex = 0;
const quoteTarget = document.getElementById('quote-target');

function cycleThoughts() {
    if (!quoteTarget || thoughtList.length <= 1) return;
    quoteTarget.classList.add('fade-out');
    setTimeout(() => {
        currentThoughtIndex = (currentThoughtIndex + 1) % thoughtList.length;
        quoteTarget.textContent = thoughtList[currentThoughtIndex];
        quoteTarget.classList.remove('fade-out');
    }, 500);
}

// --- 5. SNOWFLAKE PARTICLES ---
function spawnSnow() {
    const container = document.getElementById('snow-container');
    if (!container) return;
    const symbols = ['❄', '❅', '❆', '·', '✦'];
    for (let i = 0; i < 22; i++) {
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        const size = Math.random() * 10 + 7;
        flake.style.cssText = `
            left: ${Math.random() * 100}%;
            font-size: ${size}px;
            animation-duration: ${Math.random() * 20 + 15}s;
            animation-delay: ${Math.random() * 20}s;
            opacity: ${(Math.random() * 0.35 + 0.1).toFixed(2)};
        `;
        container.appendChild(flake);
    }
}

// --- START ---
updateStatus();
setInterval(updateStatus, 15000);

updateClock();
setInterval(updateClock, 1000);

if (galleryTarget && galleryImages.length > 1) {
    setInterval(cycleGallery, 10000);
}
if (quoteTarget && thoughtList.length > 1) {
    setInterval(cycleThoughts, 20000);
}

spawnSnow();
