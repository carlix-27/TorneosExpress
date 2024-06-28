import {displaySuccessMessage} from "../display/displaySuccessMessage";
import {displayErrorMessage} from "../display/displayErrorMessage";


function loadTeams() {
    fetch(`/api/teams/all`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(teams => {
            const listaEquipos = document.getElementById("lista-todos-equipos");

            listaEquipos.innerHTML = '';

            teams.forEach(team => {

                const li = document.createElement("li");
                li.innerHTML = `
                    <div>
                        <a href="loadTeam.html?id=${team.id}"><h3>${team.name}</h3></a>
                        <p>Ubicación: ${team.location}</p>
                        <p>Deporte: ${team.sport.sportName}</p>
                        <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
                        <p>Jugadores inscritos: ${team.players.length} / ${team.sport.num_players * 2}</p>
                        <button class="signup-button" data-team-id="${team.id}">Signup</button>
                    </div>
                `;
                listaEquipos.appendChild(li);
            });

            // Attach event listeners to the signup buttons
            document.querySelectorAll('.signup-button').forEach(button => {
                button.addEventListener('click', function () {
                    showSignupModal(this.getAttribute('data-team-id'));
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

function showSignupModal(teamId) {
    const modal = document.getElementById("signupModal");
    const closeButton = modal.querySelector(".close");
    const signupButton = modal.querySelector("#sendInviteButton");
    const userId = localStorage.getItem("userId");

    fetchTeamDetails(teamId)
        .then(team => {
            displayTeamDetails(team, signupButton);
            addSignupButtonListener(team, userId, signupButton);
        })
        .catch(error => {
            console.error("Error:", error);
            // Handle error, show message to user
        });

    displayModal(modal, closeButton);
}

function fetchTeamDetails(teamId) {
    return fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
}

function displayTeamDetails(team, signupButton) {
    const teamDetails = document.getElementById("teamDetails");
    teamDetails.innerHTML = `
        <h3>${team.name}</h3>
        <p>Ubicación: ${team.location}</p>
        <p>Deporte: ${team.sport.sportName}</p>
        <p>Privacidad: ${team.private ? "Privado" : "Público"}</p>
        <p>Jugadores inscritos: ${team.players.length} / ${team.sport.num_players * 2}</p>
    `;

    if (team.private) {
        signupButton.textContent = "Send Request";
        signupButton.setAttribute("data-privacy", "private");
    } else {
        signupButton.textContent = "Sign Up";
        signupButton.setAttribute("data-privacy", "public");
    }
}

function addSignupButtonListener(team, userId, signupButton) {
    signupButton.addEventListener("click", function() {
        const teamPlayers = team.players
        const teamSport = team.sport
        const maxSize = teamSport.num_players * 2
        const teamSize = teamPlayers.length
        if (teamSize < maxSize) {
            const teamIsPrivate = team.private
            if (teamIsPrivate) {
                sendTeamRequest(team, userId);
            }
            else {
                joinPublicTeam(team, userId);
            }
        } else {
            displaySuccessMessage("Maximum number of players reached.");
        }
    });
}


function joinPublicTeam(team, userId) {
    fetch(`/api/teams/add/${team.id}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: userId
        })
    })
        .then(response => {
            if (!response.ok) {
                const statusError = response.statusText
                throw new Error(`Error al unirse a equipo: ${statusError}`);
            }
            return response.json();
        })
        .then(data => {
            displaySuccessMessage("Te has unido al equipo exitosamente!");
        })
        .catch(error => {
            displayErrorMessage(error.message);
        });
}


function sendTeamRequest(team, userId) {
    fetchPlayerDetails(userId)
        .then(playerDetails => {
            const playerName = playerDetails.name;
            const teamCaptain = team.captainId;
            const teamId = team.id;

            fetch(`/api/requests/team/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requestFrom: userId,
                    requestTo: teamCaptain,
                    teamId: teamId,
                    accepted: false,
                    denied: false,
                    sent: true,
                    name: playerName
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to send team request: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(teamRequest => {
                    createRequestNotification(teamRequest);
                })
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error fetching player details:', error));
}


function createRequestNotification(teamRequest) {
    const requestTeamId = teamRequest.teamId;
    const requestFromId = teamRequest.requestFrom;

    Promise.all([fetchTeamDetails(requestTeamId), fetchPlayerDetails(requestFromId)])
        .then(([team, player]) => {
            const playerName = player.name;
            const teamName = team.name;
            const message = `${playerName} ha solicitado unirse al siguiente equipo: ${teamName}.`;

            const notificationTo = teamRequest.requestTo;

            return fetch(`/api/notifications/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    toId: notificationTo,
                    message: message,
                })

            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to create notification: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(notification => {
            displaySuccessMessage('Request sent successfully.');
        })
        .catch(error => console.error('Error:', error));
}

function displayModal(modal, closeButton) {
    modal.style.display = "block";

    closeButton.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function fetchPlayerDetails(playerId) {
    return fetch(`/api/user/players/${playerId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch player details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
}






document.addEventListener("DOMContentLoaded", loadTeams);
