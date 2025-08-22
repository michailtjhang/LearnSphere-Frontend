import React, { useCallback, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from 'react-hot-toast'
import { apiUrl, token } from '../../../common/Config'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { MdDragIndicator } from 'react-icons/md'
import { BsPencilSquare } from 'react-icons/bs'
import { FaTrashAlt } from 'react-icons/fa'

import UpdateRequirement from './UpdateRequirement'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const ManageRequirement = () => {

    const [loading, setLoading] = useState(false);
    const [requirements, setRequirements] = useState([]);
    const [requirementData, setRequirementData] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const params = useParams();

    const [showRequirement, setShowRequirement] = useState(false);
    const handleClose = () => setShowRequirement(false);
    const handleShow = (item) => {
        setRequirementData(item);
        setShowRequirement(true);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(requirements);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setRequirements(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updatedRequirements) => {
        const res = await fetch(`${apiUrl}/sort-requirement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ requirements: updatedRequirements }),
        });
        const result = await res.json();
        if (result.status === 200) {
            toast.success(result.message);
        } else {
            toast.error(result.message || 'Failed to save order');
        }
    };

    const fetchRequirements = useCallback(async () => {
        await fetch(`${apiUrl}/requirement?course_id=${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setRequirements(result.data);
                }
            })
    }, [params.id]);

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = { ...data, course_id: params.id };

        await fetch(`${apiUrl}/requirement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false);
                if (result.status == 201) {
                    toast.success(result.message);
                    reset();
                    fetchRequirements(); // Refresh data
                }
            })
    }

    // ===== Konfirmasi Delete =====
    const [showConfirm, setShowConfirm] = useState(false);
    const [targetDelete, setTargetDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const openConfirm = (item) => {
        setTargetDelete(item);
        setShowConfirm(true);
    };
    const closeConfirm = () => {
        if (deleting) return; // jangan tutup saat lagi delete
        setShowConfirm(false);
        setTargetDelete(null);
    };

    const confirmDelete = async () => {
        if (!targetDelete) return;
        setDeleting(true);
        try {
            const res = await fetch(`${apiUrl}/requirement/${targetDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            const result = await res.json();
            if (result.status === 200) {
                toast.success(result.message || 'Deleted');
                // Update list secara lokal biar terasa cepat
                setRequirements(prev => prev.filter(o => o.id !== targetDelete.id));
                closeConfirm();
            } else {
                toast.error(result.message || 'Failed to delete requirement');
            }
        } catch (e) {
            toast.error('Something went wrong');
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        fetchRequirements();
    }, [fetchRequirements]);

    return (
        <>
            <div className='card border-0 shadow-lg mt-4'>
                <div className='card-body p-4'>
                    <div className='d-flex'>
                        <h3 className='h5 mb-3'>Requirement</h3>
                    </div>

                    <form className='mb-3' onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                            <input type="text"
                                {
                                ...register("requirement", {
                                    required: "The requirement field is required",
                                })
                                }
                                className={`form-control ${errors.requirement ? 'is-invalid' : ''}`}
                                placeholder='Requirement' />
                            {
                                errors.requirement && <span className='text-danger'>{errors.requirement.message}</span>
                            }
                        </div>

                        <button
                            disabled={loading}
                            className='btn btn-primary'>
                            {loading == false ? 'Save' : 'please wait...'}
                        </button>
                    </form>

                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        requirements.map((item, index) => (
                                            <Draggable key={item.id} draggableId={`${item.id}`} index={index}>

                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className='card shadow mb-2'
                                                    >

                                                        <div className='card-body p-2 d-flex'>
                                                            <div><MdDragIndicator /></div>
                                                            <div className='d-flex justify-content-between w-100'>
                                                                <div className='ps-2'>{item.text}</div>
                                                                <div className='d-flex'>
                                                                    <button
                                                                        onClick={() => handleShow(item)}
                                                                        className='text-primary me-1 btn btn-link p-0'
                                                                        style={{ border: 'none', background: 'none' }}
                                                                    >
                                                                        <BsPencilSquare />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openConfirm(item)} // <— buka modal konfirmasi
                                                                        className='text-danger btn btn-link p-0'
                                                                        style={{ border: 'none', background: 'none' }}
                                                                    >
                                                                        <FaTrashAlt />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                </div>
            </div>

            <UpdateRequirement
                requirementData={requirementData}
                showRequirement={showRequirement}
                handleClose={handleClose}
                requirements={requirements}
                setRequirement={setRequirements}
            />

            {/* Modal konfirmasi delete */}
            <ConfirmDeleteModal
                show={showConfirm}
                item={targetDelete}
                loading={deleting}
                onCancel={closeConfirm}
                onConfirm={confirmDelete}
            />

        </>
    )
}

export default ManageRequirement