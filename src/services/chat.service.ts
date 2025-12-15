import { db } from './mockDatabase';

export interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string; // 'admin' or userId
    senderName: string;
    content: string;
    timestamp: string;
    read: boolean;
}

export interface Conversation {
    id: string;
    userId: string;
    userName: string;
    lastMessage: string;
    updatedAt: string;
    unreadCount: number;
}

const STORAGE_KEY_MSGS = 'CHAT_MESSAGES';
const STORAGE_KEY_CONVS = 'CHAT_CONVERSATIONS';

export const ChatService = {
    // Get or Create conversation for a user
    startConversation: (userId: string, userName: string): Conversation => {
        const convs = db.getAll<Conversation>(STORAGE_KEY_CONVS);
        let conv = convs.find(c => c.userId === userId);

        if (!conv) {
            conv = {
                id: `conv_${Date.now()}`,
                userId,
                userName,
                lastMessage: 'Nouvelle conversation',
                updatedAt: new Date().toISOString(),
                unreadCount: 0
            };
            db.add(STORAGE_KEY_CONVS, conv);
        }
        return conv;
    },

    getAllConversations: (): Conversation[] => {
        return db.getAll<Conversation>(STORAGE_KEY_CONVS).sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    },

    getMessages: (conversationId: string): ChatMessage[] => {
        const all = db.getAll<ChatMessage>(STORAGE_KEY_MSGS);
        return all.filter(m => m.conversationId === conversationId).sort((a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
    },

    sendMessage: (conversationId: string, senderId: string, senderName: string, content: string): ChatMessage => {
        const msg: ChatMessage = {
            id: `msg_${Date.now()}`,
            conversationId,
            senderId,
            senderName,
            content,
            timestamp: new Date().toISOString(),
            read: false
        };
        db.add(STORAGE_KEY_MSGS, msg);

        // Update conversation
        const convs = db.getAll<Conversation>(STORAGE_KEY_CONVS);
        const convIndex = convs.findIndex(c => c.id === conversationId);
        if (convIndex >= 0) {
            const conv = convs[convIndex];
            const updatedConv = {
                ...conv,
                lastMessage: content,
                updatedAt: new Date().toISOString(),
                unreadCount: senderId !== 'admin' ? conv.unreadCount + 1 : conv.unreadCount // Only increment if user sends
            };
            // Simple update hack for mockDB since it doesn't have updateByIndex exposed easily, 
            // but we can use db.update if we had IDs. mockDB.update uses id.
            db.update(STORAGE_KEY_CONVS, conv.id, updatedConv);
        }

        return msg;
    },

    markAsRead: (conversationId: string) => {
        const convs = db.getAll<Conversation>(STORAGE_KEY_CONVS);
        const conv = convs.find(c => c.id === conversationId);
        if (conv) {
            db.update(STORAGE_KEY_CONVS, conv.id, { ...conv, unreadCount: 0 });
        }
    }
};
