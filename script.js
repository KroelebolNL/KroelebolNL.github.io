const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

// --- 1. LANYARD STATUS & KLOK (Behouden) ---
async function updateStatus() {
    try {
        const response = await fetch(LANYARD_URL);
        const json = await response.json();
        const dot = document.getElementById('status-dot');
        const text = document.getElementById('discord-status-text');
        const label = document.getElementById('status-label');
        const statusBox = document.querySelector('.status-box');

        if (!dot || !text || !label) return;

        if (json.success) {
            const data = json.data;
            const status = data.discord_status;
            
            const colors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
            const currentColor = colors[status] || colors.offline;
            dot.style.backgroundColor = currentColor;
            dot.style.boxShadow = `0 0 10px ${currentColor}`;
            label.textContent = status.toUpperCase();

            // Fade Effect voor tekstverandering
            text.classList.add('fade-out');

            setTimeout(() => {
                if (data.listening_to_spotify && data.spotify) {
                    const song = data.spotify.song || data.spotify.track || "A song";
                    const artist = data.spotify.artist || "Unknown Artist";
                    text.textContent = `Listening to ${song} by ${artist}`;

                    if (statusBox && data.spotify.album_art_url) {
                        statusBox.style.backgroundImage = `linear-gradient(rgba(30, 27, 36, 0.9), rgba(30, 27, 36, 0.9)), url('${data.spotify.album_art_url}')`;
                        statusBox.style.backgroundSize = 'cover';
                        statusBox.style.backgroundPosition = 'center';
                    }
                } else {
                    if (statusBox) statusBox.style.backgroundImage = 'none';
                    const custom = data.activities.find(a => a.type === 4);
                    text.textContent = (custom && custom.state) ? `"${custom.state}"` : "Expert at doing nothing.";
                }
                text.classList.remove('fade-out');
            }, 400); 
        }
    } catch (e) { console.error("Lanyard error:", e); }
}

function updateClock() {
    const now = new Date();
    const options24 = { timeZone: 'Europe/Amsterdam', hour12: false, hour: '2-digit', minute: '2-digit' };
    const options12 = { timeZone: 'Europe/Amsterdam', hour12: true, hour: '2-digit', minute: '2-digit' };
    const time24 = new Intl.DateTimeFormat('nl-NL', options24).format(now);
    const time12 = new Intl.DateTimeFormat('en-US', options12).format(now);
    const clock24 = document.getElementById('clock-24');
    const clock12 = document.getElementById('clock-12');
    if (clock24) clock24.innerHTML = time24.replace(':', '<span>:</span>');
    if (clock12) clock12.textContent = time12;
}

// --- 2. NIEUW: GALLERY SLIDESHOW ---
// Pas deze lijst aan met je eigen foto's!
const galleryImages = [
    "./assets/images/byte-dark.jpg", // Foto 1 (huidige)
    "./assets/images/foto2.jpg",     // Vul hier het pad naar je 2e foto in
    "./assets/images/foto3.jpg",     // Vul hier het pad naar je 3e foto in
    "./assets/images/foto4.jpg"      // Je kunt er zoveel toevoegen als je wilt
];
let currentGalleryIndex = 0;
const galleryTarget = document.getElementById('gallery-target');

function cycleGallery() {
    if (!galleryTarget || galleryImages.length <= 1) return;

    // Fade out
    galleryTarget.classList.add('fade-out');

    // Wacht tot de fade-out klaar is (matcht CSS 0.5s)
    setTimeout(() => {
        // Volgende index, of terug naar 0
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        // Verander de bron van de afbeelding
        galleryTarget.src = galleryImages[currentGalleryIndex];
        
        // Zorg dat de afbeelding geladen is voordat we fade-in doen
        galleryTarget.onload = () => {
            galleryTarget.classList.remove('fade-out');
        };
    }, 500);
}

// --- 3. NIEUW: THOUGHTS CYCLE ---
// Pas deze lijst aan met je favoriete quotes of gedachten!
const thoughtList = [
    "\"Staying in my own little bubble, where the stars shine a bit brighter.\"", // Quote 1
    "\"QUIET & cozy is not just a vibe, it's a lifestyle.\"", // Quote 2
    "\"Sometimes the best adventures happen without moving at all.\"", // Quote 3
    "\"expert at doing nothing. Also good at being shy.\"", // Quote 4
    "\"gmt+1: De tijdzone waar cozy cream altijd cozy is.\"" // Quote 5
];
let currentThoughtIndex = 0;
const quoteTarget = document.getElementById('quote-target');

function cycleThoughts() {
    if (!quoteTarget || thoughtList.length <= 1) return;

    // Fade out
    quoteTarget.classList.add('fade-out');

    // Wacht tot de fade-out klaar is (matcht CSS 0.5s)
    setTimeout(() => {
        // Volgende index, of terug naar 0
        currentThoughtIndex = (currentThoughtIndex + 1) % thoughtList.length;
        // Verander de tekst
        quoteTarget.textContent = thoughtList[currentThoughtIndex];
        
        // Fade in
        quoteTarget.classList.remove('fade-out');
    }, 500);
}

// --- START EN TIMERS ---
// Start Lanyard & Klok
updateStatus();
setInterval(updateStatus, 15000); // Check status elke 15s
updateClock();
setInterval(updateClock, 1000); // Check klok elke 1s

// Start Gallery Slideshow (Elke 10 seconden)
if (galleryTarget && galleryImages.length > 1) {
    setInterval(cycleGallery, 10000); 
}

// Start Thoughts Cycle (Elke 20 seconden)
if (quoteTarget && thoughtList.length > 1) {
    setInterval(cycleThoughts, 20000); 
}
