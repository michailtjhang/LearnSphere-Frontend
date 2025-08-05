import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../common/Layout'
import { useForm } from 'react-hook-form'
import { apiUrl } from '../common/Config'
import toast from 'react-hot-toast'
import { AuthContext } from '../context/Auth'

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(result => {
        console.log("Registration successful:", result);
        if (result.status == 200) {
          const userInfo = {
            name: result.name,
            id: result.id,
            token: result.token
          }
          localStorage.setItem('userInfoLMS', JSON.stringify(userInfo));
          login(userInfo);
          navigate('/account/dashboard');
        } else {
          toast.error(result.message);
        }
      })
  };

  return (
    <>
      <Layout>
        <div className='container py-5 mt-5'>
          <div className='d-flex align-items-center justify-content-center'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='card border-0 shadow login'>
                <div className='card-body p-4'>
                  <h3 className='border-bottom pb-3 mb-3'>Login</h3>
                  <div className='mb-3'>
                    <label className='form-label' htmlFor="email">Email</label>
                    <input
                      {
                      ...register("email", {
                        required: "The email field is required",
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: "Please enter a valid email address"
                        }
                      })
                      }
                      type="text"
                      className='form-control'
                      placeholder='Email' />
                    {
                      errors.email && <span className='text-danger'>{errors.email.message}</span>
                    }
                  </div>

                  <div className='mb-3'>
                    <label className='form-label' htmlFor="password">Password</label>
                    <input
                      {
                      ...register("password", {
                        required: "The password field is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters long"
                        }
                      })
                      }
                      type="password"
                      className='form-control'
                      placeholder='Password' />
                    {
                      errors.password && <span className='text-danger'>{errors.password.message}</span>
                    }
                  </div>

                  <div className='d-flex justify-content-between align-items-center'>
                    <button className='btn btn-primary'>Login</button>
                    <Link to={`/account/register`} className='text-secondary'>Register Here</Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Login