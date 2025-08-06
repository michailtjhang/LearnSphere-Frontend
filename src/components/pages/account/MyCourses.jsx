import React from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import EditCourse from '../../common/EditCourse'

const MyCourses = () => {
  return (
    <>
      <Layout>
        <section className='section-4'>
          <div className='container pb-5 pt-3'>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/account/dashboard">Account</Link></li>
                <li className="breadcrumb-item active" aria-current="page">My Courses</li>
              </ol>
            </nav>
            <div className='row'>
              <div className='col-md-12 mt-5 mb-3'>
                <div className='d-flex justify-content-between'>
                  <h2 className='h4 mb-0 pb-0'>My Courses</h2>
                  <Link to="/account/courses/create" className='btn btn-primary'>Create</Link>
                </div>
              </div>
              <div className='col-lg-3 account-sidebar'>
                <UserSidebar />
              </div>
              <div className='col-lg-9'>
                <div className='row gy-4'>
                  <EditCourse />
                  <EditCourse />
                  <EditCourse />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export default MyCourses