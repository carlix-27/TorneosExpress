// Función para cargar los torneos del usuario
function cargarTorneos() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        // Handle error, redirect to log in or show message
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
            const listaTorneos = document.getElementById("lista-torneos");
            listaTorneos.innerHTML = ""; // Limpiar la lista antes de agregar torneos nuevos

            tournaments.forEach(tournament => {
                const li = document.createElement("li");
                li.innerHTML = `
        <div>
            <h3>${tournament.name}</h3>
            <p>Deporte: ${tournament.sport.sportName}</p>
            <p>Ubicación: ${tournament.location}</p>
            <p>Privacidad: ${tournament.isPrivate ? "Privado" : "Público"}</p>
            <p>Dificultad: ${tournament.difficulty}</p>
            <p>Maxima Cantidad de Equipos: ${tournament.maxTeams}</p>
            <p>Equipos Participantes: ${tournament.participatingTeamsShortData.length}</p>
            <p>Solicitudes de Participación: ${tournament.participationRequestsShortData.length}</p>
            <button onclick="editarTorneo(${tournament.id})">Editar</button>
            <button onclick="borrarTorneo(${tournament.id})">Borrar</button>
        </div>
    `;
                listaTorneos.appendChild(li);
            });

        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user
        });
}

// Función para editar un torneo
function editarTorneo(torneoId) {
    // Implementar la lógica para redireccionar a la página de edición del torneo
    window.location.href = `edit-tournament.html?id=${torneoId}`;
}

// Función para borrar un torneo
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
                // Recargar la lista de torneos después de borrar
                cargarTorneos();
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle error, show message to user
            });
    }
}

// Al cargar la página, cargar los torneos del usuario
document.addEventListener("DOMContentLoaded", cargarTorneos);
