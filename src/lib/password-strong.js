export const isPasswordStrong = (password) => {
    // Must be at least 8 chars, include uppercase, lowercase, number, special char
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
};
