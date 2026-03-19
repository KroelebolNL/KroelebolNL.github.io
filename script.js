// --- CONFIGURATION ---
const PROFILES = {
    byte: {
        name: "BYTE",
        pronouns: "HE/HIM",
        vibe: "Quiet & cozy. Staying in my own little bubble.",
        mainImg: "./assets/images/byte-sunset.jpg",
        images: [
            "./assets/images/byte-dark.jpg",
            "./assets/images/byte-camera.jpg",
            "./assets/images/byte-flex.jpg",
            "./assets/images/byte-room.jpg"
        ],
        thoughts: [
            "\"Silence is not empty, it's full of answers.\"",
            "\"Collect moments, not things.\"",
            "\"Protect your peace like it’s a physical treasure.\""
        ],
        accent: "#C774E8",
        discordId: "416887610233847820",
        style: "default" // De normale paarse bento stijl
    },
    squeakers: {
        name: "OmgItzSqueakers",
        pronouns: "HE/HIM",
        vibe: "Shy but friendly. Single Pringle.",
        mainImg: "./assets/images/friend-main.jpg", // Jouw nieuwe foto (image_2.png)
        images: [
            "./assets/images/friend-main.jpg", // Voor nu dezelfde, vul aan met meer ijzige foto's!
            "./assets/images/friend-main.jpg"
        ],
        thoughts: [
            "\"Ask me anything.\""
        ],
        accent: "#A0FEFE", // Neon Cyaan accent voor Status/Tijd in ice-style
        discordId: "JOUW_VRIEND_DISCORD_ID", // Belangrijk: Vul de ID van je vriend hier in!
        style: "ice-style", // De nieuwe winterse stijl
        localTime: "Austin, TX (GMT-6)" // De locatie van je vriend
    }
};

let currentProfileKey = "byte";
let currentGalleryIndex = 0;
let currentThoughtIndex = 0;

// --- CORE FUNCTIONS ---

async function updateStatus() {
    const profile = PROFILES[currentProfileKey];
    const LANYARD_URL = `https://api.lanyard.rest/v1/users/${profile.discordId}`;
    
    try {
        const response = await fetch(LANYARD_URL);
        const json = await response.json();
        const dot = document.getElementById('status-dot');
        const text = document.getElementById('discord-status-text');
        const label = document.getElementById('status-label');
        const statusBox = document.querySelector('.status-box');

        if (json.success) {
            const data = json.data;
            const status = data.discord_status;
            // Kleuren voor de status indicators
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
                    // Spotify Logica
                    if (data.listening_to_spotify && data.spotify) {
                        text.textContent = `Listening to ${data.spotify.song} by ${data.spotify.artist}`;
                        if (statusBox) {
                            // Achtergrond met album art, aangepast voor leesbaarheid
                            statusBox.style.backgroundImage = `linear-gradient(rgba(10, 20, 30, 0.9), rgba(10, 20, 30, 0.9)), url('${data.spotify.album_art_url}')`;
                            statusBox.style.backgroundSize = 'cover';
                            statusBox.classList.add('is-listening');
                            statusBox.onclick = () => window.open(`https://open.spotify.com/track/${data.spotify.track_id}`, '_blank');
                        }
                    } else {
                        // Geen Spotify
                        if (statusBox) {
                            statusBox.style.backgroundImage = 'none';
                            statusBox.classList.remove('is-listening');
                            statusBox.onclick = null;
                        }
                        const custom = data.activities.find(a => a.type === 4);
                        // Gebruik de Discord bio info als status als er geen custom status is
                        if (currentProfileKey === 'squeakers' && (!custom || !custom.state)) {
                            text.textContent = '"26 He/Him Texas"'; // Directe tekst van image_0.png
                        } else {
                            text.textContent = (custom && custom.state) ? `"${custom.state}"` : "Expert at doing nothing.";
                        }
                    }
                    text.classList.remove('fade-out');
                }, 400);
            }
        }
    } catch (e) { 
        console.error("Lanyard Error:", e);
        // Fallback voor status tekst
        if (currentProfileKey === 'squeakers') {
            document.getElementById('discord-status-text').textContent = '"26 He/Him Texas"';
        }
    }
}

function updateClock() {
    const profile = PROFILES[currentProfileKey];
    // Gebruik Amsterdam voor Byte, Austin voor Squeakers
    const timeZone = (currentProfileKey === 'byte') ? 'Europe/Amsterdam' : 'America/Chicago';
    
    const now = new Date();
    const options24 = { timeZone: timeZone, hour12: false, hour: '2-digit', minute: '2-digit' };
    const options12 = { timeZone: timeZone, hour12: true, hour: '2-digit', minute: '2-digit' };
    
    // en-GB voor 24u formaat, en-US voor 12u AM/PM formaat
    const time24 = new Intl.DateTimeFormat('en-GB', options24).format(now);
    const time12 = new Intl.DateTimeFormat('en-US', options12).format(now);
    
    const clock24 = document.getElementById('clock-24');
    const clock12 = document.getElementById('clock-12');
    
    if (clock24) clock24.innerHTML = time24.replace(':', '<span>:</span>');
    if (clock12) clock12.textContent = time12;
}

function cycleGallery() {
    const galleryTarget = document.getElementById('gallery-target');
    const images = PROFILES[currentProfileKey].images;
    if (!galleryTarget || images.length <= 1) return;

    galleryTarget.classList.add('fade-out');
    setTimeout(() => {
        currentGalleryIndex = (currentGalleryIndex + 1) % images.length;
        galleryTarget.src = images[currentGalleryIndex];
        galleryTarget.onload = () => galleryTarget.classList.remove('fade-out');
    }, 500);
}

function cycleThoughts() {
    const quoteTarget = document.getElementById('quote-target');
    const thoughts = PROFILES[currentProfileKey].thoughts;
    if (!quoteTarget || thoughts.length <= 1) return;

    quoteTarget.classList.add('fade-out');
    setTimeout(() => {
        currentThoughtIndex = (currentThoughtIndex + 1) % thoughts.length;
        quoteTarget.textContent = thoughts[currentThoughtIndex];
        quoteTarget.classList.remove('fade-out');
    }, 500);
}

// --- PROFILE SWITCHER LOGIC ---

function switchProfile() {
    currentProfileKey = (currentProfileKey === "byte") ? "squeakers" : "byte";
    const data = PROFILES[currentProfileKey];
    const body = document.body;

    // 1. Update Teksten & Afbeeldingen
    document.getElementById('profile-name').textContent = data.name;
    document.getElementById('profile-pronouns').textContent = data.pronouns;
    document.getElementById('profile-vibe').textContent = data.vibe;
    document.getElementById('quote-author').textContent = `— ${data.name.split(' ')[0]}`; // pakt OmgItz of Byte
    document.getElementById('profile-main-img').src = data.mainImg;
    
    // Update Locatie tekst onder klok
    document.querySelector('.extra-box .subtext').textContent = data.localTime || "Amsterdam, NL (GMT+1)";

    // 2. Reset Gallery & Thoughts
    currentGalleryIndex = 0;
    currentThoughtIndex = 0;
    document.getElementById('gallery-target').src = data.images[0];
    document.getElementById('quote-target').textContent = data.thoughts[0];

    // 3. Update Kleur & Stijl (Dit is de belangrijkste verandering!)
    if (data.style === "ice-style") {
        body.classList.add('ice-style'); // Activeert CSS ijzige stijlen
        document.documentElement.style.setProperty('--accent-glow', data.accent); // Neon Cyaan
        switchBackgroundAnimation('snow');
    } else {
        body.classList.remove('ice-style'); // Terug naar paars
        document.documentElement.style.setProperty('--accent-glow', data.accent); // Paars
        switchBackgroundAnimation('bubbles');
    }

    // 4. Refresh Discord Status
    updateStatus();
}

// Hulpfunctie om achtergrondsfeer te wisselen
function switchBackgroundAnimation(type) {
    const bubbleContainer = document.getElementById('bubble-container');
    const snowContainer = document.getElementById('snow-container');

    if (type === 'snow') {
        // Schakel Byte's bubbels uit
        if (bubbleContainer) bubbleContainer.style.display = 'none';
        
        // Schakel Squeakers sneeuw in
        if (snowContainer) {
            snowContainer.style.display = 'block';
            createSnowflakes(); // Voegt sneeuwvlokken toe als ze er nog niet zijn
        }
    } else {
        // Schakel Byte's bubbels in
        if (bubbleContainer) bubbleContainer.style.display = 'block';
        
        // Schakel Squeakers sneeuw uit
        if (snowContainer) snowContainer.style.display = 'none';
    }
}

// Genereert sneeuwvlokken via JS voor betere controle over animatie
function createSnowflakes() {
    const container = document.getElementById('snow-container');
    if (container.children.length > 0) return; // Maak ze niet dubbel aan

    const numberOfSnowflakes = 50;
    for (let i = 0; i < numberOfSnowflakes; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        
        // Random grootte, positie en snelheid
        const size = Math.random() * 5 + 2 + 'px';
        const left = Math.random() * 100 + '%';
        const delay = Math.random() * 20 + 's';
        const duration = Math.random() * 10 + 5 + 's';

        snowflake.style.width = size;
        snowflake.style.height = size;
        snowflake.style.left = left;
        snowflake.style.animationDelay = delay;
        snowflake.style.animationDuration = duration;

        container.appendChild(snowflake);
    }
}

// --- INITIALIZE ---
document.getElementById('profile-toggle').addEventListener('click', switchProfile);

updateStatus();
setInterval(updateStatus, 15000); // Check status elke 15s
updateClock();
setInterval(updateClock, 1000); // Check klok elke 1s
setInterval(cycleGallery, 10000); // Gallery elke 10s
setInterval(cycleThoughts, 20000); // Thoughts elke 20s
