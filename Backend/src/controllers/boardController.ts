import { collection, getDocs, addDoc, getDoc, doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { Request, Response } from "express";
import { Board } from "./interface";
import db from "../config/firebaseConfig";
import { AuthRequest } from "../middlewares/auth";



// Collection/doc ref
const collectionRef = collection(db, "Boards")


function fitterData(doc: any, data: any) {
    return {
        id: doc.id,
        name: data.name || "",
        description: data.description || "",
        ownerId: data.ownerId || "",
        createdAt: data.createdAt || null,
        members: Array.isArray(data.members) ? data.members.map((ref: any) => ref.id) : [],
        invites: Array.isArray(data.invites) ? data.invites.map((ref: any) => ref.id) : []
    };

}




class boardController {



    async create(req: Request, res: Response) {
        try {
            const { name, description, invites } = req.body
            console.log(req.body);


            const board: Board = {
                name: name,
                description: description,
                ownerId: "",
                members: [],
                invites: invites,
                createdAt: serverTimestamp(),
            }
             await addDoc(collectionRef, board);
            const snapshot = await getDocs(collection(db, "Boards"));
             const boards = snapshot.docs.map((doc) => ({
                boardId: doc.id,       //attatch id to object
                ...doc.data(),
            }));
            res.status(200).json({ status: "success!", boards});
            console.log(boards)
        } catch (error) {
            res.status(500).json({ status: "failed", error });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const getAllBoards = await getDocs(collectionRef);
            const boards = getAllBoards.docs.map(doc => { return fitterData(doc, doc.data()) });


            return res.status(200).json({ status: "success", boards });
        } catch (error) {
            return res.status(500).json({ status: "failed", message: "getAll boards failed", error });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { boardId } = req.params;
            if (!boardId) return res.status(400).json({ status: "failed", message: "Missing boardId" });

            const docSnap = await getDoc(doc(db, "Boards", boardId));
            if (!docSnap.exists()) return res.status(404).json({ status: "failed", message: "Board not found" });

            res.status(200).json({ status: "success", board: fitterData(docSnap, docSnap.data()) });
        } catch (error) {
            res.status(500).json({ status: "failed", message: "getById failed", error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { boardId } = req.params;
            if (!boardId) return res.status(400).json("boardId error")
            await setDoc(doc(db, "Boards", boardId), { contents: "some-data", }, { merge: true })

            res.status(200).json("Updated/merged!");
        } catch (error) {
            res.status(500).json(" error")
        };

    }

    async delete(req: Request, res: Response) {
        try {
            const { boardId } = req.params;
            if (!boardId) return res.status(400).json("boardId error")
            await deleteDoc(doc(db, "Boards", boardId))

            res.status(200).json("Updated/merged!");
        } catch (error) {
            res.status(500).json(" error")
        };

    }
}

export default new boardController();
