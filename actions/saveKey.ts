import * as SecureStore from 'expo-secure-store';
import { storage } from '@/storage';
export async function save(key:any, value:any) {
    await SecureStore.setItemAsync(key, value);
  }
  
export async function ModernSave(key: any, value: any,stringify:boolean=false) {
  try {
    return stringify ? storage.set(key, JSON.stringify(value)) : storage.set(key, value)
  }catch(error){
    return null
  }
}

export async function saveKey(key:any,value:any,stringify:boolean=false,modern:boolean=false){
 try{ 
  return modern ? await ModernSave(key,value,stringify):await save(key,value)
 }catch(error){
   return null
 }
}