import {GithubUser} from "./githubUser.JS"

// classe que vai conter a lógica dos dados 
// como os dados serão estruturados 

export class favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  } 

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async  add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já encontrado')
      }

      const user = await GithubUser.serach(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = 
    this.entries.filter(
    entry => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
    this.save()
  }
} 

// classe que vai criar a vizualização e eventos do HTML
export class FavoritesView extends favorites {
 constructor(root) {
  super(root)

  this.tbody = 
  this.root.querySelector('table tbody')

  this.update()
  this.onadd()
 }

  onadd() {
   const addButton = this.root.querySelector('.search button')
   addButton.onclick = () => {
    const {value} = this.root.querySelector('#input-search')

    this.add(value)
   }
  }

  update() {
  this.removeAllTr()
  this.createEmptyTable()
  
  this.entries.forEach(user => {
   const row = this.createRow()

   row.querySelector('.user img').src = `https://github.com/${user.login}.png`
   row.querySelector('.user img').alt = `imagem de ${user.name} `
   row.querySelector('.user a').href = `https://github.com/${user.login}`
   row.querySelector('.user p').textContent = user.name
   row.querySelector('.user span').textContent = user.login
   row.querySelector('.Repositories').textContent = user.public_repos 
   row.querySelector('.Followers').textContent = user.followers

   row.querySelector('.remove').onclick = () => {
    const isOk = confirm('Tem certeza que deseja deletar essa linha ?') 
    if(isOk) {
    this.delete(user)
    }
   }

    this.tbody.append(row)    
  }) 
}
 

 createRow() {

  const tr = document.createElement('tr')

  tr.innerHTML = `
  <td class="user">
    <img src="http://github.com/gugu1073.png" alt="imagem de Gustavo">
    <a href="http://github.com/gugu1073">
      <p>Gustavo</p>
      <span>/gugu1073</span>
    </a>
  </td>
  <td class="Repositories">
   123
  </td>
  <td class="Followers">
    1234
  </td>
  <td> <button class="remove">Remover</button></td>
 </tr>
  `

  return tr
 }

createEmptyTable() {
  const isEmpty = this.entries.length == 0

  if (isEmpty) {
    const emptyRow = document.createElement('tr')
    emptyRow.innerHTML = `     
    <td colspan="4">
    <div class="no-favorites">
      <img src="/img/bankground.svg" alt="imagem de uma estrela com um rosto">
      <p>Nenhum Favorito ainda</p>
    </div>
    </td>
    `

    emptyRow.classList.add('empty-table')
    this.tbody.append(emptyRow)
  }
}

removeAllTr() {
  
  this.tbody.querySelectorAll('tr')  
    .forEach((tr) => {
      tr.remove()
    })
 }  
}
