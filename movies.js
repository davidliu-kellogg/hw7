// First, sign up for an account at https://themoviedb.org
// Once verified and signed-in, go to Settings and create a new
// API key; in the form, indicate that you'll be using this API
// key for educational or personal use, and you should receive
// your new key right away.

// For this exercise, we'll be using the "now playing" API endpoint
// https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US

// Note: image data returned by the API will only give you the filename;
// prepend with `https://image.tmdb.org/t/p/w500/` to get the 
// complete image URL

// window.addEventListener(firebase.auth().onAuthStateChanged, async function(event) {
//   console.log('signed in')
// })
// window.addEventListener('DOMContentLoaded', async function(event) {
  firebase.auth().onAuthStateChanged(async function(user){
  // Step 1: Construct a URL to get movies playing now from TMDB, fetch
  // data and put the Array of movie Objects in a variable called
  // movies. Write the contents of this array to the JavaScript
  // console to ensure you've got good data
  // ⬇️ ⬇️ ⬇️
  if(user){
    document.querySelector('.sign-in-or-sign-out').innerHTML = `
      <p class="text-white-500">Hello ${user.displayName}<p>
      <button class="text-pink-500 underline sign-out">Sign Out</button>
    `

    document.querySelector('.sign-out').addEventListener('click', function(event) {
      // console.log('sign out clicked')
      firebase.auth().signOut()
      document.location.href = 'movies.html'
    })

      let url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=0bc3fd43a07479a11b655c84e5014e72&language=en-US'
      let response = await fetch(url)
      let json = await response.json()
      let movies = json.results
      console.log(json)
      let db = firebase.firestore()
      // ⬆️ ⬆️ ⬆️ 
      // End Step 1
      


      let querySnapshot = await db.collection('watched').get()
      // let querySnapshot2 = await db.collection(user.uid).get()
      let items = querySnapshot.docs
      for (let i = 0; i < movies.length; i++) {
        let opacity =''
        for (let j=0; j<items.length; j++) {
          if(items[j].id.localeCompare(`movie-${movies[i].id}-${user.uid}`)==0){
            opacity='opacity-20'
            break;
          }
        }
        document.querySelector('.movies').insertAdjacentHTML('beforeend', `
          <div class="w-1/5 p-4 movie-${movies[i].id}-${user.uid} ${opacity}">
            <img src="https://image.tmdb.org/t/p/w500/${movies[i].poster_path}" class="w-full">
            <a href="#" class="watched-button block text-center text-white bg-green-500 mt-4 px-4 py-2 rounded">I've watched this!</a>
          </div>
          `)
      }
    


      let filters = document.querySelectorAll(`[class*="movie-"]`)
      // console.log(filters)
        for (var i = 0, element; element = filters[i]; i++) {
          
          element.addEventListener('click',async function(event){
            event.preventDefault()
            // console.log(this.classList)
            let movieId = ''
            classList = this.className.split(' ')
            for(var i = 0; i<classList.length ; i++){
              if(classList[i].indexOf('movie-')>=0){
                movieId = classList[i]
              }
            }
            // console.log(event.target)
            if(this.classList.contains('opacity-20')){

              db.collection('watched').doc(movieId).delete().then(() => {
                this.classList.remove('opacity-20')
                // console.log('delete succeeded!');
              });
            }else{
              db.collection("watched").doc(movieId).set({
              }).then(() => {
                this.classList.add('opacity-20')
                // console.log('add succeeded!');
              });
            }
            
          })
        }
        // console.log(document.querySelector('.movies').style.display)
        // document.querySelector('.movies').style.display = "block";
      }else{
// Goal:   Refactor the movies application from last week, so that it supports
//         user login and each user can have their own watchlist.

// Start:  Your starting point is one possible solution for last week's homework.

// Step 1: Add your Firebase configuration to movies.html, along with the
//         (provided) script tags for all necessary Firebase services – i.e. Firebase
//         Auth, Firebase Cloud Firestore, and Firebase UI for Auth; also
//         add the CSS file for FirebaseUI for Auth.
  // Step 1: Un-comment to add FirebaseUI Auth
  // Initializes FirebaseUI Auth
        // console.log('logged out')
       // document.querySelector('.movies').classList.add('hidden')
        
        // document.querySelector('.movies').style.display = "none";
        let ui = new firebaseui.auth.AuthUI(firebase.auth())

        // FirebaseUI configuration
        let authUIConfig = {
          signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
          ],
          signInSuccessUrl: 'movies.html'
        }

        // Starts FirebaseUI Auth
        ui.start('.sign-in-or-sign-out', authUIConfig)
      }

// Step 2: Change the main event listener from DOMContentLoaded to 
//         firebase.auth().onAuthStateChanged and include conditional logic 
//         shows a login UI when signed, and the list of movies when signed
//         in. Use the provided .sign-in-or-sign-out element to show the
//         login UI. If a user is signed-in, display a message like "Signed 
//         in as <name>" along with a link to "Sign out". Ensure that a document
//         is set in the "users" collection for each user that signs in to 
//         your application.
// Step 3: Setting the TMDB movie ID as the document ID on your "watched" collection
//         will no longer work. The document ID should now be a combination of the
//         TMDB movie ID and the user ID indicating which user has watched. 
//         This "composite" ID could simply be `${movieId}-${userId}`. This should 
//         be set when the "I've watched" button on each movie is clicked. Likewise, 
//         when the list of movies loads and is shown on the page, only the movies 
//         watched by the currently logged-in user should be opaque.



})