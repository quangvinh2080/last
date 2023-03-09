import { Modal, Button, Input, Link } from 'react-daisyui';
import { useLayoutState, useLayoutDispatch } from '../contexts/LayoutContext';

const Signup = () => {
  const { isShowSignupModal } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  return (
    <Modal className="text-black space-y-5" open={isShowSignupModal}>
      <Modal.Header className="font-bold mb-4">
        <h3 className="font-semibold text-2xl text-gray-800">Sign Up</h3>
        <p className="text-gray-500">Just 5 seconds, sign up to retain your data</p>
        <label className="btn btn-outline btn-sm btn-circle absolute right-5 top-5" onClick={() => layoutDispatch({ type: 'HIDE_SIGNUP_MODAL' })}>✕</label>
      </Modal.Header>

      <Modal.Body>
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
            <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="mail@gmail.com" />
          </div>
          <div className="space-y-2">
            <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
              Password
            </label>
            <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Enter your password" />
          </div>
          <div className="space-y-2">
            <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
              Confirm password
            </label>
            <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Re-enter your password" />
          </div>
          <div className="space-y-2">
            <Button color="primary" type="submit" shape="circle" fullWidth>
              Sign up
            </Button>
          </div>
          <div className="space-y-2 text-center">
            <span className="text-gray-500">Already have an account? </span>
            {' '}
            <Link color="primary" className="ml-2" onClick={() => layoutDispatch({ type: 'SHOW_SIGNIN' })}>Sign in</Link>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default Signup;
