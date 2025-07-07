// CRUD 
// create metodo post
//Read metodo get
async function getFilms(){
    const response = await fetch ("http://localhost:3000/films", {
        method: "GET", 
        headers: {
            'content-Type': 'application/json' //peticion al navegador
        }
    })

    const filmData= await response.json()
    console.log(filmData)
    return filmData
}



// Update metodo put
// Delete metodo delete