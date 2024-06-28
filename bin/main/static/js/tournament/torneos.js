function fetchActiveTournaments() {
    fetch('/api/tournaments/active')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            const tournamentList = document.getElementById('tournament-list');

            // Clear existing list
            tournamentList.innerHTML = '';

            tournaments.forEach(tournament => {
                const tournamentName = tournament.name;
                const tournamentSport = tournament.sport;
                const tournamentSportName = tournamentSport.sportName;
                const tournamentLocation = tournament.location;
                const tournamentPrivacy = tournament.private;
                const maxTeams = tournament.maxTeams;
                const participatingTeams = tournament.participatingTeams;
                const numOfParticipatingTeams = participatingTeams.length;

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <a href="loadTournament.html?id=${tournament.id}"><h3>${tournament.name}</h3></a> 
                    <p>Deporte: ${tournamentSportName}</p>
                    <p>Ubicación: ${tournamentLocation}</p>
                    <p>Privacidad: ${tournamentPrivacy ? "Privado" : "Público"}</p>
                    <p>Dificultad: ${tournament.difficulty}</p>
                    <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
                    <button class="signup-button" data-tournament-id="${tournament.id}">Inscribirse</button>
                `;
                tournamentList.appendChild(listItem);
            });


            document.querySelectorAll('.signup-button').forEach(button => {
                button.addEventListener('click', function () {
                    showSignupModal(this.getAttribute('data-tournament-id'));
                });
            });

        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'Error al obtener los torneos activos.';
            document.getElementById('error-message').style.display = 'block';
        });
}

function showSignupModal(tournamentId) {
    const modal = document.getElementById("signupModal");
    const closeButton = modal.querySelector(".close");
    const signupButton = modal.querySelector("#sendInviteButton");
    const userId = localStorage.getItem("userId");

    fetchTournamentDetails(tournamentId)
        .then(tournament => {
            displayTournamentDetails(tournament, signupButton);


            fetchUserTeams(userId)
                .then(teams => {
                    populateTeamSelect(teams);
                    addSignupButtonListener(tournament, userId, signupButton);
                })
                .catch(error => {
                    console.error('Error fetching user teams:', error);
                });
        })
        .catch(error => {
            console.error("Error fetching tournament details:", error);
        });

    displayModal(modal, closeButton);
}


function populateTeamSelect(teams) {
    const teamSelect = document.getElementById('teamSelect');

    teamSelect.innerHTML = '';

    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });
}




function addSignupButtonListener(tournament, userId, signupButton) {
    signupButton.addEventListener("click", function() {
        const participatingTeams = tournament.participatingTeams;
        const maxTeams = tournament.maxTeams;
        const numOfParticipatingTeams = participatingTeams.length;
        const tournamentCreator = tournament.creatorId
        const teamId = document.getElementById("teamSelect").value;
        const user = localStorage.getItem("userId");

        if (user === tournamentCreator.toString()){
            displayErrorMessage("No te podes anotar a tu propio torneo.")
        }

        if (numOfParticipatingTeams < maxTeams) {

            const tournamentIsPrivate = tournament.private;

            if (tournamentIsPrivate) {
                sendTournamentRequest(tournament, teamId, userId);
            } else {
                joinPublicTournament(tournament, teamId);
            }
        } else {
            displayErrorMessage("Error al inscribirse: Numero maximo de equipos.");
        }
    });
}

function joinPublicTournament(tournament, teamId) {
    const tournamentId = tournament.id;
    const team = teamId
    fetch(`/api/tournaments/add/${tournamentId}/${team}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to join tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Successfully joined tournament:", data);
            displaySuccessMessage("Exito al anotarse a torneo!")
        })
        .catch(error => {
            console.error('Error joining tournament:', error);
            displayErrorMessage("Error al unirse a torneo")
        });
}



function fetchUserTeams(userId) {
    return fetch(`/api/teams/captain/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch user teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
}

function fetchTournamentDetails(tournamentId) {
    return fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
}


function displayTournamentDetails(tournament, signupButton) {
    const tournamentDetails = document.getElementById("tournamentDetails");

    const tournamentName = tournament.name;
    const tournamentSport = tournament.sport;
    const tournamentSportName = tournamentSport.sportName;
    const tournamentLocation = tournament.location;
    const privateTournament = tournament.private;
    const maxTeams = tournament.maxTeams;
    const participatingTeams = tournament.participatingTeams;
    const numOfParticipatingTeams = participatingTeams.length;


    tournamentDetails.innerHTML = `
        <h3>${tournamentName}</h3>
        <p>Deporte: ${tournamentSportName}</p>
        <p>Ubicación: ${tournamentLocation}</p>
        <p>Privacidad: ${privateTournament ? "Privado" : "Público"}</p>
        <p>Dificultad: ${tournament.difficulty}</p>
        <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
    `;

    if (privateTournament) {
        signupButton.textContent = "Send Request";
        signupButton.setAttribute("data-privacy", "private");
    } else {
        signupButton.textContent = "Sign Up";
        signupButton.setAttribute("data-privacy", "public");
    }
}



function sendTournamentRequest(tournament, teamId, userId) {
    fetchTeamDetails(teamId)
        .then(teamDetails => {

            const teamName = teamDetails.name;
            const tournamentId = tournament.id
            const tournamentCreator = tournament.creatorId
            const userFrom = userId

            fetchPlayerDetails(userFrom)
                .then(playerDetails => {


                    const senderName = playerDetails.name;

                    return fetch(`/api/requests/tournament/send`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            requestFrom: userFrom,
                            requestTo: tournamentCreator,
                            teamId: teamId,
                            tournamentId: tournamentId,
                            teamName: teamName,
                            accepted: false,
                            denied: false,
                            sent: true,
                            name: senderName
                        })
                    });
                })
                .then(response => {
                    if (!response.ok) {
                        displayErrorMessage("Error al inscribirse al torneo.")
                    }
                    return response.json();
                })
                .then(tournamentRequest => {
                    displaySuccessMessage("Exito al anotarse a torneo!")
                    createRequestNotification(tournamentRequest);
                })
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error fetching team details:', error));
}




function createRequestNotification(tournamentRequest) {
    const requestTournamentId = tournamentRequest.tournamentId;
    const requestTeamId = tournamentRequest.teamId;

    Promise.all([fetchTournamentDetails(requestTournamentId), fetchTeamDetails(requestTeamId)])
        .then(([tournament, team]) => {
            const tournamentName = tournament.name;
            const teamName = team.name;
            const message = `${teamName} ha solicitado unirse al siguiente torneo: ${tournamentName}.`;

            const notificationTo = tournamentRequest.requestTo;

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
            displaySuccessMessage('Solicitud mandada con exito.');
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



function fetchTeamDetails(teamId) {
    return fetch(`/api/teams/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch player details: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
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


document.addEventListener("DOMContentLoaded", function() {
    fetchActiveTournaments(); // Llamar a la función para cargar los torneos activos
});
