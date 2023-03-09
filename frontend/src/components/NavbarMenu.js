import { Menu, Link } from "react-daisyui"
import { useLayoutDispatch } from '../contexts/LayoutContext';

const NavbarMenu = () => {
  const layoutDispatch = useLayoutDispatch();

  return (
    <Menu horizontal className="p-0">
      <Menu.Item>
        <Link onClick={() => layoutDispatch({ type: 'SHOW_SIGNIN' })}>Login</Link>
      </Menu.Item>
    </Menu>
  )
}

export default NavbarMenu