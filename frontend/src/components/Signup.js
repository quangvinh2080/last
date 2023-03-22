import { useState } from 'react';
import { Modal, Button, Input, Link } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { useLayoutState, useLayoutDispatch } from '../contexts/LayoutContext';
import { signup } from '../services/api';

const Signup = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isShowSignupModal } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  const onSubmit = async ({ email, password, confirmPassword }) => {
    setErrMsg('');
    setIsLoading(true);

    if (!email || !password || !confirmPassword) {
      setErrMsg('Email or password can not be empty');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrMsg('Password doesn\'t match');
      setIsLoading(false);
      return;
    }

    try {
      const { data, status } = await signup({
        email,
        password,
      });

      if (status >= 400 && data?.detail) {
        setErrMsg(data.detail);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      layoutDispatch({ type: 'HIDE_SIGNUP' });
    } catch (err) {
      console.error(err);
      setErrMsg('Unknown error, please try again later');
      setIsLoading(false);
    }
  };

  return (
    <Modal className="text-black space-y-5" open={isShowSignupModal}>
      <Modal.Header className="font-bold mb-4">
        <h3 className="font-semibold text-2xl text-gray-800">Sign Up</h3>
        <p className="text-gray-500">Just 5 seconds, sign up to retain your data</p>
        <label className="btn btn-outline btn-sm btn-circle absolute right-5 top-5" onClick={() => layoutDispatch({ type: 'HIDE_SIGNUP' })}>✕</label>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 tracking-wide">Email</label>
              <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="mail@gmail.com" {...register('email', { required: { value: true, message: 'This field is required' }, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }})} disabled={isLoading} />
              {errors?.email && (<div><span className="text-error text-sm">{errors.email.message}</span></div>)}
            </div>
            <div className="space-y-2">
              <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                Password
              </label>
              <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Enter your password" {...register('password', { required: { value: true, message: 'This field is required' }, minLength: { value: 3, message: 'Password must have at least 3 characters or numbers'  }})} type="password" disabled={isLoading} />
              {errors?.password && (<div><span className="text-error text-sm">{errors.password.message}</span></div>)}
            </div>
            <div className="space-y-2">
              <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                Confirm password
              </label>
              <Input color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Re-enter your password" {...register('confirmPassword', { required: { value: true, message: 'This field is required' }})} type="password" disabled={isLoading} />
              {errors?.confirmPassword && (<div><span className="text-error text-sm">{errors.confirmPassword.message}</span></div>)}
            </div>
            {errMsg && (<div className="space-y-2">
              <div className="text-error">
                <div className="flex">
                  <div className="py-1"><svg className="fill-current h-4 w-4 text-error mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
                  <div>
                    <p className="text-md">{errMsg}</p>
                  </div>
                </div>
              </div>
            </div>)}
            <div className="space-y-2">
              <Button color="primary" type="submit" shape="circle" fullWidth loading={isLoading} disabled={isLoading}>
                Sign up
              </Button>
            </div>
            <div className="space-y-2 text-center">
              <span className="text-gray-500">Already have an account? </span>
              {' '}
              <Link color="primary" className="ml-2" onClick={() => layoutDispatch({ type: 'SHOW_SIGNIN' })}>Sign in</Link>
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default Signup;
