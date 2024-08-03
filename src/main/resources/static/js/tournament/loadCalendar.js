// Función para cargar los torneos del usuario
// Function to load the user's tournaments
function loadCalendar() {
    const urlParams = new URLSearchParams(window.location.search);
    const tournamentId = urlParams.get('id');

    fetch(`/api/tournaments/${tournamentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournament => {
            console.log("Tournament: ", tournament);
            const calendar = document.getElementById("calendar-result"); // TODO: Para ver como armamos bien el fixture hay que mirar aca.
            const backButton = document.getElementById("back-button");

            backButton.addEventListener("click", () => {
                window.location.replace(`loadTournament.html?id=${tournament.id}`);
            });

            if (tournament.participatingTeams.length < tournament.maxTeams) {
                calendar.innerHTML = `
                <div id="result">
                    <h3>Calendario no disponible para el torneo.</h3>
                </div>`;
            } else {
                switch(tournament.type){
                    case 'ROUNDROBIN':
                        fetchRoundRobinFixture(tournamentId, tournament.matches, tournament.name, tournament.creatorId, calendar, tournament.type);
                        break;
                    case 'KNOCKOUT':
                        // TODO: Ver como podes hacer para tener en cuenta la cantidad de equipos, por tanto la estructura del fixture va a ser distinta.
                        fetchKnockoutFixture(tournament.participatingTeams, tournamentId, tournament.matches, tournament.name, tournament.creatorId, calendar, tournament.type);
                        break;
                    case 'GROUPSTAGE':
                        fetchGroupStage(tournamentId, tournament.matches, tournament.name, tournament.creatorId, calendar, tournament.type);
                        break;
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}


function fetchRoundRobinFixture(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type) {
    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(matches => {
            calendarListHTML.innerHTML = `
                <div id="result">
                    <h2>${tournamentName} - Calendario</h2>
                </div>`;

            matches.forEach(match => {
                const listItem = document.createElement('li');
                listItem.className = 'tournament-bracket__item';
                listItem.innerHTML = `
                                 <div class="tournament-bracket__match" tabindex="0">
                                        <table class="tournament-bracket__table">
                                             <caption class="tournament-bracket__caption">
                                                    <p>${match.date}</p>
                                             </caption>
                                             <thead class="sr-only">
                                                <tr>
                                                    <th>Country</th>
                                                    <th>Score</th>
                                                </tr>
                                             </thead>
                                             <tbody class="tournament-bracket__content">
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                         <span class="tournament-bracket__number">${match.firstTeamScore}</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">${match.secondTeamScore}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                 </div>                  
                `;
                calendarListHTML.appendChild(listItem);
            });
        })
        .catch(error =>{
            console.error('error fetching tournament data: ', error);
        });
}



// Posible implementacion - TODO
function fetchKnockoutFixture(participatingTeams, id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type){
    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response =>{
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })

        .then(matches => {
            console.log("Matches: ", matches);
            const results = document.createElement('div');
            results.id = 'result';
            results.innerHTML = `
                <h2>${tournamentName} - Calendario</h2>
                <h3 class="tournament-bracket__round-title">Octavos de Final</h3>
            `;

            const listaPartidosDeOctavosPendientes = document.getElementById('listaPartidosPendientes'); // TODO -> Como puedo hacer para preservar los partidos de octavo de final aca, solamente?

            calendarListHTML.appendChild(listaPartidosDeOctavosPendientes);

            let winners = [];

            let roundCompleted = true;


            // TODO: El match esta configurado para tener 0 a 0 por defecto?
            listaPartidosDeOctavosPendientes.forEach(match => { // Fixme: Este es el causante de tener 30 partidos distintos, iguales. Por tanto la clave esta en guardar los terminados y pendientes.
                const team1Score = match.firstTeamScore !== null ? match.firstTeamScore : 0;
                const team2Score = match.secondTeamScore !== null ? match.secondTeamScore : 0;


                if(team1Score !== 0  || team2Score !== 0) { // Si son 0 quiere decir que aun no se agregaron estadisticas a ninguno de los equipos. Estan 0 a 0

                    const winner = checkWinner(team1Score, team2Score);

                    if (winner !== null) {
                        const winningTeam = winner === 1 ? match.team1 : match.team2;

                        console.log("Winning team: ", winningTeam);

                        winners.push(winningTeam);

                    }
                } else{
                    roundCompleted = false; // Aun no terminamos de hacer el agregado de estadisticas.
                }

                const listItem = document.createElement('li');
                listItem.className = 'tournament-bracket__item';
                listItem.innerHTML = `
                    <div class="tournament-bracket__match" tabindex="0">
                        <table class="tournament-bracket__table">
                            <caption class="tournament-bracket__caption">
                                <p>${match.date}</p>
                            </caption>
                            <thead class="sr-only">
                                <tr>
                                    <th>Country</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody class="tournament-bracket__content">
                                <tr class="tournament-bracket__team">
                                    <td class="tournament-bracket__country">
                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                    </td>
                                    <td class="tournament-bracket__score">
                                        <span class="tournament-bracket__number">${team1Score}</span>
                                    </td>
                                </tr>
                                <tr class="tournament-bracket__team">
                                    <td class="tournament-bracket__country">
                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                    </td>
                                    <td class="tournament-bracket__score">
                                        <span class="tournament-bracket__number">${team2Score}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                calendarListHTML.appendChild(listItem);
            });

            if(roundCompleted && winners.length !== 0){
                const nextRoundTitle = getNextRoundTitle('Octavos de Final');

                console.log("Winnners 8tavos: ", winners); // TODO: Si los winners son teams, debo volver a armar partidos con ellos.

                const listaPartidosPendientesParaCuartos = document.getElementById('listaPartidosPendientes'); // los de 8tavos fueron jugados y tienen stats, ahora pasamos a 4tos.


                if(winners.length === 8){ // Tienen que quedar 8 teams ganadores para armar cuartos de final.
                    fillNextRound(calendarListHTML, winners, nextRoundTitle);
                    fetchKnockoutFixtureForQuarterFinals(winners, id, listaPartidosPendientesParaCuartos, tournamentName, tournamentCreatorId, calendarListHTML, type); // Arma partidos con los winners.
                }
            }
        });
}

function fetchKnockoutFixtureForQuarterFinals(participatingTeams, id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type){
    console.log("ESTOY EN CUARTOS");
    console.log("Equipos que participan: ", participatingTeams);

    fetch(`/api/tournaments/${id}/${type}/calendarKnockoutOfQuarterFinals`,{
        method: 'PUT', // Especificar el método HTTP como PUT
        headers: {
            'Content-Type': 'application/json' // Indicar que el cuerpo de la solicitud es JSON
        },

    }) // Aca te trae a todos los partidos que almaceno, ese es el drama!

        .then(response =>{
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })

        .then(matches => {
            console.log("Matches de CUARTOS: ", matches); // Deberia para estar altura, tener los matches armados con los winners.

            let winners = [];

            let roundCompleted = true;

            matches.forEach(match => {
                const team1Score = match.firstTeamScore !== null ? match.firstTeamScore : 0;
                const team2Score = match.secondTeamScore !== null ? match.secondTeamScore : 0;

                console.log("Team1Score: ", team1Score);
                console.log("Team2Score: ", team2Score);

                    if(team1Score !== 0 || team2Score !== 0) { // Si alguno de los 2 es distinto de 0 quiere decir que se anotaron estadisticas.
                        const winner = checkWinner(team1Score, team2Score);

                        console.log("Winner: ", winner);

                        if (winner !== null) {
                            const winningTeam = winner === 1 ? match.team1 : match.team2;

                            console.log("Winning team: ", winningTeam);

                            winners.push(winningTeam);

                        } else {
                            roundCompleted = false;
                        }
                    }



                const listItem = document.createElement('li');
                listItem.className = 'tournament-bracket__item';
                listItem.innerHTML = `
                    <div class="tournament-bracket__match" tabindex="0">
                        <table class="tournament-bracket__table">
                            <caption class="tournament-bracket__caption">
                                <p>${match.date}</p>
                            </caption>
                            <thead class="sr-only">
                                <tr>
                                    <th>Country</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody class="tournament-bracket__content">
                                <tr class="tournament-bracket__team">
                                    <td class="tournament-bracket__country">
                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                    </td>
                                    <td class="tournament-bracket__score">
                                        <span class="tournament-bracket__number">${team1Score}</span>
                                    </td>
                                </tr>
                                <tr class="tournament-bracket__team">
                                    <td class="tournament-bracket__country">
                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                    </td>
                                    <td class="tournament-bracket__score">
                                        <span class="tournament-bracket__number">${team2Score}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                calendarListHTML.appendChild(listItem);
            });

            if(roundCompleted && winners.length !== 0){
                const nextRoundTitle = getNextRoundTitle('Cuartos de Final');

                console.log("Winnners 4tos: ", winners); // TODO: Si los winners son teams, debo volver a armar partidos con ellos.

                const listaPartidosPendientesParaSemis = document.getElementById('listaPartidosPendientes'); // los de 4tos fueron jugados y tienen stats, ahora pasamos a semis.



                if(winners.length === 4){
                    fillNextRound(calendarListHTML, winners, nextRoundTitle);
                    fetchKnockoutFixtureForSemifinals(winners, id,  listaPartidosPendientesParaSemis, tournamentName, tournamentCreatorId, calendarListHTML, type); // Arma partidos con los winners.
                }
            }
        });

}

function fetchKnockoutFixtureForSemifinals(participatingTeams, id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type){
    fetch(`/api/tournaments/${id}/${type}/calendarKnockoutOfSemifinals`)
        .then(response =>{
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })

        .then(matches => {

            let winners = [];

            let roundCompleted = true;

            matches.forEach(match => {
                const team1Score = match.firstTeamScore !== null ? match.firstTeamScore : 0;
                const team2Score = match.secondTeamScore !== null ? match.secondTeamScore : 0;

                console.log("Team1Score: ", team1Score);
                console.log("Team2Score: ", team2Score);

                if(team1Score !== 0 || team2Score !== 0) {
                    const winner = checkWinner(team1Score, team2Score);

                    console.log("Winner: ", winner);

                    if (winner !== null) {
                        const winningTeam = winner === 1 ? match.team1 : match.team2;

                        console.log("Winning team: ", winningTeam);

                        winners.push(winningTeam);
                    }
                } else {
                    roundCompleted = false;
                }

                const listItem = document.createElement('li');
                listItem.className = 'tournament-bracket__item';
                listItem.innerHTML = `
                    <div class="tournament-bracket__match" tabindex="0">
                        <table class="tournament-bracket__table">
                            <caption class="tournament-bracket__caption">
                                <p>${match.date}</p>
                            </caption>
                            <thead class="sr-only">
                                <tr>
                                    <th>Country</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody class="tournament-bracket__content">
                                <tr class="tournament-bracket__team">
                                    <td class="tournament-bracket__country">
                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                    </td>
                                    <td class="tournament-bracket__score">
                                        <span class="tournament-bracket__number">${team1Score}</span>
                                    </td>
                                </tr>
                                <tr class="tournament-bracket__team">
                                    <td class="tournament-bracket__country">
                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                    </td>
                                    <td class="tournament-bracket__score">
                                        <span class="tournament-bracket__number">${team2Score}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                calendarListHTML.appendChild(listItem);
            });

            if(roundCompleted && winners.length !== 0){
                const nextRoundTitle = getNextRoundTitle('Semifinal');

                console.log("Winnners Semi: ", winners); // TODO: Si los winners son teams, debo volver a armar partidos con ellos.

                const listaPartidosPendientesParaFinal = document.getElementById('listaPartidosPendientes'); // los de semis fueron jugadosy tienen stats, ahora pasamos a final.

                if(winners.length === 2){
                    fillNextRound(calendarListHTML, winners, nextRoundTitle);
                    fetchKnockoutFixtureForFinal(winners, id, listaPartidosPendientesParaFinal,tournamentName, tournamentCreatorId, calendarListHTML, type); // Arma partidos con los winners.
                }
            }
        });
}


function fetchKnockoutFixtureForFinal(participatingTeams, id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type){
    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response =>{
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })

        .then(matches => {
            let winners = [];

            let roundCompleted = true;

            matches.forEach(match => {
                const team1Score = match.firstTeamScore !== null ? match.firstTeamScore : 0;
                const team2Score = match.secondTeamScore !== null ? match.secondTeamScore : 0;

                console.log("Team1Score: ", team1Score);
                console.log("Team2Score: ", team2Score);

                if(team1Score !== 0 || team2Score !== 0) {
                    const winner = checkWinner(team1Score, team2Score);
                    console.log("Winner: ", winner);
                    if (winner !== null) {
                        const winningTeam = winner === 1 ? match.team1 : match.team2;
                        console.log("Winning team: ", winningTeam);
                        winners.push(winningTeam); // TODO: Este es el team que gano el torneo. Podes usarlo.
                    }
                } else{
                    roundCompleted = false;
                }

                const listItem = document.createElement('li');
                listItem.className = 'tournament-bracket__item';
                listItem.innerHTML = `
                    <div class="tournament-bracket__match" tabindex="0">
                        <table class="tournament-bracket__table">
                            <caption class="tournament-bracket__caption">
                                <p>${match.date}</p>
                            </caption>
                            <thead class="sr-only">
                                <tr>
                                    <th>Country</th>
                                    <th>Score</th>
                                </tr>
                            </thead>
                            <tbody class="tournament-bracket__content">
                                <tr class="tournament-bracket__team">
                                    <td class="tournament-bracket__country">
                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                    </td>
                                    <td class="tournament-bracket__score">
                                        <span class="tournament-bracket__number">${team1Score}</span>
                                    </td>
                                </tr>
                                <tr class="tournament-bracket__team">
                                    <td class="tournament-bracket__country">
                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                    </td>
                                    <td class="tournament-bracket__score">
                                        <span class="tournament-bracket__number">${team2Score}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                `;
                calendarListHTML.appendChild(listItem);
            });

            /*if(roundCompleted){
                // TODO: Que hacemos con el que gana?
                /*Podrian probablemente, tenerse en consideracion, los siguientes aspectos:
                * - Ver aca la logica de terminar el torneo, o informar que el team ´tanto´ gano.
                * En base a eso, como ya tenemos un winner, tenemos la posibilidad de terminar un torneo knockout, y asignarle los puntos de prestigio correspondientes.
                * TODO: Fijate como haces para tener en cuenta estas cuestiones.
                *  Tenes la lista de Winners, que ahora, va a tener a un winner solo.*/
            /*}*/
        });
}

function fillNextRound(calendarListHTML, teams, roundTitle) {
    if (teams.length <= 1) {
        return; // Final stage already reached
    }
    // Check if calendarListHTML is a valid DOM element
    if (!(calendarListHTML instanceof HTMLElement)) {
        console.error("calendarListHTML is not a valid DOM element");
        return;
    }
    const round = document.createElement('div');
    round.innerHTML = `<h3 class="tournament-bracket__round-title">${roundTitle}</h3>`;
    calendarListHTML.appendChild(round);
}

function getNextRoundTitle(currentRoundTitle) {
    switch (currentRoundTitle) {
        case 'Octavos de Final':
            return 'Cuartos de Final';
        case 'Cuartos de Final':
            return 'Semifinal';
        case 'Semifinal':
            return 'Final';
        default:
            return '';
    }
}

// TODO: Que pasa si es empate? Que informe, que pasan a penales y de ahi forma random quien gana. dudoso
function checkWinner(team1Score, team2Score) {
    if(team1Score === team2Score){
        return 0;
    } else if(team1Score > team2Score){
        return 1;
    } else{
        return 2;
    }
}




// fetchGroupStage(tournamentId, tournament.matches, tournament.name, tournament.creatorId, calendar, tournament.type);
function fetchGroupStage(id, matches, tournamentName, tournamentCreatorId, calendarListHTML, type) {
    fetch(`/api/tournaments/${id}/${type}/calendar`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch tournament: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(matches => {
            calendarListHTML.innerHTML = `
                <div id="result">
                    <h2>${tournamentName} - Calendario</h2>
                    
                </div>
            `;
            if (tournamentCreatorId !== localStorage.getItem("userId")) {

                const groupedMatches = {};
                let groupCounter = 1;

                // Crear un mapa para rastrear que equipos ya han sido emparejados
                const pairedTeams = new Set();


                // Iterar sobre los partidos y agrupar de a 2 por grupo
                matches.forEach(match => {
                    const { team1, team2 } = match;

                    // Si uno de los equipos ya ha sido emparejado, saltar este partido
                    if (pairedTeams.has(team1.name) || pairedTeams.has(team2.name)) return;

                    // Agregar los equipos al conjunto de emparejados
                    pairedTeams.add(team1.name);
                    pairedTeams.add(team2.name);

                    // Verificar si el grupo actual ya tiene 2 partidos
                    if (!groupedMatches[groupCounter]) {
                        groupedMatches[groupCounter] = { id: groupCounter, matches: [] };
                    } else if (groupedMatches[groupCounter].matches.length >= 2) {
                        groupCounter++;
                        groupedMatches[groupCounter] = { id: groupCounter, matches: [] };
                    }

                    // Agregar el partido al grupo actual
                    groupedMatches[groupCounter].matches.push(match);
                });

                // Iterar sobre cada grupo y mostrar los partidos
                Object.values(groupedMatches).forEach(group => {
                    // Crear elemento HTML para el grupo
                    const groupElement = document.createElement('div');
                    groupElement.classList.add('group'); // Estilo CSS para grupos

                    // Encabezado del grupo (número de grupo)
                    const groupHeader = document.createElement('h2');
                    groupHeader.textContent = `Grupo ${group.id}`;
                    groupElement.appendChild(groupHeader);

                    group.matches.forEach(match => {
                        const listItem = document.createElement('li');
                        listItem.className = 'tournament-bracket__item';
                        listItem.innerHTML = `
                                 <div class="tournament-bracket__match" tabindex="0">
                                        <table class="tournament-bracket__table">
                                             <caption class="tournament-bracket__caption">
                                                    <p>${match.date}</p>
                                             </caption>
                                             <thead class="sr-only">
                                                <tr>
                                                    <th>Country</th>
                                                    <th>Score</th>
                                                </tr>
                                             </thead>
                                             <tbody class="tournament-bracket__content">
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team1.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                         <span class="tournament-bracket__number">${match.firstTeamScore}</span> 
                                                    </td>
                                                </tr>
                                                
                                        
                                                <tr class="tournament-bracket__team">
                                                    <td class="tournament-bracket__country">
                                                        <abbr class="tournament-bracket__code">${match.team2.name}</abbr>
                                                    </td>
                                                    <td class="tournament-bracket__score">
                                                        <span class="tournament-bracket__number">${match.secondTeamScore}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                 </div>                         
                        `;
                        groupElement.appendChild(listItem);
                    });

                    calendarListHTML.appendChild(groupElement);
                });
            }
        })
        .catch(error => console.error(error));
}


document.addEventListener("DOMContentLoaded", loadCalendar);

function modifyDate(matchId, tournamentId) {
    window.location.replace(`modifyDate.html?match-id=${matchId}&tournament-id=${tournamentId}`);
}

