import assert from 'assert';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import prisma from '../../lib/prisma';

const jwtSecret = 'SUPERSECRETE20220';

async function findUser(email_user, callback) {
  callback 
  callback(await prisma.user.findMany({
    select: { id: true, 
              name: true,
              email: true,
              password: true },
    where: { email: email_user },
  }));
}

function authUser(email, password, hash, callback) {
  bcrypt.compare(password, hash, callback);
}

export default (req, res) => {
  if (req.method === 'POST') {
    //login
    try {
      assert.notEqual(null, req.body.email, 'Email required');
      assert.notEqual(null, req.body.password, 'Password required');
    } catch (bodyError) {
      res.status(403).send(bodyError.message);
    }
      const email_rec = req.body.email;
      const password_rec  = req.body.password;

      findUser(email_rec, function(received) {
        if (typeof received == 'undefined') {
          res.status(500).json({error: true, message: 'Error finding User'});
          return;
        }
        if (received.length == 0) {
          res.status(404).json({error: true, message: 'User not found'});
          return;
        } else {
          authUser(email_rec, password_rec, received[0].password, function(err, match) {
            if (err) {
              res.status(500).json({error: true, message: 'Auth Failed'});
            }
            if (match) {
              const token = jwt.sign(
                {userId: received[0].id, email: received[0].email},
                jwtSecret,
                {
                  expiresIn: 3000, //50 minutes
                },
              );
              res.status(200).json({token});
              return;
            } else {
              res.status(401).json({error: true, message: 'Auth Failed'});
              return;
            }
          });
        }
      });
  } else {
    // Handle any other HTTP method
    res.statusCode = 401;
    res.end();
  }
};
