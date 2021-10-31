import assert from 'assert';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const jwtSecret = 'SUPERSECRETE20220';
import prisma from '../../lib/prisma';

const saltRounds = 10;


async function findUser(email_user, callback) {
  callback 
  callback(await prisma.user.findMany({
    select: { id: true, 
              name: true,
              email: true },
    where: { email: email_user },
  }));
}

function createUser( email_user, password_user, success, fail) {
  bcrypt.hash(password_user, saltRounds, function(err, hash) {
    // Store hash in your password DB.
     return prisma.user.create({
        data: { 
            name: "teste",
            email: email_user,
            password: hash,        
            type: 1
        }
      }).then((creationResult) => {
          const user = creationResult;
          const token = jwt.sign(
            {userId: user.id, email: user.email},
            jwtSecret,
            {
              expiresIn: 3000, //50 minutes
            },
          );
          success(token);
         
        }).catch((error) => {
            fail(error);

        });
  });
}

export default (req, res) => {
  if (req.method === 'POST') {
    // signup
    try {
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
    } catch (bodyError) {
      res.status(403).json({error: true, message: bodyError.message});
    } 
    // verify email does not exist already
 
      const email_rec = req.body.email;
      const password_rec = req.body.password;

      findUser(email_rec, function(received) {
        if (typeof received == 'undefined') {
          res.status(500).json({error: true, message: 'Error finding User'});
          return;
        }
        if (received.length == 0) {
          // proceed to Create
           createUser(email_rec, password_rec, 
            function(token){ 
              res.status(200).json({token});
            },function(error){
              res.status(500).json({error: true, message: error});
            });
          
        } else {
          // User exists
          res.status(403).json({error: true, message: 'Email exists'});
          return;
        }
      });
  } else {
    // Handle any other HTTP method
    res.status(200).json({users: ['John Doe']});
  }
};
