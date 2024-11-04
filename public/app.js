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
            const resultDiv = document.getElementById("result");
            resultDiv.innerHTML = "";
            if (result.results[0] === undefined) {
                const failure = document.createElement("h2");
                failure.textContent = "No device found.";
                resultDiv.appendChild(failure);
            } else {

                // Display data on the webpage
                const deviceTitle = document.createElement("h1");
                deviceTitle.textContent = result.results[0].displayName;
                const userList = document.createElement("ul");

                let j = result.results.length;
                for (let i = 0; i < result.results.length; i++) {
                    j--;
                    const userItem = document.createElement("li");
                    const options = { 
                        year: 'numeric', 
                        month: 'numeric', 
                        day: 'numeric', 
                        hour: 'numeric', 
                        minute: 'numeric', 
                        second: 'numeric' 
                    };
                    userItem.textContent = result.results[j].userName + " - " + new Date(result.results[j].lastLogOnDateTime).toLocaleDateString(undefined, options);
                    userList.appendChild(userItem);
                }

                resultDiv.appendChild(deviceTitle);
                resultDiv.appendChild(userList);
            }    
        } else {
            console.error(result.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}