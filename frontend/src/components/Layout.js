import { Drawer, Menu } from 'react-daisyui';
import { Outlet } from 'react-router-dom'
import { useLayoutDispatch, useLayoutState } from '../contexts/LayoutContext';
import Header from "./Header";
import { discord, google_sheet, pushbullet, pushover } from '../constants/icons';
import { Box } from 'react-feather';

const Layout = () => {
  const layoutDispatch = useLayoutDispatch();
  const { isShowIntegration } = useLayoutState();
  
  const handleOpenGoogleSheets = () => {
    layoutDispatch({ type: 'HIDE_INTEGRATION' });
    layoutDispatch({ type: 'SHOW_GOOGLE_SHEETS_INTEGRATION' });
  };

  const Side = () => {
    return (
      <Menu className='menu p-4 overflow-y-auto w-96 bg-base-100 text-base-content'>
        <div className="text-2xl font-bold mb-3 text-center relative">
          <span><Box className="absolute left-16 top-1" />Integration</span>
        </div>
        <div className="text-lg font-bold mt-3 mb-2">Data & Storage</div>
        <Menu.Item onClick={() => handleOpenGoogleSheets()}>
          <a>
            <img src={google_sheet} width={42} height={42} />
            <div>
              <div className="font-bold">Google Sheets</div>
              <div className="text-sm">Keep your data sync with google sheets</div>
            </div>
          </a>
        </Menu.Item>
        <div className="text-lg font-bold mt-3 mb-2">Notification</div>
        <Menu.Item>
          <a>
            <img src={discord} width={42} height={42} />
            <div>
              <div className="font-bold">Discord</div>
              <div className="text-sm">Get reminder to your Discord channel</div>
            </div>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a>
            <img src={pushbullet} width={42} height={42} />
            <div>
              <div className="font-bold">Pushbullet</div>
              <div className="text-sm">Reminders will be sent to your Pushbullet account</div>
            </div>
          </a>
        </Menu.Item>
        <Menu.Item>
          <a>
            <img src={pushover} width={42} height={42} />
            <div>
              <div className="font-bold">Pushover</div>
              <div className="text-sm">Reminders will be sent to your Pushover account</div>
            </div>
          </a>
        </Menu.Item>
      </Menu>
    )
  }
  return (
    <Drawer side={<Side />} end open={isShowIntegration} onClickOverlay={() => layoutDispatch({ type: 'HIDE_INTEGRATION' })}>
      <div className="App flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 min-h-full flex flex-col">
          <Outlet />
        </main>
      </div>
    </Drawer>
  )
}

export default Layout;