import mongoose from "mongoose";

const IssueSchema = new mongoose.Schema({
    app: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
    },
    reportedBy: {
        type: String,
    },
}, { timestamps: true });

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;