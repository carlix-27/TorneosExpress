document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("find-player-form");
    const playerList = document.getElementById("lista-jugadores");

    function getAllPlayers() {
        fetch(`/api/user/players`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(players => renderPlayers(players))
            .catch(error => {
                console.error('Error:', error);
                // Handle the error, display a message to the user
            });
    }

    function renderPlayers(players) {
        playerList.innerHTML = ""; // Clear previous results

        players.forEach(function (player) {
            const listItem = document.createElement("li");
            listItem.textContent = player.name + " - " + player.location;

            // Create invite button
            const inviteButton = document.createElement("button");
            inviteButton.textContent = "Invite";
            inviteButton.addEventListener("click", function () {
                showInviteModal(player);
            });

            // Append invite button to player list item
            listItem.appendChild(inviteButton);

            playerList.appendChild(listItem);
        });
    }

    function filterPlayers(event){
        event.preventDefault();

        console.log("Filtering players...");

        const playerName = form.querySelector("#playerName").value.trim().toLowerCase();
        const playerLocation = form.querySelector("#playerLocation").value.trim().toLowerCase();

        console.log("Name:", playerName);
        console.log("Location:", playerLocation);

        fetch(`/api/user/players`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch active players: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(players => {
                console.log("Fetched players: " + players);

                const filteredPlayers = players.filter(function (player) {
                    const lowercasePlayerName = player.name.toLowerCase();
                    console.log("LowercasePlayerName: ", lowercasePlayerName);
                    const lowercaseLocation = player.location.toLowerCase(); // Corrected this line
                    console.log("LowercasePlayerLocation: ", lowercaseLocation);

                    const nameMatches = lowercasePlayerName.includes(playerName.toLowerCase()) || playerName === "";
                    console.log("Name Matches? : ", nameMatches);

                    const locationMatches = lowercaseLocation.includes(playerLocation.toLowerCase()) || playerLocation === ""; // Corrected this line
                    console.log("Location Matches? : ", locationMatches);

                    return nameMatches && locationMatches;
                });

                console.log("Filtered Players: ", filteredPlayers);
                renderPlayers(filteredPlayers);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Function to show invite modal
    // Function to show invite modal
    function showInviteModal(player) {
        const modal = document.getElementById("inviteModal");
        const closeButton = document.getElementsByClassName("close")[0];
        const sendInviteButton = document.getElementById("sendInviteButton");
        const teamSelect = document.getElementById("teamInput");

        // Display modal
        modal.style.display = "block";

        // Set player name in modal header
        document.querySelector(".modal-content h2").textContent = `Invite ${player.name} to Team`;

        // Close modal when the close button is clicked
        closeButton.onclick = function() {
            modal.style.display = "none";
        }

        // Close modal when user clicks outside the modal
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        // Fetch teams for the current user and populate the dropdown
        const playerId = localStorage.getItem("userId");
        fetch(`/api/user/${playerId}/teams`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(teams => {
                // Clear previous options
                teamSelect.innerHTML = "<option value=''>Select Team</option>";

                // Populate the dropdown menu with the fetched teams
                teams.forEach(team => {
                    const option = document.createElement("option");
                    option.value = team.id; // Assuming the team ID is used as the value
                    option.textContent = team.name; // Assuming the team name is displayed in the dropdown
                    teamSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
                // Handle the error, display a message to the user
            });

        // Send invite when the send invite button is clicked
        sendInviteButton.onclick = function() {
            const teamId = teamSelect.value;
            if (teamId) {
                // Check if the team is private and the current user is the captain
                const isPrivate = true; // You need to retrieve this information from your backend
                const isCaptain = true; // You need to retrieve this information from your backend

                if (isPrivate && !isCaptain) {
                    alert("You are not the captain of this private team. You cannot invite players.");
                } else {
                    sendInvite(player, teamId);
                    modal.style.display = "none"; // Close modal after sending invite
                }
            } else {
                alert("Please select a team.");
            }
        }
    }



// Function to show invite popup
    function sendInvite(player, team) {
        // Code to send invite
        // You can make a fetch request to your backend to send the invite

        // Example code:
        console.log(`Invite ${player.name} to team ${team}`);
    }


    form.addEventListener("submit", filterPlayers);

    // Fetch active tournaments when the page loads
    getAllPlayers();
});