import React, { useCallback, useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from 'react-hot-toast'
import { apiUrl, token } from '../../../common/Config'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { MdDragIndicator } from 'react-icons/md'
import { BsPencilSquare } from 'react-icons/bs'
import { FaTrashAlt } from 'react-icons/fa'

import UpdateOutcome from './UpdateOutcome'
import ConfirmDeleteModal from './ConfirmDeleteModal'

const ManageOutcome = () => {
    const [loading, setLoading] = useState(false);
    const [outcomes, setOutcomes] = useState([]);
    const [outcomeData, setOutcomeData] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const params = useParams();

    const [showOutcome, setShowOutcome] = useState(false);
    const handleClose = () => setShowOutcome(false);
    const handleShow = (item) => {
        setOutcomeData(item);
        setShowOutcome(true);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(outcomes);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setOutcomes(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updatedOutcomes) => {
        const res = await fetch(`${apiUrl}/sort-outcome`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ outcomes: updatedOutcomes }),
        });
        const result = await res.json();
        if (result.status === 200) {
            toast.success(result.message);
        } else {
            toast.error(result.message || 'Failed to save order');
        }
    };

    const fetchOutcomes = useCallback(async () => {
        await fetch(`${apiUrl}/outcome?course_id=${params.id}`, {
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
                    setOutcomes(result.data);
                }
            })
    }, [params.id]);

    const onSubmit = async (data) => {
        setLoading(true);
        const formData = { ...data, course_id: params.id };

        await fetch(`${apiUrl}/outcome`, {
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
                    fetchOutcomes(); // Refresh data
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
            const res = await fetch(`${apiUrl}/outcome/${targetDelete.id}`, {
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
                setOutcomes(prev => prev.filter(o => o.id !== targetDelete.id));
                closeConfirm();
            } else {
                toast.error(result.message || 'Failed to delete outcome');
            }
        } catch (e) {
            toast.error('Something went wrong');
            console.error(e);
        } finally {
            setDeleting(false);
        }
    };

    useEffect(() => {
        fetchOutcomes();
    }, [fetchOutcomes]);

    return (
        <>
            <div className='card border-0 shadow-lg'>
                <div className='card-body p-4'>
                    <div className='d-flex'>
                        <h3 className='h5 mb-3'>Outcome</h3>
                    </div>

                    <form className='mb-3' onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                            <input type="text"
                                {
                                ...register("outcome", {
                                    required: "The outcome field is required",
                                })
                                }
                                className={`form-control ${errors.outcome ? 'is-invalid' : ''}`}
                                placeholder='Outcome' />
                            {
                                errors.outcome && <span className='text-danger'>{errors.outcome.message}</span>
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
                                        outcomes.map((item, index) => (
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

            <UpdateOutcome
                outcomeData={outcomeData}
                showOutcome={showOutcome}
                handleClose={handleClose}
                outcomes={outcomes}
                setOutcome={setOutcomes}
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

export default ManageOutcome