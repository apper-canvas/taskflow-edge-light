import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { routeArray } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routeArray.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={<route.component />}
          />
        ))}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="z-[9999]"
      />
    </BrowserRouter>
  );
}

export default App;