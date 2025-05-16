import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView, Dimensions, FlatList, Alert, TouchableOpacity} from 'react-native';
import {
    Appbar,
    Card,
    Text,
    ProgressBar,
    Button,
    Menu,
    Divider,
    MD3LightTheme,
    useTheme,
    Icon, FAB, IconButton,
    Avatar, Portal, Dialog, ActivityIndicator,

} from 'react-native-paper';
import {Controller, useForm} from 'react-hook-form';
import Constants from 'expo-constants';
import { TabView, TabBar } from 'react-native-tab-view';
import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Get, GetById, GetQuery, Patch, Post} from "@/actions/helpers";
import {useLocalSearchParams, useRouter} from "expo-router";
import {LegendList} from "@legendapp/list";
import {queryClient, renderContributionCycle} from "@/actions/Utility";
import toast from "@/actions/toast";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const defaultTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: '#4CAF50',
        secondaryContainer: '#E0F2F1',
        onSecondaryContainer: '#004D40',
        surfaceVariant: '#F5F5F5',
        surface: '#FFFFFF',
        onSurface: '#000000',
        onSurfaceVariant: '#424242',
        outline: '#BDBDBD',
        outlineVariant: '#EEEEEE',
        onSurfaceDisabled: '#9E9E9E',
        error: '#D32F2F',
    },
};


const MichangoTab = ({ paperTheme,data }:any) => {

    const themeToUse = paperTheme || defaultTheme;
    return (
        <ScrollView contentContainerStyle={styles.scrollContainerTab}>

            <View style={styles.cardRow}>
                <Card style={[styles.infoCard]}>
                    <Card.Content style={styles.cardContent}>
                        <Icon source="cash" size={20} color={'#009c41'} />
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: 'black' }]}>Mchango</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: 'black' }]}>{data?.contributionAmount?.toLocaleString('sw-TZ', {
                            style: 'currency',
                            currency: 'TZS',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }) ?? 'TZS 1,000'}</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.infoCard]}>
                    <Card.Content style={styles.cardContent}>
                        <Icon source="calendar-clock" size={20} color={'#009c41'}/>
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: 'black' }]}>Mzunguko</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: 'black' }]}>{renderContributionCycle(data?.frequency) ?? "Kila Siku"}</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.infoCard]}>
                    <Card.Content style={styles.cardContent}>
                        <Icon source="account-group-outline" size={20} color={'#009c41'} />
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: 'black' }]}>Wanachama</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: 'black' }]}>{data?.approved_member_count ?? 0}/{data?.memberLimit ?? 10}</Text>
                    </Card.Content>
                </Card>
            </View>


            <View style={styles.cardRow}>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: 'black' }]}>Jumla ya Michango</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: 'black' }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: 'black' }]}>Jumla ya Malipo</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: 'black' }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: 'black' }]}>Salio la Sasa</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: 'black' }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
            </View>


            <View style={styles.progressSection}>
                <Text variant="bodyMedium" style={{ color: themeToUse.colors.onSurface }}>Maendeleo ya Kikundi</Text>
                <View style={styles.progressBarContainer}>
                    <ProgressBar progress={0.0} color={themeToUse.colors.primary} style={styles.progressBar} />
                    <Text variant="bodyMedium" style={[styles.progressText, { color: themeToUse.colors.onSurface }]}>0 %</Text>
                </View>
            </View>

            {data?.upcoming_payments.length > 0 ? (
                <LegendList
                    data={data.upcoming_payments}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        const date = new Date(item);
                        const formatted = date.toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        });

                        return (
                            <Card style={{ marginVertical: 6, marginHorizontal: 10, elevation: 2 }}>
                                <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons
                                        name="calendar-today"
                                        size={20}
                                        color="#6200ee"
                                        style={{ marginRight: 10 }}
                                    />
                                    <Text>{formatted}</Text>
                                </Card.Content>
                            </Card>
                        );
                    }}
                />
            ):(
            <View style={styles.placeholderContainer}>
                <Icon source="file-multiple-outline" size={60} color={themeToUse.colors.onSurfaceDisabled} />
                <Text variant="titleMedium" style={[styles.placeholderTitle, { color: themeToUse.colors.onSurface }]}>Hakuna malipo yaliyopangwa</Text>
                <Text variant="bodyMedium" style={[styles.placeholderSubtitle, { color: themeToUse.colors.onSurfaceDisabled }]}>Ratiba ya malipo itaonekana hapa</Text>
            </View>
                )}
        </ScrollView>
    );
};

const WanachamaTab = ({ paperTheme,data }:any) => {
    const themeToUse = paperTheme || defaultTheme;
    return (
        <ScrollView contentContainerStyle={styles.scrollContainerTab}>

            <View style={styles.cardRow}>
                <Card style={[styles.infoCard]}>
                    <Card.Content style={styles.cardContent}>
                        <Icon source="cash" size={20} color={'#009c41'}/>
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: 'black' }]}>Mchango</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: 'black' }]}>{data?.contributionAmount?.toLocaleString('sw-TZ', {
                            style: 'currency',
                            currency: 'TZS',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }) ?? 'TZS 1,000'}</Text>
                    </Card.Content>
                </Card>

                <Card style={[styles.infoCard]}>
                    <Card.Content style={styles.cardContent}>
                        <Icon source="calendar-clock" size={20} color={'#009c41'}/>
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: 'black' }]}>Mzunguko</Text>
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: 'black' }]}>{renderContributionCycle(data?.frequency) ?? "Kila Siku"}</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.infoCard]}>
                    <Card.Content style={styles.cardContent}>
                        <Icon source="account-group-outline" size={20} color={'#009c41'} />
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: 'black' }]}>Wanachama</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: 'black' }]}> {data?.approved_member_count ?? 0}/{data?.memberLimit ?? 10}</Text>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.cardRow}>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: 'black' }]}>Jumla ya Michango</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: 'black' }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
                {/* ... other cards ... */}
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: 'black' }]}>Jumla ya Malipo</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: 'black' }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: 'black' }]}>Salio la Sasa</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: 'black' }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.progressSection}>
                <Text variant="bodyMedium" style={{ color: themeToUse.colors.onSurface }}>Maendeleo ya Kikundi</Text>
                <View style={styles.progressBarContainer}>
                    <ProgressBar progress={0.0} color={themeToUse.colors.primary} style={styles.progressBar} />
                    <Text variant="bodyMedium" style={[styles.progressText, { color: themeToUse.colors.onSurface }]}>0 %</Text>
                </View>
            </View>

            {(data?.approved_members && data.approved_members.length > 0) ? (
            <LegendList
            data={data.approved_members}
            keyExtractor={(item:any, index:number) => index.toString()}
            renderItem={({ item, index }:{item:any,index:number}) => (
                <Card style={styles.memberCard}>
                    <Card.Content style={styles.memberCardContent}>

                        <Avatar.Image
                            size={48}
                            source={{uri:item?.user?.photoUrl || "https://via.placeholder.com/150"}}
                            // style={styles.memberAvatar}
                        />
                        <View style={styles.memberInfo}>
                            <Text  style={{  color: 'black'  }}>
                                {item.user?.firstName} {item.user?.lastName}
                            </Text>
                            <Text variant="bodyMedium" style={{ color: 'black' }}>
                                {item.role ? `(${item.role})` : item.user?.phoneNumber}
                            </Text>
                        </View>
                    </Card.Content>

                </Card>
            )}
            contentContainerStyle={styles.flatListContentContainer}
        />
    ):(
            <View style={styles.placeholderContainer}>
                <Icon source="account-multiple-plus-outline" size={60} color={themeToUse.colors.onSurfaceDisabled} />
                <Text variant="titleMedium" style={[styles.placeholderTitle, { color: themeToUse.colors.onSurface }]}>Hakuna wanachama katika kikundi hiki</Text>
                <Text variant="bodyMedium" style={[styles.placeholderSubtitle, { color: themeToUse.colors.onSurfaceDisabled }]}>Anzia kwa kuongeza wanachama</Text>
            </View>
            )}
        </ScrollView>
    );
};


const MalipoTab = ({ paperTheme,data }:any) => {
    const themeToUse = paperTheme || defaultTheme;
    return (
        <ScrollView contentContainerStyle={styles.scrollContainerTab}>
            {(data?.payments && data?.payments.length >0) ?
                (
                    <LegendList
                        data={data.payments}
                        keyExtractor={(item:any, index:number) => index.toString()}
                        renderItem={({ item, index }:{item:any,index:number}) => (
                            <Card style={styles.memberCard}>
                                <Card.Content style={styles.memberCardContent}>

                                    <Avatar.Image
                                        size={48}
                                        source={{uri:item?.user?.photoUrl || "https://via.placeholder.com/150"}}
                                        // style={styles.memberAvatar}
                                    />
                                    <View style={styles.memberInfo}>
                                        <Text  style={{  color: 'black'  }}>
                                            {item.user?.firstName} {item.user?.lastName}
                                        </Text>
                                        <Text variant="bodyMedium" style={{ color: 'black' }}>
                                            {parseFloat(item.amount) + parseFloat(item.feeAmount)}
                                        </Text>
                                        <Text variant="bodyMedium" style={{ color: 'black' }}>
                                            {item.receiptUrl}
                                        </Text>

                                        <Text variant="bodyMedium" style={{ color: 'black' }}>
                                            {item.status}
                                        </Text>
                                    </View>
                                </Card.Content>

                            </Card>
                        )}
                        contentContainerStyle={styles.flatListContentContainer}
                    />
                ):
                    (
            <View style={styles.placeholderContainer}>
                <Icon source="cash-multiple" size={60} color={themeToUse.colors.onSurfaceDisabled} />
                <Text variant="titleMedium" style={[styles.placeholderTitle, { color: themeToUse.colors.onSurface }]}>Hakuna historia ya malipo</Text>
                <Text variant="bodyMedium" style={[styles.placeholderSubtitle, { color: themeToUse.colors.onSurfaceDisabled }]}>Malipo yajayo na yaliyopita yataonekana hapa</Text>
            </View>)}
        </ScrollView>
    );
};

const MaombiTab = ({ paperTheme, data }: any) => {
    const themeToUse = paperTheme || defaultTheme;

    const handleAccept = useMutation({
        mutationFn: (user: any) => Patch("member-request", user.member_id, { status: "approved" }, "token"),
        onSuccess: (data, variables) => {
            toast(`${variables?.firstName} Added to Group Successfully`, "done", `${variables?.firstName} Added to Group Successfully`);
            queryClient.invalidateQueries(["groupId", data?.group_id]);
        },
    });

    return (
        <ScrollView contentContainerStyle={styles.scrollContainerTab}>
            {(data?.waiting_requests && data?.waiting_requests.length > 0) ? (
                <LegendList
                    data={data?.waiting_requests}
                    keyExtractor={(item: any, index: number) => index.toString()}
                    renderItem={({ item, index }: { item: any, index: number }) => (
                        <Card style={styles.memberCard}>
                            <Card.Content style={styles.memberCardContent}>
                                <Avatar.Image
                                    size={48}
                                    source={{ uri: item?.user?.photoUrl || "https://via.placeholder.com/150" }}
                                />
                                <View style={styles.memberInfo}>
                                    <Text variant="titleMedium" style={{ color: themeToUse.colors.onSurface }}>
                                        {item.user?.firstName} {item.user?.lastName}
                                    </Text>
                                    <Text variant="bodyMedium" style={{ color: themeToUse.colors.onSurfaceVariant }}>
                                        {item.role ? `(${item.role})` : item.user?.phoneNumber}
                                    </Text>
                                </View>
                            </Card.Content>

                            {data?.current_user_role === 'admin' && (
                                <Button
                                    mode="contained"
                                    style={[styles.kubaliButton, { backgroundColor: '#009c41' }]}
                                    onPress={() => {

                                        handleAccept.mutate(item.user);
                                    }}
                                >
                                    Kubali
                                </Button>
                            )}

                            {index < data?.waiting_requests.length - 1 && <Divider />}
                        </Card>
                    )}
                    contentContainerStyle={styles.flatListContentContainer}
                />
            ) : (
                <View style={styles.placeholderContainer}>
                    <Icon source="account-multiple-plus-outline" size={60} color={themeToUse.colors.onSurfaceDisabled} />
                    <Text variant="titleMedium" style={[styles.placeholderTitle, { color: themeToUse.colors.onSurface }]}>
                        Hakuna maombi ya uanachama
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};



export default function GroupScreen (){
    const [visible, setVisible] = useState(false);
    const paperTheme = useTheme();
    const [menuVisible, setMenuVisible] = useState(false);
    const startDate = new Date().toISOString().split('T')[0];
    const [anchorLayout, setAnchorLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const anchorRef = useRef<any>(null);
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [payDate,setPayDate]=useState<any|null>(null)
    const hideDatePicker = () => setDatePickerVisible(false);

    useEffect(() => {
        if (startDate) {
            setPayDate(startDate);
        }
    }, [startDate]);

    const handleConfirm = (date: Date) => {
        const localDate = new Date(date);
        const formattedDate = `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;

        setPayDate(formattedDate);
        hideDatePicker();
    };

    const { id }: any = useLocalSearchParams();
    const { data, isLoading, error } = useQuery({
        queryKey: ['groupId',id],
        queryFn: async () => {
            try {
                const data = await GetById("groups",id,"token")

                return data ?? null;
            } catch (err) {
                console.error('Error fetching data:', err);
                throw err;
            }
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
        // refetchInterval: 2000,
    });

    const currency = "TZS"

    const leaveGroup = useMutation({
        mutationFn: (groupId: string) =>
            Post('left', { groupId:groupId }, 'token'),
        onSuccess: () => {
            toast('Umeondoka kwenye kikundi', 'done', 'Left group successfully');
            queryClient.invalidateQueries({ queryKey: ['groups'] });

            router.replace('/groups');
        },
        onError: () => {
            toast('Imeshindikana kuondoka', 'error', 'Failed to leave group');
        },
    });

    const showLeaveGroupAlert = () => {
        Alert.alert(
            'Ondoka Kwenye Kikundi',
            `Je, unahitaji kuondoka kwenye hiki kikundi? Kumbuka kua Unapo indoka kwenye kikundi hiki utapoteza Moja Kwa Moja sifa za kua mwanachama katika kikundi hiki.
Je, ni taarifa zipi muhuni kwangu tapoteza?
Taarifa Muhimu Utakazo poteza baada ya kuondoka kwenye kikundi hiki ni pamoja na pesa ambazo ulikua umesha changia , Historia ya Michango pamoja na shughuri zote ulizo fanya katika kikundi hiki zote Zita toeka .
Hivyo Huta weza Kurudishiwa chochote utakacho poteza baada ya kuondoka kwenye kikundi.
Asante Kwa usikivu na tuna kutakia laheri huko uendako
Bonyeza NDIYO Ili kuondoka kwenye kikundi`,
            [
                {
                    text: 'Ghairi',
                    style: 'cancel',
                },
                {
                    text: 'Ndiyo, Ondoka',
                    style: 'destructive',
                    onPress: () => {
                        if (data?.group_id) {
                            leaveGroup.mutate(data?.group_id);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const title = data?.name ?? "Mchezo wa Biashara"

    const openMenu = () => {
        anchorRef.current?.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
            setAnchorLayout({ x: px, y: py + height, width, height });
            setMenuVisible(true);
        });
    };



    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues: {
        paymentDate:new Date(),
        } });


    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'wanachama', title: 'Wanachama' },
        { key: 'michango', title: 'Michango' },
        { key: 'malipo', title: 'Malipo' },
        { key: 'maombi', title: 'Maombi' },
    ]);


    const closeMenu = () => setMenuVisible(false);
    const handleEditGroup = () => { console.log('Edit Group'); closeMenu(); };
    const handleViewTerms = () => {router.push(`/rules/${id}`); closeMenu(); };
    const [open, setOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);
    const [visiblePayDialog, setVisiblePayDialog] = useState(false);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    const openPaymentDialog = () => {
        setVisiblePayDialog(true);
    };
    const closePaymentDialog = () => {
        setVisiblePayDialog(false);
    };
    const onSubmit = async () => {
        closeDialog();
        const amount = Number(data?.contributionAmount);
        const feeAmount = Number((data?.contributionAmount * 0.02).toFixed(2));
        const payload = {
            groupId: data.group_id,
            amount:amount,
            feeAmount:feeAmount,
            // provider: data.provider,
            date: new Date(payDate),
        };
        openPaymentDialog()

        try {
           const response = await Post("pay",payload,"token")
            closePaymentDialog()
            toast(response?.data?.data?.message,"done",response?.data?.data?.message)
            queryClient.invalidateQueries({ queryKey: ["groupId", id] })
            queryClient.invalidateQueries(['homepage'])

        } catch (err) {
            console.error("Payment error:", err);
            toast("Payment Failed","error","Payment Failed")
        }
    };


    const renderScene = ({ route }:any) => {
        switch (route.key) {
            case 'wanachama':

                return <WanachamaTab paperTheme={paperTheme} data={data}/>;
            case 'michango':
                return <MichangoTab paperTheme={paperTheme} data={data}/>;
            case 'malipo':
                return <MalipoTab paperTheme={paperTheme} data={data}/>;
            case 'maombi':
                return <MaombiTab paperTheme={paperTheme} data={data}/>;
            default:
                return null;
        }
    };

const router = useRouter()
    const renderTabBar = (props:any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#009c41' }}
            style={{ backgroundColor: paperTheme.colors.surface }}
            labelStyle={{ color: paperTheme.colors.onSurface, textTransform: 'none', fontWeight: '600',fontSize: wp('3.5%') }}
            activeColor={'#009c41'}
            inactiveColor={paperTheme.colors.onSurfaceVariant}
        />
    );


    return (

        <View style={styles.container}>

            <Appbar.Header
                style={{ backgroundColor: paperTheme.colors.surface }}
                statusBarHeight={Constants.statusBarHeight}
            >
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={title} titleStyle={styles.appBarTitle} />
                <IconButton
                    ref={anchorRef}
                    icon="dots-vertical"
                    onPress={openMenu}
                />
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={anchorLayout}
                    style={{
                        marginTop: 0,
                    }}
                >
                    <Menu.Item onPress={handleEditGroup} title="Hariri Kikundi" leadingIcon="pencil-outline" />
                    <Menu.Item onPress={handleViewTerms} title="Kanuni na Masharti" leadingIcon="file-document-outline" />
                    <Divider />
                    <Menu.Item onPress={showLeaveGroupAlert} title="Ondoka Kwenye Kikundi" leadingIcon="logout" titleStyle={{ color: paperTheme.colors.error }}/>
                </Menu>
            </Appbar.Header>


            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: Dimensions.get('window').width }}
                renderTabBar={renderTabBar}
                style={styles.tabView}
            />


            {/*<View style={[styles.buttonContainer, { borderTopColor: paperTheme.colors.outlineVariant, backgroundColor: paperTheme.colors.surface }]}>*/}
            {/*    <Button*/}
            {/*        icon="cash-plus"*/}
            {/*        mode="contained"*/}
            {/*        onPress={handleSubmit(onSubmit)}*/}
            {/*        style={styles.payButton}*/}
            {/*        labelStyle={styles.buttonLabel}*/}
            {/*        contentStyle={styles.buttonContent}*/}
            {/*        theme={{ roundness: 3 }} */}
            {/*    >*/}
            {/*        Lipa Mchango*/}
            {/*    </Button>*/}

                <FAB
                    icon={() => <Ionicons name="add" size={24} color="#FFFFFF" />}
                    label="Lipa Mchango"
                    color="#FFFFFF"
                    style={styles.fab}
                    onPress={() => openDialog()}
                />
            {/*</View>*/}

            <Portal>
                <Dialog visible={open} onDismiss={closeDialog}>
                    <Dialog.Title>Thibitisha Malipo</Dialog.Title>
                    <Dialog.Content>
                        <Text>Mchango: {currency} {data?.contributionAmount}</Text>
                        <Text>Ada ya Huduma (2%): {data?.contributionAmount ? (data?.contributionAmount * 0.02).toFixed(2) : '0'}</Text>
                        <Text style={{ marginTop: 12, marginBottom: 5 }}>Chagua Tarehe ya Malipo:</Text>

                        <Controller
                            name="paymentDate"
                            control={control}
                            defaultValue={new Date()}
                            render={({ field: { onChange, value } }) => (
                                <>


                                            <View style={styles.inputWithIcon}>
                                                <MaterialCommunityIcons name="calendar" size={24} color="#757575" style={styles.inputIcon} />
                                                <View style={styles.dropdownContainer}>
                                                    <Button
                                                        mode="outlined"
                                                        onPress={() => setDatePickerVisible(true)}
                                                        style={styles.dropdownButton}
                                                        contentStyle={styles.dropdownButtonContent}
                                                        icon={() => <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />}
                                                        labelStyle={styles.dropdownButtonLabel}
                                                    >
                                                        {payDate}
                                                    </Button>

                                                    <DateTimePickerModal
                                                        isVisible={datePickerVisible}
                                                        mode="date"
                                                        onConfirm={(date) => {

                                                            handleConfirm(date);
                                                        }}
                                                        onCancel={hideDatePicker}
                                                    />
                                                </View>
                                            </View>

                                </>
                            )}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={closeDialog}>Ghairi</Button>
                        <Button onPress={onSubmit}>Lipa</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Portal>
                <Dialog visible={visiblePayDialog} onDismiss={closePaymentDialog}>
                    <Dialog.Title>Tafadhali Subiri...</Dialog.Title>
                    <Dialog.Content>
                        <ActivityIndicator animating={true} color={"#009c41"}/>
                    </Dialog.Content>

                </Dialog>
            </Portal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: defaultTheme.colors.surface,
    },
    appBarTitle: {
        fontSize: 18,
    },
    tabView: {
        flex: 1,
    },
    scrollContainerTab: {
        padding: 16,
        paddingBottom: 20,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    infoCard: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 8,
        elevation: 1,
        backgroundColor:"#FFFFFF"
    },
    summaryCard: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 8,
        elevation: 1,
        backgroundColor:"#FFFFFF"
    },
    cardContent: {
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    summaryCardContent: {
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    cardIcon: {
        marginBottom: 6,
    },
    cardTitle: {
        marginBottom: 4,
        textAlign: 'center',
        fontSize: 12,
    },
    cardValue: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
    },
    summaryCardTitle: {
        marginBottom: 4,
        textAlign: 'center',
        fontSize: 12,
    },
    summaryCardValue: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 14,
    },
    progressSection: {
        marginTop: 8,
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    progressBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 4,
    },
    progressText: {
        marginLeft: 12,
        fontWeight: 'bold',
        fontSize: 14,
    },
    placeholderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 20,
        paddingHorizontal: 16,
        minHeight: 150,
    },
    placeholderTitle: {
        marginTop: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    placeholderSubtitle: {
        marginTop: 4,
        textAlign: 'center',
        fontSize: 14,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderTopWidth: 1,
    },
    kubaliButton: {
        marginVertical: 10,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    payButton: {
        borderRadius: 50,
        backgroundColor: '#009c41',
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    buttonContent: {
        height: 50,
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#009c41',
        borderRadius: 28,
    },
    flatListContentContainer: {
        padding: 16,
    },
    memberCard: {
        marginVertical: 8,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        elevation: 1,
    },
    memberCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    memberAvatar: {
        marginRight: 16,
    },
    memberInfo: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
    },
    dropdownContainer: {
        flex: 1,
    },
    dropdownButton: {
        width: '100%',
        justifyContent: 'space-between',
        borderColor: '#CCCCCC',
        borderWidth: 1,
        backgroundColor: 'white',
    },dropdownButtonContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    dropdownButtonLabel: {
        color: 'black',
        marginRight: 'auto',
    },
});

