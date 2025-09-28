import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
const Verify: React.FC = () => {
    const [code, setCode]= useState("");
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();
    const email =localStorage.getItem("email");

    const handleVerify = async(e: React.FormEvent)=>{
        e.preventDefault();
        setLoading(true);
        try {
            if(!email|| !code) throw Error("email,code not found!");
            
            const data = await authService.verifyCode(email,code);
            localStorage.setItem("token",data.token)
            alert("Login success!")
            navigator("/boards")

        } catch (error) {
             alert(error.message);
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ width: "400px" }}>
                <h3 className="text-center mb-4">Xác thực Email</h3>
                <form onSubmit={handleVerify}>
                    <div className="mb-3">
                        <label className="form-label">Mã xác thực</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập mã OTP"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn btn-success w-100" type="submit" disabled={loading}>
                        {loading ? "Đang xác thực..." : "Xác nhận"}
                    </button>
                </form>
            </div>
        </div>


    )

}

export default Verify;



// {"email":"anh112233@gmail.com",
// "code":"947980"
// }