import configDetails from "../../ConfigureDetails/redirectConfig";

async function getOrderCartItems(cartItemIds, authIdToken){
    try{
        const cartItemsIdsString = cartItemIds.join(','); 
        const api = `${configDetails.baseUrl}/getordercartitems?cartItemsIds=${cartItemsIdsString}`;
        const response = await fetch(api, {
            method: 'GET',
            headers: {
            "Content-Type": "application/json",
            'Authorization':authIdToken
            }
        });
        if(response.ok){
            const cartItems = await response.json();
            return cartItems;
        } else {
            throw new Error('Failed to fetch cart items');
        }
    }
    catch(error){
        console.error('Error fetching cart items:', error);
        throw error; 
    }
}

export default getOrderCartItems;
