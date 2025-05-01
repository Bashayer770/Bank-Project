
type TransactionType = "deposit" | "withdraw" | "transfer"

export interface Transaction {
    _id: string;
    type: TransactionType;
    amount: number;
    from: string;
    to: string;
    createdAt: Date;
    updatedAt: Date;    
}

export interface TransactionResponse{
    msg: string
}
