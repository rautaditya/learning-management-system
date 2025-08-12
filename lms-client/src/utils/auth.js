// src/utils/auth.js
export function isSuperadminAuthenticated() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    token &&
    user &&
    user.role === 'superadmin'
    
  );
}
export function isAdminAuthenticated() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    token &&
    user &&
    user.role === 'admin'
  );
}