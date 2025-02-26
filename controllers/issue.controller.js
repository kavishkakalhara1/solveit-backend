import Issue from "../models/issues/issue.model.js";

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
        !status ||
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