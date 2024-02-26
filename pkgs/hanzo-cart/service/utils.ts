import type { LineItem } from "../types"  
import firebase_app from "./firebase-config"  
import { getFirestore, collection, addDoc } from "firebase/firestore"  
  
const db = getFirestore(firebase_app, 'lux-commerce')  
  
export default async function persistCart(cart: LineItem[], userEmail: string) {  
    let result = null  
    let error = null

    const cartAsObject = cart.reduce((acc, item) => {
        acc[item.product.id] = {
            product: item.product,
            quantity: item.quantity
        }
        return acc
    }, {} as Record<string, {}>)
  
    try {  
        try {
            result = await addDoc(collection(db, userEmail), {cartAsObject, timestamp: Date.now()})
        } catch (e) {  
            console.error('Error writing item document: ', e)
            error = e  
        }  
    } catch (e) {  
        console.error('Error writing order document: ', e)
        error = e  
    }  
  
    return { result, error }  
}