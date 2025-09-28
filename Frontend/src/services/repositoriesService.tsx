export const BASE_URL = "http://localhost:3000";

export const API_URL = {
  repoInfo: (repositoryId: string) =>
    `${BASE_URL}/repositories/${repositoryId}/github-info`,
  attachGithub: (boardId: string, cardId: string, taskId: string) =>
    `${BASE_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attach`,
  listAttachments: (boardId: string, cardId: string, taskId: string) =>
    `${BASE_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments`,
  deleteAttachment: (
    boardId: string,
    cardId: string,
    taskId: string,
    attachmentId: string
  ) =>
    `${BASE_URL}/boards/${boardId}/cards/${cardId}/tasks/${taskId}/github-attachments/${attachmentId}`,
};

class RepositoriesService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async getRepoInfo(repositoryId: string) {
    const res = await fetch(API_URL.repoInfo(repositoryId), {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get repository info");
    }

    return res.json();
  }

  async attach(boardId: string, cardId: string, taskId: string, data: any) {
    const res = await fetch(API_URL.attachGithub(boardId, cardId, taskId), {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to attach github repo");
    }

    return res.json();
  }

  async getAttachments(boardId: string, cardId: string, taskId: string) {
    const res = await fetch(API_URL.listAttachments(boardId, cardId, taskId), {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to get github attachments");
    }

    return res.json();
  }

  async deleteAttachment(
    boardId: string,
    cardId: string,
    taskId: string,
    attachmentId: string
  ) {
    const res = await fetch(
      API_URL.deleteAttachment(boardId, cardId, taskId, attachmentId),
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to delete github attachment");
    }

    return res.json();
  }
}

export default new RepositoriesService();
