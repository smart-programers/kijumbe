"use client"

import React, { useState } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Text,
    Card,
    Button,
    FAB,
    Portal,
    Modal,
    Divider,
    Chip,
    Switch,
    ActivityIndicator,
    TextInput
} from "react-native-paper"
import { Controller, useForm } from "react-hook-form"
import { Delete, Patch, Post, GetById } from "@/actions/helpers"
import { Ionicons } from "@expo/vector-icons"
import toast from "@/actions/toast"
import { SafeAreaView } from "react-native-safe-area-context"

enum RuleType {
    latePenalty = "latePenalty",
    missedPaymentPenalty = "missedPaymentPenalty",
    attendance = "attendance",
    other = "other",
}

interface Rule {
    id?: string
    groupId: string
    title: string
    description: string
    penaltyAmount: number
    type: RuleType
    isActive: boolean
}

export default function GroupRulesScreen() {
    const { id }: any = useLocalSearchParams()
    const queryClient = useQueryClient()
    const router = useRouter()
    const [visible, setVisible] = useState(false)
    const [editingRule, setEditingRule] = useState<Rule | null>(null)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Rule>()

    const { data, isLoading, error } = useQuery({
        queryKey: ["rules", id],
        queryFn: async () => {
            const data = await GetById("group-rules", id, "token")
            return data ?? null
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
    })

    const createRuleMutation = useMutation({
        mutationFn: (newRule: Rule) => Post("rule", newRule, "token"),
        onSuccess: () => {
            toast("Added Successfully", "done", "Added Successfully")
            queryClient.invalidateQueries({ queryKey: ["rules", id] })
            setVisible(false)
            reset()
        },
    })

    const updateRuleMutation = useMutation({
        mutationFn: (updatedRule: Rule) =>
            Patch("rule", updatedRule.id!, updatedRule, "token"),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rules", id] })
            toast("Edited Successfully", "done", "Edited Successfully")
            setVisible(false)
            setEditingRule(null)
            reset()
        },
    })

    const deleteRuleMutation = useMutation({
        mutationFn: (ruleId: string) => Delete("rule", ruleId, "token"),
        onSuccess: () => {
            toast("Deleted Successfully", "done", "Deleted Successfully")
            queryClient.invalidateQueries({ queryKey: ["rules", id] })
        },
    })

    const isAdmin = data?.member[0]?.role === "admin"

    const showModal = (rule?: Rule) => {
        if (rule) {
            setEditingRule(rule)
            reset({
                id: rule.id,
                groupId: rule.groupId,
                title: rule.title,
                description: rule.description,
                penaltyAmount: rule.penaltyAmount,
                type: rule.type,
                isActive: rule.isActive,
            })
        } else {
            setEditingRule(null)
            reset({
                groupId: id,
                title: "",
                description: "",
                penaltyAmount: 0,
                type: RuleType.other,
                isActive: true,
            })
        }
        setVisible(true)
    }

    const hideModal = () => {
        setVisible(false)
        setEditingRule(null)
        reset()
    }

    const onSubmit = (data: Rule) => {
        if (editingRule) {
            updateRuleMutation.mutate(data)
        } else {
            createRuleMutation.mutate(data)
        }
    }

    const handleDelete = (ruleId: string) => {
        Alert.alert("Delete Rule", "Are you sure you want to delete this rule?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                onPress: () => deleteRuleMutation.mutate(ruleId),
                style: "destructive",
            },
        ])
    }

    const getRuleTypeLabel = (type: RuleType) => {
        switch (type) {
            case RuleType.latePenalty:
                return "Late Penalty"
            case RuleType.missedPaymentPenalty:
                return "Missed Payment"
            case RuleType.attendance:
                return "Attendance"
            default:
                return "Other"
        }
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <Text>Error loading group data</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color="#000"
                    onPress={() => router.back()}
                    style={styles.backIcon}
                />
                <Text style={styles.title}>Sheria za {data?.name}</Text>
            </View>

            <Text style={styles.subtitle}>
                These rules govern the group's operations and penalties
            </Text>

            <ScrollView style={styles.rulesContainer}>
                {data?.rule && data?.rule.length > 0 ? (
                    data.rule.map((rule: Rule) => (
                        <Card key={rule.id} style={styles.ruleCard}>
                            <Card.Content>
                                <View style={styles.ruleHeader}>
                                    <Text variant="titleMedium">{rule.title}</Text>
                                    <Chip
                                        mode="outlined"
                                        style={[
                                            styles.typeChip,
                                            !rule.isActive && styles.inactiveChip,
                                        ]}
                                    >
                                        {getRuleTypeLabel(rule.type)}
                                        {!rule.isActive && " (Inactive)"}
                                    </Chip>
                                </View>
                                <Text variant="bodyMedium" style={styles.description}>
                                    {rule.description}
                                </Text>
                                <Text variant="bodyMedium" style={styles.penalty}>
                                    Penalty: ${rule.penaltyAmount.toFixed(2)}
                                </Text>
                            </Card.Content>

                            {isAdmin && (
                                <Card.Actions>
                                    <Button mode="text" onPress={() => showModal(rule)} icon="pencil">
                                        Edit
                                    </Button>
                                    <Button
                                        mode="text"
                                        onPress={() => handleDelete(rule.id!)}
                                        textColor="red"
                                        icon="delete"
                                    >
                                        Delete
                                    </Button>
                                </Card.Actions>
                            )}
                        </Card>
                    ))
                ) : (
                    <Card style={styles.emptyCard}>
                        <Card.Content>
                            <Text style={styles.emptyText}>No rules have been created yet.</Text>
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>

            {isAdmin && (
                <FAB
                    icon={() => <Ionicons name="add" size={24} color="#FFFFFF" />}
                    color="#FFFFFF"
                    style={styles.fab}
                    onPress={() => showModal()}
                    label="Unda Sheria"
                />
            )}

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={hideModal}
                    contentContainerStyle={styles.modalContainer}
                >
                    <Text style={styles.modalTitle}>
                        {editingRule ? "Edit Rule" : "Add New Rule"}
                    </Text>
                    <Divider style={styles.divider} />

                    <ScrollView style={styles.formContainer}>
                        <Controller
                            control={control}
                            rules={{ required: "Title is required" }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Title"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    error={!!errors.title}
                                    style={styles.input}
                                />
                            )}
                            name="title"
                        />
                        {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

                        <Controller
                            control={control}
                            rules={{ required: "Description is required" }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Description"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    multiline
                                    numberOfLines={3}
                                    error={!!errors.description}
                                    style={styles.input}
                                />
                            )}
                            name="description"
                        />
                        {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

                        <Controller
                            control={control}
                            rules={{
                                required: "Penalty amount is required",
                                min: { value: 0, message: "Amount must be positive" },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Penalty Amount ($)"
                                    mode="outlined"
                                    onBlur={onBlur}
                                    onChangeText={(text) => onChange(Number.parseFloat(text) || 0)}
                                    value={value?.toString()}
                                    keyboardType="numeric"
                                    error={!!errors.penaltyAmount}
                                    style={styles.input}
                                />
                            )}
                            name="penaltyAmount"
                        />
                        {errors.penaltyAmount && (
                            <Text style={styles.errorText}>{errors.penaltyAmount.message}</Text>
                        )}

                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.selectContainer}>
                                    <Text style={styles.selectLabel}>Rule Type:</Text>
                                    <View style={styles.chipContainer}>
                                        {Object.values(RuleType).map((type) => (
                                            <Chip
                                                key={type}
                                                selected={value === type}
                                                onPress={() => onChange(type)}
                                                style={styles.selectChip}
                                                selectedColor={value === type ? "#fff" : undefined}
                                                mode={value === type ? "flat" : "outlined"}
                                            >
                                                {getRuleTypeLabel(type as RuleType)}
                                            </Chip>
                                        ))}
                                    </View>
                                </View>
                            )}
                            name="type"
                        />

                        <Controller
                            control={control}
                            render={({ field: { onChange, value } }) => (
                                <View style={styles.switchContainer}>
                                    <Text>Active</Text>
                                    <Switch color={"#009c41"} value={value} onValueChange={onChange} />
                                </View>
                            )}
                            name="isActive"
                        />
                    </ScrollView>

                    <Divider style={styles.divider} />
                    <View style={styles.modalActions}>
                        <Button onPress={hideModal} mode="outlined">
                            Cancel
                        </Button>
                        <Button
                            buttonColor={"#009c41"}
                            onPress={handleSubmit(onSubmit)}
                            mode="contained"
                            loading={createRuleMutation.isPending || updateRuleMutation.isPending}
                        >
                            {editingRule ? "Update" : "Create"}
                        </Button>
                    </View>
                </Modal>
            </Portal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    backIcon: {
        marginRight: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 16,
    },
    rulesContainer: {
        flex: 1,
    },
    ruleCard: {
        marginBottom: 12,
        elevation: 2,
    },
    ruleHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    description: {
        marginBottom: 8,
    },
    penalty: {
        fontWeight: "bold",
    },
    typeChip: {
        height: 30,
    },
    inactiveChip: {
        backgroundColor: "#f0f0f0",
        borderColor: "#ccc",
    },
    emptyCard: {
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        color: "#666",
        textAlign: "center",
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#009c41",
    },
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        margin: 20,
        borderRadius: 8,
        maxHeight: "80%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    divider: {
        marginVertical: 10,
    },
    formContainer: {
        marginVertical: 10,
    },
    input: {
        marginBottom: 12,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: -8,
        marginBottom: 8,
        marginLeft: 4,
    },
    selectContainer: {
        marginBottom: 16,
    },
    selectLabel: {
        fontSize: 16,
        marginBottom: 8,
    },
    chipContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    selectChip: {
        marginRight: 8,
        marginBottom: 8,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
    },
})
