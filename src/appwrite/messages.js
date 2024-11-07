import { Client, Databases, ID, Query, Realtime } from "appwrite";
import conf from "../env_Conf/conf";


export class MessageServices{
    client = new Client();
    databases;
    realtime;

    constructor(){
        this.client.setEndpoint(conf.appwriteUrl).setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client);
        this.realtime = new Realtime(this.client);
    }

    async getMessages(conversationId){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteMessagesId,
                [
                    Query.equal("conversationId", conversationId)
                ]
            )
        } catch (error) {
            console.log("Appwrite service :: getMessages() :: ", err);
            return false
        }
    }

    async sendMessage(conversationId, senderId, message){
       try{
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteMessagesId,
            ID.unique(),
            {
                conversationId: conversationId,
                senderId: senderId,
                message: message,
                timestamp: new Date().toISOString(),
                readReceipt: false,
            }
        );
       } catch(err){
        console.log("Appwrite service :: sendMessage() :: ", err);
        return false
       }
    }

    listenToMessages(conversationId, useCallback) {
        this.realtime.subscribe(
            `collections.${conf.appwriteDatabaseId}.documents.${conf.appwriteMessagesId}.create`, 
            (response) => {
                // Check if the document belongs to the desired conversation
                if (response.payload.conversation_id === conversationId) {
                    useCallback(response.payload); // Pass the message data to the callback
                }
            }
        );
    }

    async markMessageAsRead(messageId) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteMessagesId,
                messageId,  // The message ID to update
                {
                    readReceipt: true
                }
            );
        } catch (err) {
            console.log("Appwrite service :: markMessageAsRead() :: ", err);
            return false;
        }
    }
}

const messageServices = new MessageServices()
export default messageServices;