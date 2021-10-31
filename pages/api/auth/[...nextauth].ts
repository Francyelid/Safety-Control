import { Console } from "console";
import NextAuth from "next-auth"
import Providers from 'next-auth/providers'

export default(req, res) => NextAuth(req, res, {
    // Configure one or more authentication providers
    providers: [
        Providers.Credentials({

        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
            username: { label: "email", type: "text" },
            password: {  label: "password", type: "password" }
        },

        async authorize(credentials, req) {
            var autenticacao = null;
            // Add logic here to look up the user from the credentials supplied
            const url = process.env.NEXTAUTH_URL + '/api/servicos/User/userService?email='+credentials["email"]+'&password='+credentials["password"];
            await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }).then((r) => {
              return r.json();
            })
            .then((data) => {
              autenticacao = data.result;
            });
            
            if (autenticacao) {
              // Any object returned will be saved in `user` property of the JWT
              return autenticacao;
            } else {
              // If you return null or false then the credentials will be rejected
              return null
              // You can also Reject this callback with an Error or with a URL:
              // throw new Error('error message') // Redirect to error page
              // throw '/path/to/redirect'        // Redirect to a URL
            }
          }
      }),
      // ...add more providers here
    ],
    session:{
        jwt:true
    },
    jwt:{
        secret:'SUPERSECRETE20220'
    },
    pages:{
        signIn: '../../frontend/pages/login',
        error: '../../frontend/pages/login'
    }
  })