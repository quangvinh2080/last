import { Menu, Link } from "react-daisyui"
import { useLayoutDispatch, useLayoutState } from '../contexts/LayoutContext';

const NavbarMenu = () => {
  const layoutDispatch = useLayoutDispatch();
  const { isAuth } = useLayoutState();

  return (
    <Menu horizontal className="p-0">
      <Menu.Item>
        {isAuth ? <Link onClick={() => layoutDispatch({ type: 'LOGGED_OUT' })}>Logout</Link> : <Link onClick={() => layoutDispatch({ type: 'SHOW_SIGNIN' })}>Login</Link>}
      </Menu.Item>
    </Menu>
  )
}

export default NavbarMenu