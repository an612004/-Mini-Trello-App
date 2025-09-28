import { Request, Response } from "express";
import { addDoc, doc, setDoc, collection, serverTimestamp, getDoc, arrayUnion, updateDoc, getDocs, where, query } from "firebase/firestore";
import { Invite } from "./interface";
import db from "../config/firebaseConfig";
import { AuthRequest } from "../middlewares/auth";

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

const inviteRef = doc(collection(db, "Invitations"));
class inviteController {
    // /boards/:boardId/invite

    async getInvite(req: AuthRequest, res: Response) {
        try {
            const { boardId } = req.params;

            if (!boardId) {
                return res.status(400).json({ success: false, message: "Missing boardId" });
            }

            const invitesSnap = await getDocs(query(collection(db, "Invitations"), where("boardId", "==", boardId),where("emailMember", "==", req.user?.email )));
            const invites = invitesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            return res.status(200).json({ success: true, invites });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Server error", error });
        }
    }

   async invite(req: AuthRequest, res: Response) {
  try {
    const { boardId } = req.params;
    const { emailMember } = req.body;

    if (!boardId || !emailMember) {
      return res.status(400).json({ success: false, message: "Missing params" });
    }

    // Tìm user theo email
    const usersSnap = await getDocs(
      query(collection(db, "Users"), where("email", "==", emailMember))
    );

    if (usersSnap.empty) {
      return res.status(404).json({ success: false, message: "User not found with this email" });
    }

    const userDoc = usersSnap.docs[0];
    if (!userDoc) {
      return res.status(404).json({ success: false, message: "User document not found" });
    }
    const memberId = userDoc.id;

    // Lấy thông tin board
    const boardSnap = await getDoc(doc(db, "Boards", boardId));
    if (!boardSnap.exists()) {
      return res.status(404).json({ success: false, message: "Board not found" });
    }
    const boardData = fitterData(boardSnap, boardSnap.data());

    // Chặn mời chính mình
    if (memberId === boardData.ownerId) {
      return res.status(400).json({ success: false, message: "You cannot invite yourself" });
    }

    const invite: Invite = {
      boardId,
      boardOwnerId: boardData.ownerId,
      memberId,
      emailMember,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "Invitations"), invite);

    return res.status(201).json({ success: true, invite });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error });
  }
}



    // Nhận / từ chối lời mời
    // /boards/:boardId/invite/accept
async acceptInvite(req: Request, res: Response) {
    try {
        const { boardId, inviteId } = req.params;
        const { action } = req.body;

        if (!boardId || !inviteId || !action) {
            return res.status(400).json({ success: false, message: "Missing params" });
        }

        const inviteRef = doc(db, "Invitations", inviteId);
        const inviteSnap = await getDoc(inviteRef);

        if (!inviteSnap.exists()) {
            return res.status(404).json({ success: false, message: "Invite not found" });
        }

        const inviteData: any = inviteSnap.data();

        if (action === "accepted") {
            const cardsSnap = await getDocs(collection(db, "Boards", boardId, "Cards"));
            
            const updatePromises = cardsSnap.docs.map(async (cardDoc) => {
                const tasksSnap = await getDocs(collection(db, "Boards", boardId, "Cards", cardDoc.id, "Tasks"));

                const taskUpdatePromises = tasksSnap.docs.map(taskDoc => {
                    const taskRef = doc(db, "Boards", boardId, "Cards", cardDoc.id, "Tasks", taskDoc.id);
                    return setDoc(taskRef, {
                        // thêm cả member (người nhận) và owner (người mời)
                        assignedMembers: arrayUnion(inviteData.memberId, inviteData.boardOwnerId)
                    }, { merge: true });
                });

                await Promise.all(taskUpdatePromises);
            });

            await Promise.all(updatePromises);

            await updateDoc(inviteRef, { status: "accepted" });

        } else if (action === "declined") {
            await updateDoc(inviteRef, { status: "declined" });
        }

        return res.status(200).json({ success: true, action });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error });
    }
}


}
export default new inviteController();