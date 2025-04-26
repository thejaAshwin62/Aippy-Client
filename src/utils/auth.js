import { jwtDecode } from "jwt-decode";

export const getJwtFromCookie = () => {
  const cookies = document.cookie.split(';');
  const jwtCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
  return jwtCookie ? jwtCookie.split('=')[1] : null;
};

export const getUserFromJwt = () => {
  const jwt = getJwtFromCookie();
  if (!jwt) return null;
  
  try {
    const decoded = jwtDecode(jwt);
    return {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}; 