
function getCharacterInfo(){
    const characterNameInput = document.getElementById("characterName")
    const characterInfo = document.getElementById("characterInfo")
    
    const characterName= characterNameInput.value.toLocaleLowerCase() 

    
    fetch (`http://localhost:3000/characters/${characterName}`)
    .then(response => response.json())
    .then(data =>{
        
        characterInfo.innerHTML=`<h2>Resultados de: ${characterName}</h2>`
        data.forEach(element => {
            const {name, status, species, gender, origin: {name: originName}, image} = element[0] //Saca la info en variables
            

            const charDiv = document.createElement("div")
            characterInfo.appendChild(charDiv)

            const charh3 = document.createElement("h3")
            charh3.innerHTML= `${name}`
            charDiv.appendChild(charh3)

            const charImg = document.createElement("img")
            charImg.setAttribute("src", `${image}`)
            charImg.setAttribute("alt", `${name}`)
            charDiv.appendChild(charImg)

            const charStat = document.createElement("p")
            charStat.innerHTML= `<b>Status:</b> ${status}`
            charDiv.appendChild(charStat)

            const charSpeci = document.createElement("p")
            charSpeci.innerHTML= `<b>Species:</b> ${species}`
            charDiv.appendChild(charSpeci)

            const charGen = document.createElement("p")
            charGen.innerHTML= `<b>Gender:</b> ${gender}`
            charDiv.appendChild(charGen)

            const charOri = document.createElement("p")
            charOri.innerHTML= `<b>Origin:</b> ${originName}`
            charDiv.appendChild(charOri)
        })        
    })
    .catch(error => characterInfo.innerHTML = `<p>Imposible acceder al personaje</p>`)
}

function borrarFiltro(){
    document.getElementById('characterName').value = ''
    getCharacterInfo()
}

module.exports = { getCharacterInfo, borrarFiltro }