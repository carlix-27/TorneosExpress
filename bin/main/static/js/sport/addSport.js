import {displaySuccessMessage} from "../display/displaySuccessMessage.js";
import {displayErrorMessage} from "../display/displayErrorMessage.js";

export function addSport() {
    const sportName = document.getElementById('sport-name').value;
    const num_players = document.getElementById('num_players').value;
    const userId = localStorage.getItem("userId");


    if (!sportName.trim()) {
        displayErrorMessage("Nombre del deporte no puede estar vació.")
        return;
    }

    if (!num_players.trim()) {
        displayErrorMessage("Por favor especificar numero de jugadores")
        return;
    }

    checkPremiumStatus(userId, function (isPremium){
        if (isPremium) {
            const createSportRequest = {
                name: sportName,
                num_players: num_players,
            };

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/sports/create', true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onload = function () {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    console.log('Deporte creado: ', response);

                    displaySuccessMessage("Deporte creado con éxito")
                    document.getElementById('add-sport-form').reset();
                } else if (xhr.status === 500) {
                    displayErrorMessage("Nombre del deporte debe ser único")
                } else {
                    console.error("Error:", xhr.status, xhr.responseText);
                }
            };

            xhr.send(JSON.stringify(createSportRequest));
        } else {
            window.location.href = "buy_premium.html";
        }
    });
}

function checkPremiumStatus(userId, callback){
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
            callback(false);
        }
    };
    xhr.send();
}
