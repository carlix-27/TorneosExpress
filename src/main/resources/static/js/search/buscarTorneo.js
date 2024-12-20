let userLat, userLng, map, userMarker;

document.addEventListener("DOMContentLoaded", () => {
    fetchAndLoadGoogleMapsAPI()
        .then(() => {
            initializeAutocomplete('location');
        })
        .catch(error => {
            console.error("Error loading Google Maps API:", error);
            showErrorToast("Error loading location services.", "error");
        });

    const userId = localStorage.getItem("userId");
    if (userId) {
        fetchUserInfo(userId);
    } else {
        console.error("User ID not found in localStorage.");
    }
});

function fetchUserInfo(userId) {
    fetch(`/api/user/players/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(player => {
            // Assuming the player's location is a string "lat,long"
            const location = player.location; // Example: "40.730610,-73.935242"
            const [lat, lng] = location.split(',').map(Number);

            if (!isNaN(lat) && !isNaN(lng)) {
                userLat = lat;
                userLng = lng;
                fetchActiveTournaments();
                initializeMap();
            } else {
                console.error("Invalid location format for user.");
            }
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
            showErrorToast('Unable to retrieve user information.', 'error');
        });
}

function fetchActiveTournaments() {
    fetch('/api/tournaments/active')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch active tournaments: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(tournaments => {
            renderTournaments(tournaments);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function renderTournaments(tournaments) {
    const tournamentList = document.getElementById("tournament-list");
    tournamentList.innerHTML = "";

    tournaments.forEach(function (tournament) {
        const [tournamentLat, tournamentLng] = tournament.location.split(',').map(Number);

        if (isNaN(tournamentLat) || isNaN(tournamentLng)) {
            console.error('Invalid tournament location:', tournament.location);
            return;
        }

        // Get the readable address for the tournament
        reverseGeocode(tournamentLat, tournamentLng)
            .then(address => {
                // Render all tournaments
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <a href="loadTournament.html?id=${tournament.id}">
                        <h3>${tournament.name}</h3>
                    </a>
                    <p>Ubicación: ${address}</p>
                    <p>Deporte: ${tournament.sport.sportName}</p>
                `;
                tournamentList.appendChild(listItem);

                // Only render nearby tournaments (within 50 km)
                const distance = getDistanceFromLatLonInKm(userLat, userLng, tournamentLat, tournamentLng);
                if (distance <= 50) {
                    addMarker(tournament, tournamentLat, tournamentLng, address, distance);
                }
            })
            .catch(error => {
                console.error('Error reverse geocoding tournament location:', error);
                // If reverse geocoding fails, use the raw coordinates
                const listItem = document.createElement("li");
                listItem.innerHTML = `
                    <a href="loadTournament.html?id=${tournament.id}">
                        <h3>${tournament.name}</h3>
                    </a>
                    <p>Ubicación: ${tournament.location}</p>
                    <p>Deporte: ${tournament.sport.sportName}</p>
                `;
                tournamentList.appendChild(listItem);
            });
    });
}

function initializeMap() {
    const mapOptions = {
        center: { lat: userLat, lng: userLng },
        zoom: 12,
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // Marker for user's location
    userMarker = new google.maps.Marker({
        position: { lat: userLat, lng: userLng },
        map: map,
        title: "Your Location",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "blue",
            fillOpacity: 1,
            strokeWeight: 2
        }
    });
}

function addMarker(tournament, lat, lng, address, distance) {
    const marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: `${tournament.name} - ${address}`,
    });

    const infowindow = new google.maps.InfoWindow({
        content: `
            <h4>${tournament.name}</h4>
            <p>Ubicación: ${address}</p>
            <p>Distancia: ${distance.toFixed(2)} km</p>
        `
    });

    marker.addListener("click", function() {
        infowindow.open(map, marker);
    });
}

// Helper function to calculate the distance between two locations in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1Rad = degToRad(lat1);
    const lon1Rad = degToRad(lon1);
    const lat2Rad = degToRad(lat2);
    const lon2Rad = degToRad(lon2);

    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}

// Helper function to convert degrees to radians
function degToRad(deg) {
    return deg * (Math.PI / 180);
}
