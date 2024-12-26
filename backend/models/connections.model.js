import mongoose from "mongoose";


const connectionRrqest = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    connectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status_accepted: {
        type: Boolean,
        default: null,
    }

});

const ConnectionRrqest =  mongoose.model("ConnectionRrqest", connectionRrqest);

export default connectionRrqest;