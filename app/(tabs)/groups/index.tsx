import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import GroupCard from '@/components/groups/groupCard';
import { ListRenderItem } from 'react-native';
import { Get } from '@/actions/helpers';

interface Group {
  id: string;
  name: string;
  group_status: 'active' | 'completed' | 'pending';
  contribution_amount: number;
  currency: string;
  members: number;
  max_members: number;
  progress: number;
}

const MOCK_GROUPS: Group[] = [
  { id: '1', name: 'Mchezo wa Biashara', group_status: 'active', contribution_amount: 1000, currency: 'TZS', members: 0, max_members: 10, progress: 0 },
  { id: '2', name: 'Family Support', group_status: 'active', contribution_amount: 5000, currency: 'TZS', members: 5, max_members: 15, progress: 30 },
  { id: '3', name: 'Kilimo Bora', group_status: 'completed', contribution_amount: 2000, currency: 'TZS', members: 8, max_members: 8, progress: 100 },
  { id: '4', name: 'Ada ya Shule', group_status: 'pending', contribution_amount: 10000, currency: 'TZS', members: 1, max_members: 20, progress: 5 },
  { id: '5', name: 'Ujenzi Group', group_status: 'active', contribution_amount: 50000, currency: 'TZS', members: 12, max_members: 12, progress: 75 },
];

type FilterStatus = 'active' | 'completed' | 'pending';

interface FilterItem {
  type: 'filter';
  group_status: FilterStatus;
  label: string;
}

interface GroupItem {
  type: 'group';
  group: Group;
}

type ListItem = FilterItem | GroupItem;

export default function VikundiPage({ navigation }: any) {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('active');
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);

  const filters: FilterItem[] = useMemo(
    () => [
      { type: 'filter', group_status: 'active', label: 'Michezo Hai' },
      { type: 'filter', group_status: 'completed', label: 'Michezo Zilizokamilika' },
      { type: 'filter', group_status: 'pending', label: 'Michezo Inayosubiri' },
    ],
    []
  );
  useEffect(()=>{
    async function getData(){
      const data = await Get("groups","token")
        console.log(data.data)
      if(data?.success===true){
  
    setGroups(data?.data)
      }
    }
    getData()
  },[])
  const filteredGroups = useMemo(() => {
    return groups.filter(group => group.group_status === activeFilter).map(group => ({ type: 'group', group }));
  }, [groups, activeFilter]);

  const listData: ListItem[] = useMemo(() => {
    return [...filteredGroups];
  }, [filteredGroups]);

  const handleCreateGroup = useCallback(() => {
    console.log("Navigate to Create Group Form");

  }, [navigation]);

  const renderItem: ListRenderItem<ListItem> = ({ item }) => {
    if (item.type === 'group') {
      return <GroupCard group={item.group} />;
    }
    return null;
  };

  const renderHeader = () => (
    <View style={styles.filterListContainer}>
      <FlatList
        data={filters}
        renderItem={({ item }: { item: FilterItem }) => {
          const isActive = activeFilter === item.group_status;
          return (
            <TouchableOpacity
              style={[styles.filterButton, isActive && styles.activeFilterButton]}
              onPress={() => setActiveFilter(item.group_status)}
            >
              {isActive && <Ionicons name="checkmark-circle" size={16} color="#009c41" style={styles.activeIcon} />}
              <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
        contentContainerStyle={styles.filterListContent}
        keyExtractor={(item) => item.status}
      />
    </View>
  );

  const ListEmptyComponent: React.FC<any> = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Hakuna michezo katika kategoria hii.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.appbar} elevated={false}>
        <View style={styles.appbarContent}>
          <View style={styles.appbarIcons}>
            <Appbar.Action icon="magnify" onPress={() => console.log('Search')} color="#333" />
            <Appbar.Action icon="account-multiple-plus-outline" onPress={() => console.log('Add Member')} color="#333" />
          </View>
        </View>
      </Appbar.Header>

      <FlatList
        data={listData}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        style={styles.groupList}
        recycleItems={true}
        contentContainerStyle={styles.groupListContent}
        ListEmptyComponent={ListEmptyComponent}
        keyExtractor={(item) => item.type === 'group' ? item.group.id : item.status}
      />

      <FAB
        style={styles.fab}
        icon={() => <Ionicons name="add" size={24} color="#FFFFFF" />}
        label="Unda Mchezo Mpya"
        color="#FFFFFF"
        onPress={handleCreateGroup}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appbar: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  appbarContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  appbarIcons: {
    flexDirection: 'row',
  },
  filterListContainer: {
    backgroundColor: '#FFFFFF',
    // borderBottomWidth: 1,
    // borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    // margin: 10
  },
  filterList: {
    flexGrow: 0,
  },
  filterListContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    backgroundColor: '#FFFFFF',
    marginRight: 8,
  },
  activeFilterButton: {
    borderColor: '#009c41',
    backgroundColor: '#E8F5E9',
  },
  filterText: {
    fontSize: 12.5,
    color: '#555555',
    marginLeft: 4,
  },
  activeFilterText: {
    color: '#00796B',
    fontWeight: 'bold',
  },
  activeIcon: {
    marginRight: 4,
  },
  groupList: {
    flex: 1,
    paddingTop: 15,
  },
  groupListContent: {
    paddingHorizontal: 15,
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#009c41',
    borderRadius: 28,
  },
});