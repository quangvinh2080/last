import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Header = () => {
  const { auth, setAuth } = useAuth()
  let navigate = useNavigate();

  const logout = () => {
    setAuth({})
    navigate("/login", { replace: true })
  };

  const login = () => {

  };

  const signup = () => {

  };

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" to="/">Last Time</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          {!auth?.username &&
            <li className="mx-1"><label htmlFor="login-modal" className="link link-hover">Login</label></li>}
          {auth?.username &&
            <li className="mx-1"><button className=" btn-warning" onClick={logout}>
              Logout <span className="font-semibold">{auth?.username}</span></button></li>
          }
        </ul>
        <input type="checkbox" id="login-modal" className="modal-toggle" />
        <div className="modal text-black">
          <div className="modal-box relative">
            <label for="login-modal" className="btn btn-outline btn-sm btn-circle absolute right-5 top-5">✕</label>
            <div className="flex justify-center self-center z-10">
              <div className="p-12 bg-white mx-auto rounded-2xl w-100 ">
                <div className="mb-4">
                  <h3 className="font-semibold text-2xl text-gray-800">Sign In </h3>
                  <p className="text-gray-500">Please sign in to your account.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
                    <input className=" w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400" type="" placeholder="mail@gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                      Password
                    </label>
                    <input className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400" type="" placeholder="Enter your password" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <a href="#" className="link link-primary link-hover">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                  <div>
                    <button type="submit" className="btn btn-primary btn-block rounded-full">
                      Sign in
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-gray-500">Don't have an account ? </span>
                    {' '}
                    <a className="link link-primary ml-2" onClick={() => signup()}>Sign up</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

        export default Header