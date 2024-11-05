import { pool } from '../helpers/db.js';
import { Router } from 'express';
import { emptyOrRows } from '../helper/utils.js';
import { auth } from '../helper/auth.js';

const router = Router();

router.get('/', (req, res, next) => {
    pool.query('select * from task', (error, results) => {
        if (error) return next(error)
        return res.status(200).json(emptyOrRows(results))
    })
})

router.post('/create', auth, (req, res, next) => {
    pool.query('insert into task (description) values ($1) returning *',
        [req.body.description],
        (error, results) => {
            if (error) return next(error)
            return res.status(200).json({ id: results.rows[0].id })
        })
})

router.delete('/delete/:id', auth, (req, res, next) => {
    const id = parseInt(req.params.id);
    pool.query('delete from task where id = $1',
        [id],
        (error, results) => {
            if (error) return next(error)
            return res.status(200).json({ id })
        })
})

export default router;