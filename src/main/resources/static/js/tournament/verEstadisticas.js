document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    fetchMatches(tournamentId)
        .then(matches => {
            populateMatches(matches);
            checkTournamentOwner(tournamentId);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

function fetchMatches(tournamentId) {
    return fetch(`/api/tournaments/${tournamentId}/matches`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        });
}

function populateMatches(matches) {
    const listaPartidosTerminados = document.getElementById('listaPartidosTerminados');
    const listaPartidosPendientes = document.getElementById('listaPartidosPendientes');

    console.log("Matches: ", matches);

    matches.forEach(match => {
        if (match.played) {
            console.log("Match", match)
            const listItem = document.createElement('li');

            // Nombre del equipo 1 y su puntaje
            const team1Text = `<span class="team-name">${match.team1.name}</span> ${match.firstTeamScore}`;
            console.log("Team 1 Text: ", team1Text);

            // Nombre del equipo 2 y su puntaje
            const team2Text = `${match.secondTeamScore} <span class="team-name">${match.team2.name}</span>`;
            console.log("Team 2 Text: ", team2Text);

            listItem.innerHTML = `${team1Text} - ${team2Text}`;
            console.log("List Item: ", listItem);
            listaPartidosTerminados.appendChild(listItem);
        } else {
            const listItem = document.createElement('li');
            listItem.textContent = `${match.team1.name} vs ${match.team2.name}`;
            console.log("List Item: (verEstadisticas_js)", listItem);
            console.log("Lista Partidos Pendientes: ", listaPartidosPendientes);
            console.log("Lista Partidos terminados: ", listaPartidosTerminados);
            listaPartidosPendientes.appendChild(listItem);
        }
    });
}

function checkTournamentOwner(tournamentId) {
    const userId = getUserId();

    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(tournament => {
            if (userId == tournament.creatorId) {
                const addButton = document.createElement('button');
                addButton.textContent = 'Agregar Estadísticas';
                addButton.addEventListener('click', () => {
                    window.location.href = 'agregarEstadisticas.html?id=' + tournamentId;
                });

                const header = document.querySelector('header');
                header.appendChild(addButton);
            }
        })
        .catch(error => {
            console.error('Error fetching tournament details:', error);
        });
}

function getUserId() {
    return localStorage.getItem("userId");
}
