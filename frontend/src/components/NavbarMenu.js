import Cookies from "js-cookie";
import { Menu, Link } from "react-daisyui"
import { useLayoutDispatch, useLayoutState } from '../contexts/LayoutContext';
import { useTaskDispatch } from "../contexts/TaskContext";

const NavbarMenu = () => {
  const { isAuth } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();
  const taskDispatch = useTaskDispatch();

  const doLogout = () => {
    Cookies.remove('token');
    layoutDispatch({ type: 'LOGGED_OUT' });
    taskDispatch({ type: 'UPDATE_TASKS', value: [] });
  };

  return (
    <Menu horizontal className="p-0">
      <Menu.Item>
        {isAuth ? <Link onClick={() => doLogout()}>Logout</Link> : <Link onClick={() => layoutDispatch({ type: 'SHOW_SIGNIN' })}>Login</Link>}
      </Menu.Item>
    </Menu>
  )
}

export default NavbarMenu