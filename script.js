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

            // --- START FADE ---
            text.classList.add('fade-out');

            setTimeout(() => {
                if (data.listening_to_spotify && data.spotify) {
                    const songTitle = data.spotify.song || data.spotify.track || "A song";
                    const artistName = data.spotify.artist || "Unknown Artist";
                    text.textContent = `Listening to ${songTitle} by ${artistName}`;

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
                
                // --- EINDIG FADE ---
                text.classList.remove('fade-out');
            }, 400); 

        }
    } catch (e) {
        console.error("Lanyard error:", e);
    }
}

updateStatus();
setInterval(updateStatus, 15000);
