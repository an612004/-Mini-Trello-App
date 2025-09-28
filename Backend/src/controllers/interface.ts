import { Timestamp,FieldValue } from "firebase/firestore";


// 1. Users
export interface User {
  userId?:string;
  boardId?: string;
  email: string;
  createdAt: Timestamp | FieldValue;
  boards: string[]; 
}

// 2. Boards
export interface Board {
  boardId?: string;
  name: string;
  description?: string;
  ownerId: string; 
  createdAt: Timestamp | FieldValue;
  members: string[];
  invites: string[];
}

// 3. Cards (subcollection of Boards)
export interface Card {
  boardId?: string;
  name: string;
  description?: string;
  createdAt: Timestamp | FieldValue;
  ownerId: string;
  list_member: string[];
  tasks_count: number;
}

// 4. Tasks (subcollection of Cards)
export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  taskId?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Timestamp | FieldValue;
  ownerId: string;
  assignedMembers: string[];
  githubAttachments: string[];
}

// 5. Invitations 
export type InviteStatus = "pending" | "accepted" | "declined";

export interface Invite {
  boardId?: string|undefined;
  boardOwnerId: string|undefined;
  memberId?: string; 
  emailMember: string;
  status: InviteStatus;
  createdAt: Timestamp | FieldValue;
}

// 6. GitHub Attachment (subcollection of Tasks)
export type GitHubAttachmentType = "pull_request" | "commit" | "issue";

export interface GitHubAttachments {
  attboardId?: string;
  type: GitHubAttachmentType;
  number?: string;
  sha?: string;    
  createdAt: Timestamp | FieldValue;
}

// 7. Email Verification Code
export interface EmailVerificationCodes {
  email?:string;
  code: string;
  expiresAt: Timestamp | FieldValue;
  createdAt: Timestamp | FieldValue;
}

// 8. Lists
export interface List {
  boardId?: string;
  title: string;
  cards: Card[];
}