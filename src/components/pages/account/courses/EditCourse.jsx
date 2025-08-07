import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { apiUrl, token } from '../../../common/Config'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

const EditCourse = () => {

    const params = useParams();
    // const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
        defaultValues: async () => {
            await fetch(`${apiUrl}/courses/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(result => {
                    if (result.status == 200) {
                        reset({
                            title: result.data.title,
                            category: result.data.category_id,
                            level: result.data.level_id,
                            language: result.data.language_id,
                            description: result.data.description,
                            sell_price: result.data.price,
                            cross_price: result.data.cross_price
                        })
                    } else {
                        console.error("Error fetching course metadata:", result.message);
                        toast.error(result.message);
                    }
                })
        }
    });
    
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);

    const onSubmit = async (data) => {
        setLoading(true);
        await fetch(`${apiUrl}/courses/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false);
                if (result.status == 200) {
                    toast.success(result.message);
                    // navigate('/account/courses/edit/' + result.data.id);
                } else {
                    const errors = result.errors;
                    Object.keys(errors).forEach(field => {
                        setError(field, { message: errors[field][0] });
                    });
                }
            })
    }

    const CourseMetaData = async () => {
        await fetch(`${apiUrl}/courses/meta-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setCategories(result.data.categories);
                    setLevels(result.data.levels);
                    setLanguages(result.data.languages);
                } else {
                    console.error("Error fetching course metadata:", result.message);
                    toast.error(result.message);
                }
            })
    }

    useEffect(() => {
        CourseMetaData();
    }, []);

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account/dashboard">Account</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Edit Course</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>Edit Course</h2>
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
                                                    <select
                                                        className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                                        id='category'
                                                        {
                                                        ...register("category", {
                                                            required: "The category field is required",
                                                        })
                                                        }
                                                    >
                                                        <option value="" hidden>Select a Category</option>
                                                        {
                                                            categories && categories.map((category, index) => (
                                                                <option key={index} value={category.id}>{category.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {
                                                        errors.category && <span className='text-danger'>{errors.category.message}</span>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label htmlFor="level" className='form-label'>Level</label>
                                                    <select
                                                        className={`form-select ${errors.level ? 'is-invalid' : ''}`}
                                                        id='level'
                                                        {
                                                        ...register("level", {
                                                            required: "The level field is required",
                                                        })
                                                        }
                                                    >
                                                        <option value="" hidden>Select a level</option>
                                                        {
                                                            levels && levels.map((level, index) => (
                                                                <option key={index} value={level.id}>{level.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {
                                                        errors.level && <span className='text-danger'>{errors.level.message}</span>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label htmlFor="language" className='form-label'>Language</label>
                                                    <select
                                                        className={`form-select ${errors.language ? 'is-invalid' : ''}`}
                                                        id='language'
                                                        {
                                                        ...register("language", {
                                                            required: "The language field is required",
                                                        })
                                                        }
                                                    >
                                                        <option value="" hidden>Select a Language</option>
                                                        {
                                                            languages && languages.map((language, index) => (
                                                                <option key={index} value={language.id}>{language.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    {
                                                        errors.language && <span className='text-danger'>{errors.language.message}</span>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label htmlFor="description" className='form-label'>Description</label>
                                                    <textarea
                                                        {
                                                        ...register("description", {
                                                            required: "The description field is required",
                                                        })
                                                        }
                                                        id='description'
                                                        rows={5}
                                                        placeholder='Description'
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                    ></textarea>
                                                    {
                                                        errors.description && <span className='text-danger'>{errors.description.message}</span>
                                                    }
                                                </div>

                                                <h4 className='h5 border-bottom pb-3 mb-3'>Pricing</h4>

                                                <div className='mb-3'>
                                                    <label htmlFor="sell-price" className='form-label'>Sell Price</label>
                                                    <input type="number"
                                                        {
                                                        ...register("sell_price", {
                                                            required: "The sell price field is required",
                                                        })
                                                        }
                                                        className={`form-control ${errors.sell_price ? 'is-invalid' : ''}`}
                                                        placeholder='Sell Price'
                                                        id='sell-price' />
                                                    {
                                                        errors.sell_price && <span className='text-danger'>{errors.sell_price.message}</span>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label htmlFor="cross-price" className='form-label'>cross Price</label>
                                                    <input type="number"
                                                        {
                                                        ...register("cross_price")
                                                        }
                                                        className={`form-control ${errors.cross_price ? 'is-invalid' : ''}`}
                                                        placeholder='cross Price'
                                                        id='cross-price' />
                                                    {
                                                        errors.cross_price && <span className='text-danger'>{errors.cross_price.message}</span>
                                                    }
                                                </div>

                                                <button 
                                                disabled={loading}
                                                className='btn btn-primary'>
                                                    {loading == false ? 'Update' : 'please wait...'}
                                                </button>
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