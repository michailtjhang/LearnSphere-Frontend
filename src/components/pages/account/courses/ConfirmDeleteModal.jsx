import { Modal, Button } from 'react-bootstrap';
import { FaExclamationTriangle } from 'react-icons/fa';

const ConfirmDeleteModal = ({ show, item, loading, onCancel, onConfirm }) => (
    <Modal show={show} onHide={onCancel} centered backdrop="static" keyboard={!loading}>
        <Modal.Header closeButton={!loading}>
            <Modal.Title className="d-flex align-items-center gap-2">
                <FaExclamationTriangle className="text-warning" />
                Delete Outcome
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p className="mb-2">Are you sure you want to delete this outcome?</p>
            <div className="bg-light border rounded p-2">
                <small className="text-muted">“{item?.text}”</small>
            </div>
            <p className="mt-3 mb-0 text-muted"><small>This action can’t be undone.</small></p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onCancel} disabled={loading}>
                Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} disabled={loading}>
                {loading ? 'Deleting…' : 'Delete'}
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ConfirmDeleteModal;
