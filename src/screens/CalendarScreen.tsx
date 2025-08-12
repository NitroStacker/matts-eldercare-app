import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Appointment } from '../types';
import TimePicker from '../components/TimePicker';

const CalendarScreen = ({ navigation, route }: any) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'past'>(
    route?.params?.filter || 'all'
  );
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    description: '',
    provider: '',
    location: '',
    type: 'other' as Appointment['type'],
    duration: 60,
    notes: '',
    time: '09:00',
  });

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return '#FFA726';
      case 'confirmed': return '#66BB6A';
      case 'completed': return '#42A5F5';
      case 'cancelled': return '#EF5350';
    }
  };

  const getTypeIcon = (type: Appointment['type']) => {
    switch (type) {
      case 'doctor': return 'medical';
      case 'therapy': return 'fitness';
      case 'social': return 'people';
      case 'other': return 'calendar';
    }
  };

  const getTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'doctor': return '#FF6B6B';
      case 'therapy': return '#4ECDC4';
      case 'social': return '#45B7D1';
      case 'other': return '#96CEB4';
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const now = new Date();
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'upcoming') return appointment.date > now;
    if (selectedFilter === 'past') return appointment.date < now;
    return true;
  });

  const addAppointment = () => {
    if (!newAppointment.title.trim() || !newAppointment.provider.trim()) {
      Alert.alert('Error', 'Please enter appointment title and provider');
      return;
    }

    // Create appointment date with selected time
    const [hours, minutes] = newAppointment.time.split(':').map(Number);
    const appointmentDate = new Date();
    appointmentDate.setHours(hours, minutes, 0, 0);

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: newAppointment.title,
      description: newAppointment.description,
      date: appointmentDate,
      duration: newAppointment.duration,
      provider: newAppointment.provider,
      location: newAppointment.location,
      type: newAppointment.type,
      status: 'scheduled',
      notes: newAppointment.notes,
    };

    setAppointments(prevAppointments => [appointment, ...prevAppointments]);
    setNewAppointment({
      title: '',
      description: '',
      provider: '',
      location: '',
      type: 'other' as Appointment['type'],
      duration: 60,
      notes: '',
      time: '09:00',
    });
    setModalVisible(false);
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <View style={[styles.appointmentCard, { borderLeftColor: getTypeColor(item.type) }]}>
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentIcon}>
          <Ionicons name={getTypeIcon(item.type)} size={20} color={getTypeColor(item.type)} />
        </View>
        <View style={styles.appointmentInfo}>
          <Text style={styles.appointmentTitle}>{item.title}</Text>
          <Text style={styles.appointmentProvider}>{item.provider}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.appointmentDescription}>{item.description}</Text>

      <View style={styles.appointmentDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.detailText}>
            {formatDate(item.date)} at {formatTime(item.date)} ({item.duration} min)
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>

        {item.notes && (
          <View style={styles.detailRow}>
            <Ionicons name="document-text" size={16} color="#666" />
            <Text style={styles.detailText}>{item.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'upcoming', 'past'] as const).map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.filterTabActive
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextActive
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Appointment List */}
      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointment}
        keyExtractor={item => item.id}
        style={styles.appointmentList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No appointments found</Text>
            <Text style={styles.emptySubtext}>Add a new appointment to get started</Text>
          </View>
        }
      />

      {/* Add Appointment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Appointment</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Appointment Title</Text>
              <TextInput
                style={styles.input}
                value={newAppointment.title}
                onChangeText={(text) => setNewAppointment(prev => ({ ...prev, title: text }))}
                placeholder="Enter appointment title"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newAppointment.description}
                onChangeText={(text) => setNewAppointment(prev => ({ ...prev, description: text }))}
                placeholder="Enter appointment description"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>Provider</Text>
              <TextInput
                style={styles.input}
                value={newAppointment.provider}
                onChangeText={(text) => setNewAppointment(prev => ({ ...prev, provider: text }))}
                placeholder="Enter provider name"
              />

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={newAppointment.location}
                onChangeText={(text) => setNewAppointment(prev => ({ ...prev, location: text }))}
                placeholder="Enter location"
              />

              <Text style={styles.inputLabel}>Time</Text>
              <TimePicker
                value={newAppointment.time}
                onTimeChange={(time) => setNewAppointment(prev => ({ ...prev, time }))}
                placeholder="Select appointment time"
              />

              <Text style={styles.inputLabel}>Type</Text>
              <View style={styles.typeContainer}>
                {(['doctor', 'therapy', 'social', 'other'] as const).map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeOption,
                      newAppointment.type === type && styles.typeOptionActive
                    ]}
                    onPress={() => setNewAppointment(prev => ({ ...prev, type }))}
                  >
                    <Ionicons 
                      name={getTypeIcon(type)} 
                      size={16} 
                      color={newAppointment.type === type ? 'white' : getTypeColor(type)} 
                    />
                    <Text style={[
                      styles.typeOptionText,
                      newAppointment.type === type && styles.typeOptionTextActive
                    ]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Duration (minutes)</Text>
              <View style={styles.durationContainer}>
                {([30, 45, 60, 90, 120] as const).map(duration => (
                  <TouchableOpacity
                    key={duration}
                    style={[
                      styles.durationOption,
                      newAppointment.duration === duration && styles.durationOptionActive
                    ]}
                    onPress={() => setNewAppointment(prev => ({ ...prev, duration }))}
                  >
                    <Text style={[
                      styles.durationOptionText,
                      newAppointment.duration === duration && styles.durationOptionTextActive
                    ]}>
                      {duration}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newAppointment.notes}
                onChangeText={(text) => setNewAppointment(prev => ({ ...prev, notes: text }))}
                placeholder="Enter any additional notes"
                multiline
                numberOfLines={3}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={addAppointment}
              >
                <Text style={styles.saveButtonText}>Add Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    color: '#6C757D',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  appointmentList: {
    flex: 1,
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 2,
  },
  appointmentProvider: {
    fontSize: 14,
    color: '#6C757D',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  appointmentDescription: {
    color: '#6C757D',
    fontSize: 14,
    marginBottom: 12,
  },
  appointmentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#495057',
    fontSize: 14,
    marginLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#6C757D',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ADB5BD',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  typeOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeOptionText: {
    color: '#6C757D',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  typeOptionTextActive: {
    color: 'white',
  },
  durationContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  durationOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    alignItems: 'center',
  },
  durationOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  durationOptionText: {
    color: '#6C757D',
    fontWeight: '500',
  },
  durationOptionTextActive: {
    color: 'white',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DEE2E6',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6C757D',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CalendarScreen;
