import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  useColorScheme,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Button, TextInput, Text, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import { BaseUrl } from "@/api";
import { PaperSelect } from "react-native-paper-select";
import { NormalGet } from "@/actions/helpers";

import {
  PhoneNumberInput,
  getCountryByCode,
} from "react-native-paper-phone-number-input";

const includeCountries = [
  "AZ",
  "BD",
  "CA",
  "GB",
  "IN",
  "NZ",
  "US",
  "TR",
  "TZ",
  "UG",
  "KE",
];

export default function HomeScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = useTheme();
  const [countryCode, setCountryCode] = useState<string>("TZ");
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const { name, flag, dialCode } = getCountryByCode(countryCode);
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const registrationData = {
        ...data,
        photoUrl: "",
        phoneNumber: `${dialCode}${""}${phoneNumber}`,
      };

      const response = await axios.post(
        `${BaseUrl}/authentication/register`,
        registrationData,
      );

      if (response.status === 200) {
        toast.show("Registered successfully", {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
        reset();

        router.push("/");
      }
    } catch (error) {
      // toast.show("Registration failed", {
      //   type: "danger",
      //   placement: "top",
      //   duration: 4000,
      //   animationType: "slide-in",
      // });
      console.log(error, BaseUrl);
    } finally {
      setIsLoading(false);
    }
  };

  const paperSelectTheme = {
    colors: {
      background: isDarkMode ? theme.colors.surface : theme.colors.background,
      text: isDarkMode ? theme.colors.onSurface : theme.colors.onBackground,
      primary: theme.colors.primary,
    },
  };

  return (
    <ScrollView
      style={{
        backgroundColor: isDarkMode
          ? theme.colors.background
          : theme.colors.surface,
      }}
    >
      <View style={styles.choppaContainer}>
        <Text style={[styles.choppa, { color: theme.colors.primary }]}>
          Kijumbe
        </Text>

        <Text
          style={[styles.inputContainer, { color: theme.colors.onBackground }]}
        >
          First Name
        </Text>
        <Controller
          control={control}
          rules={{ required: "First Name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="First Name"
              placeholder="Revay"
              mode="outlined"
              onBlur={() => {
                onBlur();
                trigger("firstName");
              }}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
              theme={{
                ...paperSelectTheme,
                roundness: 20,
              }}
            />
          )}
          name="firstName"
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName.message}</Text>
        )}

        <Text
          style={[styles.inputContainer, { color: theme.colors.onBackground }]}
        >
          Last Name
        </Text>
        <Controller
          control={control}
          rules={{ required: "Last Name is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Last Name"
              placeholder="Colizer"
              mode="outlined"
              onBlur={() => {
                onBlur();
                trigger("lastName");
              }}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              left={<TextInput.Icon icon="account" />}
              theme={{
                ...paperSelectTheme,
                roundness: 20,
              }}
            />
          )}
          name="lastName"
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName.message}</Text>
        )}

        <Text
          style={[styles.inputContainer, { color: theme.colors.onBackground }]}
        >
          Email
        </Text>
        <Controller
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Enter a valid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              mode="outlined"
              placeholder="example@gmail.com"
              onBlur={() => {
                onBlur();
                trigger("email");
              }}
              left={<TextInput.Icon icon="email" />}
              onChangeText={onChange}
              value={value}
              style={styles.input}
              theme={{
                ...paperSelectTheme,
                roundness: 20,
              }}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        <Text
          style={[styles.inputContainer, { color: theme.colors.onBackground }]}
        >
          Phone Number
        </Text>
        <PhoneNumberInput
          code={countryCode}
          setCode={setCountryCode}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          includeCountries={includeCountries}
          contentStyle={[styles.input, { color: theme.colors.onBackground }]}
          theme={{
            ...paperSelectTheme,
            roundness: 20,
          }}
          style={{ color: theme.colors.onBackground}}
        />

        <Text
          style={[styles.inputContainer, { color: theme.colors.onBackground }]}
        >
          Password
        </Text>
        <Controller
          control={control}
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              mode="outlined"
              placeholder="..............."
              secureTextEntry={!passwordVisible}
              onBlur={() => {
                onBlur();
                trigger("password");
              }}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={passwordVisible ? "eye-off" : "eye"}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
              onChangeText={onChange}
              value={value}
              style={styles.input}
              theme={{
                ...paperSelectTheme,
                roundness: 20,
              }}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <Text
          style={[styles.inputContainer, { color: theme.colors.onBackground }]}
        >
          Repeat Password
        </Text>
        <Controller
          control={control}
          rules={{
            required: "Repeat Password is required",
            validate: (value) =>
              value === getValues().password || "Passwords do not match",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Repeat Password"
              mode="outlined"
              placeholder="................"
              secureTextEntry={!passwordVisible}
              onBlur={() => {
                onBlur();
                trigger("confirmPassword");
              }}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={passwordVisible ? "eye-off" : "eye"}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
              onChangeText={onChange}
              value={value}
              style={styles.input}
              theme={{
                ...paperSelectTheme,
                roundness: 20,
              }}
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
          <Button
            style={[styles.btn, styles.roundedBtn]}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
            rippleColor={theme.colors.primaryContainer}
            disabled={loading}
          >
            <Text style={[styles.text, { color: theme.colors.onPrimary }]}>
              Register
            </Text>
          </Button>
        </Pressable>

        {/* <View style={styles.container}>
          <View style={[styles.line, { backgroundColor: theme.colors.onBackground }]} />
          <Text style={[styles.textOR, { color: theme.colors.onBackground }]}>OR</Text>
          <View style={[styles.line, { backgroundColor: theme.colors.onBackground }]} />
        </View> */}

        {/* <View style={styles.button}>
          <Button
            icon={({}) => (
              <Ionicons name="logo-google" size={20} color={theme.colors.primary} />
            )}
            style={[styles.btnGoogle,styles.roundedBtn, { borderColor: theme.colors.onBackground }]}
            buttonColor={theme.colors.surface}
            textColor={theme.colors.onSurface}
            rippleColor={theme.colors.surfaceVariant}
          >
            <Text style={[styles.textGoogle, { color: theme.colors.onSurface }]}>Continue with Google</Text>
          </Button>
        </View> */}

        <Text style={{ textAlign: "center", color: theme.colors.onBackground }}>
          Terms and Conditions
        </Text>

        <Text style={{ color: theme.colors.onBackground }}>
          Have an account?
        </Text>
        <Link href={"/login"}>
          <Text style={[styles.sign, { color: theme.colors.primary }]}>
            Sign In
          </Text>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    paddingVertical: 24,
  },
  input: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 100,
  },
  inputContainer: {
    width: "100%",
  },
  sign: {
    fontSize: 18,
  },
  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    overflow: "hidden",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  textGoogle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  choppaContainer: {
    flex: 1,
    paddingVertical: 80,
    paddingHorizontal: 20,
    margin: 10,
  },
  choppa: {
    fontSize: 70,
    fontWeight: "bold",
    textAlign: "center",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  roundedBtn: {
    borderRadius: 25,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
  },
  textOR: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  btnGoogle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 4,
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  servicesContainer: {
    marginVertical: 10,
  },
  paperSelectContainer: {
    borderRadius: 4,
  },
});
