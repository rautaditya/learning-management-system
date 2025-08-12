import { Route } from 'react-router-dom';
import AdminSuperadminLogin from '../components/commonpages/AdminSuperadminLogin';

export  function CommonRoutes() {
  return (
    <Route path="/adminsuperadmin/login" element={<AdminSuperadminLogin />} />
  );
}
