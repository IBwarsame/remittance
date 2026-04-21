// Minimum NIST/OWASP-aligned policy:
//   12+ chars, upper, lower, digit, special character
const SPECIAL = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

function isStrongPassword(password) {
  return (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    SPECIAL.test(password)
  );
}

function assertStrongPassword(password) {
  if (!password) throw new Error("Password is required");
  if (password.length < 12)
    throw new Error("Password must be at least 12 characters");
  if (!/[A-Z]/.test(password))
    throw new Error("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password))
    throw new Error("Password must contain at least one lowercase letter");
  if (!/[0-9]/.test(password))
    throw new Error("Password must contain at least one number");
  if (!SPECIAL.test(password))
    throw new Error("Password must contain at least one special character");
}

module.exports = { isStrongPassword, assertStrongPassword };