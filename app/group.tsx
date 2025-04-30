import React, { useState } from 'react';
import {View, Text, TextInput, FlatList, StyleSheet, useColorScheme} from 'react-native';
import {useMutation, useQuery} from '@tanstack/react-query';
import {Dialog, Button, useTheme} from 'react-native-paper';
import {Get, Post} from "@/actions/helpers";
import SelfGroupCard from "@/components/self-add-group/SelfGroupCard";
import {LegendList} from "@legendapp/list";
import toast from "@/actions/toast";
import {queryClient} from "@/actions/Utility";




const GroupsScreen = () => {
    const {data:groups, isLoading, error} = useQuery({
        queryKey: ['group'],
        queryFn: async () => {
            try {
                const data = await Get("group", "token");
                return data?.data ?? [];
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

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);

    const filteredGroups = groups?.filter((group:any) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGroupPress = (group:any) => {
        setSelectedGroup(group);
    };

    const handleAccept
        = useMutation({
            mutationFn: () => Post("member", {groupId:selectedGroup?.id,role:"member",joinStatus:"original",isRemoved:false}, "token"),
            onSuccess: () => {
                setSelectedGroup(null);
                toast("Added to Group Successfully", "done", "Added to Group Successfully")
                queryClient.invalidateQueries({ queryKey: ["group"] });
                queryClient.invalidateQueries({ queryKey: ["groups"] });

            },
        })





    const handleCancel = () => {
        setSelectedGroup(null);
    };


    const renderRule = ({ item }:any) => (
        <View style={styles.ruleContainer}>
            <Text style={styles.ruleTitle}>{item?.title}</Text>
            <Text>{item?.description}</Text>
            <Text style={styles.penalty}>Penalty: {item?.penaltyAmount} {item?.type}</Text>
        </View>
    );

    return (
        <View style={[styles.container,{backgroundColor: isDarkMode
            ? theme.colors.background
            : theme.colors.surface}]}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search groups"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <LegendList
                    data={filteredGroups}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <SelfGroupCard group={item} onPress={() => handleGroupPress(item)} />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}
            {selectedGroup && (
                <Dialog visible={true} onDismiss={handleCancel}>
                    <Dialog.Title>{selectedGroup.name}</Dialog.Title>
                    <Dialog.Content>
                        <FlatList
                            data={selectedGroup?.rule}
                            keyExtractor={(item) => item?.id}
                            renderItem={renderRule}
                            showsVerticalScrollIndicator={false}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={handleCancel}>Cancel</Button>
                        <Button onPress={() => handleAccept.mutate()}>Accept</Button>
                    </Dialog.Actions>
                </Dialog>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingLeft: 8,
    },
    ruleContainer: {
        marginBottom: 12,
    },
    ruleTitle: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    penalty: {
        fontStyle: 'italic',
        color: '#ff6347',
    },
});

export default GroupsScreen;
