import React from "react";
import { Modal } from "react-bootstrap";

interface Task {
    id?: string;
    title: string;
    description: string;
    status: string;
    createdAt?: any;
    ownerId: string;
    assignedMembers: string[];
}

interface DetailsModalProps {
    show: boolean;
    onHide: () => void;
    task: Task | null;
    boardId?: string;
    taskId?: string;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ show, onHide, task, boardId, taskId }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            size="lg"
            className="details-modal"
        >
            <Modal.Header closeButton className="details-modal-header">
                <Modal.Title className="details-modal-title">
                    📋 Task & Card Details
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="details-modal-body">
                {task && (
                    <div className="details-content">
                        {/* Task Details Section */}
                        <div className="details-section">
                            <h5 className="section-title">
                                <span className="section-icon">📝</span>
                                Task Information
                            </h5>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <label>Task ID:</label>
                                    <span>{taskId || 'N/A'}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Title:</label>
                                    <span>{task.title}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Status:</label>
                                    <span className={`status-badge status-${task.status}`}>
                                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <label>Owner ID:</label>
                                    <span>{task.ownerId}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Created At:</label>
                                    <span>{task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}</span>
                                </div>
                                <div className="detail-item full-width">
                                    <label>Description:</label>
                                    <div className="description-content">
                                        {task.description || 'No description provided'}
                                    </div>
                                </div>
                                <div className="detail-item full-width">
                                    <label>Assigned Members:</label>
                                    <div className="members-list">
                                        {task.assignedMembers && task.assignedMembers.length > 0 ? (
                                            task.assignedMembers.map((member, index) => (
                                                <span key={index} className="member-tag">
                                                    {member}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="no-data">No members assigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Board & Navigation Info */}
                        <div className="details-section">
                            <h5 className="section-title">
                                <span className="section-icon">🎯</span>
                                Navigation Information
                            </h5>
                            <div className="details-grid">
                                <div className="detail-item">
                                    <label>Board ID:</label>
                                    <span>{boardId}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Current Path:</label>
                                    <span className="path-info">
                                        Board → Card → Task
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default DetailsModal;
