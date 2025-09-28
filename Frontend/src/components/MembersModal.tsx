import React from "react";
import { Modal, ListGroup, Button } from "react-bootstrap";

interface Task {
    id?: string;
    title: string;
    description: string;
    status: string;
    createdAt?: any;
    ownerId: string;
    assignedMembers: string[];
}

interface MembersModalProps {
    show: boolean;
    onHide: () => void;
    task: Task | null;
}

const MembersModal: React.FC<MembersModalProps> = ({ show, onHide, task }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="members-modal"
        >
            <Modal.Header closeButton className="members-modal-header">
                <Modal.Title className="members-modal-title">
                    👥 Assigned Members
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="members-modal-body">
                {task && task.assignedMembers && task.assignedMembers.length > 0 ? (
                    <ListGroup variant="flush">
                        {task.assignedMembers.map((member, index) => (
                            <ListGroup.Item
                                key={index}
                                className="member-list-item"
                            >
                                <div className="member-info-container">
                                    <div className="member-avatar-large">
                                        {member.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div className="member-details">
                                        <div className="member-name">{member}</div>
                                        <div className="member-email">{member}</div>
                                        <div className="member-role">Member</div>
                                    </div>
                                    <div className="member-actions">
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            className="remove-member-btn"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <div className="no-members-message">
                        <div className="no-members-icon">👥</div>
                        <h5>No members assigned</h5>
                        <p>Add members to this task to help collaborate and track progress.</p>
                    </div>
                )}

                <div className="add-member-section">
                    <Button
                        variant="primary"
                        className="add-new-member-btn"
                    >
                        + Add Member
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default MembersModal;
