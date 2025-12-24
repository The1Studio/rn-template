import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Text,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { secureStorage } from '@repo/core';

const STORAGE_KEY = 'demo-notes';

export default function ExploreScreen() {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setIsLoading(true);
    const notes = await secureStorage.getObject<string[]>(STORAGE_KEY);
    setSavedNotes(notes || []);
    setIsLoading(false);
  };

  const saveNote = async () => {
    if (!note.trim()) {
      Alert.alert('Error', 'Please enter a note');
      return;
    }

    const updatedNotes = [...savedNotes, note.trim()];
    await secureStorage.setObject(STORAGE_KEY, updatedNotes);
    setSavedNotes(updatedNotes);
    setNote('');
    Alert.alert('Success', 'Note saved to SecureStore!');
  };

  const deleteNote = async (index: number) => {
    const updatedNotes = savedNotes.filter((_, i) => i !== index);
    await secureStorage.setObject(STORAGE_KEY, updatedNotes);
    setSavedNotes(updatedNotes);
  };

  const clearAllNotes = async () => {
    Alert.alert('Clear All', 'Are you sure you want to delete all notes?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: async () => {
          await secureStorage.remove(STORAGE_KEY);
          setSavedNotes([]);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Storage Demo</Text>
        <Text style={styles.subtitle}>
          Using expo-secure-store for data persistence
        </Text>

        {/* Input Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add New Note</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your note here..."
            placeholderTextColor="#999"
            value={note}
            onChangeText={setNote}
            multiline
          />
          <Pressable style={styles.button} onPress={saveNote}>
            <Text style={styles.buttonText}>Save to SecureStore</Text>
          </Pressable>
        </View>

        {/* Saved Notes Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Saved Notes ({savedNotes.length})
            </Text>
            {savedNotes.length > 0 && (
              <Pressable onPress={clearAllNotes}>
                <Text style={styles.clearButton}>Clear All</Text>
              </Pressable>
            )}
          </View>

          {isLoading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : savedNotes.length === 0 ? (
            <Text style={styles.emptyText}>
              No notes saved yet.{'\n'}Notes will persist after app restart!
            </Text>
          ) : (
            <View style={styles.notesList}>
              {savedNotes.map((savedNote, index) => (
                <View key={index} style={styles.noteItem}>
                  <Text style={styles.noteText}>{savedNote}</Text>
                  <Pressable
                    onPress={() => deleteNote(index)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>X</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Storage Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Storage Type:</Text>
            <Text style={styles.infoValue}>expo-secure-store</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Encryption:</Text>
            <Text style={styles.infoValue}>
              iOS Keychain / Android Keystore
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Size Limit:</Text>
            <Text style={styles.infoValue}>2KB per value</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Works in Expo Go:</Text>
            <Text style={[styles.infoValue, styles.successText]}>Yes</Text>
          </View>
        </View>

        {/* Code Example */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Usage Example</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.code}>
              {`import { secureStorage } from '@repo/core';

// Save data
await secureStorage.setObject('key', data);

// Load data
const data = await secureStorage.getObject('key');

// Delete data
await secureStorage.remove('key');`}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    color: '#dc3545',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
    paddingVertical: 20,
  },
  notesList: {
    gap: 8,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#dc3545',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  successText: {
    color: '#28a745',
  },
  codeBlock: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#d4d4d4',
    lineHeight: 18,
  },
});
