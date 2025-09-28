export const BOARD_API = "http://localhost:3000/boards";


// /boards/:boardId/invite // /boards/:boardId/cards/:id/invite/accept
class InviteService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getInvite(
    boardId: string,
    emailMember: string,
  ) {
    const res = await fetch(`${BOARD_API}/${boardId}/invite`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to send invite");
    }

    return res.json();
  }
  async invite(
    boardId: string,
    emailMember: string,
  ) {
    const res = await fetch(`${BOARD_API}/${boardId}/invite`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({  emailMember }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to send invite");
    }

    return res.json();
  }

  async acceptInvite(
    boardId: string,
    inviteId: string,
    action: string
  ) {
    const res = await fetch(
      `${BOARD_API}/${boardId}/invite/${inviteId}/accept`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ action }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to accept invite");
    }

    return res.json();
  }
}

export default new InviteService();
