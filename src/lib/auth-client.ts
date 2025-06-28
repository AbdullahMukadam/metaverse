
import { createAuthClient } from "better-auth/react"
import { config } from "dotenv";
config({ path: ".env" });

export const authClient = createAuthClient({
     baseURL: process.env.FRONTEND_URL as string
})
