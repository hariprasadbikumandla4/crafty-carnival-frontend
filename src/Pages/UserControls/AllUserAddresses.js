import configDetails from "../../ConfigureDetails/redirectConfig";

async function getAllUserAddresses(userEmail, authIdToken) {
    try {
        const api = `${configDetails.baseUrl}${configDetails.allAddresses}`;
        const response = await fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authIdToken
            }
        });
        if (response.ok) {
            const addresses = await response.json();
            // Filter addresses to include only those that match the userEmail
            const userAddresses = addresses.filter(address => address.email === userEmail);
            return userAddresses;
        } else {
            throw new Error("Failed to fetch addresses");
        }
    } catch (error) {
        throw new Error("Failed to fetch addresses: " + error.message);
    }
}

export default getAllUserAddresses;
