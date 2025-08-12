import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AnimatedView from '../components/AnimatedView';
import { colors, typography, spacing, borderRadius, shadows, layout, componentStyles } from '../theme/AppleDesignSystem';

const { width } = Dimensions.get('window');

interface ProfileData {
  name: string;
  dateOfBirth: string;
  caringFor: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  profilePicture: string | null;
}

const ProfileScreen = () => {
  const { logout } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Doe',
    dateOfBirth: '1985-03-15',
    caringFor: 'Mom - Sarah Doe',
    emergencyContact: {
      name: 'Jane Smith',
      phone: '(555) 123-4567',
      relationship: 'Sister',
    },
    profilePicture: null,
  });

  const handleSave = () => {
    // Here you would typically save to backend
    Alert.alert('Success', 'Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      name: 'John Doe',
      dateOfBirth: '1985-03-15',
      caringFor: 'Mom - Sarah Doe',
      emergencyContact: {
        name: 'Jane Smith',
        phone: '(555) 123-4567',
        relationship: 'Sister',
      },
      profilePicture: null,
    });
    setIsEditing(false);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AnimatedView animationType="fadeIn" duration={600}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons 
              name={isEditing ? 'close' : 'create-outline'} 
              size={24} 
              color={isEditing ? colors.systemRed : colors.systemBlue} 
            />
          </TouchableOpacity>
        </View>

        {/* Profile Picture Section */}
        <AnimatedView animationType="slideUp" delay={100} duration={600}>
          <View style={styles.profilePictureSection}>
            <View style={styles.profilePictureContainer}>
              {profileData.profilePicture ? (
                <Image source={{ uri: profileData.profilePicture }} style={styles.profilePicture} />
              ) : (
                <View style={styles.profilePicturePlaceholder}>
                  <Ionicons name="person" size={60} color={colors.secondaryLabel} />
                </View>
              )}
              {isEditing && (
                <TouchableOpacity style={styles.cameraButton}>
                  <Ionicons name="camera" size={20} color={colors.systemBackground} />
                </TouchableOpacity>
              )}
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </AnimatedView>

        {/* Personal Information */}
        <AnimatedView animationType="slideUp" delay={200} duration={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={profileData.name}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.secondaryLabel}
                />
              ) : (
                <Text style={styles.infoText}>{profileData.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date of Birth</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={profileData.dateOfBirth}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, dateOfBirth: text }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.secondaryLabel}
                />
              ) : (
                <Text style={styles.infoText}>{formatDate(profileData.dateOfBirth)}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Who You're Caring For</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={profileData.caringFor}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, caringFor: text }))}
                  placeholder="e.g., Mom - Sarah Doe"
                  placeholderTextColor={colors.secondaryLabel}
                />
              ) : (
                <Text style={styles.infoText}>{profileData.caringFor}</Text>
              )}
            </View>
          </View>
        </AnimatedView>

        {/* Emergency Contact */}
        <AnimatedView animationType="slideUp" delay={300} duration={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={profileData.emergencyContact.name}
                  onChangeText={(text) => setProfileData(prev => ({ 
                    ...prev, 
                    emergencyContact: { ...prev.emergencyContact, name: text }
                  }))}
                  placeholder="Emergency contact name"
                  placeholderTextColor={colors.secondaryLabel}
                />
              ) : (
                <Text style={styles.infoText}>{profileData.emergencyContact.name}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={profileData.emergencyContact.phone}
                  onChangeText={(text) => setProfileData(prev => ({ 
                    ...prev, 
                    emergencyContact: { ...prev.emergencyContact, phone: text }
                  }))}
                  placeholder="(555) 123-4567"
                  placeholderTextColor={colors.secondaryLabel}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoText}>{profileData.emergencyContact.phone}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Relationship</Text>
              {isEditing ? (
                <TextInput
                  style={styles.textInput}
                  value={profileData.emergencyContact.relationship}
                  onChangeText={(text) => setProfileData(prev => ({ 
                    ...prev, 
                    emergencyContact: { ...prev.emergencyContact, relationship: text }
                  }))}
                  placeholder="e.g., Sister, Spouse, Friend"
                  placeholderTextColor={colors.secondaryLabel}
                />
              ) : (
                <Text style={styles.infoText}>{profileData.emergencyContact.relationship}</Text>
              )}
            </View>
          </View>
        </AnimatedView>

        {/* Action Buttons */}
        <AnimatedView animationType="slideUp" delay={400} duration={600}>
          <View style={styles.actionButtons}>
            {isEditing ? (
              <>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelEditButton} onPress={handleCancel}>
                  <Text style={styles.cancelEditButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={colors.systemBackground} />
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            )}
          </View>
        </AnimatedView>

        <View style={styles.bottomSpacing} />
      </AnimatedView>
    </ScrollView>
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
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.md,
    backgroundColor: colors.systemBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  headerTitle: {
    ...typography.largeTitle,
    color: colors.label,
    fontWeight: '700',
  },
  editButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.small,
  },
  profilePictureSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.systemBackground,
    marginBottom: spacing.md,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePicturePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.systemGray5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.systemBlue,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  changePhotoButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  changePhotoText: {
    ...typography.subheadline,
    color: colors.systemBlue,
    fontWeight: '600',
  },
  section: {
    backgroundColor: colors.systemBackground,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.title2,
    color: colors.label,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.subheadline,
    color: colors.secondaryLabel,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  textInput: {
    ...typography.body,
    color: colors.label,
    backgroundColor: colors.systemGray6,
    borderRadius: borderRadius.medium,
    paddingHorizontal: spacing.componentPadding,
    paddingVertical: spacing.buttonPadding,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  infoText: {
    ...typography.body,
    color: colors.label,
    paddingVertical: spacing.sm,
  },
  actionButtons: {
    paddingHorizontal: spacing.screenMargin,
    paddingVertical: spacing.lg,
  },
  saveButton: {
    backgroundColor: colors.systemBlue,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.buttonPadding,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.small,
  },
  saveButtonText: {
    ...typography.headline,
    color: colors.systemBackground,
    fontWeight: '600',
  },
  cancelEditButton: {
    backgroundColor: colors.systemGray5,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.buttonPadding,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.separator,
  },
  cancelEditButtonText: {
    ...typography.headline,
    color: colors.label,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: colors.systemRed,
    borderRadius: borderRadius.button,
    paddingVertical: spacing.buttonPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  logoutButtonText: {
    ...typography.headline,
    color: colors.systemBackground,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  bottomSpacing: {
    height: spacing.xl,
  },
});

export default ProfileScreen;
