const express = require("express");
const { generateToken, verifyToken } = require("../middlewares/authMiddleware");
const { getCharacterInfo, borrarFiltro } = require("../js/script");
const users = require("../data/users");
const axios = require("axios")

const router = express.Router()

// Ruta de Inicio
router.get('/', (req, res) => {
    
    const loginForm = `
    <form action="/login" method="post">
    <label for="username">Usuario:</label>
    <input type="text" id="username" name="username" required><br>
    
          <label for="password">Contraseña:</label>
          <input type="password" id="password" name="password" required><br>
    
          <button type="submit">Iniciar sesión</button>
        </form>
        <a href="/dashboard">dashboard</a>
    
    `;
    
    res.send(loginForm);
});


//Ruta de inicio de sesión
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
    (u) => u.username === username && u.password === password
    );
    
    if (user) {
        const token = generateToken(user);
        req.session.token = token;
        res.redirect('/search');
    } else {
    res.status(401).json({ message: 'Credenciales incorrectas' });
    }
})



router.get('/search', verifyToken, (req, res) => {
    const userId = req.user;
    const user = users.find((u) => u.id === userId);
    //const characterNameInput = getElementById("characterName")
    
    if (user) {
    res.send(`
    
    <h1>Bienvenido, ${user.name}!</h1> <p>ID: ${user.id}</p> <p>Usuario: ${user.username}</p> <br> <form action="/logout" method="post"> <button type="submit">Cerrar sesión</button> </form> <a href="/">home</a>

    <h2>Personajes</h2>
    <form id="searchForm">
        <label for="characterName">Introduce el nombre para filtrar el personaje</label>
        <input type="text" id="characterName" placeholder="Rick"/>
        <button onclick="borrarFiltro()">Borrar filtro</button>
    </form>
    <button onclick='buscarPersonaje()'>Buscar</button>
    
    <div id="characterInfo"></div>
    <script>
        
        function buscarPersonaje(){
            const characterNameInput = document.getElementById("characterName").value
            if(characterNameInput){
                const url = "/character/" + encodeURIComponent(characterNameInput)
                window.open(url)
            } else {
                const url = "/characters/"
                window.open(url)
            }
            
        }
        function borrarFiltro(){
            document.getElementById('characterName').value = ''
        }
    
    </script>
    
    `
    
);
    } else {
    res.status(401).json({ message: 'Usuario no encontrado' });
    }
});


//Ruta /characters
router.get("/characters", verifyToken, async (req, res)=>{
    const userId = req.user;
    const user = users.find((u) => u.id === userId);
    
    if (user) {
        let url = "https://rickandmortyapi.com/api/character"
        try{
            //Array para almacenar todos los personajes de todas las páginas
            let allResults = []
            
            let response = await axios.get(url) 
            let resultsArray = response.data.results
            
            //Saca los personajes de la primera página
            resultsArray.forEach(element => {
                const personaje = [] //Array para añadir la información
                const {name, status, species, gender, origin: {name: originName}, image} = element //Saca la info necesaria en variables

                //Añade la info al array del personaje y añade este array de personaje al array de personajes totales
                personaje.push({name, status, species, gender, origin: {name: originName}, image})
                allResults.push(personaje)

            })

            //Saca los personajes del resto de páginas (hasta que no haya página siguiente)
            while (response.data.info.next){
                //Sustitule ya url por la página siguiente a la que se acaba de hacer
                url = response.data.info.next
                //Actualiza la respuesta con la nueva url
                response = await axios.get(url)
                //Actualiza el array resultsArray con la nueva respuesta
                resultsArray = response.data.results

                resultsArray.forEach(element => {
                    const personaje = [] //Array para añadir la información
                    const {name, status, species, gender, origin: {name: originName}, image} = element //Saca la info necesaria en variables
        
                    //Añade la info al array del personaje y añade este array de personaje al array de personajes totales
                    personaje.push({name, status, species, gender, origin: {name: originName}, image})
                    allResults.push(personaje)
                })   
            }
            
            url = "https://rickandmortyapi.com/api/character" //Reset a la url cambiada
            res.json(allResults)
        } catch (ERROR){
            console.log(ERROR)
            res.status(404).json({error: "Error"}) 
        }
    } else {
        res.status(401).json({ message: 'Usuario no encontrado' });
    }
})


//Ruta /characters por nombre
router.get("/character/:characterName", verifyToken, async (req, res)=>{
    const userId = req.user;
    const user = users.find((u) => u.id === userId);
    
    if (user) {
        const name = req.params.characterName;
        const url =`https://rickandmortyapi.com/api/character/?name=${name}`

        try {
            const response = await axios.get(url);
            const data = response.data.results;
            const {name, status, species, gender, origin: { name: originName }, image } = data[0]

            //res.json({name, status, species, gender, origin: { name: originName }, image})
            
            res.send(`
            <h1>${name}</h1>
            <p>Status: ${status}</p>
            <p>Species: ${species}</p>
            <p>Gender: ${gender}</p>
            <p>Origin: ${originName}</p>
            <img src="${image}">
            `)


        } catch (ERROR) {
            res.status(404).json({error: "Personaje no encontrado"});
        }
        

    }   else {
        res.status(401).json({ message: 'Usuario no encontrado' });
    }

})



//Ruta de cierre de sesión
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router