import configDetails from "../../ConfigureDetails/redirectConfig";

async function getAllUserOrders(userEmail, authIdToken){
    try{
        const api = `${configDetails.baseUrl}${configDetails.getUserOrder}?userEmail=${userEmail}`;
        const response = await fetch(api, {
            method: 'GET',
            headers: {
            "Content-Type": "application/json",
            'Authorization':authIdToken
            }
        });
        if(response.ok){
            const orders = await response.json();
            return orders;
        } else {
            throw new Error('Failed to fetch user orders');
        }
    }
    catch(error){
        console.error('Error fetching user orders:', error);
        throw error; 
    }
}

export default getAllUserOrders;
