import React, {useState} from 'react';
import { View, StyleSheet, Text } from "react-native";
import {ActivityIndicator, Button, Card, Dialog, Portal, RadioButton} from "react-native-paper";
import {formatDate, getDaysDifference, queryClient} from "@/actions/Utility";
import { Ionicons } from "@expo/vector-icons";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import {Controller, useForm} from "react-hook-form";
import {Post} from "@/actions/helpers";
import toast from "@/actions/toast";

const day = "Siku";
const text = "Kiasi cha Mchango";
const dateHeader = "Tarehe ya Mwisho";
const payCaption = "Lipa Sasa";

const PROVIDERS = ["Airtel", "Tigo", "Halopesa", "Azampesa", "Mpesa"];
export default function GroupList({ groups }: { groups: any[] }) {
  const header = "Malipo Yajayo";
  const caption = "Angalia Vyote";

    const [visible, setVisible] = useState(false);
    const [visiblePayDialog, setVisiblePayDialog] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<any>(null);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            provider: "Tigo",
        },
    });

    const openDialog = (group: any) => {
        setSelectedGroup(group);
        reset({ provider: "Tigo" });
        setVisible(true);
    };

    const closeDialog = () => {
        setVisible(false);
        setSelectedGroup(null);
    };

    const openPaymentDialog = () => {
        setVisiblePayDialog(true);
    };
    const closePaymentDialog = () => {
        setVisiblePayDialog(false);
    };

    const onSubmit = async (data: any) => {
        if (!selectedGroup) return;

        const amount = Number(selectedGroup.expected_amount);
        const feeAmount = Number((amount * 0.02).toFixed(2));
        closeDialog();
        const payload = {
            groupId: selectedGroup.group_id,
            amount:amount,
            feeAmount:feeAmount,
            // provider: data.provider,
            date: selectedGroup.next_due_date,
        };
        openPaymentDialog()

        try {
           const response = await Post("pay",payload,"token")
            closePaymentDialog()

            toast(response?.data?.data?.message,"done",response?.data?.data?.message)
            queryClient.invalidateQueries(['homepage'])

        } catch (err) {
            console.error("Payment error:", err);
            toast("Payment Failed","error","Payment Failed")
        }
    };


        const renderCardItem = ({ item }: LegendListRenderItemProps<any>) => (
    <Card style={styles.cardRow}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.topRow}>
          <Text style={styles.groupName}>{item?.group_name || 'N/A'}</Text>
          {item?.next_due_date && (
            <View style={styles.daysChip}>
              <Ionicons name="stopwatch-outline" size={14} color={"#8B4513"} style={{ marginRight: 3 }} />
              <Text style={styles.daysText}>
                {day} {getDaysDifference(item.next_due_date)}
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
           onPress={() => openDialog(item)}
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

        <Portal>
            <Dialog visible={visible} onDismiss={closeDialog}>
                <Dialog.Title>Thibitisha Malipo</Dialog.Title>
                <Dialog.Content>
                    <Text>Mchango: {selectedGroup?.currency} {selectedGroup?.expected_amount}</Text>
                    <Text>Ada ya Huduma (2%): {selectedGroup ? (selectedGroup.expected_amount * 0.02).toFixed(2) : '0'}</Text>
                    {/*<Text style={{ marginTop: 12, marginBottom: 5 }}>Chagua Mtoa Huduma:</Text>*/}
                    {/*<Controller*/}
                    {/*    name="provider"*/}
                    {/*    control={control}*/}
                    {/*    render={({ field: { onChange, value } }) => (*/}
                    {/*        <RadioButton.Group onValueChange={onChange} value={value}>*/}
                    {/*            {PROVIDERS.map((provider) => (*/}
                    {/*                <View key={provider} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>*/}
                    {/*                    <RadioButton value={provider} />*/}
                    {/*                    <Text>{provider}</Text>*/}
                    {/*                </View>*/}
                    {/*            ))}*/}
                    {/*        </RadioButton.Group>*/}
                    {/*    )}*/}
                    {/*/>*/}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={closeDialog}>Ghairi</Button>
                    <Button onPress={handleSubmit(onSubmit)}>Lipa</Button>
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