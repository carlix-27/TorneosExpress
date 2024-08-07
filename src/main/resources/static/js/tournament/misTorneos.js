function cargarTorneos() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    fetch(`/api/tournaments/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournaments: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            const listaTorneosCreados = document.getElementById("torneos-creados-list");
            const listaTorneosParticipados = document.getElementById("torneos-participados-list");
            listaTorneosCreados.innerHTML = "";
            listaTorneosParticipados.innerHTML = "";

            tournaments.forEach(tournament => {
                const li = document.createElement("li");
                const {
                    name: tournamentName,
                    sport: tournamentSport,
                    location: tournamentLocation,
                    private: privateTournament,
                    id: tournamentId,
                    participatingTeams,
                    creatorId
                } = tournament;

                const isCreator = userId == creatorId;

                const numOfParticipatingTeams = participatingTeams.length;
                const maxTeams = tournament.maxTeams;
                const sportName = tournamentSport.sportName;

                if (privateTournament && isCreator) {
                    fetch(`/api/requests/tournament/${userId}/${tournamentId}`)
                        .then(response => response.json())
                        .then(requests => {
                            const numOfRequests = requests.length;
                            li.innerHTML = `
                            <div>
                                <a href="loadTournament.html?id=${tournament.id}"><h3>${tournamentName}</h3></a> 
                                <p>Deporte: ${sportName}</p>
                                <p>Ubicación: ${tournamentLocation}</p>
                                <p>Privacidad: ${privateTournament ? "Privado" : "Público"}</p>
                                <p>Dificultad: ${tournament.difficulty}</p>
                                <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
                                ${isCreator ? `<a class="action-link" onclick="editarTorneo(${tournamentId})">Editar</a>
                                <a class="action-link" onclick="borrarTorneo(${tournamentId})">Borrar</a>` : ''}
                                ${privateTournament && isCreator ? `<a class="action-link" onclick="manejarSolicitudes(${tournamentId})">Manejar Solicitudes${numOfRequests > 0 ? ` <span class="request-count">(${numOfRequests})</span>` : ''}</a>` : ''}
                            </div>
                            `;
                            if (isCreator) {
                                listaTorneosCreados.appendChild(li);
                            } else {
                                listaTorneosParticipados.appendChild(li);
                            }
                        })
                        .catch(error => console.error('Error fetching tournament requests:', error));
                } else {
                    li.innerHTML = `
                    <div>
                        <a href="loadTournament.html?id=${tournament.id}"><h3>${tournamentName}</h3></a> 
                        <p>Deporte: ${sportName}</p>
                        <p>Ubicación: ${tournamentLocation}</p>
                        <p>Privacidad: ${privateTournament ? "Privado" : "Público"}</p>
                        <p>Dificultad: ${tournament.difficulty}</p>
                        <p>Equipos Participantes: ${numOfParticipatingTeams} / ${maxTeams}</p>
                        ${isCreator ? `<a class="action-link" onclick="editarTorneo(${tournamentId})">Editar</a>
                        <a class="action-link" onclick="borrarTorneo(${tournamentId})">Borrar</a>` : ''}
                    </div>
                    `;
                    if (isCreator) {
                        listaTorneosCreados.appendChild(li);
                    } else {
                        listaTorneosParticipados.appendChild(li);
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function editarTorneo(torneoId) {
    window.location.href = `edit-tournament.html?id=${torneoId}`;
}

function manejarSolicitudes(torneoId) {
    window.location.href = `manejarSolicitudesTorneo.html?id=${torneoId}`;
}

function borrarTorneo(torneoId) {
    const confirmarBorrar = confirm("¿Estás seguro de que deseas borrar este torneo?");
    if (confirmarBorrar) {
        fetch(`/api/tournaments/${torneoId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete tournament: ${response.status} ${response.statusText}`);
                }
                cargarTorneos();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

document.addEventListener("DOMContentLoaded", cargarTorneos);