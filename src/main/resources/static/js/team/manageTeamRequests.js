function loadTeamRequests(teamId) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        console.error("User ID not found in localStorage");
        return;
    }

    // Solo fetch teamReque
    fetchTeamRequests(userId, teamId)
}

function fetchTeamRequests(userId, teamId){
    return fetch(`/api/requests/team/${userId}/${teamId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch team requests: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(requests => {
            const requestsContainer = document.getElementById("team-requests");
            requestsContainer.innerHTML = '';

            requests.forEach(request => {
                const requestElement = document.createElement('div');
                const playerRequesting = request.name;

                requestElement.className = 'request';
                requestElement.innerHTML = `
                            <p>From: ${playerRequesting}</p>
                            <div class="button-container">
                                <button class="manage-button accept-button" data-request-id="${request.id}">Accept</button>
                                <button class="manage-button deny-button" data-request-id="${request.id}">Deny</button>
                            </div>
                        `;
                requestsContainer.appendChild(requestElement);
            });

            document.querySelectorAll('.accept-button').forEach(button => {
                button.addEventListener('click', handleAccept);
            });

            document.querySelectorAll('.deny-button').forEach(button => {
                button.addEventListener('click', handleDeny);
            });
        });
}


function handleAccept(event) {
    const requestId = event.target.getAttribute('data-request-id');
    updateRequestStatus(requestId, true);
}

function handleDeny(event) {
    const requestId = event.target.getAttribute('data-request-id');
    updateRequestStatus(requestId, false);
}

function updateRequestStatus(requestId, accepted) {
    const acceptUrl = `/api/requests/team/${requestId}/accept`;
    const denyUrl = `/api/requests/team/${requestId}/deny`;

    const url = accepted ? acceptUrl : denyUrl;

    fetch(url, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update request: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(() => {
            loadTeamRequests();
        })
        .catch(error => console.error('Error:', error));
}


function getTeamIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

document.addEventListener("DOMContentLoaded", function() {
    const teamId = getTeamIdFromUrl();
    if (teamId) {
        loadTeamRequests(teamId);
    } else {
        console.error('Team ID not found in URL');
    }
});
