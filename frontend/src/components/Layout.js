import { Outlet } from 'react-router-dom'
import Header from "./Header";

const Layout = () => {
  return (
    <div className="App flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 min-h-full flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout;