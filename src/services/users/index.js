import express from 'express'
import createHttpError from 'http-errors'
import UserModel from './schema.js'
import { basicAuthMiddleware } from '../auth/basic.js'



const userRouter = express.Router()

userRouter.get("/", basicAuthMiddleware, async(req, res , next) => {
    try {
        const users = await UserModel.find()
        res.send(users)
    } catch (error) {
      next(error)  
    }
})

userRouter.get("/:userID", basicAuthMiddleware, async(req, res , next) => {
    try {
        const userId = req.params.userID
        const user = await UserModel.findById(userId)
        if(user){
            res.send(user)
        }else{
            next(createHttpError(404, `user with ${userId} not found!`))
        }
    } catch (error) {
      next(error)  
    }
})

userRouter.post("/", basicAuthMiddleware, async(req, res , next) => {
    try {
        const user = new UserModel(req.body)
        const {_id} = await user.save()
        res.send({_id})
        
    } catch (error) {
      next(error)  
    }
})

userRouter.put("/:userID", basicAuthMiddleware, async(req, res , next) => {
    try {
        const userId = req.params.userID
        const modifiedUser = await UserModel.findByIdAndUpdate(userId, req.body, {
            new:true,
        })

        if(modifiedUser){
            res.send(modifiedUser)
        }else{
            next(createHttpError(404,`user with id ${userId} not found!`))
        }
        
    } catch (error) {
      next(error)  
    }
})

userRouter.delete("/:userID", basicAuthMiddleware,  async(req, res , next) => {
    try {
        const userId = req.params.userID
        const deletedUser = await UserModel.findByIdAndDelete(userId)
        
        if(deletedUser){
          res.status(204).send()
        }else{
            next(createHttpError(404, `user with id ${userId} not found!`))
        }
    } catch (error) {
      next(error)  
    }
})

export default userRouter