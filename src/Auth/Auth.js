import auth0 from 'auth0-js';

export default class Auth {
  auth0 = new auth0.WebAuth({
    clientID: 'yvIqHBF3lGfWzQ47kQEyEmTRs6unLMUY',
    domain: 'brittshroyer.auth0.com',
    redirectUri: 'http://localhost:3000/callback',
    responseType: 'token id_token',
    scope: 'openid'
  });

  login = () => {
    this.auth0.authorize();
  }
}lll
