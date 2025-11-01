import { createSlice } from "@reduxjs/toolkit";
const initialState  = {
    items:[],
    statusTab:false
}

const cartSlice = createSlice({
    name : 'cart',
    initialState,
    reducers:{
        addToCart(state,action){
            const {bookId,quantity} = action.payload;
            const indexProductId =  (state.items).findIndex(item=>item.bookId === bookId);
            if(indexProductId>=0){
                state.items[indexProductId].quantity += quantity;
            }else{
                 state.items.push({bookId,quantity});
            }
            
        },

        changeQuantity(state,action){
            const{bookId,quantity} = action.payload;
            const indexProductId =  (state.items).findIndex(item=>item.bookId === bookId);
            if(quantity>0){
                state.items[indexProductId].quantity = quantity;
            }else{ 
                // delete state.items[indexProductId];
                state.items = (state.items).filter(item=>item.bookId !== bookId)
            }
        },
        toggleStatusTab(state){
            if(state.statusTab === false ){
                state.statusTab = true;
            }
            else{
                state.statusTab = false;
            }
        }

    }
})

export const {addToCart,changeQuantity,toggleStatusTab} = cartSlice.actions;
export default cartSlice.reducer;