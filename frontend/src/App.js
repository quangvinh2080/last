import {Route, Routes} from 'react-router-dom';
import Layout from './components/Layout';
import Homepage from './pages/Homepage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Homepage />} />
      </Route>
    </Routes>
  );
}

export default App;
