import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { Avatar, Card, ProgressBar, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import {useRouter} from "expo-router";


interface Group {
  id: string;
  name: string;
  group_status: 'active' | 'completed' | 'pending'; 
  contributionAmount: number;
  currency: string;
  members: number;
  memberLimit: number;
  progress: number; 
}

interface GroupCardProps {
  group: Group;
}

const getStatusStyle = (status: Group['group_status']) => {
  switch (status) {
    case 'active':
      return { text: 'Hai', color: '#009c41', textColor: '#FFFFFF' };
    case 'completed':
      return { text: 'Iliokamilika', color: '#4682B4', textColor: '#FFFFFF' }; 
    case 'pending':
      return { text: 'Inayosubiri', color: '#FFA500', textColor: '#FFFFFF' }; 
    default:
      return { text: 'N/A', color: '#888888', textColor: '#FFFFFF' };
  }
};

export default function GroupCard({ group }: GroupCardProps) {
  const firstLetter = group.name ? group.name.charAt(0).toUpperCase() : 'G';
  const statusStyle = getStatusStyle(group.group_status);
  const progressValue = (group.progress || 0) / 100; 
  const router =useRouter();

  const handleCardPress = () => {
    if (group.group_status === 'active' || group.group_status === 'completed') {
      router.push(`/groupId/${group.id}`);
    } else {
      console.log('Cannot navigate. Group status is:', group.group_status);
    }
  };
  return (
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.8}>
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Avatar.Text
            size={48}
            label={firstLetter}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
            color="#FFFFFF"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.groupName}>{group.name || 'Jina la Mchezo'}</Text>
            <Chip
              style={[styles.statusChip, { backgroundColor: statusStyle.color }]}
              textStyle={[styles.statusChipText, { color: statusStyle.textColor }]}
            >
              {statusStyle.text}
            </Chip>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Mchango</Text>
            <Text style={styles.infoValue}>{group.currency || 'TZS'} {group.contributionAmount || 0}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Wanachama</Text>
            <Text style={styles.infoValue}>{group.members || 0}/{group.memberLimit || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>Maendeleo</Text>
          <ProgressBar
            progress={progressValue}
            color="#009c41"
            style={styles.progressBar}
          />
          <Text style={styles.progressPercent}>{group.progress || 0}%</Text>
        </View>
      </Card.Content>
    </Card>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    elevation: 3,
  },
  cardContent: {
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    backgroundColor: '#009c41',
    marginRight: 15,
  },
  avatarLabel: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  groupName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, 
    marginRight: 10,
    paddingTop: 3, 
  },
  statusChip: {
    height: 28,
    justifyContent: 'center',
    paddingHorizontal: 8, 
    borderRadius: 15,
    elevation: 1,
  },
  statusChipText: {
    fontSize: 11.5,
    fontWeight: 'bold',
    lineHeight: 14, 
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 5, 
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 6,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5, 
  },
  progressLabel: {
    fontSize: 13,
    color: '#666',
    marginRight: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
    minWidth: 30, 
    textAlign: 'right',
  },
});