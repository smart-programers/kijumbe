import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    ScrollView,
    useColorScheme,
    Pressable,
    Image,
    Alert,
} from 'react-native';
import {
    Avatar,
    Button,
    Card,
    Dialog,
    Divider,
    Icon,
    IconButton,
    List,
    Portal,
    Text,
    TextInput,
    useTheme,
    Chip,
    ActivityIndicator,
} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';

import {
    PhoneNumberInput,
    getCountryByCode,
} from 'react-native-paper-phone-number-input';
import {useQuery} from "@tanstack/react-query";
import {Get, Post, Upload} from "@/actions/helpers";
import toast from "@/actions/toast";
import {queryClient} from "@/actions/Utility";
import {BaseUrl} from "@/api";
import parsePhoneNumberFromString from "libphonenumber-js";
import {storage} from "@/storage";
import {useNavigation} from '@react-navigation/native';

const MOCK_USER_DATA = {
    firstName: 'Revay',
    lastName: 'Colizer',
    email: 'revay.c@example.com',
    phoneNumber: '712345678',
    phoneCountryCode: 'TZ',
    photoUrl: '',
    isVerified: false,
};

const includeCountries = ['TZ', 'KE', 'UG', 'RW', 'BI', 'US', 'GB'];

const ProfileScreen = () => {
    const navigation = useNavigation()
    const {data, isLoading, error} = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            try {
                const data = await Get("profile", "token")
                return data?.data ?? null;
            } catch (err) {
                console.error('Error fetching data:', err);
                throw err;
            }
        },
        refetchOnWindowFocus: false,
        // refetchInterval: 2000,
    });
    const theme = useTheme();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    async function Logout(token: string) {
        storage.delete(token)
        toast("Logged Out Successfully", "done", "Logged Out Successfully")
        navigation.reset({
            index: 0,
            routes: [{name: 'login'}] as any,
        });
    }

    const [userData, setUserData] = useState(MOCK_USER_DATA);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const showDialog = () => {
        setSelectedImage(null);
        setDialogVisible(true);
    }
    const hideDialog = () => {
        setSelectedImage(null);
        setDialogVisible(false);
    }

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
        setValue,
    } = useForm({

        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            photoUrl: '',

        },
    });


    const [formPhoneNumber, setFormPhoneNumber] = useState('');
    const [formCountryCode, setFormCountryCode] = useState('TZ');


    useEffect(() => {
        if (dialogVisible) {
            reset({
                firstName: data?.firstName,
                lastName: data?.lastName,
                email: data?.email,
                photoUrl: data?.photoUrl,
            });

            const parsedPhoneNumber = parsePhoneNumberFromString(data?.phoneNumber);

            setFormPhoneNumber(parsedPhoneNumber?.nationalNumber || data?.phoneNumber || '');
            setFormCountryCode(parsedPhoneNumber?.country?.callingCode || userData.phoneCountryCode || 'TZ');
            setSelectedImage(null);
        }
    }, [dialogVisible, data, reset]);

    const pickImage = async () => {

        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
            return;
        }


        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {

            const asset = result.assets[0];
            const uri = asset.uri;

            const fileType = asset.mimeType || uri.substring(uri.lastIndexOf('.') + 1);
            const fileName = asset.fileName || uri.substring(uri.lastIndexOf('/') + 1);

            // @ts-ignore
            setSelectedImage({uri: uri, type: fileType, name: fileName});
        }
    };

    const onSaveChanges = async (formData: any) => {
        setIsSaving(true);

        let finalPhotoUrl = userData.photoUrl;

        const {dialCode} = getCountryByCode(formCountryCode);
        const fullPhoneNumber = `${dialCode}${formPhoneNumber}`;

        try {
            if (selectedImage) {

                finalPhotoUrl = await Upload("upload", selectedImage, "token");
                finalPhotoUrl = `${BaseUrl}/${finalPhotoUrl}`

            }
            await Post("profile", {
                email: formData?.email,
                phoneNumber: fullPhoneNumber,
                firstName: formData?.firstName,
                lastName: formData?.lastName,
                photoUrl: finalPhotoUrl
            }, "token")
            await queryClient.invalidateQueries(['profile'])
            hideDialog()
            toast('Profile updated successfully!', "done", 'Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast('Error', "error", 'Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };


    const dynamicStyles = {
        container: {
            flex: 1,
            paddingVertical: 40
        },
        scrollViewContent: {
            paddingBottom: 80,
        },
        avatarContainer: {
            alignItems: 'center',
            marginTop: 30,
            marginBottom: 10,
        },
        avatarWrapper: {
            padding: 5,
            borderRadius: 70,
            backgroundColor: theme.colors.surfaceVariant,
        },
        editIcon: {
            position: 'absolute',
            bottom: 0,
            right: '30%',
            backgroundColor: theme.colors.primary,
            borderRadius: 15,
        },
        verificationChip: {
            alignSelf: 'center',
            marginBottom: 20,
            backgroundColor: '#009c41',
        },
        verificationText: {
            color: theme.colors.onSurfaceVariant,
        },
        listItem: {
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            marginHorizontal: 16,
            marginVertical: 6,
            paddingVertical: 5,
        },
        logoutItem: {
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            marginHorizontal: 16,
            marginVertical: 6,
            paddingVertical: 5,

            margin: 16,
            right: 0,
            bottom: 0,
        },
        bottomContainer: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            paddingHorizontal: 16,
            paddingBottom: 20,
        },
        listItemTitle: {
            color: theme.colors.onSurfaceVariant,
            fontWeight: 'bold',
        },
        listItemDescription: {
            color: theme.colors.onSurfaceVariant,
            fontSize: 12,
        },
        dialogContent: {},
        input: {
            marginBottom: 15,
            backgroundColor: 'transparent',
        },
        inputLabel: {
            marginBottom: 5,
            color: theme.colors.onSurfaceVariant,
            fontSize: 14,
        },
        errorText: {
            color: theme.colors.error,
            fontSize: 12,
            marginTop: -10,
            marginBottom: 10,
        },
        imagePickerContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        imagePreview: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.colors.surfaceDisabled,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: theme.colors.outline,
        }

    };

    const renderProfileItem = ({icon, title, description, onPress}: any) => (
        <List.Item
            title={title}
            description={description}
            // @ts-ignore
            titleStyle={dynamicStyles.listItemTitle}
            descriptionStyle={dynamicStyles.listItemDescription}
            style={dynamicStyles.listItem}
            onPress={onPress}
            left={props => <List.Icon {...props} icon={icon} color={'#009c41'}/>}
            right={props => <List.Icon {...props} icon="chevron-right" color={'#009c41'}/>}
        />
    );


    const renderItem = ({icon, title, description, onPress}: any) => (
        <List.Item
            title={title}
            description={description}
            // @ts-ignore
            titleStyle={dynamicStyles.listItemTitle}
            descriptionStyle={dynamicStyles.listItemDescription}
            style={dynamicStyles.logoutItem}
            onPress={onPress}
            left={props => <List.Icon {...props} icon={icon} color={'#009c41'}/>}
            right={props => <List.Icon {...props} icon="chevron-right" color={'#009c41'}/>}
        />
    );


    return (
        <View style={[dynamicStyles.container, {
            backgroundColor: isDarkMode
                ? theme.colors.background
                : theme.colors.surface
        }]}>

            <ScrollView contentContainerStyle={dynamicStyles.scrollViewContent}>

                <View style={dynamicStyles.avatarContainer}>
                    <View style={dynamicStyles.avatarWrapper}>
                        {data?.photoUrl ? (
                            <Avatar.Image size={100} source={{uri: data?.photoUrl}}/>
                        ) : (

                            <Avatar.Icon size={100} icon="account" style={{backgroundColor: '#009c41'}}
                                         color={'#FFFFFF'}/>
                        )}
                    </View>
                    <IconButton
                        icon="pencil"
                        size={20}
                        iconColor={theme.colors.onPrimary}
                        // style={dynamicStyles.editIcon}
                        onPress={showDialog}
                    />
                </View>


                {/*{!userData.isVerified && (*/}
                {/*    <Chip*/}
                {/*        icon="information-outline"*/}
                {/*        style={dynamicStyles.verificationChip}*/}
                {/*        textStyle={dynamicStyles.verificationText}*/}
                {/*    >*/}
                {/*        Verification Pending*/}
                {/*    </Chip>*/}
                {/*)}*/}


                {renderProfileItem({
                    icon: 'account-outline',
                    title: 'Taarifa Zangu',
                    description: 'Tazama na hariri taarifa zako za msingi',
                    onPress: showDialog,
                })}
                {renderProfileItem({
                    icon: 'bell-outline',
                    title: 'Notifications',
                    description: 'Simamia arifa na vipaumbele',
                    onPress: () => console.log('Navigate to Notifications'),
                })}
                {renderProfileItem({
                    icon: 'lock-outline',
                    title: 'Usalama',
                    description: 'Badilisha nywila na angalia akaunti',
                    onPress: () => console.log('Navigate to Security'),
                })}
                {renderProfileItem({
                    icon: 'help-circle-outline',
                    title: 'Msaada',
                    description: 'Maswali yanayoulizwa mara kwa mara na msaada',
                    onPress: () => console.log('Navigate to Help/Support'),
                })}

            </ScrollView>
            <View style={dynamicStyles.bottomContainer}>
                {renderItem({
                    icon: 'exit-to-app',
                    title: 'Ondoka',
                    description: '',
                    onPress: () => Logout("token"),
                })}
            </View>

            <Portal>
                <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                    <Dialog.Title>Edit Profile</Dialog.Title>
                    <Dialog.Content style={dynamicStyles.dialogContent}>

                        <View style={dynamicStyles.imagePickerContainer}>
                            <Image
                                source={{uri: selectedImage?.uri || data?.photoUrl || undefined}}
                                style={dynamicStyles.imagePreview}

                                // defaultSource={require('./assets/icon.png')}
                            />

                            {/*{!(selectedImage?.uri || data?.photoUrl) && (*/}
                            {/*    <Avatar.Icon size={100} icon="account" style={[dynamicStyles.imagePreview, { backgroundColor: theme.colors.surfaceDisabled }]} />*/}
                            {/*)}*/}
                            <Button
                                icon="camera"
                                mode="contained-tonal"
                                onPress={pickImage}
                                disabled={isSaving}
                            >
                                {selectedImage ? 'Change Photo' : 'Select Photo'}
                            </Button>
                        </View>


                        <Text style={dynamicStyles.inputLabel}>First Name</Text>
                        <Controller
                            control={control}
                            rules={{required: 'First Name is required'}}
                            name="firstName"
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="First Name"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={dynamicStyles.input}
                                />
                            )}
                        />
                        {errors.firstName && <Text style={dynamicStyles.errorText}>{errors.firstName.message}</Text>}


                        <Text style={dynamicStyles.inputLabel}>Last Name</Text>
                        <Controller
                            control={control}
                            rules={{required: 'Last Name is required'}}
                            name="lastName"
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="Last Name"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={dynamicStyles.input}
                                />
                            )}
                        />
                        {errors.lastName && <Text style={dynamicStyles.errorText}>{errors.lastName.message}</Text>}


                        <Text style={dynamicStyles.inputLabel}>Email</Text>
                        <Controller
                            control={control}
                            rules={{
                                required: 'Email is required',
                                pattern: {value: /^\S+@\S+$/i, message: 'Invalid email address'},
                            }}
                            name="email"
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="Email"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    style={dynamicStyles.input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            )}
                        />
                        {errors.email && <Text style={dynamicStyles.errorText}>{errors.email.message}</Text>}

                        <Text style={dynamicStyles.inputLabel}>Phone Number</Text>
                        <PhoneNumberInput

                            code={formCountryCode}
                            setCode={setFormCountryCode}
                            phoneNumber={formPhoneNumber}
                            setPhoneNumber={setFormPhoneNumber}
                            includeCountries={includeCountries}

                            contentStyle={[dynamicStyles.input, {color: theme.colors.onSurface}]}
                            style={{backgroundColor: 'transparent', marginBottom: 15}}
                            theme={{
                                roundness: 3,

                            }}
                        />

                        {!formPhoneNumber && <Text style={dynamicStyles.errorText}>Phone number is required</Text>}


                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={hideDialog} disabled={isSaving}>Cancel</Button>
                        <Button
                            onPress={handleSubmit(onSaveChanges)}
                            loading={isSaving}
                            disabled={isSaving}
                        >
                            Save Changes
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>


        </View>
    );
};
export default ProfileScreen;
