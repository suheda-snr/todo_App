import { selectAllTasks, createTask, removeTask } from "../models/Task.js";
import { emptyOrRows } from "../helper/utils.js";

const getTasks = async (req, res, next) => {
    try {
        const result = await selectAllTasks();
        return res.status(200).json(emptyOrRows(result));
    } catch (error) {
        return next(error);
    }
}

const postTask = async (req, res, next) => {
    try {
        if (!req.body.description || req.body.description.length === 0) {
            const error = new Error('Invalid description for task');
            error.statusCode = 400;
            return next(error);
        }
        const result = await createTask(req.body.description);
        return res.status(200).json(
            { id: result.rows[0].id }
        )
    } catch (error) {
        return next(error);
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (!id) {
            const error = new Error("Invalid id for task")
            return next(error);
        }
        const result = await removeTask(id);
        return res.status(200).json({ id: id });
    } catch (error) {
        return next(error);
    }
}

export { getTasks, postTask, deleteTask };
