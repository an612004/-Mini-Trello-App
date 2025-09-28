import React, { useEffect, useState } from "react";
import inviteService from "../services/inviteService";



interface Invite {
    id: string;
    boardId: string;
    boardOwnerId: string;
    memberId: string;
    emailMember: string;
    status: "pending" | "accepted" | "declined";
    createdAt: any;
}

const Invite = ({ boardId }) => {


    const [inviteEmail, setInviteEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);




    const handleInvite = async () => {
        if (!inviteEmail.trim() || !boardId) return;

        try {
            await inviteService.invite(boardId, inviteEmail);
            setInviteEmail("");
            setShowInviteModal(false);
            alert("Invitation sent successfully!");
        } catch (error) {
            console.error("Failed to send invitation:", error);
            alert("Failed to send invitation. Please try again.");
        }
    };
    const copyInviteLink = () => {
        const inviteLink = `${window.location.origin}/boards/${boardId}/invite`;
        navigator.clipboard.writeText(inviteLink).then(() => {
            alert("Invite link copied to clipboard!");
        }).catch(err => {
            console.error('Failed to copy link: ', err);
        });
    };
    return (
        <div>
            {boardId && (
                <div>
                    <button
                        className={"btn border bg-dark text-white"}
                        onClick={() => setShowInviteModal(true)}
                        title="Invite to board"
                    >
                       Invite Members
                    </button>
                    {showInviteModal && (
                        <div>
                            {loading ? (<div className="loading-indicator">Loading...</div>) : (
                                <div className="modal-overlay" onClick={() => setShowInviteModal(false)}>
                                    <div className="invite-modal" onClick={(e) => e.stopPropagation()}>
                                        <div className="modal-header">
                                            <h4>Invite to Board</h4>
                                            <button className="modal-close" onClick={() => setShowInviteModal(false)}>✕</button>
                                        </div>
                                        <div className="modal-body">
                                            <input
                                                type="email"
                                                className="invite-input"
                                                placeholder="Email address or name"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handleInvite();

                                                }}
                                                autoFocus
                                            />
                                            <div className="invite-link-section">
                                                <div className="invite-text">Invite someone to this Workspace with a link:</div>
                                            </div>
                                            <div className="modal-actions d-flex justify-content-space-between">
                                                <button className="copy-link-btn" onClick={copyInviteLink}>
                                                    Copy link
                                                </button>
                                                <button className="invite-send-btn" onClick={handleInvite}>
                                                    Send Invitation
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )}
                        </div>
                    )}

                </div>
            )}

        </div>
    )
}

export default Invite;