import { useEffect, useState } from 'react';
import { Info } from 'react-feather';
import { Modal, Input, InputGroup , Button, Alert, Link } from 'react-daisyui';
import { useForm } from 'react-hook-form';
import { useLayoutState, useLayoutDispatch } from '../contexts/LayoutContext';
import { getGoogleSheetsIntegration, sharePermission } from '../services/api';

const GoogleSheetsIntegration = () => {
  const { register, setValue, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({
    type: '',
    message: '',
  });
  const [sheetsIntegration, setSheetsIntegration] = useState();

  const { isShowGoogleSheetsIntegration } = useLayoutState();
  const layoutDispatch = useLayoutDispatch();

  const onSubmit = async ({ email }) => {
    setIsLoading(true);
    try {
      await sharePermission(email);
      setIsLoading(false);
      setValue('email', '');
      setAlert({
        type: 'success',
        message: 'Shared with ' + email
      });
    } catch (err) {
      setIsLoading(false);
      setAlert({
        type: 'error',
        message: 'Something wrong, please try again later'
      });
      console.error(err);
    }
  };

  useEffect(() => {
    getGoogleSheetsIntegration()
    .then(({ data, status }) => {
      if (status === 200) {
        if (data?.spreadsheet_id) {
          setSheetsIntegration(data);
        }
      }
    })
  }, []);

  return (
    <Modal className="text-black space-y-5" open={isShowGoogleSheetsIntegration} responsive>
      <Modal.Header className="font-bold mb-4">
        <h3 className="font-semibold text-2xl text-gray-800">Google Sheets</h3>
        <p className="text-gray-500">Keep your data sync with google sheets</p>
        <label className="btn btn-outline btn-sm btn-circle absolute right-5 top-5" onClick={() => layoutDispatch({ type: 'HIDE_GOOGLE_SHEETS_INTEGRATION' })}>✕</label>
      </Modal.Header>
      <Modal.Body >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5 mb-5">
            {/* Content */}
            {sheetsIntegration?.spreadsheet_id ? (
              <div className="pl-2 pr-2 mb-5">
                <Alert status="info">
                  <Info /> 
                  <span>You have integrated Google Sheets. Go to <Link className="text-primary" hover target="_blank" href={`https://docs.google.com/spreadsheets/d/${sheetsIntegration.spreadsheet_id}`}>your sheet</Link> now</span>
                </Alert>
              </div>
            ) : null}
            <div className="pl-2 pr-2 mb-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Share spreadsheet with email</span>
                </label>
                <InputGroup>
                  <Input disabled={isLoading} color="ghost" bordered className="w-full content-center text-base px-4 py-2 rounded-lg" placeholder="Add email to access your spreadsheet" {...register('email', { required: { value: true, message: 'This field is required' }, pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' } })} />
                  <Button loading={isLoading} disabled={isLoading} type="submit">Add</Button>
                </InputGroup>
                {errors?.email && <div className="text-error text-sm mt-3">{errors.email.message}</div>}
              </div>
            </div>
            {alert.type ? (
              <div className="pl-2 pr-2 mb-5">
                <Alert status={alert.type}>{alert.message}</Alert>
              </div>
            ) : null}
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default GoogleSheetsIntegration