import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { getCombinationKey, getKey, ModerngetKey } from '@/actions/getKey';
import { useNavigation } from '@react-navigation/native';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

export default function IndexScreen() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const navigation = useNavigation()
  useEffect(() => {
    async function checkUser() {
      try {
        const token = await ModerngetKey('token');
      
        return token ? navigation.reset({
            index: 0,
            routes: [{ name: '(tabs)' }] as any,
          }) :  navigation.reset({
             index: 0,
             routes: [{ name: 'login' }] as any,
           });
        
      } catch (error) {
        console.error('Error checking user token:', error);
        navigation.reset({
            index: 0,
            routes: [{ name: 'login' }] as any,
          });
      } finally {
        setLoading(false);
        SplashScreen.hideAsync();
      }
    }

    checkUser();
  }, [router]);

 
  if (loading) {
    return null; 
  }

  return null;
}