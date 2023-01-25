

let store = Immutable.Map({
    user: Immutable.Map({ name: "Student" }),
    apod: '',
    rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
    startingRover: 'displayedRover'
})



const root = document.getElementById('root')





const updateStore = (state, newState) => {    
    store = state.mergeDeep(newState)
    render(root, store)
}




const render = async (root, state) => {
    root.innerHTML = App(state)
}






const App = (state) => {


    if (state.get('startingRover') === 'displayedRover')  {
        return (`
        <header>

        <div class="navbar-flexible">
        <div class="logo-flexible" onclick="homeEvent(event)">
            <a href="#"><img src="./assets/mars.png" alt="Mars image"></a>
            <p>Welcome to Mars!</p>
            
        </div>

        
    </div>

        </header>

        <main class="mainContainer" style="background-image: url(${ImageOfTheDay(state)});">
        

              
               <div class="btn-wrapper">
               <h3> ${store.user && store.user.name ? Greeting(store.user.name) : ""}</h3>
               <h1 class="main-title">Please Choose Rover</h1>		
               <div class="container-btn">${displayButton(state)}</div>

               </div>
               </div>
        </main>

        <footer>
                <div class="foot">Icons made by <a href="https://www.flaticon.com/authors/tulpahn" title="tulpahn">tulpahn</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                </div>
            <footer>      

        `)
    } else {
      
        return (`

        <header>
            <div class="navbar-flexible">
                <div class="logo-flexible" onclick="homeEvent(event)">
                   <a href="#"><img src="./assets/mars.png" alt="Mars icon"></a>
                    <p>Choose Another Rover --></p>
                 </div>
                 <ul class="items-navbar">${contentsOftMenu(state)}<ul>
            </div>
        </header>

        <main> 
        
            <div class="mainContainer-display">
                <h1 class="pageTitle">About Rover: <span>${state.get('startingRover').latest_photos[0].rover.name}</span></h1>		
                <div class="photos">${displayedRovers(state)}</div>
            </div>
        </main>

            <footer>
            <div class="foot">Icons made by <a href="https://www.flaticon.com/authors/tulpahn" title="tulpahn">tulpahn</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                </div>
            <footer>
        `)
    }
}




const parentElement = document.querySelector('.main-flexible');

parentElement.addEventListener('click', function(event) {
  if (event.target.matches('img')) {
    event.target.classList.toggle('enlarged');
  }
});



const Greeting = (state) => {

    const name =  state.get('user.name').join("")
   
    if (name === "Student") {
        return `
            <h1>Welcome, Student!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}


window.addEventListener('load', () => {
    render(root, store)
})

 



const displayButton = (state) => {
    return `<ul class="flexible {">${stateOfButton(state)}</ul>`
}


const stateOfButton = (state) => { 
        return  Array.from(state.get('rovers')).map( items => 
        `<li id=${items} class="button" onclick="roverEvent(event)">
        <a ref="#"  class=""  >Rover:${(`${items}`)}</a>
        
        <p>More...</p>
           
        </li>`
        )
}


const contentsOftMenu = (state) => {
    
    return  Array.from(state.get('rovers')).map( object => 
        `<li id=${object} class="" onclick="roverEvent(event)">
        <a ref="#"  class=""  >${(`${object}`)}</a>
        <p>Click for More...</p>
        </li>`
        )
}



const displayedRovers = (state) => {
    const getCurrentRover = state.get('startingRover');

    return Array.from(getCurrentRover.latest_photos).map( object => 
        `<div class="wrapper">
            <img src="${object.img_src}" />
            <div class="wrapper-info">
                
                <p><b>Rover:</b> ${object.rover.name}</p>
                <p><b>Status:</b> ${object.rover.status}</p>
                <p><b>Launched:</b> ${object.rover.launch_date}</p>
                <p><b>Landed:</b> ${object.rover.landing_date}</p>
                <p><b>Picture Date:</b>${object.earth_date}</p>
            </div>
         </div>`
        ).slice(0, 50).join("")
}



const ImageOfTheDay = (state) => {
   
    return (!state.get('apod')) ? getImageOfTheDay(store) : 
    (state.get('apod').image.media_type === "video") ? 
    'https://apod.nasa.gov/apod/image/2212/Makemakemoon100mile2000px.jpg'
     : state.get('apod').image.url;

}





const roverEvent = event => {
    const id = event.currentTarget.id;
    store.get('rovers').includes(id)
      ? roverPics(id, store)
      : console.log(`The rover ${id} is not available`);

  };




const homeEvent = event => {
    const newState = { ...store, 'startingRover' : 'displayedRover'};
    updateStore(store, newState);
}



const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => {

        const newState = store.set('apod', apod);
        updateStore(store, newState)
        return apod
        })

    
}


const roverPics = (name, state) => {
    let {startingRover} = state;
  
    return fetch(`http://localhost:3000/rovers/${name}`)
        .then(response => response.json())
        .then(startingRover=> {
            const newStore = store.set('startingRover', startingRover);
            updateStore(store, newStore);
            return startingRover;
        })
}







