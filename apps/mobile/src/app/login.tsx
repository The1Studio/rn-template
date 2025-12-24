import {
  StyleSheet,
  View,
  Pressable,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores';
import { useLogin } from '@/hooks/queries';
import { FormTextInput, FormPasswordInput } from '@repo/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod schema for login form validation
const loginSchema = z.object({
  email: z
    .email({ message: 'Please enter a valid email' })
    .min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const login = useAuthStore((state) => state.login);

  const { mutate: _loginRequest, error: apiError, isPending } = useLogin();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@example.com',
      password: 'password123',
    },
  });

  // Redirect to tabs if already authenticated
  if (isHydrated && isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const onSubmit = (data: LoginFormData) => {
    // Mock successful login (for demo)
    login(
      {
        id: 'user-123',
        email: data.email,
        name: data.email.split('@')[0],
        avatar: 'https://i.pravatar.cc/150',
      },
      'mock-jwt-token-xyz'
    );

    // Uncomment to use real API:
    // loginRequest(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>RN Template</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <FormTextInput
            control={control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <FormPasswordInput
            control={control}
            name="password"
            label="Password"
            placeholder="Enter your password"
          />

          {apiError ? (
            <Text style={styles.error}>
              {apiError.message || 'Login failed'}
            </Text>
          ) : null}

          <Pressable
            style={[styles.button, isPending && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </Pressable>

          <Text style={styles.hint}>Demo: Use any email/password to login</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This is a demo login screen.{'\n'}
            Auth state is persisted with expo-secure-store.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#007AFF',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    gap: 16,
  },
  error: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    lineHeight: 18,
  },
});
