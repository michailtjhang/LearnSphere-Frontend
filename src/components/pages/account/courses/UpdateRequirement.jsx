import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { apiUrl, token } from '../../../common/Config'

const UpdateRequirement = ({ requirementData, showRequirement, handleClose, requirements, setRequirement }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { title: '' } // optional
    });

    const onSubmit = async (data) => {
        if (!requirementData) return; // guard
        setLoading(true);
        try {
            const res = await fetch(`${apiUrl}/requirement/${requirementData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ requirement: data.title }),
            });
            const result = await res.json();
            setLoading(false);
            if (result.status === 200) {
                toast.success(result.message);
                const updated = requirements.map(o =>
                    o.id === requirementData.id ? { ...o, text: data.title } : o
                );
                setRequirement(updated);
                handleClose();
            } else {
                toast.error(result.message || 'Failed to update requirement');
            }
        } catch (e) {
            setLoading(false);
            toast.error('Something went wrong');
            console.error(e);
        }
    };

    useEffect(() => {
        if (requirementData) {
            reset({ title: requirementData.text });
        }
    }, [requirementData, reset]);

  return (
      <Modal size='lg' show={showRequirement} onHide={handleClose}>
          <form onSubmit={handleSubmit(onSubmit)}>
              <Modal.Header closeButton>
                  <Modal.Title>Update Requirement</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <div className='mb-3'>
                      <label className='form-label'>Title</label>
                      <input
                          {...register('title', { required: 'Title is required' })}
                          type='text'
                          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                          placeholder='Enter title'
                      />
                      {errors.title && <span className='text-danger'>{errors.title.message}</span>}
                  </div>
              </Modal.Body>
              <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose} disabled={loading}>
                      Close
                  </Button>
                  <Button variant="primary" type='submit' disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
              </Modal.Footer>
          </form>
      </Modal>
  )
}

export default UpdateRequirement