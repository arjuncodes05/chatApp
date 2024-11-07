

import { Client, Account, ID } from "appwrite";
import conf from "../env_Conf/conf";

export class AuthService{
    client = new Client()
    account;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.account = new Account(this.client)
    }

    async signup(email, username, password){
        try {
            return await this.account.create(
                ID.unique(),
                email,
                password,
                name
            )
        } catch (error) {
            console.log("Appwrite service :: signup() :: ", err);
            return false
        }
    }

    async login(email, password){
        try {
            return await this.account.createEmailPasswordSession(email, password)
        } catch (error) {
            console.log("Appwrite service :: login() :: ", err);
            return false 
        }
    }

    async logout(){
        try {
            return await this.account.deleteSessions()
        } catch (error) {
            console.log("Appwrite service :: logout() :: ", err);
            return false 
        }
    }

    async isLoggedIn(){
        try {
            return await this.account.get()
        } catch (error) {
            console.log("Appwrite service :: isLoggedIn() :: ", err);
            return false 
        }
    }
}