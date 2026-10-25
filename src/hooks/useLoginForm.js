import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

/**
 * Custom hook to encapsulate authentication form state, validation, and submission logic.
 *
 * @param {Object} options
 * @param {string} options.requiredRole - Optional role requirement check (e.g. 'ROLE_ADMIN')
 * @param {string} options.successRedirect - Fallback redirect path if role check succeeds
 * @param {string} options.roleMismatchError - Error message shown if user logs into wrong portal
 * @param {string} options.usernameRequiredMsg - Custom required validation message
 */
export const useLoginForm = ({
  requiredRole,
  successRedirect,
  roleMismatchError,
  usernameRequiredMsg = 'Email or phone number is required',
} = {}) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!username.trim()) {
      nextErrors.username = usernameRequiredMsg;
    }
    if (!password) {
      nextErrors.password = 'Password is required';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors((prev) => ({ ...prev, username: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setServerError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authService.login({
        username: username.trim(),
        password: password,
      });

      const resData = response.data;
      if (resData && resData.data) {
        const userData = resData.data;
        userData.loginIdentifier = username.trim();
        login(userData, password);

        const role = (userData.role || '').toUpperCase();

        // If a specific portal role is required
        if (requiredRole) {
          const expected = requiredRole.toUpperCase();
          const matches =
            role.includes(expected) ||
            role.replace(/^ROLE_/, '') === expected.replace(/^ROLE_/, '');

          if (matches) {
            navigate(successRedirect, { replace: true });
          } else {
            setServerError(
              roleMismatchError ||
                `Account authenticated, but does not possess ${requiredRole} permissions.`
            );
          }
        } else {
          // General login: route according to user role
          if (role.includes('ADMIN')) {
            navigate('/admin/dashboard', { replace: true });
          } else if (role.includes('DELIVERY') || role.includes('AGENT')) {
            navigate('/agent/dashboard', { replace: true });
          } else {
            navigate('/customer/dashboard', { replace: true });
          }
        }
      } else {
        setServerError(resData.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Invalid username or password'
          : 'Unable to connect to the server. Please verify network or backend status.');
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    password,
    errors,
    serverError,
    loading,
    setServerError,
    handleUsernameChange,
    handlePasswordChange,
    handleSubmit,
  };
};

export default useLoginForm;
