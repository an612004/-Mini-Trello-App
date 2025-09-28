import { Request, Response } from "express";
import { collection, query, where, getDocs, setDoc, addDoc, serverTimestamp, updateDoc, Timestamp, doc, and } from "firebase/firestore"
import db from "../config/firebaseConfig";
import jwt from "jsonwebtoken";
import { EmailVerificationCodes, User } from "./interface";
import { sendVerificationCode } from "../utils/email";


function fitterData(doc: any, data: any) {
    return {
        email: data.email || undefined,
        code: data.code,
        expiresAt: data.expiresAt || null,
        createdAt: data.createdAt || null,


    };

}

const usersCollection = collection(db, "Users");
const OTPCollection = collection(db, "emailVerificationCodes");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

class authController {

    

    async signup(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ error: "Email is required" });
            }


            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000));
            await sendVerificationCode(email, code);

            
            const q = query(OTPCollection, where("email", "==", email));
            const snapshot = await getDocs(q);

            const otpData = {
                email,
                code,
                createdAt: serverTimestamp(),
                expiresAt: expires,
            };
            console.log("Generated OTP data:", otpData);

            if (!snapshot.empty) {
                // Nếu email đã có → ghi đè (update)
                const docRef = snapshot.docs[0]?.ref; 
                if (docRef) {
                    await setDoc(docRef, otpData, { merge: true });
                }
            } else {
                // Nếu chưa có → thêm mới
                await addDoc(OTPCollection, otpData);
            }

            return res.status(200).json({ otpData });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: (error as Error).message });
        }
    };

    // /auth/signin
    // Signin: check code and return JWT
  async signin(req: Request, res: Response) {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ error: "Email and code required" });
        }

        // check otp
        const q = query(
            OTPCollection,
            where("email", "==", email),
            where("code", "==", code)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // query user theo email
        const qUser = query(usersCollection, where("email", "==", email));
        const snapshotUser = await getDocs(qUser);

        let userId: string;

        if (snapshotUser.empty) {
            // user chưa tồn tại → tạo mới
            const newUserRef = doc(usersCollection);
            userId = newUserRef.id;

            const newUser: User = {
                boardId: "",
                email,
                createdAt: serverTimestamp(),
                boards: [],
            };
            await setDoc(newUserRef, newUser);
        } else {
            // user đã tồn tại
            const ref = snapshotUser.docs[0];
            if (!ref) {
                return res.status(400).json({ error: "Invalid user reference" });
            }
            userId = ref.id;
        }

        // ký JWT với userId là id của collection
        const token = jwt.sign(
            { userId, email },
            JWT_SECRET,
            { expiresIn: "4h" }
        );

        return res.status(200).json({ token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: (error as Error).message });
    }
}



}

export default new authController();