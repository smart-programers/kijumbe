import * as SecureStore from 'expo-secure-store';
import { storage } from '@/storage';
export async function getKey(key:any) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      // alert("🔐 Here's your value 🔐 \n" + result);
      return result
    } 
    return null
  }
  
 export async function ModerngetKey(key:any,parse:boolean=false){
  try{
     const jsonData:any = storage.getString(key) 

   return parse ?JSON.parse(jsonData): jsonData
  }catch(error){
    return null
  }
 }
 
 export async function getCombinationKey(key:any,parse:boolean=false,notModern:boolean=false){
 try{  
   return notModern ? await getKey(key) : await ModerngetKey(key,parse)
 }catch(error){
   return null
 }
 }