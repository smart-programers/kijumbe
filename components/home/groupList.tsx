import React from 'react';
import { View, StyleSheet, Text } from "react-native";
import { Button, Card } from "react-native-paper";
import { formatDate, getDaysAgo } from "@/actions/Utility";
import { Ionicons } from "@expo/vector-icons";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";

const day = "Siku";
const text = "Kiasi cha Mchango";
const dateHeader = "Tarehe ya Mwisho";
const payCaption = "Lipa Sasa";

export default function GroupList({ groups }: { groups: any[] }) {
  const header = "Malipo Yajayo";
  const caption = "Angalia Vyote";

  const renderCardItem = ({ item }: LegendListRenderItemProps<any>) => (
    <Card style={styles.cardRow}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.topRow}>
          <Text style={styles.groupName}>{item?.group_name || 'N/A'}</Text>
          {item?.next_due_date && (
            <View style={styles.daysChip}>
              <Ionicons name="stopwatch-outline" size={14} color={"#8B4513"} style={{ marginRight: 3 }} />
              <Text style={styles.daysText}>
                {day} {getDaysAgo(item.next_due_date)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.middleRow}>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>{text}</Text>
            <Text style={styles.columnAmount}>
              {item?.currency || 'TZS'} {item?.expected_amount || '0'}
            </Text>
          </View>
          <View style={[styles.column, { alignItems: 'flex-end' }]}>
            <Text style={styles.columnTitle}>{dateHeader}</Text>
            <Text style={styles.columnDate}>{formatDate(item?.next_due_date)}</Text>
          </View>
        </View>

        <Button
           style={styles.payButton}
           textColor="white"
           uppercase={false}
           labelStyle={styles.buttonLabel}
           mode="contained"
         >
          {payCaption}
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.listHeaderView}>
        <Text style={styles.listHeaderTitle}>{header}</Text>
        <View style={styles.listHeaderLink}>
          <Text style={styles.listHeaderLinkText}>{caption}</Text>
          <Ionicons name="chevron-forward-outline" size={18} color={"#009c41"} />
        </View>
      </View>

       {groups && groups.length > 0 ? (
         <LegendList
           data={groups}
           renderItem={renderCardItem}
           keyExtractor={(item, index) => `${item?.group_id}_${item?.next_due_date}_${index}`}
           recycleItems={true}
           contentContainerStyle={styles.listContentContainer}
         />
       ) : (
         <Text style={styles.noDataText}>Hakuna malipo yajayo.</Text>
       )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  listHeaderView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listHeaderTitle: {
     fontSize: 16,
     fontWeight: 'bold',
     color: '#333',
  },
  listHeaderLink: {
    flexDirection: "row",
    alignItems: "center",
  },
  listHeaderLinkText: {
     fontSize: 13,
     color: '#009c41',
     marginRight: 2,
  },
  noDataText: {
     textAlign: 'center',
     color: 'grey',
     marginVertical: 20,
     fontSize: 14,
  },
   listContentContainer: {
      paddingBottom: 10,
   },
  cardRow: {
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.5,
    overflow: 'visible',
  },
  cardContent: {
    padding: 15,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  groupName: {
     fontSize: 15,
     fontWeight: 'bold',
     color: '#222',
     flexShrink: 1,
     marginRight: 10,
  },
  daysChip: {
    flexDirection: "row",
    backgroundColor: "#FAFAD2",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 15,
  },
  daysText: {
    fontSize: 11.5,
    color: '#8B4513',
    fontWeight: '500',
  },
  middleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 5,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  columnTitle: {
     fontSize: 12.5,
     color: 'grey',
     marginBottom: 4,
  },
  columnAmount: {
     fontSize: 14,
     fontWeight: '600',
     color: '#111',
  },
  columnDate: {
     fontSize: 13,
     color: '#333',
  },
  payButton: {
    borderRadius: 10,
    backgroundColor: "#009c41",
    marginTop: 10,
    height: 45,
    justifyContent: 'center',
    elevation: 1,
  },
  buttonLabel: {
     fontSize: 15,
     fontWeight: 'bold',
  }
});