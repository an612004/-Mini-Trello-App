export const API_URL = "http://localhost:3000/auth";

class authService{
    async sendEmail(email:string){
        const res  = await fetch(`${API_URL}/signup`,{
            method: "Post",
            headers: { "Content-Type": "application/json" },
            body :JSON.stringify({ email }),
        });

            if(!res.ok){
                const err = await res.json();
                throw new Error(err.message||"email failed" );
            }
            return res.json();

    }

    async verifyCode (email:string ,code:string ){
         const res  = await fetch(`${API_URL}/signin`,{
            method: "Post",
            headers: { "Content-Type": "application/json" },
            body :JSON.stringify({ email,code }),
        });

            if(!res.ok){
                const err = await res.json();
                throw new Error(err.message||"email failed" );
            }
             
            return res.json();    
    }

}
export default new  authService;