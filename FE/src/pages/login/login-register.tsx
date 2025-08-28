import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Heart,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { AuthService } from "../../service/service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utility/authContext";

// Validation types
interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FieldTouched {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation states
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [touchedFields, setTouchedFields] = useState<FieldTouched>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password))
      return "Password must contain at least one lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Password must contain at least one uppercase letter";
    if (!/(?=.*\d)/.test(password))
      return "Password must contain at least one number";
    return null;
  };

  const validateName = (name: string): string | null => {
    if (!name) return "Full name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(name))
      return "Name can only contain letters and spaces";
    return null;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ): string | null => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  // Real-time validation
  const validateLoginForm = () => {
    const errors: ValidationErrors = {};

    const emailError = validateEmail(loginForm.email);
    if (emailError && touchedFields.email) errors.email = emailError;

    if (!loginForm.password && touchedFields.password) {
      errors.password = "Password is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors: ValidationErrors = {};

    const nameError = validateName(registerForm.name);
    if (nameError && touchedFields.name) errors.name = nameError;

    const emailError = validateEmail(registerForm.email);
    if (emailError && touchedFields.email) errors.email = emailError;

    const passwordError = validatePassword(registerForm.password);
    if (passwordError && touchedFields.password)
      errors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      registerForm.password,
      registerForm.confirmPassword
    );
    if (confirmPasswordError && touchedFields.confirmPassword)
      errors.confirmPassword = confirmPasswordError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Form validation on submit
  const isLoginFormValid = () => {
    return (
      loginForm.email && loginForm.password && !validateEmail(loginForm.email)
    );
  };

  const isRegisterFormValid = () => {
    return (
      registerForm.name &&
      registerForm.email &&
      registerForm.password &&
      registerForm.confirmPassword &&
      !validateName(registerForm.name) &&
      !validateEmail(registerForm.email) &&
      !validatePassword(registerForm.password) &&
      !validateConfirmPassword(
        registerForm.password,
        registerForm.confirmPassword
      )
    );
  };

  // Handle field changes with validation
  const handleLoginChange = (field: string, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => validateLoginForm(), 100);
  };

  const handleRegisterChange = (field: string, value: string) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => validateRegisterForm(), 100);
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
    if (isLogin) {
      validateLoginForm();
    } else {
      validateRegisterForm();
    }
  };

  const handleLoginSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Mark all fields as touched for validation display
    setTouchedFields({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isLoginFormValid()) {
      setErrorMessage("Please fix the validation errors before submitting.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await AuthService.login(loginForm.email, loginForm.password);
      if (data && data.accessToken) {
        login(data.accessToken);
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    } catch (error: any) {
      setErrorMessage(error?.error || "Incorrect password or email address");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Mark all fields as touched for validation display
    setTouchedFields({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (!isRegisterFormValid()) {
      setErrorMessage("Please fix the validation errors before submitting.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const data: any = await AuthService.register(
        registerForm.name,
        registerForm.email,
        registerForm.password
      );

      if (data && data.accessToken) {
        login(data.accessToken);
        setSuccessMessage("Account created! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        setErrorMessage("Registration failed.");
      }
    } catch (error: any) {
      setErrorMessage(
        error.message || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage("");
    setSuccessMessage("");
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
    setValidationErrors({});
    setTouchedFields({
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
    });
  };

  // Helper function to get input border color based on validation state
  const getInputBorderColor = (fieldName: string, hasError: boolean) => {
    if (hasError)
      return "border-red-300 focus:border-red-500 focus:ring-red-200";
    if (touchedFields[fieldName as keyof FieldTouched] && !hasError) {
      return "border-green-300 focus:border-green-500 focus:ring-green-200";
    }
    return "border-gray-300 focus:border-teal-500 focus:ring-teal-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl mb-4">
            <Heart className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">L.I.V.E</h1>
          <p className="text-gray-600">Learn • Improve • Visualise • Empower</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-white/20">
          {/* Tabs */}
          <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                isLogin
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                !isLogin
                  ? "bg-white text-teal-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Register
            </button>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={20} />
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Forms */}
          {isLogin ? (
            <div className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => handleLoginChange("email", e.target.value)}
                    onBlur={() => handleFieldBlur("email")}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${getInputBorderColor(
                      "email",
                      !!validationErrors.email
                    )}`}
                    placeholder="Enter your email"
                  />
                  {touchedFields.email &&
                    !validationErrors.email &&
                    loginForm.email && (
                      <CheckCircle
                        className="absolute right-3 top-3 text-green-500"
                        size={20}
                      />
                    )}
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) =>
                      handleLoginChange("password", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("password")}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${getInputBorderColor(
                      "password",
                      !!validationErrors.password
                    )}`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                onClick={handleLoginSubmit}
                disabled={isLoading || !isLoginFormValid()}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isLoading || !isLoginFormValid()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transform hover:scale-[1.02]"
                }`}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Register Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) =>
                      handleRegisterChange("name", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("name")}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${getInputBorderColor(
                      "name",
                      !!validationErrors.name
                    )}`}
                    placeholder="Enter your full name"
                  />
                  {touchedFields.name &&
                    !validationErrors.name &&
                    registerForm.name && (
                      <CheckCircle
                        className="absolute right-3 top-3 text-green-500"
                        size={20}
                      />
                    )}
                </div>
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Register Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) =>
                      handleRegisterChange("email", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("email")}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${getInputBorderColor(
                      "email",
                      !!validationErrors.email
                    )}`}
                    placeholder="Enter your email"
                  />
                  {touchedFields.email &&
                    !validationErrors.email &&
                    registerForm.email && (
                      <CheckCircle
                        className="absolute right-3 top-3 text-green-500"
                        size={20}
                      />
                    )}
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Register Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={registerForm.password}
                    onChange={(e) =>
                      handleRegisterChange("password", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("password")}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${getInputBorderColor(
                      "password",
                      !!validationErrors.password
                    )}`}
                    placeholder="Create a secure password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {validationErrors.password}
                  </p>
                )}
                {/* Password strength indicator */}
                {registerForm.password && !validationErrors.password && (
                  <div className="mt-2">
                    <div className="text-xs text-green-600 flex items-center">
                      <CheckCircle size={12} className="mr-1" />
                      Strong password
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-3 text-gray-400"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={registerForm.confirmPassword}
                    onChange={(e) =>
                      handleRegisterChange("confirmPassword", e.target.value)
                    }
                    onBlur={() => handleFieldBlur("confirmPassword")}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${getInputBorderColor(
                      "confirmPassword",
                      !!validationErrors.confirmPassword
                    )}`}
                    placeholder="Confirm your password"
                  />
                  {touchedFields.confirmPassword &&
                    !validationErrors.confirmPassword &&
                    registerForm.confirmPassword && (
                      <CheckCircle
                        className="absolute right-3 top-3 text-green-500"
                        size={20}
                      />
                    )}
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegisterSubmit}
                disabled={isLoading || !isRegisterFormValid()}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  isLoading || !isRegisterFormValid()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 transform hover:scale-[1.02]"
                }`}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          )}

          {/* Toggle */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                {isLogin ? "Register here" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
