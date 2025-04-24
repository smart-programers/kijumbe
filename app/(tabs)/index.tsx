import { View,Text,useColorScheme, ScrollView } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarGroup from "@/components/home/avatarGroup";
import GroupDashboard from "@/components/home/dashboard";
import { useTheme } from 'react-native-paper';
import GroupList from "@/components/home/groupList";
import { useEffect, useState } from "react";
import { Get } from "@/actions/helpers";

export default function GroupPage(){
   const colorScheme = useColorScheme();
    const theme = useTheme();
  const isDarkMode = colorScheme === 'dark';
  const [userData, setUserData] = useState({
    user: null,
    details: [],
    upcoming: [],
  });
  
  useEffect(()=>{
    async function getData(){
      const data = await Get("user","token")
        console.log(data.data)
      if(data?.success===true){
  
    setUserData(data?.data)
      }
    }
    getData()
  },[])
  return(
    <SafeAreaView  style={{ backgroundColor: isDarkMode ? theme.colors.background : theme.colors.surface }}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <AvatarGroup user={userData?.user}/>
        <GroupDashboard details={userData?.details} />
      <GroupList groups={userData?.upcoming}/>
    </ScrollView>
    </SafeAreaView>
  )
}
