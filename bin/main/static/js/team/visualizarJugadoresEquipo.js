document.addEventListener("DOMContentLoaded", function () {
    const teamId = getTeamIdFromURL();
    if (!teamId) {
        console.error("Team ID not found");
        return;
    }
    fetchPlayersOfTeam(teamId);

    function fetchPlayersOfTeam(teamId) {
        fetch(`/api/teams/all/${teamId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch players of team: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(players => {
                renderPlayers(players);
            })
            .catch(error => console.error('Error:', error));
    }

    function renderPlayers(players) {
        const playersTableBody = document.querySelector("#playersTable tbody");
        playersTableBody.innerHTML = ''; // Clear previous data

        players.forEach(player => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${player.name}</td>
                <td>
                    <button class="action-button view-button" data-player-id="${player.id}">Ver</button>
                    <button class="action-button remove-button" data-player-id="${player.id}">Expulsar</button>
                </td>
            `;
            playersTableBody.appendChild(row);
        });

        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', handleViewPlayer);
        });

        document.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', handleRemovePlayer);
        });
    }

    function handleViewPlayer(event) {
        const playerId = event.target.getAttribute('data-player-id');
        // Implement view player functionality here
        console.log(`View player with ID: ${playerId}`);
    }

    function handleRemovePlayer(event) {
        const playerId = event.target.getAttribute('data-player-id');

        fetch(`/api/teams/${teamId}/${playerId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to remove player: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(() => {
                displaySuccessMessage('Removed player');
                fetchPlayersOfTeam(teamId);
            })
            .catch(error => console.error('Error:', error));
        console.log(`Remove player with ID: ${playerId}`);
    }


    function displaySuccessMessage(message) {
        const successMessage = document.getElementById("successMessage");
        successMessage.textContent = message;
        successMessage.style.display = "block";

        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }

    function displayErrorMessage(message) {
        const errorMessage = document.getElementById("errorMessage");
        errorMessage.textContent = message;
        errorMessage.style.display = "block";

        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }



    function getTeamIdFromURL() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        return urlParams.get('id');
    }
});
