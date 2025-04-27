import React, {useRef, useState} from 'react';
import {View, StyleSheet, ScrollView, Dimensions, FlatList} from 'react-native';
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
    Avatar,

} from 'react-native-paper';
import { useForm } from 'react-hook-form';
import Constants from 'expo-constants';
import { TabView, TabBar } from 'react-native-tab-view';
import {Ionicons} from "@expo/vector-icons";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Get, GetById, GetQuery, Patch, Post} from "@/actions/helpers";
import {useLocalSearchParams, useRouter} from "expo-router";
import {LegendList} from "@legendapp/list";
import {queryClient, renderContributionCycle} from "@/actions/Utility";
import toast from "@/actions/toast";


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
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: themeToUse.colors.onSurfaceVariant }]}>Mchango</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: themeToUse.colors.onSurfaceVariant }]}>{data?.contributionAmount?.toLocaleString('sw-TZ', {
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
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: themeToUse.colors.onSurfaceVariant }]}>Mzunguko</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: themeToUse.colors.onSurfaceVariant }]}>{renderContributionCycle(data?.frequency) ?? "Kila Siku"}</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.infoCard]}>
                    <Card.Content style={styles.cardContent}>
                        <Icon source="account-group-outline" size={20} color={'#009c41'} />
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: themeToUse.colors.onSurfaceVariant }]}>Wanachama</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: themeToUse.colors.onSurfaceVariant }]}>{data?.approved_member_count ?? 0}/{data?.memberLimit ?? 10}</Text>
                    </Card.Content>
                </Card>
            </View>


            <View style={styles.cardRow}>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: themeToUse.colors.onSecondaryContainer }]}>Jumla ya Michango</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: themeToUse.colors.onSecondaryContainer }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: themeToUse.colors.onSecondaryContainer }]}>Jumla ya Malipo</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: themeToUse.colors.onSecondaryContainer }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: themeToUse.colors.onSecondaryContainer }]}>Salio la Sasa</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: themeToUse.colors.onSecondaryContainer }]}>TZS 0</Text>
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


            <View style={styles.placeholderContainer}>
                <Icon source="file-multiple-outline" size={60} color={themeToUse.colors.onSurfaceDisabled} />
                <Text variant="titleMedium" style={[styles.placeholderTitle, { color: themeToUse.colors.onSurface }]}>Hakuna malipo yaliyopangwa</Text>
                <Text variant="bodyMedium" style={[styles.placeholderSubtitle, { color: themeToUse.colors.onSurfaceDisabled }]}>Ratiba ya malipo itaonekana hapa</Text>
            </View>
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
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: themeToUse.colors.onSurfaceVariant }]}>Mchango</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: themeToUse.colors.onSurfaceVariant }]}>{data?.contributionAmount?.toLocaleString('sw-TZ', {
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
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: themeToUse.colors.onSurfaceVariant }]}>Mzunguko</Text>
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: themeToUse.colors.onSurfaceVariant }]}>{renderContributionCycle(data?.frequency) ?? "Kila Siku"}</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.infoCard]}>
                    <Card.Content style={styles.cardContent}>
                        <Icon source="account-group-outline" size={20} color={'#009c41'} />
                        <Text variant="labelMedium" style={[styles.cardTitle, { color: themeToUse.colors.onSurfaceVariant }]}>Wanachama</Text>
                        <Text variant="titleMedium" style={[styles.cardValue, { color: themeToUse.colors.onSurfaceVariant }]}> {data?.approved_member_count ?? 0}/{data?.memberLimit ?? 10}</Text>
                    </Card.Content>
                </Card>
            </View>

            <View style={styles.cardRow}>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: themeToUse.colors.onSecondaryContainer }]}>Jumla ya Michango</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: themeToUse.colors.onSecondaryContainer }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
                {/* ... other cards ... */}
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: themeToUse.colors.onSecondaryContainer }]}>Jumla ya Malipo</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: themeToUse.colors.onSecondaryContainer }]}>TZS 0</Text>
                    </Card.Content>
                </Card>
                <Card style={[styles.summaryCard]}>
                    <Card.Content style={styles.summaryCardContent}>
                        <Text variant="labelMedium" style={[styles.summaryCardTitle, { color: themeToUse.colors.onSecondaryContainer }]}>Salio la Sasa</Text>
                        <Text variant="titleMedium" style={[styles.summaryCardValue, { color: themeToUse.colors.onSecondaryContainer }]}>TZS 0</Text>
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
                            <Text variant="titleMedium" style={{ color: themeToUse.colors.onSurface }}>
                                {item.user?.firstName} {item.user?.lastName}
                            </Text>
                            <Text variant="bodyMedium" style={{ color: themeToUse.colors.onSurfaceVariant }}>
                                {item.role ? `(${item.role})` : item.user?.phoneNumber}
                            </Text>
                        </View>
                    </Card.Content>
                    {index < data.approved_members.length - 1 && <Divider />}
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

            <View style={styles.placeholderContainer}>
                <Icon source="cash-multiple" size={60} color={themeToUse.colors.onSurfaceDisabled} />
                <Text variant="titleMedium" style={[styles.placeholderTitle, { color: themeToUse.colors.onSurface }]}>Hakuna historia ya malipo</Text>
                <Text variant="bodyMedium" style={[styles.placeholderSubtitle, { color: themeToUse.colors.onSurfaceDisabled }]}>Malipo yajayo na yaliyopita yataonekana hapa</Text>
            </View>
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

    const paperTheme = useTheme();
    const [menuVisible, setMenuVisible] = useState(false);
    const [anchorLayout, setAnchorLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const anchorRef = useRef<any>(null);
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

    const title = data?.name ?? "Mchezo wa Biashara"
    console.log("data",id,data)
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
    } = useForm({ defaultValues: {} });


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
    const handleLeaveGroup = () => { console.log('Leave Group'); closeMenu(); };
    const onSubmit = async(data:any) => { console.log('Lipa Mchango Pressed. Form Data:', data); };


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
            labelStyle={{ color: paperTheme.colors.onSurface, textTransform: 'none', fontWeight: '600' }}
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
                    <Menu.Item onPress={handleLeaveGroup} title="Ondoka Kwenye Kikundi" leadingIcon="logout" titleStyle={{ color: paperTheme.colors.error }}/>
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
                    onPress={handleSubmit(onSubmit)}
                />
            {/*</View>*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: defaultTheme.colors.surface,
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
});

