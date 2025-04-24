import { View, StyleSheet, Text } from "react-native";
import { IconSymbol } from "../ui/IconSymbol";
import { Avatar, Button, Card, Text as TextPaper } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { Fragment } from "react";

export default function GroupDashboard({details}:any) {
  const title = "Jumla ya Akiba";

  const view = "Tazama";
  const currency = `TZS`;
  const amount = `1,825,000`;

  const contribution = "Mchango";

  const contributedAmount = "1,325,000";

  const paid = "Malipo";

  const paidAmount = "3,150,000";

  const fine = "Adhabu";

  const fineAmount = "20,000";

  const incoming = "Yajayo";

  const incomingValue = "Hakuna";

  const shortcut = "Hatua za Haraka";

  const pay = "Lipa Mchango";

  const groupAction = "Unda Group";

  const receipt = "Risiti Zangu";

  const joinGroup = "Jiunge na Kikundi";
  return (
    <Fragment>
      <View style={styles.dashboard}>
        <View style={styles.view}>
          <IconSymbol name="dollarsign" size={24} color={"white"} />
          <Text style={styles.text}>{title}</Text>
          <View style={styles.container}>
            <Text style={styles.text}>{view}</Text>
            <IconSymbol name="chevron.right" size={20} color={"white"} />
          </View>
        </View>
        <Text style={styles.amount}>
          {currency} {amount}
        </Text>

        <Card style={styles.outerCard}>
          <Card.Content style={styles.subContainer}>
            <View style={styles.boxColumn}>
              <Card style={styles.cardBox}>
                <Card.Content>
                  <TextPaper variant="bodyMedium" style={styles.text}>
                    {contribution}
                  </TextPaper>
                  <TextPaper variant="bodyMedium" style={styles.text}>
                    {currency} {details[0]?.total_paid}
                  </TextPaper>
                </Card.Content>
              </Card>

              <Card style={styles.cardBox}>
                <Card.Content>
                  <TextPaper variant="bodyMedium" style={styles.text}>
                    {fine}
                  </TextPaper>
                  <TextPaper variant="bodyMedium" style={styles.text}>
                    {currency} {details[0]?.fines}
                  </TextPaper>
                </Card.Content>
              </Card>
            </View>

            <View style={styles.containerline}>
              <View style={styles.verticalLine} />
            </View>

            <View style={styles.boxColumn}>
              <Card style={styles.cardBox}>
                <Card.Content>
                  <TextPaper variant="bodyMedium" style={styles.text}>
                    {paid}
                  </TextPaper>
                  <TextPaper variant="bodyMedium" style={styles.text}>
                    {currency} {details[0]?.total_received}
                  </TextPaper>
                </Card.Content>
              </Card>

              <Card style={styles.cardBox}>
                <Card.Content>
                  <TextPaper variant="bodyMedium" style={styles.text}>
                    {incoming}
                  </TextPaper>
                  <TextPaper variant="bodyMedium" style={styles.text}>
                    {incomingValue}
                  </TextPaper>
                </Card.Content>
              </Card>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.quickActionsColor}>
        <Card.Title title={shortcut} />
        <Card.Content style={styles.quickActions}>
          <View style={styles.shortcutItem}>
            <View style={styles.iconCircle}>
              <IconSymbol name="dollarsign" size={24} color={"#009c41"} />
            </View>
            <Text style={styles.shortcutText}>{pay}</Text>
          </View>

          <View style={styles.shortcutItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="people" size={24} color={"#009c41"} />
            </View>
            <Text style={styles.shortcutText}>{groupAction}</Text>
          </View>

          <View style={styles.shortcutItem}>
            <View style={styles.iconCircle}>
              <IconSymbol name="person" size={24} color={"#009c41"} />
            </View>
            <Text style={styles.shortcutText}>{joinGroup}</Text>
          </View>

          <View style={styles.shortcutItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="file-tray" size={24} color={"#009c41"} />
            </View>
            <Text style={styles.shortcutText}>{receipt}</Text>
          </View>
        </Card.Content>
      </Card>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  dashboard: {
    backgroundColor: "#009c41",

    padding: 20,
    margin: 20,
    borderRadius: 20,
  },
  view: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  container: {
    display: "flex",
    backgroundColor: "#afe1af",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 2,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  text: {
    color: "white",
  },
  amount: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
  outerCard: {
    alignSelf: "center",
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#afe1af",
    elevation: 2,
    marginVertical: 20,
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  boxColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 10,
  },

  cardBox: {
    marginVertical: 5,
    width: 140,
    backgroundColor: "#afe1af",
  },

  containerline: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  verticalLine: {
    width: 1,
    height: 140,
    backgroundColor: "white",
  },
  quickActions: {
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
  },
  quickActionsColor: {
    overflow: "hidden",
    backgroundColor: "white",
    margin: 20,
  },
  shortcutItem: {
    width: "20%",
    alignItems: "center",
  },
  shortcutText: {
    textAlign: "center",
    flexWrap: "wrap",
    fontSize: 12,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
});
