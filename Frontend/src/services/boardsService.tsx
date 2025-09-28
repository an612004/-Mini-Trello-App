export const API_URL = "http://localhost:3000/boards";

class BoardsService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async create(name: string, description: string, invites: any) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, description, invites }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create board");
    }

    return res.json();
  }

  async getAll() {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get boards");
    }

    return res.json();
  }

  async getById(boardId: string) {
    const res = await fetch(`${API_URL}/${boardId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get board by id");
    }

    return res.json();
  }

  async update(boardId: string, data: any) {
    const res = await fetch(`${API_URL}/${boardId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update board");
    }

    return res.json();
  }

  async delete(boardId: string) {
    const res = await fetch(`${API_URL}/${boardId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete board");
    }

    return res.json();
  }
}

export default new BoardsService();
