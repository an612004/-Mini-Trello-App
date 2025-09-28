export const BASE_URL = "http://localhost:3000";

//--get    repositories/:repositoryId/github-info 
//  attach `/boards/:boardId/cards/:cardId/tasks/:taskId/github-attach`
// getList `/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments`
// remove `/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments/:attachmentId`

export const API_URL = {
  boards: `${BASE_URL}/boards`,
  tasks: (boardId: string, cardId: string) =>
    `${BASE_URL}/boards/${boardId}/cards/${cardId}/tasks`,
  taskById: (boardId: string, cardId: string, taskId: string) =>
    `${BASE_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}`,
  assignMember: (boardId: string, cardId: string, taskId: string) =>
    `${BASE_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign`,
  memberById: (boardId: string, cardId: string, taskId: string, memberId: string) =>
    `${BASE_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}/assign/${memberId}`,
};

class TasksService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async create(
    boardId: string,
    cardId: string,
    title: string,
    description: string,
    status: string,
    assignedMembers: any,
    githubAttachments: any
  ) {
    const res = await fetch(API_URL.tasks(boardId, cardId), {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        title,
        description,
        status,
        assignedMembers,
        githubAttachments,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create task");
    }

    return res.json();
  }

  async getAll(boardId: string, cardId: string) {
    const res = await fetch(API_URL.tasks(boardId, cardId), {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get tasks");
    }

    return res.json();
  }

  async getById(boardId: string, cardId: string, taskId: string) {
    const res = await fetch(API_URL.taskById(boardId, cardId, taskId), {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get task by id");
    }

    return res.json();
  }

  async update(boardId: string, cardId: string, taskId: string, data: any) {
    const res = await fetch(API_URL.taskById(boardId, cardId, taskId), {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update task");
    }

    return res.json();
  }

  async delete(boardId: string, cardId: string, taskId: string) {
    const res = await fetch(API_URL.taskById(boardId, cardId, taskId), {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete task");
    }

    return res.json();
  }

  async assignMember(boardId: string, cardId: string, taskId: string, memberId: string) {
    const res = await fetch(API_URL.memberById(boardId, cardId, taskId, memberId), {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to assign member");
    }

    return res.json();
  }

  async getMembers(boardId: string, cardId: string, taskId: string) {
    const res = await fetch(API_URL.assignMember(boardId, cardId, taskId), {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get members");
    }

    return res.json();
  }

  async removeMember(boardId: string, cardId: string, taskId: string, memberId: string) {
    const res = await fetch(API_URL.memberById(boardId, cardId, taskId, memberId), {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to remove member");
    }

    return res.json();
  }
}

export default new TasksService();
