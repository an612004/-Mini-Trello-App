import { Request, Response } from "express";
import { addDoc, getDoc, doc, collection, updateDoc, arrayRemove, serverTimestamp, setDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import db from "../config/firebaseConfig";
import { Task } from "./interface";
import { AuthRequest } from "../middlewares/auth";


export function collectionTask(boardId: string, cardId: string) {
  return collection(db, "Boards", boardId, "Cards", cardId, "Tasks");
};
export function docTaskId(boardId: string, cardId: string, taskId: string) {
  return doc(db, "Boards", boardId, "Cards", cardId, "Tasks", taskId);
};


function fitterData(doc: any, data: any) {
  return {
    id: doc.id,
    title: data.title || "",
    description: data.description || "",
    status: data.status || "",
    createdAt: data.createdAt || null,
    ownerId: data.ownerId || "",
    assignedMembers: Array.isArray(data.assignedMembers) ? data.assignedMembers.map((ref: any) => { return ref }) : []
  }
}


class taskController {
  async create(req: AuthRequest, res: Response) {
    try {
      const { title, description, status, assignedMembers, githubAttachments } = req.body;
      const { boardId, cardId } = req.params;
      const ownerId = req.user?.userId;
      if (!ownerId) { return 0 }
      console.log("req.params", req.params)
      if (!boardId || !cardId) {
        console.log(boardId, cardId)
        return res.status(400).json({ message: "Missing boardId or cardId" });
      }

      const task: Task = {
        title,
        description,
        status,
        ownerId,
        assignedMembers,
        githubAttachments,
        createdAt: serverTimestamp(),
      };

      const newTasks = await addDoc(collectionTask(boardId, cardId), task);
      res.status(200).json({
        message: "success",
        newTask: {
          taskId: newTasks.id,
          ...task,
        },
      });
      res.status(200).json({ message: "success", newTask: newTasks });
    } catch (error) {
      res.status(500).json({ message: "failed", error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { boardId, cardId } = req.params;
      if (!boardId || !cardId) return res.json("err taskID");

      const getAllTasks = await getDocs(collectionTask(boardId, cardId));
      const tasks = getAllTasks.docs.map(doc => fitterData(doc, doc.data()));
      res.status(200).json({ message: "success", tasks });
    } catch (error) {
      res.status(500).json({ message: "failed!" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { boardId, cardId, taskId } = req.params;
      if (!boardId || !cardId || !taskId) {
        return res.status(400).json({ status: "failed", message: "Missing params" });
      }

      const docRef = docTaskId(boardId, cardId, taskId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists())
        return res.status(404).json({ status: "failed", message: "Task not found" });

      res.status(200).json({ status: "success", task: fitterData(docSnap, docSnap.data()) });
    } catch (error) {
      res.status(500).json({ status: "failed", message: "getById failed", error });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { boardId, cardId, taskId } = req.params;
      if (!boardId || !cardId || !taskId) {
        return res.status(400).json({ status: "failed", message: "Missing params" });
      }

      const docRef = docTaskId(boardId, cardId, taskId);
      await setDoc(docRef, req.body, { merge: true });

      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(500).json({ status: "failed", message: "update failed", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { boardId, cardId, taskId } = req.params;
      if (!boardId || !cardId || !taskId) {
        return res.status(400).json({ status: "failed", message: "Missing params" });
      }

      await deleteDoc(docTaskId(boardId, cardId, taskId));
      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(500).json({ status: "failed", message: "delete failed", error });
    }
  }
  // /boards/:boardId/cards/:cardId/tasks/:taskId/assign
  async assignMember(req: Request, res: Response) {
    try {
      const memberId = req.body;
      const { boardId, cardId, taskId, } = req.params;
      if (!boardId || !cardId || !taskId || !memberId) {
        return res.status(400).json({ status: "failed", message: "Missing params" });
      }

      const docRef = docTaskId(boardId, cardId, taskId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return res.status(404).json({ message: "Task not found" });

      const taskData: any = docSnap.data();
      const assignedMembers = taskData.assignedMembers || [];

      // check add
      if (!assignedMembers.includes(memberId)) { assignedMembers.push(memberId); }
      //setid
      await setDoc(docRef, { assignedMembers }, { merge: true });

      return res.status(200).json({ message: "Member assigned", assignedMembers });
    } catch (error) {
      return res.status(500).json({ message: "assign failed", error });
    }
  }
  // /boards/:boardId/cards/:cardId/tasks/:taskId/members
  async getMembers(req: Request, res: Response) {
    try {
      const { boardId, cardId, taskId } = req.params;
      if (!boardId || !cardId || !taskId) {
        return res.status(400).json({ status: "failed", message: "Missing params" });
      }

      const docRef = docTaskId(boardId, cardId, taskId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return res.status(404).json({ message: "Task not found" });

      const taskData: any = docSnap.data();
      return res.status(200).json({ members: taskData.assignedMembers || [] });
    } catch (error) {
      return res.status(500).json({ message: "getMembers failed", error });
    }
  }
  // /boards/:boardId/cards/:cardId/tasks/:taskId/members/:memberId
  async removeMember(req: Request, res: Response) {
    try {
      const { boardId, cardId, taskId, memberId } = req.params;
      if (!boardId || !cardId || !taskId || !memberId) {
        return res.status(400).json({ status: "failed", message: "Missing params" });
      }

      const docRef = docTaskId(boardId, cardId, taskId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return res.status(404).json({ message: "Task not found" });

      const assignedMembers: any = docSnap.data().assignedMembers || []

      //delete on array
      await updateDoc(docRef, {
        assignedMembers: arrayRemove({ memberId })
      });


      return res.status(200).json({ message: "Member removed", assignedMembers });
    } catch (error) {
      return res.status(500).json({ message: "removeMember failed", error });
    }
  }
}


export default new taskController();
