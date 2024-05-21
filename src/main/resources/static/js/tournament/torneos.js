// Función para obtener y mostrar todos los torneos activos
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

            // Limpiar lista existente
            tournamentList.innerHTML = '';

            tournaments.forEach(tournament => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h3>${tournament.name}</h3>
                    <p>Deporte: ${tournament.sport.sportName}</p>
                    <p>${tournament.private ? 'Privado' : 'Público'}</p>
                `;

                // Creación del botón de inscripción
                const enrollButton = document.createElement('button');
                enrollButton.textContent = 'Inscribirse';
                enrollButton.addEventListener('click', () => {
                    openModal(tournament.id, tournament.private);
                });

                // Botón a la lista
                listItem.appendChild(enrollButton);

                tournamentList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = 'Error al obtener los torneos activos.';
            document.getElementById('error-message').style.display = 'block';
        });
}

// Función para abrir el modal de selección de equipo

let currentTournamentId;
let currentTournamentPrivate;

function openModal(tournamentId, isPrivate) {
    currentTournamentId = tournamentId;
    currentTournamentPrivate = isPrivate;

    // Obtener y llenar la lista de equipos del usuario
    fetch('/api/teams/all')
        .then(response => response.json())
        .then(teams => {
            const teamSelect = document.getElementById('team-select');
            teamSelect.innerHTML = ''; // Limpiar opciones existentes

            teams.forEach(team => {
                const option = document.createElement('option');
                option.value = team.id;
                option.textContent = team.name;
                teamSelect.appendChild(option);
            });

            // Mostrar el modal
            const modal = document.getElementById('teamModal');
            modal.style.display = 'block';
        })
        .catch(error => {
            console.error('Error al obtener equipos:', error);
        });
}

function closeModal() {
    const modal = document.getElementById('teamModal');
    modal.style.display = 'none';
}

function confirmEnrollment() {
    const teamSelect = document.getElementById('team-select');
    const teamId = teamSelect.value;

    if (!teamId) {
        alert("Por favor selecciona un equipo.");
        return;
    }

    localStorage.setItem('teamId', teamId);

    enrollInTournament(currentTournamentId, currentTournamentPrivate);

    closeModal();
}

// Función para inscribirse en un torneo

function enrollInTournament(tournamentId, isPrivate) {
    const userId = localStorage.getItem("userId");
    const teamId = localStorage.getItem("teamId");

    // Verificar si el usuario está en un equipo
    checkIfUserIsCaptain(userId, function (isCaptain){
        if(!isCaptain){
            document.getElementById('error-message').innerText = "Debes ser capitán para poder unirte a un torneo.";
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
            return;
        }

        // Si el torneo es privado, mostrar un formulario de solicitud de acceso
        if (isPrivate) {
            const confirmation = confirm("Este torneo es privado. ¿Deseas enviar una solicitud de acceso?");
            if (confirmation) {
                sendAccessRequest(tournamentId, userId, teamId);
            }
        } else {
            enrollUserInPublicTournament(tournamentId, teamId); // Si el torneo es público, el usuario puede inscribirse directamente
        }
    });
}



// Función para enviar una solicitud de acceso
function sendAccessRequest(tournamentId, userId, teamId) {
    const requestPayload = {
        userId: userId,
        teamId: teamId
    };

    fetch(`/api/tournaments/${tournamentId}/access-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
    })
        .then(response => {
            if (response.ok) {
                console.log("Solicitud enviada exitosamente.");
                document.getElementById('success-message').innerText = "Solicitud enviada exitosamente.";
                document.getElementById('success-message').style.display = 'block';
                document.getElementById('error-message').style.display = 'none';
            } else {
                throw new Error(`Error al enviar la solicitud: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').innerText = "Error al enviar la solicitud.";
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
        });
}

// Función para inscribir al usuario en un torneo público

function enrollUserInPublicTournament(tournamentId, teamId) {
    const userId = localStorage.getItem("userId");
    const data = {
        userId: userId,
        teamId: teamId
    };

    // Realizar una solicitud AJAX al backend para inscribir al usuario en el torneo público
    fetch(`/api/tournaments/${tournamentId}/enroll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to enroll user in public tournament: ${response.status} ${response.statusText}`);
            }
            document.getElementById('success-message').innerText = "Te has inscripto exitosamente en el torneo!";
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('error-message').style.display = 'none';
            fetchActiveTournaments(); // Aquí podrías realizar otras acciones, como recargar la lista de torneos activos
        })
        .catch(error => {
            console.error('Error: ', error);
            document.getElementById('error-message').innerText = "Hubo un error al inscribirse en el torneo. Por favor, intenta nuevamente más tarde.";
            document.getElementById('error-message').style.display = 'block';
            document.getElementById('success-message').style.display = 'none';
        });
}

// Chequea si el usuario está en un equipo

function checkIfUserIsCaptain(userId, callback) {
    fetch(`/api/user/${userId}/team-owner`)
        .then(response => response.json())
        .then(data => {
            callback(data.isCaptain);
        })
        .catch(error => {
            console.error('Error al verificar el rol de capitán:', error);
            callback(false); // Default to not in team if there's an error
        });
}

// Punto de entrada cuando se carga la página

document.addEventListener("DOMContentLoaded", function() {
    fetchActiveTournaments();
});
