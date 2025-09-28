// CardDetail.tsx
import React, { useState, useEffect } from "react";
import { Button, Form, Card, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/tasks.scss";
import tasksService from "../services/tasksService";
import { MembersModal, DetailsModal } from "../components";

interface Task {
    id?: string;
    title: string;
    description: string;
    status: string;
    createdAt?: any;
    ownerId: string;
    assignedMembers: string[];
}

const Tasks = () => {
    const { boardId, cardId, taskId } = useParams<{ boardId: string; cardId: string; taskId?: string }>();
    const navigate = useNavigate();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [description, setDescription] = useState("");
    const [comment, setComment] = useState("");
    const [showMembersModal, setShowMembersModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        const fetchCardAndTask = async () => {
            if (!boardId || !cardId || !taskId) {
                console.error("BoardId or CardId or TaskId not provided");
                return;
            }
            try {
                setLoading(true);
                const dataTask = await tasksService.getById(boardId, cardId, taskId);
                console.log(dataTask)
                if (dataTask.task) {
                    setTask(dataTask.task);
                    setDescription(dataTask.task.description || "");
                } else {
                    console.error("Task not found");
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCardAndTask();
    }, [boardId, cardId, taskId]);

    const handleBack = () => {
        navigate(`/boards/${boardId}/cards`);
    };

   

    if (loading) {
        return <div className="loading">Loading task...</div>;
    }

    if (!task) {
        return <div className="error">Task not found</div>;
    }
    return (
        <div className="tasks-modal-overlay">
            <Card className="tasks-card">
                <Card.Header className="tasks-header d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title className="tasks-title text-dark">

                            {task.title}
                        </Card.Title>
                        <Card.Subtitle className="tasks-subtitle mt-2">
                            in list {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </Card.Subtitle>
                    </div>
                    <Button className="btn  btn-danger" onClick={handleBack}>
                        ×
                    </Button>
                </Card.Header>

                <Card.Body className="tasks-body">
                    <Row>
                        {/* Left Column - Main Content */}
                        <Col md={8}>
                            {/* Members and Notifications */}
                            <div className="members-section">
                                <div className="section-tabs">
                                    <span className="tab-active">Members</span>
                                    <span className="tab-inactive">Notifications</span>
                                </div>
                                <div className="members-controls">
                                    {task.assignedMembers && task.assignedMembers.length > 0 ? (
                                        task.assignedMembers.map((member, index) => (
                                            <div key={index} className="member-avatar">
                                                {member.substring(0, 2).toUpperCase()}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="member-avatar">
                                            {task.ownerId.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <Button
                                        className="add-member-btn"
                                    >
                                        +
                                    </Button>
                                    <Button className="watch-btn"   onClick={() => setShowMembersModal(true)}>
                                        Watch
                                    </Button>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="description-section">
                                <div className="section-header">

                                    <strong>Description</strong>
                                </div>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Add a more detailed description"
                                    className="description-textarea"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            {/* Activity */}
                            <div className="activity-section">
                                <div className="activity-header">
                                    <div className="activity-title">

                                        <strong>Activity</strong>
                                    </div>
                                    <Button
                                        className="show-details-btn"
                                        onClick={() => setShowDetailsModal(true)}
                                    >
                                        Show details
                                    </Button>
                                </div>
                                <div className="comment-input-wrapper">
                                    <div className="comment-avatar">
                                        {task.ownerId.substring(0, 2).toUpperCase()}
                                    </div>
                                    <Form.Control
                                        type="text"
                                        placeholder="Write a comment"
                                        className="comment-input"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                console.log("Adding comment:", comment);
                                                setComment("");
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </Col>

                        {/* Right Column - Sidebar */}
                        <Col md={4} className="sidebar pb-3">
                            {/* Add to card */}
                            <div className="add-to-card-section">
                                <strong className="section-title">Add to card</strong>
                                <Button
                                    className="members-btn"
                                    onClick={() => setShowMembersModal(true)}
                                >
                                    👥 Members
                                </Button>
                            </div>

                            {/* Power-Ups */}
                            <div className="power-ups-section">
                                <strong className="section-title">Power-Ups</strong>
                                <div className="github-container">
                                    <div className="github-header">
                                        <strong className="text-white">GitHub</strong>
                                    </div>
                                    <div className="github-actions">
                                        <Button className="github-btn">
                                            Attach Branch
                                        </Button>
                                        <Button className="github-btn">
                                            Attach Commit
                                        </Button>
                                        <Button className="github-btn">
                                            Attach Issue
                                        </Button>
                                        <Button className="github-btn">
                                            Attach Pull Request...
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Archive */}
                            <Button className="archive-btn">
                                🗃️ Archive
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Members Modal */}
            <MembersModal 
                show={showMembersModal}
                onHide={() => setShowMembersModal(false)}
                task={task}
            />

            {/* Details Modal */}
            <DetailsModal 
                show={showDetailsModal}
                onHide={() => setShowDetailsModal(false)}
                task={task}
                boardId={boardId}
                taskId={taskId}
            />
        </div>
    );
};

export default Tasks;
