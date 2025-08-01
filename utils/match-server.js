async function requestMatch(players) {
    // Send a request to the server to find a match for the given players
    const response = await fetch(`https://sj279ray64.execute-api.us-east-1.amazonaws.com/dev/match/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ players })
    });   
    return await response.text();
}

export { requestMatch };