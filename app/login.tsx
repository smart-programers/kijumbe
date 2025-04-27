import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Text, useColorScheme } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import { BaseUrl } from '@/api';

import { ModernSave, save } from '@/actions/saveKey';
import * as Burnt from "burnt";
import toast from '@/actions/toast';

export default function HomeScreen() {

      const theme = useTheme();
      const colorScheme = useColorScheme();
      const isDarkMode = colorScheme === 'dark';
 const [loading,setIsLoading]=useState(false)
    const { control, handleSubmit, formState: { errors }, trigger, reset } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: any) => {
        axios.post(`${BaseUrl}/authentication/login`, {
            email: data.email,
            password: data.password,
        })
            .then((response) => {
                if (response.status === 200) {
                    ModernSave('token', response.data);
                    toast(
                      "Logged in successfully",
                       "done",
                      "Logged in successfully",
                     
                    );
                    reset();
                    router.push("/(tabs)");

                }
            })
            .catch((error) => {
                toast(
                  "Incorrect Credentials",
                   "error",
                  "Incorrect Credentials",
                 
                );
                console.log(error, BaseUrl, data);
            });
    };
    const paperSelectTheme = {
      colors: {
        background: isDarkMode ? theme.colors.surface : theme.colors.background,
        text: isDarkMode ? theme.colors.onSurface : theme.colors.onBackground,
        primary: theme.colors.primary,
      },
    };
   
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer} style={{ backgroundColor: isDarkMode ? theme.colors.background : theme.colors.surface }}>
        <View style={styles.choppaContainer}>
          <Text style={[styles.choppa, { color: theme.colors.primary }]}>Kijumbe</Text>

                <Text style={[styles.inputContainer, { color: isDarkMode ? 'white' : 'black' }]}>Email</Text>
                <Controller
                    control={control}
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Enter a valid email address',
                        },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Email"
                            placeholder="example@gmail.com"
                            onBlur={() => {
                                onBlur();
                                trigger('email');
                            }}
                            onChangeText={onChange}
                            value={value}
                            mode="outlined"
                            left={<TextInput.Icon icon="email" />}
                            style={styles.input}
                            theme={{
                                           ...paperSelectTheme,
                                           roundness: 20,
                                         }}
                        />
                    )}
                    name="email"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

                <Text style={[styles.inputContainer, { color: isDarkMode ? 'white' : 'black' }]}>Password</Text>
                <Controller
                    control={control}
                    rules={{
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Password"
                            placeholder="********"
                            secureTextEntry={!passwordVisible}
                            onBlur={() => {
                                onBlur();
                                trigger('password');
                            }}
                            onChangeText={onChange}
                            value={value}
                            mode="outlined"
                            left={<TextInput.Icon icon="lock" />}
                            right={
                                <TextInput.Icon
                                    icon={passwordVisible ? "eye-off" : "eye"}
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                />
                            }
                            style={styles.input}
                            theme={{
                                           ...paperSelectTheme,
                                           roundness: 20,
                                         }}
                        />
                    )}
                    name="password"
                />
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

                <View style={styles.buttonContainer}>
                    <Button
                        style={[styles.btn, styles.roundedBtn]}
                        buttonColor={theme.colors.primary}
                        textColor={theme.colors.onPrimary}
                        rippleColor={theme.colors.primaryContainer}
                        onPress={handleSubmit(onSubmit)}
                    >
                        <Text style={[styles.text, { color: theme.colors.onPrimary }]}>Login</Text>
                    </Button>
                </View>

                <View style={styles.rmemb}>
                    <Text style={[styles.acc, { color: isDarkMode ? 'white' : 'black' }]}>Forgot Password</Text>
                </View>

                <View style={styles.textContainer}>
                    <Text style={{ color: theme.colors.onBackground }}>Don't have an account?</Text>
                    <Link href={"/register"}>
                        <Text style={[styles.sign, { color: theme.colors.primary }]}>Sign Up</Text>
                    </Link>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        width: '100%',
        marginVertical: 10,
    },
    inputContainer: {
        width: '100%',
    },
    buttonContainer: {
        width: '100%',
        marginVertical: 24,
    },
    roundedBtn: {
       borderRadius: 25,
     },
    btn: {
        justifyContent: 'center',
        height: 50,
        borderRadius: 4,
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    choppaContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        width: '100%',
    },
    choppa: {
        color: 'orange',
        fontSize: 70,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
    rmemb: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    textContainer: {
        width: '100%',
        marginVertical: 20,
    },
    acc: {
        color: "#000",
    },
    sign: {
        fontSize: 18,
    },
});
