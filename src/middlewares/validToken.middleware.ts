import "dotenv/config"

import { Request, Response, NextFunction } from "express"

import { verify } from "jsonwebtoken"
import AppError from "../error/appError"
import Repository from "../util/repository.util"

interface IValidToken {
  optional?:boolean
}

const validTokenMiddleware = ( { optional }:IValidToken ) => async ( req:Request, res:Response, next:NextFunction ) => {
    let token = req.headers.authorization

    if( !token && optional ){
        next()

        return
    }

    if (!token) {
      return res.status(401).json({message:"Cabeçalhos de autorização ausentes"})
    }

    token = token.split(' ')[1];

    verify(token, process.env.SECRET_KEY as string, async (error, decoded:any) => {
        if (error) {
          return res.status(401).json({message:"Token invalido"})
        }
        
        const user = await Repository.users.findOneBy({ id: decoded.sub })

        if( !user ){
          res.status(404).json({message:"Usuario não encontrado"})
        }

        if( !user?.isActive ){
          res.status(401).json({message:"Usuario não está ativo"})
        }
        
        req.token = { 
          authorizationLevel: decoded.authorizationLevel,
          id: decoded.sub,
        };

        next();
      }
    );

}

export default validTokenMiddleware