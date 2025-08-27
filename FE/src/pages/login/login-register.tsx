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

  const handleLoginSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
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
    setIsLoading(true);
    setErrorMessage("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

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
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
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
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    className="w-full pl-10 pr-12 py-3 border rounded-lg"
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
              </div>

              {/* Login Button */}
              <button
                onClick={handleLoginSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-lg font-semibold"
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
                      setRegisterForm({ ...registerForm, name: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    placeholder="Enter your full name"
                  />
                </div>
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
                      setRegisterForm({
                        ...registerForm,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    placeholder="Enter your email"
                  />
                </div>
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
                      setRegisterForm({
                        ...registerForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-12 py-3 border rounded-lg"
                    placeholder="Create a secure password"
                  />
                </div>
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
                      setRegisterForm({
                        ...registerForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 border rounded-lg"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegisterSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-lg font-semibold"
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
                className="text-teal-600 hover:text-teal-700 font-medium"
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
