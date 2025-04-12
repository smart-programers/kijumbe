import { View,Text,useColorScheme } from "react-native";
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarGroup from "@/components/home/avatarGroup";
import GroupDashboard from "@/components/home/dashboard";
import { useTheme } from 'react-native-paper';
import GroupList from "@/components/home/groupList";

export default function GroupPage(){
   const colorScheme = useColorScheme();
    const theme = useTheme();
  const isDarkMode = colorScheme === 'dark';
  return(
    <SafeAreaView  style={{ backgroundColor: isDarkMode ? theme.colors.background : theme.colors.surface }}>
    <ThemedView>
      <AvatarGroup/>
      <GroupDashboard/>
      <GroupList/>
    </ThemedView>
    </SafeAreaView>
  )
}
