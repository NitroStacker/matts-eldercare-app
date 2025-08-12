import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { useAppContext } from '../context/AppContext';
import AnimatedView from '../components/AnimatedView';
import AnimatedModal from '../components/AnimatedModal';
import TimePicker from '../components/TimePicker';
import { colors, typography, spacing, borderRadius, shadows, layout, componentStyles, screenStyles } from '../theme/AppleDesignSystem';

const TasksScreen = ({ navigation, route }: any) => {
  const { tasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useAppContext();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>(
    route?.params?.filter || 'all'
  );

  // Update filter when route params change
  useEffect(() => {
    if (route?.params?.filter) {
      setSelectedFilter(route.params.filter);
    }
  }, [route?.params?.filter]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: Task['priority'];
    category: Task['category'];
    dueTime: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
    dueTime: '09:00',
  });

  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'pending') return task.status === 'pending' || task.status === 'in-progress';
    return task.status === selectedFilter;
  });

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#FF6B6B';
      case 'medium': return '#FFA726';
      case 'low': return '#66BB6A';
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'pending': return '#FF6B6B';
      case 'in-progress': return '#FFA726';
      case 'completed': return '#66BB6A';
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleToggleTaskStatus = (taskId: string) => {
    toggleTaskStatus(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteTask(taskId),
        },
      ]
    );
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      category: task.category,
      dueTime: task.dueDate.toTimeString().slice(0, 5),
    });
    setEditModalVisible(true);
  };

  const handleSaveEditedTask = () => {
    if (!editingTask || !newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const [hours, minutes] = newTask.dueTime.split(':');
    const dueDate = new Date();
    dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    updateTask(editingTask.id, {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      category: newTask.category,
      dueDate,
    });

    setEditingTask(null);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'other', dueTime: '09:00' });
    setEditModalVisible(false);
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const [hours, minutes] = newTask.dueTime.split(':');
    const dueDate = new Date();
    dueDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    addTask({
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'pending',
      dueDate,
      category: newTask.category,
    });

    setNewTask({ title: '', description: '', priority: 'medium', category: 'other', dueTime: '09:00' });
    setModalVisible(false);
  };

  const renderTask = ({ item, index }: { item: Task; index: number }) => (
    <AnimatedView
      animationType="slideUp"
      delay={index * 100}
      duration={400}
    >
      <View style={[styles.taskCard, { borderLeftColor: getPriorityColor(item.priority) }]}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.title}</Text>
          <View style={styles.taskActions}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditTask(item)}
            >
              <Ionicons name="pencil" size={16} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteTask(item.id)}
            >
              <Ionicons name="trash" size={16} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.taskDescription}>{item.description}</Text>
        
        <View style={styles.taskFooter}>
          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag" size={12} color="#666" />
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          
          <View style={styles.timeBadge}>
            <Ionicons name="time" size={12} color="#666" />
            <Text style={styles.timeText}>{formatTime(item.dueDate.toTimeString().slice(0, 5))}</Text>
          </View>
          
          <View style={styles.priorityBadge}>
            <Ionicons name="flag" size={12} color={getPriorityColor(item.priority)} />
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority}
            </Text>
          </View>
        </View>

        {item.status === 'completed' && (
          <View style={styles.completedIndicator}>
            <Ionicons name="checkmark-circle" size={20} color="#66BB6A" />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleToggleTaskStatus(item.id)}
        >
          <Text style={styles.completeButtonText}>
            {item.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
          </Text>
        </TouchableOpacity>
      </View>
    </AnimatedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AnimatedView animationType="slideDown" duration={600}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Care Tasks</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </AnimatedView>

      {/* Filter Tabs */}
      <AnimatedView animationType="slideUp" delay={200} duration={600}>
        <View style={styles.filterContainer}>
          {(['all', 'pending', 'completed'] as const).map((filter, index) => (
            <AnimatedView
              key={filter}
              animationType="scale"
              delay={300 + index * 100}
              duration={500}
            >
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  selectedFilter === filter && styles.filterTabActive
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                                 <Text style={[
                   styles.filterText,
                   selectedFilter === filter && styles.filterTextActive
                 ]} numberOfLines={1}>
                   {filter === 'pending' ? 'In Progress' : filter === 'all' ? 'All Tasks' : 'Completed'}
                 </Text>
              </TouchableOpacity>
            </AnimatedView>
          ))}
        </View>
      </AnimatedView>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        style={styles.taskList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <AnimatedView animationType="fadeIn" delay={500} duration={800}>
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No tasks found</Text>
              <Text style={styles.emptySubtext}>Add a new task to get started</Text>
            </View>
          </AnimatedView>
        }
      />

      {/* Add Task Modal */}
      <AnimatedModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        animationType="slide"
        duration={400}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add New Task</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <Text style={styles.inputLabel}>Task Title</Text>
          <TextInput
            style={styles.input}
            value={newTask.title}
            onChangeText={(text) => setNewTask(prev => ({ ...prev, title: text }))}
            placeholder="Enter task title"
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={newTask.description}
            onChangeText={(text) => setNewTask(prev => ({ ...prev, description: text }))}
            placeholder="Enter task description"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.inputLabel}>Due Time</Text>
          <TimePicker
            value={newTask.dueTime}
            onTimeChange={(time) => setNewTask(prev => ({ ...prev, dueTime: time }))}
            placeholder="Select due time"
          />

          <Text style={styles.inputLabel}>Priority</Text>
          <View style={styles.priorityContainer}>
            {(['low', 'medium', 'high'] as const).map((priority, index) => (
              <AnimatedView
                key={priority}
                animationType="scale"
                delay={index * 100}
                duration={300}
              >
                <TouchableOpacity
                  style={[
                    styles.priorityOption,
                    newTask.priority === priority && styles.priorityOptionActive
                  ]}
                  onPress={() => setNewTask(prev => ({ ...prev, priority }))}
                >
                  <Text style={[
                    styles.priorityOptionText,
                    newTask.priority === priority && styles.priorityOptionTextActive
                  ]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              </AnimatedView>
            ))}
          </View>

          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.categoryContainer}>
            {(['medication', 'appointment', 'personal-care', 'household', 'other'] as const).map((category, index) => (
              <AnimatedView
                key={category}
                animationType="scale"
                delay={index * 50}
                duration={300}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    newTask.category === category && styles.categoryOptionActive
                  ]}
                  onPress={() => setNewTask(prev => ({ ...prev, category }))}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    newTask.category === category && styles.categoryOptionTextActive
                  ]}>
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              </AnimatedView>
            ))}
          </View>
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
            onPress={handleAddTask}
          >
            <Text style={styles.saveButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </AnimatedModal>

      {/* Edit Task Modal */}
      <AnimatedModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        animationType="slide"
        duration={400}
      >
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit Task</Text>
          <TouchableOpacity onPress={() => setEditModalVisible(false)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <Text style={styles.inputLabel}>Task Title</Text>
          <TextInput
            style={styles.input}
            value={newTask.title}
            onChangeText={(text) => setNewTask(prev => ({ ...prev, title: text }))}
            placeholder="Enter task title"
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={newTask.description}
            onChangeText={(text) => setNewTask(prev => ({ ...prev, description: text }))}
            placeholder="Enter task description"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.inputLabel}>Due Time</Text>
          <TimePicker
            value={newTask.dueTime}
            onTimeChange={(time) => setNewTask(prev => ({ ...prev, dueTime: time }))}
            placeholder="Select due time"
          />

          <Text style={styles.inputLabel}>Priority</Text>
          <View style={styles.priorityContainer}>
            {(['low', 'medium', 'high'] as const).map((priority, index) => (
              <AnimatedView
                key={priority}
                animationType="scale"
                delay={index * 100}
                duration={300}
              >
                <TouchableOpacity
                  style={[
                    styles.priorityOption,
                    newTask.priority === priority && styles.priorityOptionActive
                  ]}
                  onPress={() => setNewTask(prev => ({ ...prev, priority }))}
                >
                  <Text style={[
                    styles.priorityOptionText,
                    newTask.priority === priority && styles.priorityOptionTextActive
                  ]}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </Text>
                </TouchableOpacity>
              </AnimatedView>
            ))}
          </View>

          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.categoryContainer}>
            {(['medication', 'appointment', 'personal-care', 'household', 'other'] as const).map((category, index) => (
              <AnimatedView
                key={category}
                animationType="scale"
                delay={index * 50}
                duration={300}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryOption,
                    newTask.category === category && styles.categoryOptionActive
                  ]}
                  onPress={() => setNewTask(prev => ({ ...prev, category }))}
                >
                  <Text style={[
                    styles.categoryOptionText,
                    newTask.category === category && styles.categoryOptionTextActive
                  ]}>
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </TouchableOpacity>
              </AnimatedView>
            ))}
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setEditModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveEditedTask}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
                 </View>
       </AnimatedModal>
     </SafeAreaView>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemGroupedBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.componentPadding,
    paddingVertical: spacing.md,
    backgroundColor: colors.systemBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  headerTitle: {
    ...typography.title2,
    color: colors.label,
  },
  addButton: {
    backgroundColor: colors.systemBlue,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
    backgroundColor: colors.systemBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
    gap: spacing.sm,
    minHeight: 60,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondarySystemBackground,
    minHeight: 36,
    maxHeight: 36,
  },
  filterTabActive: {
    backgroundColor: colors.systemBlue,
  },
  filterText: {
    ...typography.subheadline,
    color: colors.label,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.systemBackground,
  },
  taskList: {
    flex: 1,
    paddingHorizontal: spacing.screenMargin,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  taskCard: {
    backgroundColor: colors.systemBackground,
    borderRadius: borderRadius.large,
    padding: spacing.componentPadding,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    ...shadows.small,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  taskTitle: {
    ...typography.headline,
    color: colors.label,
    flex: 1,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.badge,
    marginRight: spacing.sm,
  },
  statusText: {
    color: colors.systemBackground,
    ...typography.caption1,
    fontWeight: '500',
  },
  taskDescription: {
    color: colors.secondaryLabel,
    ...typography.subheadline,
    marginBottom: spacing.md,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondarySystemBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.badge,
  },
  categoryText: {
    color: colors.secondaryLabel,
    ...typography.caption1,
    marginLeft: spacing.xs,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.systemBlue,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.badge,
  },
  timeText: {
    color: colors.systemBackground,
    ...typography.caption1,
    marginLeft: spacing.xs,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    ...typography.caption1,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  completedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
  },
  completedText: {
    color: colors.systemGreen,
    ...typography.caption1,
    fontWeight: '500',
    marginLeft: spacing.xs,
  },
  completeButton: {
    backgroundColor: colors.systemGreen,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.componentPadding,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    minHeight: layout.buttonHeight,
  },
  completeButtonText: {
    color: colors.systemBackground,
    ...typography.subheadline,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    ...typography.title3,
    color: colors.secondaryLabel,
    marginTop: spacing.md,
  },
  emptySubtext: {
    ...typography.subheadline,
    color: colors.tertiaryLabel,
    marginTop: spacing.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.componentPadding,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  modalTitle: {
    ...typography.title3,
    color: colors.label,
  },
  modalBody: {
    padding: spacing.componentPadding,
  },
  inputLabel: {
    ...typography.subheadline,
    color: colors.label,
    marginBottom: spacing.sm,
    fontWeight: '600',
  },
  input: {
    ...componentStyles.input,
    marginBottom: spacing.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  timeOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    margin: spacing.xs,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.separator,
    backgroundColor: colors.systemBackground,
  },
  timeOptionActive: {
    backgroundColor: colors.systemBlue,
    borderColor: colors.systemBlue,
  },
  timeOptionText: {
    color: colors.secondaryLabel,
    ...typography.caption1,
    fontWeight: '500',
  },
  timeOptionTextActive: {
    color: colors.systemBackground,
  },
  priorityContainer: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.separator,
    alignItems: 'center',
    backgroundColor: colors.systemBackground,
  },
  priorityOptionActive: {
    backgroundColor: colors.systemBlue,
    borderColor: colors.systemBlue,
  },
  priorityOptionText: {
    color: colors.secondaryLabel,
    ...typography.subheadline,
    fontWeight: '500',
  },
  priorityOptionTextActive: {
    color: colors.systemBackground,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  categoryOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    margin: spacing.xs,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.separator,
    backgroundColor: colors.systemBackground,
  },
  categoryOptionActive: {
    backgroundColor: colors.systemBlue,
    borderColor: colors.systemBlue,
  },
  categoryOptionText: {
    color: colors.secondaryLabel,
    ...typography.caption1,
    fontWeight: '500',
  },
  categoryOptionTextActive: {
    color: colors.systemBackground,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.componentPadding,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.separator,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.buttonPadding,
    marginRight: spacing.sm,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.separator,
    alignItems: 'center',
    backgroundColor: colors.systemBackground,
    minHeight: layout.buttonHeight,
  },
  cancelButtonText: {
    color: colors.secondaryLabel,
    ...typography.headline,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: spacing.buttonPadding,
    marginLeft: spacing.sm,
    borderRadius: borderRadius.button,
    backgroundColor: colors.systemBlue,
    alignItems: 'center',
    minHeight: layout.buttonHeight,
  },
  saveButtonText: {
    color: colors.systemBackground,
    ...typography.headline,
    fontWeight: '600',
  },
});

export default TasksScreen;
