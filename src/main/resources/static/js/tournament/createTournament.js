function fetchSports() {
    fetch('/api/sports') // Assuming this endpoint returns the list of sports
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
                option.value = sport.sportId; // Assuming sportId is the ID field in your Sport entity
                option.text = sport.sportName; // Assuming sportName is the name field in your Sport entity
                sportDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle error, show message to user or retry fetch
        });
}


function createTournament() {
    const name = document.getElementById('tournament-name').value;
    const sportId = document.getElementById('sport').value; // Get the selected sportId
    const location = document.getElementById('location').value;
    const date = document.getElementById('start-date').value;
    const isPrivate = document.getElementById('privacy').checked;
    const difficulty = document.getElementById('difficulty').value;
    const maxTeams = document.getElementById('maxTeams').value;

    const userId = localStorage.getItem("userId");

    // Check if tournament name is blank
    if (!name.trim()) {
        document.getElementById('error-message').innerText = "El nombre del torneo no puede ser vacio";
        document.getElementById('error-message').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';
        return;
    }

    // Check if user is premium
    checkPremiumStatus(userId, function(isPremium) {
        if (isPremium) {
            const tournamentData = {
                name: name,
                sport: { sportId: sportId }, // Set the sportId in a nested object
                location: location,
                date: date,
                isPrivate: isPrivate,
                difficulty: difficulty,
                creatorId: userId,
                maxTeams: maxTeams,
                isActive: true
            };

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/tournaments/create', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const createdTournament = JSON.parse(xhr.responseText);
                    console.log('Tournament created:', createdTournament);

                    // Display success message in green
                    document.getElementById('success-message').innerText = "Torneo creado con éxito!";
                    document.getElementById('success-message').style.color = 'green';
                    document.getElementById('success-message').style.display = 'block';
                    document.getElementById('error-message').style.display = 'none';
                    document.getElementById('create-tournament-form').reset();
                } else if (xhr.status === 409) {
                    // Conflict - Tournament name must be unique
                    document.getElementById('error-message').innerText = "El nombre del torneo debe ser único, por favor ingresar un nuevo nombre. ";
                    document.getElementById('error-message').style.color = 'red';
                    document.getElementById('error-message').style.display = 'block';
                    document.getElementById('success-message').style.display = 'none';
                } else {
                    console.error("Error:", xhr.status, xhr.responseText);
                }
            };
            xhr.send(JSON.stringify(tournamentData));
        } else {
            window.location.href = "buy_premium.html"; // Redirect to buy premium page
        }
    });
}


function checkPremiumStatus(userId, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/user/' + userId + '/premium', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            const isPremium = response.isPremium;
            callback(isPremium);
        } else {
            console.error(xhr.responseText);
            callback(false); // Default to not premium if there's an error
        }
    };
    xhr.send();
}
