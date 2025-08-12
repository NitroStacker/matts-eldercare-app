import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AnimatedView from '../components/AnimatedView';
import { colors, typography, spacing, borderRadius, shadows, layout, componentStyles, screenStyles } from '../theme/AppleDesignSystem';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const { 
    user, 
    logout, 
    getTodayTasks, 
    getUpcomingAppointments, 
    getCompletedToday,
    getPendingTasks,
    tasks,
    appointments
  } = useAppContext();

  const today = new Date();
  const greeting = () => {
    const hour = today.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const todayTasks = getTodayTasks();
  const pendingTasks = getPendingTasks();
  const upcomingAppointments = getUpcomingAppointments();
  const completedToday = getCompletedToday();

  // Generate recent activities based on actual user actions
  const generateRecentActivities = () => {
    const activities = [];
    
    // Add completed tasks from today
    completedToday.forEach(task => {
      if (task.completedAt) {
        activities.push({
          id: `task-${task.id}`,
          title: `Completed "${task.title}"`,
          time: new Date(task.completedAt).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          timestamp: new Date(task.completedAt).getTime(),
          type: 'task-completed',
          icon: 'checkmark-circle',
          color: '#66BB6A'
        });
      }
    });

    // Add recently created tasks (last 24 hours)
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    tasks
      .filter(task => new Date(task.createdAt) > last24Hours)
      .forEach(task => {
        activities.push({
          id: `task-created-${task.id}`,
          title: `Added "${task.title}" task`,
          time: new Date(task.createdAt).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          timestamp: new Date(task.createdAt).getTime(),
          type: 'task-created',
          icon: 'add-circle',
          color: '#007AFF'
        });
      });

    // Add upcoming appointments (next 7 days)
    const next7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    appointments
      .filter(appointment => appointment.date <= next7Days && appointment.date > today)
      .forEach(appointment => {
        activities.push({
          id: `appointment-${appointment.id}`,
          title: `Scheduled "${appointment.title}"`,
          time: appointment.date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          timestamp: appointment.date.getTime(),
          type: 'appointment-scheduled',
          icon: 'calendar',
          color: '#FF9500'
        });
      });

    // Add completed appointments from today
    appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return appointmentDate.toDateString() === today.toDateString() && 
               appointment.status === 'completed';
      })
      .forEach(appointment => {
        activities.push({
          id: `appointment-completed-${appointment.id}`,
          title: `Completed "${appointment.title}" appointment`,
          time: new Date(appointment.date).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          }),
          timestamp: new Date(appointment.date).getTime(),
          type: 'appointment-completed',
          icon: 'checkmark-circle',
          color: '#66BB6A'
        });
      });

    // Sort by timestamp (most recent first) and take the last 5
    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5);
  };

  const recentActivities = generateRecentActivities();

  // If no recent activities, show a default message
  const getDefaultActivities = () => {
    return [
      {
        id: 'welcome',
        title: 'Welcome to your eldercare dashboard!',
        time: 'Just now',
        timestamp: Date.now(),
        type: 'welcome',
        icon: 'heart',
        color: '#007AFF'
      }
    ];
  };

  const displayActivities = recentActivities.length > 0 ? recentActivities : getDefaultActivities();

  const quickStats = [
    { 
      title: 'Pending Tasks', 
      value: pendingTasks.length.toString(), 
      icon: 'checkbox', 
      color: '#FF6B6B', 
      bgColor: '#FFE5E5' 
    },
    { 
      title: 'Upcoming Appointments', 
      value: upcomingAppointments.length.toString(), 
      icon: 'calendar', 
      color: '#4ECDC4', 
      bgColor: '#E0F2F1' 
    },
    { 
      title: 'Completed Today', 
      value: completedToday.length.toString(), 
      icon: 'checkmark-circle', 
      color: '#66BB6A', 
      bgColor: '#E8F5E8' 
    },
    { 
      title: 'Care Providers', 
      value: '8', 
      icon: 'people', 
      color: '#45B7D1', 
      bgColor: '#E3F2FD' 
    },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'Add Task':
        navigation.navigate('Tasks');
        break;
      case 'Schedule Appointment':
        navigation.navigate('Calendar');
        break;
      case 'Find Provider':
        navigation.navigate('Providers');
        break;
      case 'Emergency Contact':
        handleEmergencyContact();
        break;
      default:
        break;
    }
  };

  const handleStatPress = (statTitle: string) => {
    switch (statTitle) {
      case 'Pending Tasks':
        navigation.navigate('Tasks', { filter: 'pending' });
        break;
      case 'Upcoming Appointments':
        navigation.navigate('Calendar', { filter: 'upcoming' });
        break;
      case 'Completed Today':
        navigation.navigate('Tasks', { filter: 'completed' });
        break;
      case 'Care Providers':
        navigation.navigate('Providers');
        break;
      default:
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const handleEmergencyContact = () => {
    Alert.alert(
      'Emergency Contact',
      'Call emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          style: 'default', 
          onPress: () => {
            const phoneNumber = '911'; // You can replace this with the actual emergency contact number
            Linking.openURL(`tel:${phoneNumber}`);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
      {/* Header */}
      <AnimatedView animationType="slideDown" duration={600}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.date}>
              {today.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
              <Ionicons name="person" size={32} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={colors.systemBackground} />
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedView>

      {/* Quick Stats */}
      <AnimatedView animationType="slideUp" delay={200} duration={600}>
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <AnimatedView
                key={index}
                animationType="scale"
                delay={300 + index * 100}
                duration={500}
              >
                <TouchableOpacity 
                  style={[styles.statCard, { backgroundColor: stat.bgColor }]}
                  onPress={() => handleStatPress(stat.title)}
                >
                  <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                    <Ionicons name={stat.icon} size={20} color="white" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                </TouchableOpacity>
              </AnimatedView>
            ))}
          </View>
        </View>
      </AnimatedView>

      {/* Quick Actions */}
      <AnimatedView animationType="slideUp" delay={400} duration={600}>
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {[
              { title: 'Add Task', icon: 'add-circle', color: '#007AFF' },
              { title: 'Schedule Appointment', icon: 'calendar-outline', color: '#FF9500' },
              { title: 'Find Provider', icon: 'search', color: '#34C759' },
              { title: 'Emergency Contact', icon: 'call', color: '#FF3B30' },
            ].map((action, index) => (
              <AnimatedView
                key={index}
                animationType="bounce"
                delay={500 + index * 150}
                duration={600}
              >
                <TouchableOpacity 
                  style={styles.actionCard}
                  onPress={() => handleQuickAction(action.title)}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon} size={24} color="white" />
                  </View>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </TouchableOpacity>
              </AnimatedView>
            ))}
          </View>
        </View>
      </AnimatedView>

      {/* Recent Activities */}
      <AnimatedView animationType="slideUp" delay={600} duration={600}>
        <View style={styles.activitiesContainer}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.activitiesList}>
            {displayActivities.map((activity, index) => (
              <AnimatedView
                key={activity.id}
                animationType="fadeIn"
                delay={700 + index * 200}
                duration={500}
              >
                <View style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Ionicons name={activity.icon} size={20} color={activity.color} />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                  <View style={styles.activityStatus}>
                    <Ionicons 
                      name={activity.type === 'task-completed' || activity.type === 'appointment-completed' ? 'checkmark-circle' : 'time'} 
                      size={16} 
                      color={activity.type === 'task-completed' || activity.type === 'appointment-completed' ? '#66BB6A' : '#FF9500'} 
                    />
                  </View>
                </View>
              </AnimatedView>
            ))}
          </View>
        </View>
      </AnimatedView>

      {/* Health Tips */}
      <AnimatedView animationType="slideUp" delay={800} duration={600}>
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Health Tip of the Day</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons name="heart" size={24} color="#FF6B6B" />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipText}>
                Remember to drink at least 8 glasses of water daily. Proper hydration helps maintain energy levels and supports overall health.
              </Text>
            </View>
          </View>
        </View>
      </AnimatedView>

      {/* Emergency Section */}
      <AnimatedView animationType="bounce" delay={1000} duration={700}>
        <View style={styles.emergencyContainer}>
                     <TouchableOpacity 
             style={styles.emergencyButton}
             onPress={handleEmergencyContact}
           >
            <Ionicons name="warning" size={24} color="white" />
            <Text style={styles.emergencyText}>Emergency Contact</Text>
          </TouchableOpacity>
        </View>
      </AnimatedView>
      </ScrollView>
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
  greeting: {
    ...typography.body,
    color: colors.secondaryLabel,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.title1,
    color: colors.label,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.subheadline,
    color: colors.secondaryLabel,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.secondarySystemBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    ...shadows.small,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.systemRed,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  statsContainer: {
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.title3,
    color: colors.label,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - spacing.screenMargin * 2 - spacing.md) / 2,
    padding: spacing.componentPadding,
    borderRadius: borderRadius.large,
    marginBottom: spacing.md,
    alignItems: 'center',
    backgroundColor: colors.systemBackground,
    ...shadows.small,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.title2,
    color: colors.label,
    marginBottom: spacing.xs,
  },
  statTitle: {
    ...typography.caption1,
    color: colors.secondaryLabel,
    textAlign: 'center',
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 60) / 2,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  activitiesContainer: {
    padding: 20,
    paddingTop: 0,
  },
  activitiesList: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6C757D',
  },
  activityStatus: {
    marginLeft: 8,
  },
  tipsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
  },
  emergencyContainer: {
    padding: 20,
    paddingTop: 0,
  },
  emergencyButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HomeScreen;
