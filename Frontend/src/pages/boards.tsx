import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/boards.scss";
import boardsService from "../services/boardsService";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";



interface Board {
    id: string;
    name: string;
    description?: string;
    color?: "white";

}

const Boards: React.FC = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newBoardName, setNewBoardName] = useState("");
    const [newBoardDescription, setNewBoardDescription] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const data = await boardsService.getAll();
                setBoards(data.boards);
            } catch (error) {
                console.error("Failed to fetch boards:", error);
            }
        };
        fetchBoards();
    }, [boards]);

    const handleCreateBoard = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!newBoardName.trim()) return;

        try {
            const newBoard = await boardsService.create(newBoardName, newBoardDescription, []);
            setBoards([...boards, newBoard]);
            setNewBoardName("");
            setNewBoardDescription("");
            setShowCreateForm(false);
        } catch (error) {
            console.error("Failed to create board:", error);
        }
    };
    const deleteBoard = async (boardId: string) => {
        await boardsService.delete(boardId);
        setBoards(boards.filter(board => board.id !== boardId));
    }

    return (
        <div className="boards-container" style={{ background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)", minHeight: "100vh" }}>
            <TopBar showAppsMenu={true} />
            <Sidebar type="boards" />

            {/* Main Content */}
            <div className="main-content">
                <div style={{ padding: "32px" }}>
                    <div style={{ marginBottom: "32px" }}>
                        <h2 style={{ fontWeight: 700, color: "#3b5998", letterSpacing: 1 }}>YOUR WORKSPACES</h2>
                    </div>

                    {/* Boards Grid */}
                    <div className="boards-grid" style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
                        {boards.map((board, index) => (
                            <div
                                key={index}
                                className="board-card"
                                style={{
                                    background: "#fff",
                                    borderRadius: 16,
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                                    padding: "24px 32px",
                                    minWidth: 260,
                                    minHeight: 120,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    position: "relative",
                                    cursor: "pointer",
                                    transition: "box-shadow 0.2s",
                                }}
                                onClick={() => navigate(`/boards/${board.id}/cards`)}
                                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.16)")}
                                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.08)")}
                            >
                                <div>
                                    <div style={{ fontSize: 20, fontWeight: 600, color: "#3b5998" }}>{board.name}</div>
                                    <div style={{ color: "#888", marginTop: 4 }}>{board.description}</div>
                                </div>
                                <button
                                    className="delete-btn"
                                    style={{
                                        position: "absolute",
                                        top: 12,
                                        right: 16,
                                        background: "#f5f6fa",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: 32,
                                        height: 32,
                                        fontSize: 20,
                                        color: "#d32f2f",
                                        cursor: "pointer",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm("Bạn có chắc muốn xoá board này không?")) {
                                            deleteBoard(board.id);
                                        }
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {/* Create New Board */}
                        <div>
                            {!showCreateForm ? (
                                <div
                                    className="create-board"
                                    style={{
                                        background: "#e0eafc",
                                        borderRadius: 16,
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                        minWidth: 260,
                                        minHeight: 120,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        fontSize: 18,
                                        color: "#3b5998"
                                    }}
                                    onClick={() => setShowCreateForm(true)}
                                >
                                    + Create a new board
                                </div>
                            ) : (
                                <form
                                    className="card p-3 shadow-sm"
                                    style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", minWidth: 260, minHeight: 120 }}
                                    onSubmit={handleCreateBoard}
                                >
                                    <label style={{ fontWeight: 500 }}>Name</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Add board title"
                                        name="name"
                                        value={newBoardName}
                                        onChange={(e) => setNewBoardName(e.target.value)}
                                        autoFocus
                                    />
                                    <label style={{ fontWeight: 500 }}>Description</label>
                                    <input
                                        type="text"
                                        className="form-control mb-2"
                                        placeholder="Add board description"
                                        name="description"
                                        value={newBoardDescription}
                                        onChange={(e) => setNewBoardDescription(e.target.value)}
                                    />
                                    <div style={{ display: "flex", justifyContent: "end", gap: 8, marginTop: 12 }}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={!newBoardName.trim()}
                                        >
                                            Create
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => {
                                                setShowCreateForm(false);
                                                setNewBoardName("");
                                                setNewBoardDescription("");
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Boards;
