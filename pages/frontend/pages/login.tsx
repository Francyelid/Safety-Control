import React, {useState} from 'react';
import Router from 'next/router';
import cookie from 'js-cookie';

const LoginPage = () => {
  const [loginError, setLoginError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    //call api
    fetch('../../api/auth', {
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
          Router.push('/frontend/pages/home');
        }
      });
  }
  return (
    <div className="boxlogin">
      <form onSubmit={handleSubmit}>
        <p className="textlogin">Login</p>
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
      <style jsx>{`
        .boxlogin {
          display: flex;
          background-color: #6e4582;
          align-content: center;
          justify-content: center;
          width: max-content;
          height: max-content;
          padding: 20px;
          /* align-self: center; */
          flex-direction: column;
        }

        form {
          display: flex;
          background-color: #6e4582;
          align-content: center;
          justify-content: center;
          width: max-content;
          height: max-content;
          padding: 20px;
          /* align-self: center; */
          flex-direction: column;
        }

        .textlogin{
          align-self: center;
          
        }

        input {
          margin: 5px
        }

      `}</style>
    </div>
  );
};

export default LoginPage;
