//AWS END Point APIs

const configDetails={
    baseUrl:"https://1her1p6suc.execute-api.us-east-2.amazonaws.com/dev",
    //baseUrl:"http://localhost:8081",
    allCategories:"/allcategories",
    addCategory:"/addcategory",
    updateCategory:"/updatecategory",
    deleteCategory:"/deletecategory",
    allSubCategories:"/allsubcategories",
    addSubCategory:"/addsubcategory",
    updateSubCategory:"/updatesubcategory",
    deleteSubCategory:"/deletesubcategory",
    allManufacturers:"/allmanufacturers",
    addManufacturer:"/addmanufacturer",
    updateManufacturer:"/updatemanufacturer",
    deleteManufacturer:"/deletemanufacturer",
    allProducts:"/allproducts",
    addProduct:"/addproduct",
    updateProduct:"/updateproduct",
    deleteProduct:"/deleteproduct",
    addAddress:"/addaddress",
    allAddresses:"/alladdresses",
    updateAddress:"/updateaddress",
    deleteAddress:"/deleteaddress",
    addItemToCart:"/additemtocart",
    getAllCartItems:"/getallcartitems",
    getUserCartItems:"/getusercartitems",
    getTotalUserCartQuantity:"/getcurrentusercartquantity",
    placeOrder:"/placeorder",
    getAllOrders:"/getallorders",
    getUserOrder:"/getuserorders",
    getOrderCartItems:'/getordercartitems',
    updateOrderStatus:"/updateorderstatus",


}

export default configDetails;