import { View, StyleSheet, Text, ScrollView, FlatList } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { Button, Card } from "react-native-paper";
import { formatDate, getDaysAgo } from "@/actions/Utility";
import { Ionicons } from "@expo/vector-icons";

const day = "Siku";

const text = "Kiasi cha mchango";

const dateHeader = "Tarehe ya Mwisho";

const payCaption = "lipa Sasa";

export default function GroupList() {
  const groups = [
    {
      id: "1",
      name: "Mchango",
      amount: "1,325,000",
      date: Date.now(),
      currency: "TZS",
      deadline: Date.now(),
    },
    {
      id: "2",
      name: "Adhabu",
      amount: "20,000",
      date: Date.now(),
      currency: "TZS",
      deadline: Date.now(),
    },
    {
      id: "3",
      name: "Malipo",
      amount: "3,150,000",
      date: Date.now(),
      currency: "TZS",
      deadline: Date.now(),
    },
    {
      id: "4",
      name: "Yajayo",
      amount: "Hakuna",
      date: Date.now(),
      currency: "TZS",
      deadline: Date.now(),
    },
  ];

  const header = "Malipo Yajayo";

  const text = "Angalia Vyote";
  return (
    <View style={styles.container}>
      <View style={styles.headerView}>
        <Text>{header}</Text>
        <View style={styles.view}>
          <Text>{text}</Text>
          <IconSymbol name="chevron.right" size={20} color={"green"} />
        </View>
      </View>

      <FlatList
        data={groups}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
        scrollEnabled={true}
      />
    </View>
  );
}

const renderCardItem = ({ item }: any) => (
  <Card style={styles.cardRow}>
    <Card.Content style={styles.card}>
      <View style={styles.group}>
        <Text>{item?.name}</Text>
        <View style={styles.innerGroup}>
          <Ionicons name="stopwatch" size={20} color={"green"} />
          <Text>
            {day} {getDaysAgo(item?.date)}
          </Text>
        </View>
      </View>

      <View style={styles.group}>
        <View>
          <View>
            <Text>{text}</Text>
            <Text>
              {item?.currency} {item?.amount}
            </Text>
          </View>
        </View>

        <View>
          <View>
            <Text>{dateHeader}</Text>
            <Text>{formatDate(item?.deadline)}</Text>
          </View>
        </View>
      </View>
      <Button style={[styles.btn, styles.roundedBtn]} textColor="white">
        {payCaption}
      </Button>
    </Card.Content>
  </Card>
);

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
