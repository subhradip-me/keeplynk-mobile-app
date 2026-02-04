import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useDispatch } from "react-redux";
import { register, login } from "../features/auth/authThunk";
import { useTheme } from "../features/theme";

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleAuth = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        Alert.alert("Error", "Please enter your full name");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match");
        return;
      }
      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);

    try {
      let result;

      if (isSignUp) {
        const [firstName, ...lastNameParts] = fullName.trim().split(" ");
        const lastName = lastNameParts.join(" ") || firstName;

        result = await dispatch(register({
          email: email.trim(),
          password,
          firstName,
          lastName,
          initialPersona: "student",
        }));
      } else {
        result = await dispatch(login({
          email: email.trim(),
          password,
        }));
      }

      if (result.meta.requestStatus === "fulfilled") {
        // Navigation handled by App.jsx
      } else {
        Alert.alert("Error", result.payload || "Authentication failed");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {isSignUp ? "Create Account" : "Sign in"}
          </Text>

          {/* Subtitle */}
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <Text style={[styles.link, { color: colors.textPrimary }]} onPress={toggleAuthMode}>
                  Sign in
                </Text>
              </>
            ) : (
              <>
                New user?{" "}
                <Text style={[styles.link, { color: colors.textPrimary }]} onPress={toggleAuthMode}>
                  Create an account
                </Text>
              </>
            )}
          </Text>

          {/* Name (Signup only) */}
          {isSignUp && (
            <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={colors.textTertiary}
                style={[styles.input, { color: colors.textPrimary }]}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>
          )}

          {/* Email */}
          <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
            <TextInput
              placeholder="Email Address"
              placeholderTextColor={colors.textTertiary}
              style={[styles.input, { color: colors.textPrimary }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
            <TextInput
              placeholder="Password"
              placeholderTextColor={colors.textTertiary}
              secureTextEntry
              style={[styles.input, { color: colors.textPrimary }]}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Confirm Password (Signup only) */}
          {isSignUp && (
            <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={colors.textTertiary}
                secureTextEntry
                style={[styles.input, { color: colors.textPrimary }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          )}

          {/* Forgot password (Signin only) */}
          {!isSignUp && (
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.forgot, { color: colors.textSecondary }]}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Primary Button */}
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.textPrimary }, loading && styles.primaryButtonDisabled]}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.primaryText, { color: colors.background }]}>
                {isSignUp ? "Sign Up" : "Login"}
              </Text>
            )}
          </TouchableOpacity>

          {/* OR */}
          <Text style={[styles.or, { color: colors.textTertiary }]}>or</Text>

          {/* Social */}
          <Text style={[styles.socialText, { color: colors.textSecondary }]}>Continue with Social Media</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} activeOpacity={0.7}>
              <Text style={[styles.socialIconText, { color: colors.textSecondary }]}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} activeOpacity={0.7}>
              <Text style={[styles.socialIconText, { color: colors.textSecondary }]}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} activeOpacity={0.7}>
              <Text style={[styles.socialIconText, { color: colors.textSecondary }]}>𝕏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]} activeOpacity={0.7}>
              <Text style={[styles.socialIconText, { color: colors.textSecondary }]}>in</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={[styles.footer, { color: colors.textSecondary }]}>
            By continuing, you agree to our{" "}
            <Text style={[styles.link, { color: colors.textPrimary }]}>Terms</Text> &{" "}
            <Text style={[styles.link, { color: colors.textPrimary }]}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  card: {
    marginHorizontal: 20,
   // borderRadius: 20,
    padding: 24,
    //elevation: 6,
    //shadowColor: "#000",
   // shadowOffset: { width: 0, height: 4 },
   // shadowOpacity: 0.1,
    //shadowRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
    fontSize: 14,
  },
  link: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  inputContainer: {
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  input: {
    height: 52,
    fontSize: 15,
  },
  forgot: {
    alignSelf: "flex-end",
    marginBottom: 20,
    fontSize: 13,
  },
  primaryButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  or: {
    textAlign: "center",
    marginVertical: 12,
    fontSize: 13,
  },
  socialText: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 24,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  socialIconText: {
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default AuthScreen;
