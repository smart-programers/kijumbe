import { BaseUrl } from "@/api"
import { getCombinationKey } from "./getKey"
import axios from "axios"

export async function Pagination(endpoint:string,page: number = 1) {
  try{
    const res = await fetch(`${BaseUrl}/${endpoint}?page=${page}`, { cache: 'no-store' })
    if (!res.ok) {
      throw new Error('Failed to fetch jobs')
    }
    return res.json()
}catch(error){
    console.log(error)
}
  }
  
  export async function PaginationBearer(endpoint: string, page: number = 1,key:any) {
    try {
        const token = await getCombinationKey(key);
      
           if (!token) return []
            
      const res = await fetch(`${BaseUrl}/${endpoint}?page=${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        cache: 'no-store',
      });
  
      if (!res.ok) {
        console.log('Failed to fetch jobs',res,token);
        return []
      }
    const data = await res.json()
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function GetQuery(endpoint: string, id:string,key:any) {
    try {
      const token = await getCombinationKey(key);
    
         if (!token) return []
      
      const res = await fetch(`${BaseUrl}/${endpoint}?id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        cache: 'no-store',
      });
    
      if (!res.ok) {
        console.log('Failed to fetch jobs');
      }
  
      const data = await res.json();
      return data
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function Post(endpoint:string,userData:any,bearer:string){
    const token = await getCombinationKey(bearer);
  
       if (!token) return []
    try{
      const response = await axios.post(`${BaseUrl}/${endpoint}`, userData
    , {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 200) {
       return {data:response,success:true}
    
    }
  } catch (error:any) {
    console.log('Error in axios request:', error);
    return {data:[],success:false}
  } 
    
  }
  
  
  export async function Patch(endpoint:string,userData:any,bearer:string){
    const token = await getCombinationKey(bearer);
  
       if (!token) return []
    try{
      const response = await axios.patch(`${BaseUrl}/${endpoint}`, userData
    , {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (response.status === 200) {
       return {data:response,success:true}
    
    }
  } catch (error:any) {
    console.log('Error in axios request:', error);
    return {data:[],success:false}
  } 
    
  }
  
  export async function Delete(endpoint: string, userData: any, bearer: string) {
    const token = await getCombinationKey(bearer);
  
       if (!token) return []
    try {
      const response = await axios.delete(
        `${BaseUrl}/${endpoint}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { id: userData }, 
        }
      );
  
      if (response.status === 200) {
        return { data: response, success: true };
      }
    } catch (error: any) {
      console.log('Error in axios request:', error);
      return { data: [], success: false };
    }
  }
  
  export async function Upload(endpoint: string, file: File, bearer: string) {
    const token = await getCombinationKey(bearer);
  
       if (!token) return []
    try {
      const formData = new FormData();
      formData.append('file', file); 
  
      const response = await axios.post(`${BaseUrl}/${endpoint}`, formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        console.log("File uploaded successfully:", response.data);
        return response.data; 
      } else {
        console.log("Error uploading file:", response.statusText);
        return null;
      }
    } catch (error) {
      console.log("Error during file upload:", error);
      return null;
    }
  }
  
  export async function PaginationSearchBearer(endpoint: string, page: number = 1,bearer:string, search?: string,) {
    try {
      const token = await getCombinationKey(bearer);
    
         if (!token) return []
      
      const searchParam = search ? `&name=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${BaseUrl}/${endpoint}?page=${page}${searchParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        cache: 'no-store',
      });
  
      if (!res.ok) {
        console.log('Failed to fetch jobs');
      }
  
      const data = await res.json();
      return data
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function PaginationSearchBearerWithId(endpoint: string, id:string,page: number = 1, bearer:string, search?: string,) {
    try {
      const token = await getCombinationKey(bearer);
    
         if (!token) return []
      
      const searchParam = search ? `&name=${encodeURIComponent(search)}` : '';
      const res = await fetch(`${BaseUrl}/${endpoint}?page=${page}&id=${id}${searchParam}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        cache: 'no-store',
      });
  
      if (!res.ok) {
        console.log('Failed to fetch jobs');
      }
  
      const data = await res.json();
      return data
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function PaginationBearerWithId(endpoint: string, page: number = 1,id:string,bearer:string) {
    try {
      const token = await getCombinationKey(bearer);
    
         if (!token) return []
      const res = await fetch(`${BaseUrl}/${endpoint}?page=${page}&id=${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
        cache: 'no-store',
      });
  
      if (!res.ok) {
        throw new Error('Failed to fetch jobs');
      }
  
      const data = await res.json()
      return data
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function Get(endpoint: string,bearer:string) {
      try {
        const token = await getCombinationKey(bearer);
      
           if (!token) return []
  
          const response = await axios.get(`${BaseUrl}/${endpoint}`, {
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
          });
  
          if (response.status === 200) {
              return { data: response.data, success: true };
          }
  
          return { data: [], success: false };
      } catch (error) {
        
          return { data: [], success: false };
      }
  }
  
  export async function NormalGet(endpoint: string) {
      try {

          const response = await axios.get(`${BaseUrl}/${endpoint}`);
  
          if (response.status === 200) {
              return { data: response.data, success: true };
          }
  
          return { data: [], success: false };
      } catch (error) {
        
          return { data: [], success: false };
      }
  }