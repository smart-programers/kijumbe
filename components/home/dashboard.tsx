import React, { Fragment } from 'react';
import { View, StyleSheet, Text } from "react-native";
import { Card, Text as TextPaper } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

export default function GroupDashboard({ details }: { details: any[] }) {
  const title = "Jumla ya Akiba";
  const view = "Tazama";
  const currency = `TZS`;

  const summary = details && details.length > 0 ? details[0] : {};

  const totalSavings = summary?.total_savings || summary?.total_paid || '0';
  const totalPaid = summary?.total_paid || '0';
  const totalReceived = summary?.total_received || '0';
  const fines = summary?.fines || '0';
  const incomingValue = summary?.incoming || "Hakuna";

  const contribution = "Mchango";
  const paid = "Malipo";
  const fine = "Adhabu";
  const incoming = "Yajayo";
  const shortcut = "Hatua za Haraka";
  const pay = "Lipa Mchango";
  const groupAction = "Unda Kikundi";
  const receipt = "Risiti Zangu";
  const joinGroup = "Jiunge na Kikundi";

  return (
    <Fragment>
      <View style={styles.dashboard}>
        <View style={styles.headerView}>
          <Ionicons name="cash-outline" size={20} color={"white"} style={styles.headerIcon} />
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={styles.headerChip}>
            <Text style={styles.headerChipText}>{view}</Text>
            <Ionicons name="chevron-forward-outline" size={14} color={"#009c41"} />
          </View>
        </View>
        <Text style={styles.amount}>
          {currency} {totalSavings}
        </Text>

        <Card style={styles.outerCard}>
          <Card.Content style={styles.subContainer}>
            <View style={styles.boxColumn}>
              <View style={styles.cardBox}>
                 <Ionicons name="arrow-up-circle" size={22} color="#009c41" style={styles.cardBoxIcon} />
                 <View style={styles.cardBoxTextContainer}>
                   <TextPaper style={styles.cardBoxTextTitle}>
                     {contribution}
                   </TextPaper>
                   <TextPaper style={styles.cardBoxTextAmount}>
                     {currency} {totalPaid}
                   </TextPaper>
                 </View>
              </View>

              <View style={styles.cardBox}>
                  <Ionicons name="warning" size={22} color="#D32F2F" style={styles.cardBoxIcon} />
                  <View style={styles.cardBoxTextContainer}>
                   <TextPaper style={styles.cardBoxTextTitle}>
                     {fine}
                   </TextPaper>
                   <TextPaper style={styles.cardBoxTextAmount}>
                     {currency} {fines}
                   </TextPaper>
                 </View>
              </View>
            </View>

            <View style={styles.verticalLine} />

            <View style={styles.boxColumn}>
              <View style={styles.cardBox}>
                   <Ionicons name="wallet-outline" size={22} color="#B8860B" style={styles.cardBoxIcon} />
                   <View style={styles.cardBoxTextContainer}>
                     <TextPaper style={styles.cardBoxTextTitle}>
                       {paid}
                     </TextPaper>
                     <TextPaper style={styles.cardBoxTextAmount}>
                       {currency} {totalReceived}
                     </TextPaper>
                   </View>
              </View>

              <View style={styles.cardBox}>
                   <Ionicons name="calendar-outline" size={22} color="#4682B4" style={styles.cardBoxIcon} />
                   <View style={styles.cardBoxTextContainer}>
                     <TextPaper style={styles.cardBoxTextTitle}>
                       {incoming}
                     </TextPaper>
                     <TextPaper style={styles.cardBoxTextAmount}>
                       {incomingValue}
                     </TextPaper>
                   </View>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.quickActionsCard}>
        <Card.Title title={shortcut} titleStyle={styles.quickActionsTitle} />
        <Card.Content style={styles.quickActionsContent}>
          <View style={styles.shortcutItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="cash-outline" size={26} color={"#009c41"} />
            </View>
            <Text style={styles.shortcutText}>{pay}</Text>
          </View>

          <View style={styles.shortcutItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="people-outline" size={26} color={"#B8860B"} />
            </View>
            <Text style={styles.shortcutText}>{groupAction}</Text>
          </View>

          <View style={styles.shortcutItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="person-add-outline" size={26} color={"#4682B4"} />
            </View>
            <Text style={styles.shortcutText}>{joinGroup}</Text>
          </View>

          <View style={styles.shortcutItem}>
            <View style={styles.iconCircle}>
              <Ionicons name="document-text-outline" size={26} color={"#4682B4"} />
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
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 18,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  headerChip: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  headerChipText: {
     color: "white",
     fontSize: 12,
     marginRight: 3,
  },
  amount: {
    color: "white",
    textAlign: "center",
    fontSize: 26,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  outerCard: {
    padding: 10,
    borderRadius: 15,
    backgroundColor: "#20ac5f",
    elevation: 0,
    marginTop: 10,
    marginBottom: 5,
    alignSelf: 'stretch',
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "stretch",
  },
  boxColumn: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 12,
    flex: 1,
    alignItems: 'center',
  },
  verticalLine: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: 5,
  },
  cardBoxIcon: {
    marginRight: 6,
    color: 'white',
  },
  cardBoxTextContainer: {
    flexDirection: 'column',
  },
  cardBoxTextTitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginBottom: 1,
  },
  cardBoxTextAmount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsCard: {
    backgroundColor: "white",
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionsTitle: {
     fontWeight: 'bold',
     fontSize: 16,
     color: '#333',
     paddingLeft: 15,
     paddingTop: 10,
  },
  quickActionsContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  shortcutItem: {
    alignItems: "center",
    flex: 1,
  },
  shortcutText: {
    textAlign: "center",
    fontSize: 11.5,
    marginTop: 5,
    color: '#444',
    lineHeight: 15,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#f0ead6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
});