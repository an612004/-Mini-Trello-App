import React from "react";

interface SidebarProps {
    type: "boards" | "cards";
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ type, onClose }) => {
    if (type === "boards") {
        return (
            <div className="sidebar">
                <div className="p-3">
                    <nav>
                        <div className="mb-2">
                            <div className="nav-item active">
                                <div className="icon">
                                    <img src="/assets/logo.png" width={18} height={18} alt="logo" />
                                </div>
                                <span>Boards</span>
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="nav-item">
                                <div className="icon">👥</div>
                                <span>All Members</span>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }

    // Cards sidebar
    return (
        <div className="sidebar">
            <div className="p-3">
                <h6 className="sidebar-title">Your boards</h6>
                <div className="board-item">
                    <div className="board-icon">
                        <img src="/assets/logo.png" alt="logo" height={24} width={24} />
                    </div>
                    <span>My Trello board</span>
                </div>
                <div className="sidebar-footer">
                    <button className="btn-close" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
