const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

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
            
            // 1. Kleuren instellen voor de status-dot
            const colors = {
                online: '#43b581',
                idle: '#faa61a',
                dnd: '#f04747',
                offline: '#747f8d'
            };

            const currentColor = colors[status] || colors.offline;
            dot.style.backgroundColor = currentColor;
            dot.style.boxShadow = `0 0 10px ${currentColor}`;
            label.textContent = status.toUpperCase();

            // 2. Spotify Check (Prioriteit #1)
            if (data.listening_to_spotify && data.spotify) {
                // Checkt op .song OF .track voor maximale compatibiliteit
                const songTitle = data.spotify.song || data.spotify.track || "A beautiful song";
                const artistName = data.spotify.artist || "Unknown Artist";
                
                text.textContent = `Listening to ${songTitle} by ${artistName}`;

                // Achtergrond aanpassen naar albumhoes met een donkere overlay
                if (statusBox && data.spotify.album_art_url) {
                    statusBox.style.backgroundImage = `linear-gradient(rgba(30, 27, 36, 0.9), rgba(30, 27, 36, 0.9)), url('${data.spotify.album_art_url}')`;
                    statusBox.style.backgroundSize = 'cover';
                    statusBox.style.backgroundPosition = 'center';
                }
            } else {
                // 3. Custom Status of Default (Als er geen Spotify aanstaat)
                if (statusBox) statusBox.style.backgroundImage = 'none';
                
                const custom = data.activities.find(a => a.type === 4);
                if (custom && custom.state) {
                    text.textContent = `"${custom.state}"`;
                } else {
                    text.textContent = "Expert at doing nothing.";
                }
            }
        } else if (json.error && json.error.code === "user_not_monitored") {
            text.textContent = "Please join the Lanyard Discord.";
            label.textContent = "ERROR";
            dot.style.backgroundColor = "#ff4747";
        }
    } catch (e) {
        console.error("Lanyard error:", e);
    }
}

// Start de loop
updateStatus();
setInterval(updateStatus, 15000);
