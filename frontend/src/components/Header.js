import { Link } from 'react-router-dom'
import { Navbar } from 'react-daisyui';
import Login from './Login';
import Signup from './Signup';
import NavbarMenu from './NavbarMenu';

const Header = () => {

  return (
    <Navbar className="bg-primary text-primary-content">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/">Last Time</Link>
      </div>
      <div className="flex-none">
        <NavbarMenu />
        <Login />
        <Signup />
      </div>
    </Navbar>
  )
}

        export default Header