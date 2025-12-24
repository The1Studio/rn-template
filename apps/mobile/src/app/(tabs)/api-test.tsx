import { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Text,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '@/api/axios-config';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

interface ApiResponse {
  status: number;
  data: any;
  duration: number;
}

const TEST_ENDPOINTS = [
  {
    name: 'GET Posts',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
  },
  {
    name: 'GET Users',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/users/1',
  },
  {
    name: 'POST Create',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: { title: 'Test', body: 'Testing axios', userId: 1 },
  },
  {
    name: 'PUT Update',
    method: 'PUT',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    body: { id: 1, title: 'Updated', body: 'Updated body', userId: 1 },
  },
  {
    name: 'DELETE',
    method: 'DELETE',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
  },
];

export default function ApiTestScreen() {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);

  const testApi = async (endpoint: (typeof TEST_ENDPOINTS)[0]) => {
    setStatus('loading');
    setError(null);
    setResponse(null);
    setActiveEndpoint(endpoint.name);

    const startTime = Date.now();

    try {
      let res;
      switch (endpoint.method) {
        case 'GET':
          res = await apiClient.get(endpoint.url);
          break;
        case 'POST':
          res = await apiClient.post(endpoint.url, endpoint.body);
          break;
        case 'PUT':
          res = await apiClient.put(endpoint.url, endpoint.body);
          break;
        case 'DELETE':
          res = await apiClient.delete(endpoint.url);
          break;
        default:
          res = await apiClient.get(endpoint.url);
      }

      const duration = Date.now() - startTime;
      setResponse({
        status: res.status,
        data: res.data,
        duration,
      });
      setStatus('success');
    } catch (err: any) {
      const duration = Date.now() - startTime;
      setError(
        err.response?.data?.message || err.message || 'An error occurred'
      );
      setResponse({
        status: err.response?.status || 0,
        data: err.response?.data || null,
        duration,
      });
      setStatus('error');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#28a745';
      case 'error':
        return '#dc3545';
      case 'loading':
        return '#007AFF';
      default:
        return '#666';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return '#28a745';
      case 'POST':
        return '#007AFF';
      case 'PUT':
        return '#ffc107';
      case 'DELETE':
        return '#dc3545';
      default:
        return '#666';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>API Test</Text>
        <Text style={styles.subtitle}>
          Test axios configuration with JSONPlaceholder API
        </Text>

        {/* Test Buttons */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Test Endpoints</Text>
          <View style={styles.buttonGrid}>
            {TEST_ENDPOINTS.map((endpoint) => (
              <Pressable
                key={endpoint.name}
                style={[
                  styles.testButton,
                  activeEndpoint === endpoint.name &&
                    status === 'loading' &&
                    styles.testButtonActive,
                ]}
                onPress={() => testApi(endpoint)}
                disabled={status === 'loading'}
              >
                <View style={styles.buttonContent}>
                  <Text
                    style={[
                      styles.methodBadge,
                      { backgroundColor: getMethodColor(endpoint.method) },
                    ]}
                  >
                    {endpoint.method}
                  </Text>
                  <Text style={styles.testButtonText}>{endpoint.name}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Request Status</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status:</Text>
            <View style={styles.statusValueContainer}>
              {status === 'loading' && (
                <ActivityIndicator size="small" color="#007AFF" />
              )}
              <Text style={[styles.statusValue, { color: getStatusColor() }]}>
                {status.toUpperCase()}
              </Text>
            </View>
          </View>
          {response && (
            <>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>HTTP Status:</Text>
                <Text
                  style={[
                    styles.statusValue,
                    {
                      color:
                        response.status >= 200 && response.status < 300
                          ? '#28a745'
                          : '#dc3545',
                    },
                  ]}
                >
                  {response.status}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Duration:</Text>
                <Text style={styles.statusValue}>{response.duration}ms</Text>
              </View>
            </>
          )}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Response Card */}
        {response?.data && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Response Data</Text>
            <View style={styles.codeBlock}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <Text style={styles.code}>
                  {JSON.stringify(response.data, null, 2)}
                </Text>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Axios Config Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Timeout:</Text>
            <Text style={styles.infoValue}>60s</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Test API:</Text>
            <Text style={styles.infoValue}>jsonplaceholder.typicode.com</Text>
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  buttonGrid: {
    gap: 10,
  },
  testButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  testButtonActive: {
    backgroundColor: '#e3f2fd',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  methodBadge: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  testButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
  },
  statusValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  codeBlock: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    color: '#d4d4d4',
    lineHeight: 18,
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
});
