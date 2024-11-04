// Script that interacts with index.html
async function fetchAndReturn() {
    // Fetch data from input field
    const input = document.getElementById("serial").elements[0].value;

    // Send POST request to endpoint /api/fetch-logon
    try {
        const response = await fetch('/api/fetch-logon', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serial: input }),
        });

        // Wait for a response and save it to result
        const result = await response.json();

        // If response (200)
        if (response.ok) {

            // Display data on the webpage
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = "";

            const userList = document.createElement("ul");

            let j = 0;
            for (let i = 0; i < result.results.length; i++) {
                console.log(result.results[j].userName);
                const userItem = document.createElement("li");
                userItem.textContent = "User: " + result.results[j].userName + " Login date: " + result.results[j].lastLogOnDateTime;
                userList.appendChild(userItem);
                j++;
            }

            resultDiv.appendChild(userList);
            
        } else {
            console.error(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function checkEnter(event){
    if (event.key == "Enter"){
        window.alert("You pressed", event.key);
        fetchAndReturn();
    }
}