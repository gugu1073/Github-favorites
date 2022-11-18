export class GithubUser {
  static serach(username) {
    const endpoint = `https://api.github.com/users/${username}`
     
    //Promessa 
    return fetch(endpoint)
    .then( data => data.json())
    .then((data) => {
 
     const {login, name, public_repos, followers} = data
 
     return  {
       login: login,
       name: name,
       public_repos:public_repos,
       followers:followers,
     }
 
    })
  }
 }