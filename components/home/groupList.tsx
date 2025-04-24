
import { View, StyleSheet, Text } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { Button, Card } from "react-native-paper";
import { formatDate, getDaysAgo } from "@/actions/Utility";
import { Ionicons } from "@expo/vector-icons";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";

const day = "Siku";
const text = "Kiasi cha mchango";
const dateHeader = "Tarehe ya Mwisho";
const payCaption = "lipa Sasa";

export default function GroupList({ groups }: any) {
  const header = "Malipo Yajayo";
  const caption = "Angalia Vyote";

  const renderCardItem = ({ item }: LegendListRenderItemProps<any>) => (
    <Card style={styles.cardRow}>
      <Card.Content style={styles.card}>
        <View style={styles.group}>
          <Text>{item?.group_name}</Text>
          <View style={styles.innerGroup}>
            <Ionicons name="stopwatch" size={20} color={"green"} />
            <Text>
              {day} {getDaysAgo(item?.next_due_date)}
            </Text>
          </View>
        </View>

        <View style={styles.group}>
          <View>
            <Text>{text}</Text>
            <Text>
              {item?.currency} {item?.expected_amount}
            </Text>
          </View>
          <View>
            <Text>{dateHeader}</Text>
            <Text>{formatDate(item?.next_due_date)}</Text>
          </View>
        </View>

        <Button style={[styles.btn, styles.roundedBtn]} textColor="white">
          {payCaption}
        </Button>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text>{header}</Text>
        <View style={styles.view}>
          <Text>{caption}</Text>
          <IconSymbol name="chevron.right" size={20} color={"green"} />
        </View>
      </View>

      <LegendList
        data={groups}
        renderItem={renderCardItem}
        keyExtractor={(item, index) => `${item.group_id}_${item.next_due_date}_${index}`}
        recycleItems
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 10 }} 
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  roundedBtn: {
    borderRadius: 12,
    backgroundColor: "green",
    marginVertical: 4,
  },
  btn: {
    justifyContent: "center",
    height: 50,
    borderRadius: 4,
  },
  headerView: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  view: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  group: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  innerGroup: {
    display: "flex",
    backgroundColor: "yellow",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 2,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  cardRow: {
    justifyContent: "space-between",
    marginBottom: 10,
    backgroundColor: "white",
    overflow: "hidden",
    elevation: 40,
  },
  card: {
    backgroundColor: "white",
  },
});
