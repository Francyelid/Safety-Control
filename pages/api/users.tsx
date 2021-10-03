import assert from 'assert';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const jwtSecret = 'SUPERSECRETE20220';
import prisma from '../../lib/prisma';

const saltRounds = 10;


async function findUser(email_user, callback) {
  console.log("aqui aqui") 
  console.log(email_user)
  callback 
  callback(await prisma.user.findMany({
    select: { id: true, 
              name: true,
              email: true },
    where: { email: email_user },
  }));
}

function createUser( email_user, password_user, success, fail) {
  console.log("createUser");
  bcrypt.hash(password_user, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    console.log("hash");
     return prisma.user.create({
        data: { 
            name: "teste",
            email: email_user,
            password: hash,        
            type: 1
        }
      }).then((creationResult) => {
        console.log(creationResult)
          console.log("aquiiiiii")
          const user = creationResult;
          const token = jwt.sign(
            {userId: user.id, email: user.email},
            jwtSecret,
            {
              expiresIn: 3000, //50 minutes
            },
          );
          console.log("aquiiiiii")
          success(token);
         
        }).catch((error) => {
          console.log(error)
            console.log("aquiiiiii")
            fail(error);

        });
  });
}

export default (req, res) => {
  console.log('req') 
  console.log(req.body) 
  if (req.method === 'POST') {
    // signup
    try {
      console.log("chegou") 
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
      console.log("chegou234") 
    } catch (bodyError) {
      console.log(bodyError) 
      res.status(403).json({error: true, message: bodyError.message});
    }
    console.log("chegou34") 
    // verify email does not exist already
 
      const email_rec = req.body.email;
      const password_rec = req.body.password;

      findUser(email_rec, function(received) {
        console.log("aqui") 
        console.log(received)
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
