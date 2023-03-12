import React from 'react'
import { useEffect } from 'react';
import { useLayoutDispatch } from '../contexts/LayoutContext';
import { Plus, Box } from 'react-feather';
import { info } from '../services/api';

const Homepage = () => {
  const layoutDispatch = useLayoutDispatch();
  
  async function initializeApp() {
    const { data } = await info();
    if (data.id) {
      layoutDispatch({ type: 'LOGGED_IN' });
    }
  }

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <div className="mt-2 ml-2 mr-2">
      <div className="flex justify-end">
        <button className="btn btn-ghost btn-outline mr-2">
          <Box />
          <span className="pl-2">Integration</span>
        </button>
        <button className="btn btn-ghost btn-outline">
          <Plus />
          <span className="pl-2">Add</span>
        </button>
      </div>
    </div>
  )
}

export default Homepage