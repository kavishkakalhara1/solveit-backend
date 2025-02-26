import Issue from "../models/issues/issue.model.js";
import User from "../models/users/User.model.js";
import { errorHandler } from "../utils/error.js";

const generateIssueId = async () => {
    const issueId = Math.random().toString(36).slice(-6);
    return issueId;
}

export const createIssue = async (req, res, next) => {
    const issueId = await generateIssueId();
    
    const {
        app,
        severity,
        description,
        type,
        status,
        assignedTo,
        reportedBy
    } = req.body;

    req.body.trend2 = issueId;

    if (
        !app ||
        !severity ||
        !type ||
        !reportedBy
    ) {
        next(errorHandler(400, "All fields are required"));
    }

    const newIssue = new Issue({
        app,
        severity,
        description,
        type,
        status,
        assignedTo,
        reportedBy
    });

    try {
        await newIssue.save();
        res.json("Issue created successfully");
    } catch (error) {
        next(error);
    }
};


//Get issues
export const getIssues = async (req, res, next) => {
    try {
        // Fetch all issues
        const issues = await Issue.find();

        // Extract unique user IDs from issues
        const userIds = [...new Set(issues.map(issue => issue.reportedBy))];

        // Fetch user details for those IDs
        const users = await User.find({ _id: { $in: userIds } }, { _id: 1, email: 1 });

        // Create a mapping of user _id to email
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.email;
            return acc;
        }, {});

        // Replace reportedBy (user _id) with email in the response
        const formattedIssues = issues.map(issue => ({
            ...issue.toObject(),
            reportedBy: userMap[issue.reportedBy?.toString()] || "Unknown", // Replace _id with email
        }));

        res.json(formattedIssues);
    } catch (error) {
        next(error);
    }
};