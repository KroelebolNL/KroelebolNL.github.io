const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

async function updateStatus() {
    try {
        const response = await fetch(LANYARD_URL);
        const json = await response.json();

        if (!json.success) return;

        const data = json.data;
        const dot = document.getElementById('status-dot');
        const text = document.getElementById('discord-status-text');
        const label = document.getElementById('status-label');

        // 1. Update de status kleur & label
        const status = data.discord_status;
        const colors = {
            online: '#43b581',
            idle: '#faa61a',
            dnd: '#f04747',
            offline: '#747f8d'
        };

        const currentColor = colors[status] || colors.offline;
        dot.style.backgroundColor = currentColor;
        dot.style.boxShadow = `0 0 10px ${currentColor}`; // Geeft die mooie glow
        label.textContent = status.toUpperCase();

        // 2. Update de tekst (Prioriteit: Spotify > Custom Status > Default)
        if (data.listening_to_spotify && data.spotify) {
            text.textContent = `Listening to ${data.spotify.track}`;
        } else {
            const customStatus = data.activities.find(a => a.type === 4);
            if (customStatus && customStatus.state) {
                text.textContent = customStatus.state;
            } else {
                text.textContent = "Expert at doing nothing.";
            }
        }

    } catch (e) {
        console.error("Lanyard error:", e);
    }
}

// Meteen laden en elke 15 seconden verversen
updateStatus();
setInterval(updateStatus, 15000);
