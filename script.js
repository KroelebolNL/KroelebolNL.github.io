const DISCORD_USER_ID = "416887610233847820"; 
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`;

async function updateStatus() {
    try {
        const response = await fetch(LANYARD_URL);
        const data = await response.json();

        const dot = document.getElementById('status-dot');
        const text = document.getElementById('discord-status-text');
        const label = document.getElementById('status-label');

        // Check of de user überhaupt gevolgd wordt door Lanyard
        if (data.error && data.error.code === "user_not_monitored") {
            text.textContent = "Server fix needed";
            label.textContent = "Join Lanyard Discord Server";
            dot.style.backgroundColor = "#ff4747"; // Rood voor error
            return;
        }

        if (data.success) {
            const status = data.data.discord_status;
            const colors = {
                online: '#43b581',
                idle: '#faa61a',
                dnd: '#f04747',
                offline: '#747f8d'
            };

            dot.style.backgroundColor = colors[status] |

| colors.offline;
            dot.style.boxShadow = `0 0 15px ${colors[status]}`;
            label.textContent = status.toUpperCase();

            // Custom status check
            const custom = data.data.activities.find(a => a.type === 4);
            text.textContent = custom? `"${custom.state}"` : "Expert at doing nothing.";
        }
    } catch (e) {
        console.error("Lanyard error:", e);
    }
}

// Initial check & interval
updateStatus();
setInterval(updateStatus, 15000);
