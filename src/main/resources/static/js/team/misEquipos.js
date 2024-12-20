document.addEventListener("DOMContentLoaded", () => {
    loadTeams();
    fetchAndLoadGoogleMapsAPI()
        .then(() => {
        })
        .catch(error => {
            console.error('Error fetching API key:', error);
        });
});

function loadTeams() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    fetch(`/api/teams/user/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch teams: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const { teamsAsCaptain, teamsAsMember } = data;
            const listaEquiposCapitan = document.getElementById("lista-equipos-capitan");
            const listaEquiposMiembro = document.getElementById("lista-equipos-miembro");
            listaEquiposCapitan.innerHTML = "";
            listaEquiposMiembro.innerHTML = "";

            const createTeamElement = (team, isCaptain) => {
                const teamId = team.id;
                const teamPrivate = team.isPrivate;
                const teamLocation = team.location;
                const teamName = team.name;
                const teamPlayers = team.players;
                const numberOfPlayersInTeam = teamPlayers.length;
                const teamSport = team.sport;
                const sportNumOfPlayers = teamSport.num_players;
                const maxNumberOfPlayersPerTeam = sportNumOfPlayers * 2;

                const li = document.createElement("li");

                const fetchTeamRequests = () => {
                    fetch(`/api/requests/team/${userId}/${teamId}`)
                        .then(response => response.json())
                        .then(requests => {
                            const numOfRequests = requests.length;
                            li.innerHTML = `
                            <div>
                                <a href="visualizarJugadoresEquipo.html?id=${team.id}"><h3>${teamName}</h3></a>
                                <p>Ubicación: ${teamLocation}</p>
                                <p>Privacidad: ${teamPrivate ? "Privado" : "Público"}</p>
                                <p>Jugadores inscritos: ${numberOfPlayersInTeam} / ${maxNumberOfPlayersPerTeam}</p>
                                ${isCaptain ? `
                                <a class="action-link" onclick="editarEquipo(${teamId})">Editar</a>
                                <a class="action-link" onclick="borrarEquipo(${teamId})">Borrar</a>
                                ${teamPrivate ? `<a class="action-link" onclick="manejarSolicitudes(${teamId})">Manejar Solicitudes${numOfRequests > 0 ? ` <span class="request-count">(${numOfRequests})</span>` : ''}</a>` : ''}` : ''}
                                <a class="action-link" onclick="verBeneficios(${teamId})">Ver beneficios</a>
                            </div>
                            `;
                        })
                        .catch(error => console.error('Error fetching team requests:', error));
                };

                if (teamLocation) {
                    const [lat, lng] = teamLocation.split(',').map(coord => parseFloat(coord.trim()));

                    if (!isNaN(lat) && !isNaN(lng)) {
                        reverseGeocode(lat, lng)
                            .then(address => {
                                li.querySelector('p').innerHTML = `Ubicación: ${address}`;
                            })
                            .catch(error => console.error('Error reverse geocoding:', error));
                    }
                }

                if (teamPrivate && isCaptain) {
                    fetchTeamRequests();
                } else {
                    li.innerHTML = `
                    <div>
                        <a href="visualizarJugadoresEquipo.html?id=${team.id}"><h3>${teamName}</h3></a>
                        <p>Ubicación: ${teamLocation}</p>
                        <p>Privacidad: ${teamPrivate ? "Privado" : "Público"}</p>
                        <p>Jugadores inscritos: ${numberOfPlayersInTeam} / ${maxNumberOfPlayersPerTeam}</p>
                        ${isCaptain ? `
                        <a class="action-link" onclick="editarEquipo(${teamId})">Editar</a>
                        <a class="action-link" onclick="borrarEquipo(${teamId})">Borrar</a>` : ''}
                    </div>
                    `;
                }

                if (isCaptain) {
                    listaEquiposCapitan.appendChild(li);
                } else {
                    listaEquiposMiembro.appendChild(li);
                }
            };

            teamsAsCaptain.forEach(team => {
                createTeamElement(team, true);
            });

            teamsAsMember.forEach(team => {
                createTeamElement(team, false);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function reverseGeocode(lat, lng) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        const latLng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({ location: latLng }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results[0]) {
                resolve(results[0].formatted_address);
            } else {
                reject('Geocode failed: ' + status);
            }
        });
    });
}

function editarEquipo(teamId) {
    window.location.href = `editar-equipo.html?id=${teamId}`;
}

function manejarSolicitudes(teamId) {
    window.location.href = `manejarSolicitudesEquipo.html?id=${teamId}`;
}

function borrarEquipo(teamId) {
    const confirmarBorrar = confirm("¿Estás seguro de que deseas borrar este equipo?");
    if (confirmarBorrar) {
        fetch(`/api/teams/${teamId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete team: ${response.status} ${response.statusText}`);
                }
                loadTeams();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function verBeneficios(teamId){
    fetch(`/api/teams/myArticles/${teamId}`,{
        method: 'GET'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to get articles team: ${response.status} ${response.statusText}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
