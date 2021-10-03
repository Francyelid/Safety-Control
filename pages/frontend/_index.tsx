/*import Head from 'next/head';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import Link from 'next/link';
import cookie from 'js-cookie';
import React, { useEffect } from 'react';

function Home() {

  
  let {data, error, mutate} = useSWR('/api/me', async function(args) {
    const res = await fetch(args);
    return res.json();
  });

  function Logout() {      
      console.log('logout')   
      cookie.remove('token');
      mutate(data,true)
  };

  if (!data) return <h1>Loading...</h1>;
  let loggedIn = false;
  if (data.email) {
    loggedIn = true;
  }
  return (
    <div>
      <Head>
        <title>Welcome to landing page</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      
      <h1>Simplest login</h1>

      <h2>Proudly using Next.js, Mongodb and deployed with Now</h2>
      {loggedIn && (
        <>
          <p>Welcome {data.email}!</p>
          <button
            onClick={() => {
              Logout()
            }}>
            Logout
          </button>
        </>
      )}
      {!loggedIn && (
        <>
          <Link href="/login">Login</Link>
          <p>or</p>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </div>
  );
}

export default Home;*/


import Routes from "./_routes";


import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';

const App = () => {
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    //call api
    fetch('api/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((r) => {
        console.log('login retorno')
        return r.json();
      })
      .then((data) => {
        if (data && data.error) {
          setLoginError(data.message);
        }
        if (data && data.token) {
          //set cookie
          cookie.set('token', data.token, {expires: 2});
         // Router.push('/_router');
          return <Routes />
        }
      });
  }
  return (
    <form onSubmit={handleSubmit}>
      <p>Login</p>
      <input
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input type="submit" value="Submit" />
      {loginError && <p style={{color: 'red'}}>{loginError}</p>}
    </form>
  );
};

export default App;



/*import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from '../lib/prisma';

// index.tsx
export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.user.findMany({
    select: { id: true, 
              name: true,
              email: true },
    where: { id: 1 },
  });
  return { props: { feed } };
};

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Public Feed</h1>
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
*/