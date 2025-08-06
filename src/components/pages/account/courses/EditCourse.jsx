import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { apiUrl, token } from '../../../common/Config'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const EditCourse = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        await fetch(`${apiUrl}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(result => {
                console.log("Registration successful:", result);
                if (result.status == 200) {
                    toast.success(result.message);
                    navigate('/account/courses/edit/' + result.data.id);
                } else {
                    toast.error(result.message);
                }
            })
    }

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account/dashboard">Account</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Create Course</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>Create Course</h2>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className='row'>

                                <div className='col-md-7'>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='card border-0 shadow-lg'>
                                            <div className='card-body p-4'>

                                                <h4 className='h5 border-bottom pb-3 mb-3'>Course Details</h4>

                                                <div className='mb-3'>
                                                    <label htmlFor="title" className='form-label'>Title</label>
                                                    <input type="text"
                                                        {
                                                        ...register("title", {
                                                            required: "The title field is required",
                                                        })
                                                        }
                                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                        placeholder='Title' />
                                                    {
                                                        errors.title && <span className='text-danger'>{errors.title.message}</span>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label htmlFor="category" className='form-label'>Category</label>
                                                    <select className='form-select' id='category'>
                                                        <option value="">Select a Category</option>
                                                    </select>
                                                </div>

                                                <div className='mb-3'>
                                                    <label htmlFor="level" className='form-label'>Level</label>
                                                    <select className='form-select' id='level'>
                                                        <option value="">Select a level</option>
                                                    </select>
                                                </div>

                                                <div className='mb-3'>
                                                    <label htmlFor="language" className='form-label'>Language</label>
                                                    <select className='form-select' id='language'>
                                                        <option value="">Select a Language</option>
                                                    </select>
                                                </div>

                                                <div className='mb-3'>
                                                    <label htmlFor="description" className='form-label'>Description</label>
                                                    <textarea id='description' rows={5} placeholder='Description' className='form-control'></textarea>
                                                </div>

                                                <h4 className='h5 border-bottom pb-3 mb-3'>Pricing</h4>

                                                <div className='mb-3'>
                                                    <label htmlFor="sell-price" className='form-label'>Sell Price</label>
                                                    <input type="number"
                                                        {
                                                        ...register("sell-price", {
                                                            required: "The sell price field is required",
                                                        })
                                                        }
                                                        className={`form-control ${errors["sell-price"] ? 'is-invalid' : ''}`}
                                                        placeholder='Sell Price'
                                                        id='sell-price' />
                                                    {
                                                        errors.title && <span className='text-danger'>{errors.title.message}</span>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label htmlFor="cross-price" className='form-label'>cross Price</label>
                                                    <input type="number"
                                                        {
                                                        ...register("cross-price", {
                                                            required: "The cross price field is required",
                                                        })
                                                        }
                                                        className={`form-control ${errors["cross-price"] ? 'is-invalid' : ''}`}
                                                        placeholder='cross Price'
                                                        id='cross-price' />
                                                    {
                                                        errors.title && <span className='text-danger'>{errors.title.message}</span>
                                                    }
                                                </div>

                                                <button type='submit' className='btn btn-primary'>Continue</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className='col-md-5'>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default EditCourse