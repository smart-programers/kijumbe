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
import {useQuery} from "@tanstack/react-query";

export default function GroupPage(){
   const colorScheme = useColorScheme();
    const theme = useTheme();
  const isDarkMode = colorScheme === 'dark';
  const [userData, setUserData] = useState({
    user: null,
    details: [],
    upcoming: [],
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['homepage'],
    queryFn: async () => {
      try {
        const data = await Get("user","token")
        return data?.data;
      } catch (err) {
        console.error('Error fetching data:', err);
        throw err;
      }
    },
    refetchOnWindowFocus: false,
    // refetchInterval: 2000,
  });

  return(
    <SafeAreaView  style={{ backgroundColor: isDarkMode ? theme.colors.background : theme.colors.surface }}>
      <ScrollView showsVerticalScrollIndicator={false}>
      <AvatarGroup user={data?.user}/>
        <GroupDashboard details={data?.details} />
      <GroupList groups={data?.upcoming}/>
    </ScrollView>
    </SafeAreaView>
  )
}
