import { Request, Response } from "express";
import { addDoc, getDoc, doc, collection, serverTimestamp, setDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";
import db from "../config/firebaseConfig";
import { Card } from "./interface";
import { AuthRequest } from "../middlewares/auth";

export const collectionCard = (boardId: string) => {
  return collection(db, "Boards", boardId, "Cards");
};

function fitterData(doc: any, data: any) {
  return {
    id: doc.id,
    name: data.name || "",
    description: data.description || "",
    createdAt: data.createdAt || null,
    ownerId: data.ownerId || "",
    list_member: Array.isArray(data.list_member) ? data.list_member.map((ref: any) => {  return ref }) : [],
    tasks_count: data.tasks_count,
  }
}

class CardController {

  async create(req: AuthRequest, res: Response) {
    try {
      const { name, description, list_member, tasks_count } = req.body;
      const { boardId } = req.params;
      const ownerId  = req.user?.userId;
      if(!ownerId){return 0}

      if (!boardId) return res.status(400).json({ message: "boardId undefined" });

      const card: Card = {
        name,
        description,
        createdAt: serverTimestamp(),
        ownerId: ownerId,
        list_member,
        tasks_count,
      };
      const newCard = await addDoc(collectionCard(boardId), card);
      // Trả về luôn id card
      res.status(200).json({
        message: "success",
        newCard: {
          cardId: newCard.id,
          ...card,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "faile", error })
    }
  }
  async getAll(req: Request, res: Response) {
    const { boardId } = req.params;
    if (!boardId) { return res.json("boardId underfine") }

    try {
      const getAllCards = await getDocs(collectionCard(boardId));
      const cards = getAllCards.docs.map((cards) => { return fitterData(cards, cards.data()) })
      res.status(200).json({ message: "succes", cards })
    } catch (error) {
      res.status(500).json({ message: "failed!" })
    }
  }
  async getById(req: Request, res: Response) {
    try {
      const { boardId, cardId } = req.params;
      if (!boardId || !cardId) return res.status(400).json({ status: "failed", message: "Missing id" });

      const docSnap = await getDoc(doc(db, "Boards", boardId, "Cards", cardId));
      if (!docSnap.exists()) return res.status(404).json({ status: "failed", message: "Card not found" });

      res.status(200).json({ status: "success", card: fitterData(docSnap, docSnap.data()) });
    } catch (error) {
      res.status(500).json({ status: "failed", message: "getById failed", error });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const { boardId, cardId } = req.params;
      if (!boardId || !cardId) return res.status(400).json({ status: "failed", message: "Missing id" });

      await setDoc(doc(db, "Boards", boardId, "Cards", cardId), req.body, { merge: true });
      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(500).json({ status: "failed", message: "update failed", error });
    }
  }
  async delete(req: Request, res: Response) {
    try {
      const { boardId, cardId } = req.params;
      if (!boardId || !cardId) return res.status(400).json({ status: "failed", message: "Missing id" });

      await deleteDoc(doc(db, "Boards", boardId, "Cards", cardId));
      res.status(200).json({ status: "success" });
    } catch (error) {
      res.status(500).json({ status: "failed", message: "delete failed", error });
    }
  }


  // Lấy card theo user
  async getByUser(req: Request, res: Response) {
    try {
      const { boardId, userId } = req.params;
      if (!boardId || !userId) return res.status(400).json({ status: "failed", message: "Missing params" });

      const queryOwnerId = query(collectionCard(boardId), where("ownerId", "==", userId));
      const snapshot = await getDocs(queryOwnerId);

      const cards = snapshot.docs.map(doc => fitterData(doc, doc.data()));
      return res.status(200).json({ cards });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}

export default new CardController();
