export const BASE_URL = "http://localhost:3000";

export const API_URL = {
  boards: `${BASE_URL}/boards`,
  cards: (boardId: string) => `${BASE_URL}/boards/${boardId}/cards`,
  cardById: (boardId: string, cardId: string) => `${BASE_URL}/boards/${boardId}/cards/${cardId}`,
};

class CardsService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async create(
    boardId: string,
    name: string,
    description: string,
    list_member: any,
    tasks_count: number
  ) {
    const res = await fetch(`${API_URL.cards(boardId)}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, description, list_member, tasks_count }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create card");
    }

    return res.json();
  }


  async getAll(boardId: string) {
    const res = await fetch(`${API_URL.cards(boardId)}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get cards");
    }
    return res.json();
  }

  async getById(boardId: string, cardId: string) {
    const res = await fetch(`${API_URL.cardById(boardId, cardId)}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get card by id");
    }

    return res.json();
  }

  async update(boardId: string, cardId: string, data: any) {
    const res = await fetch(`${API_URL.cardById(boardId, cardId)}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update card");
    }

    return res.json();
  }

  async delete(boardId: string, cardId: string) {
    const res = await fetch(`${API_URL.cardById(boardId, cardId)}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete card");
    }

    return res.json();
  }

  async getByUser(boardId: string, userId: string) {
    const res = await fetch(`${API_URL.cards(boardId)}/user/${userId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get cards by user");
    }

    return res.json();
  }
}

export default new CardsService();
