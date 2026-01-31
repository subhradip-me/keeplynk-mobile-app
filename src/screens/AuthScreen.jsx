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

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
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
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        <View style={styles.card}>
          {/* Title */}
          <Text style={styles.title}>
            {isSignUp ? "Create Account" : "Sign in"}
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <Text style={styles.link} onPress={toggleAuthMode}>
                  Sign in
                </Text>
              </>
            ) : (
              <>
                New user?{" "}
                <Text style={styles.link} onPress={toggleAuthMode}>
                  Create an account
                </Text>
              </>
            )}
          </Text>

          {/* Name (Signup only) */}
          {isSignUp && (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#999"
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                editable={!loading}
              />
            </View>
          )}

          {/* Email */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Confirm Password (Signup only) */}
          {isSignUp && (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                secureTextEntry
                style={styles.input}
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
              <Text style={styles.forgot}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Primary Button */}
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>
                {isSignUp ? "Sign Up" : "Login"}
              </Text>
            )}
          </TouchableOpacity>

          {/* OR */}
          <Text style={styles.or}>or</Text>

          {/* Social */}
          <Text style={styles.socialText}>Continue with Social Media</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Text style={styles.socialIconText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Text style={styles.socialIconText}>f</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Text style={styles.socialIconText}>𝕏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon} activeOpacity={0.7}>
              <Text style={styles.socialIconText}>in</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            By continuing, you agree to our{" "}
            <Text style={styles.link}>Terms</Text> &{" "}
            <Text style={styles.link}>Privacy Policy</Text>
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
    backgroundColor: "#ffffffff",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 20,
  },
  card: {
    marginHorizontal: 20,
    backgroundColor: "#ffffffff",
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
    color: "#000",
  },
  subtitle: {
    color: "#666",
    marginBottom: 24,
    fontSize: 14,
  },
  link: {
    color: "#000",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  inputContainer: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  input: {
    height: 52,
    fontSize: 15,
    color: "#000",
  },
  forgot: {
    alignSelf: "flex-end",
    color: "#666",
    marginBottom: 20,
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: "#000",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  or: {
    textAlign: "center",
    color: "#999",
    marginVertical: 12,
    fontSize: 13,
  },
  socialText: {
    textAlign: "center",
    fontSize: 12,
    color: "#666",
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
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  socialIconText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
  },
  footer: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default AuthScreen;
