let autocomplete;

function initAutocomplete(apiKey) {
    const input = document.getElementById('location');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initializeAutocomplete`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

function initializeAutocomplete() {
    const input = document.getElementById('location');
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
        const place = autocomplete.getPlace();
        if (place.geometry) {
            const location = place.geometry.location;
            document.getElementById('location').dataset.latitude = location.lat();
            document.getElementById('location').dataset.longitude = location.lng();
        } else {
            console.error('No details available for input: ' + place.name);
        }
    });
}

function fetchSports() {
    fetch('/api/sports')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch sports: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(sports => {
            const sportDropdown = document.getElementById('sport');
            sports.forEach(sport => {
                const option = document.createElement('option');
                option.value = sport.sportId;
                option.text = sport.sportName;
                sportDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function createTournament() {
    const name = document.getElementById('tournament-name').value;
    const sportId = document.getElementById('sport').value;

    const latitude = document.getElementById('location').dataset.latitude;
    const longitude = document.getElementById('location').dataset.longitude;

    if (!latitude || !longitude) {
        displayErrorMessage("Debe seleccionar una ubicación válida.");
        return;
    }

    const location = `${latitude},${longitude}`;

    const date = document.getElementById('start-date').value;
    const isPrivate = document.getElementById('privacy').checked;
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    const maxTeams = document.getElementById('maxTeams').value;
    const userId = localStorage.getItem("userId");

    if (!name.trim()) {
        displayErrorMessage("Tournament name cannot be blank.")
        return
    }

    // TODO: Necesito poder crear torneos, con fechas de hace bastante, para poder tener el torneo completo, sin la necesidad de esperar a otros dias para llenar los datos.
    // Ahorro el chequeo del calendar. Sirve para demo, es decir, torneos ya creados, y para testear los otros tipos de torneos.

    // const today = new Date();
    const selectedDate = new Date(date);

    // today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // if (selectedDate < today) {
        // displayErrorMessage("La fecha del torneo no puede ser anterior a la fecha actual.");
        // return;
    // }

    if (maxTeams < 0) {
        displayErrorMessage("No se puede ingresar números negativos")
        return;
    }

    const tournamentData = {
        name: name,
        sport: { sportId: sportId },
        location: location,
        date: date,
        isPrivate: isPrivate,
        difficulty: difficulty,
        creatorId: userId,
        maxTeams: maxTeams,
        isActive: true,
        type: type
    };

    console.log(tournamentData)

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/tournaments/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const createdTournament = JSON.parse(xhr.responseText);
            displaySuccessMessage("Torneo creado con exito!")
        } else if (xhr.status === 500) {
            displayErrorMessage("El nombre del torneo debe ser único, por favor elegir un nuevo nombre.")
        } else {
            console.error("Error:", xhr.status, xhr.responseText);
        }
    };
    xhr.send(JSON.stringify(tournamentData));

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
    fetch('/api/googleMapsApiKey')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch API key: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(apiKey => {
            initAutocomplete(apiKey);
        })
        .catch(error => {
            console.error('Error fetching API key:', error);
        });
});
