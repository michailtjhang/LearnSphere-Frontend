import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Page Components
import Home from './components/pages/Home'
import Courses from './components/pages/Courses'
import Detail from './components/pages/Detail'
import Login from './components/pages/Login'
import Register from './components/pages/Register'

// Account Pages
import MyLearning from './components/pages/account/MyLearning'
import MyCourses from './components/pages/account/MyCourses'
import WatchCourse from './components/pages/account/WatchCourse'
import ChangePassword from './components/pages/account/ChangePassword'
import Dashboard from './components/pages/account/Dashboard'
import CreateCourse from './components/pages/account/courses/CreateCourse'
import EditCourse from './components/pages/account/courses/EditCourse'

// Common Components
import { RequireAuth } from './components/common/RequireAuth'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/detail" element={<Detail />} />

        {/* Auth Routes */}
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/register" element={<Register />} />

        {/* Account Routes */}
        <Route path="/account/my-learning" element={<MyLearning />} />
        <Route path="/account/my-courses" element={<MyCourses />} />
        <Route path="/account/watch-course" element={<WatchCourse />} />
        <Route path="/account/change-password" element={<ChangePassword />} />

        {/* Protected Routes */}
        {[
          { path: '/account/dashboard', element: <Dashboard /> },
          { path: '/account/courses/create', element: <CreateCourse /> },
          { path: '/account/courses/edit/:id', element: <EditCourse /> }
        ].map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <RequireAuth>
                {route.element}
              </RequireAuth>
            }
          />
        ))}
      </Routes>

      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </BrowserRouter>
  )
}

export default App