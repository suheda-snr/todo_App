import { pool } from '../helpers/db.js';
import { Router } from 'express';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
const { sign } = jwt

const router = Router();

router.post('/register', (req, res, next) => {

    hash(req.body.password, 10, (error, hashedPassword) => {
        if (error) next(error) //hash error
        try {
            pool.query('insert into account(email, password) values ($1, $2) returning *',
                [req.body.email, hashedPassword],
                (error, results) => {
                    if (error) return next(error) // db error
                    res.status(201).json({ id: results.rows[0].id, email: results.rows[0].email })
                }
            )
        } catch (error) {
            return next(error)
        }
    })
})

router.post('/login', (req, res, next) => {
    const invalid_message = 'Invalid credentials.'
    try {
        pool.query('select * from account where email=$1',
            [req.body.email],
            (error, result) => {
                if (error) next(error) // db error
                if (result.rowCount === 0) return next(new Error(invalid_message))
                compare(req.body.password, result.rows[0].password, (error, match) => {
                    if (error) return next(error) // compare error
                    if (!match) return next(new Error(invalid_message))
                    const token = sign({ user: req.body.email }, process.env.JWT_SECRET_KEY)
                    const user = result.rows[0]
                    return res.status(200).json(
                        {
                            'id': user.id,
                            'email': user.email,
                            'token': token
                        }
                    )
                })
            })
    } catch (error) {
        return next(error)
    }
})


export default router;