import { useNavigate } from 'react-router-dom';
import auth from '../../services/auth';

// Inside your Header component
const handleLogout = () => {
  auth.logout();
  navigate('/login');
};

// Add this to your header menu/buttons
<button 
  onClick={handleLogout}
  className="text-gray-600 hover:text-gray-800"
>
  Logout
</button> 