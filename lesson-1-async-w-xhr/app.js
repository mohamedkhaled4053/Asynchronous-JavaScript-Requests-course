(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // get image from unsplash.com

        // handler for success
        function addImg() {
            let data = JSON.parse(this.responseText)

            if (data && data.results && data.results.length != 0) {
                // get one off the images roundomly
                let roundomImg = data.results[Math.floor(Math.random() * data.results.length)]

                // create Elements
                let img = document.createElement('img')
                img.src = roundomImg.urls.regular
                let figure = document.createElement('figure')
                let figcaption = document.createElement('figcaption')
                figcaption.textContent = `${searchedForText} by ${roundomImg.user.name}`

                figure.append(img, figcaption)

                responseContainer.insertAdjacentElement("afterbegin", figure)
            } else {
                // if no response or no images
                responseContainer.insertAdjacentHTML('afterbegin', '<div class="error-no-image">no image found</div>')
            }
        }

        // handler for error
        function noImg() {
            responseContainer.insertAdjacentHTML('afterbegin', '<div class="error-no-image">no image found</div>')
        }

        // make the request
        let unsplashReq = new XMLHttpRequest()
        unsplashReq.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`)
        unsplashReq.setRequestHeader('Authorization', 'Client-ID uiR-LyGL9lTUPvNHL_ZDC9bJ038rc-9afAXS9t_9Zt4') // we can use client_id query parameter in the link above instead of this line
        unsplashReq.send()
        unsplashReq.onload = addImg
        unsplashReq.onerror = noImg


        // get articles from "The New York Times"

        // handler for success  
        function addArticles() {
            let data = JSON.parse(this.responseText)
            if (data) {
                
                let docs = data.response.docs // array of articles
                let ul = document.createElement('ul')
                docs.forEach(doc => {
                    let htmlContent = ` 
                    <li class="article">
                        <h2>
                            <a href="${doc.web_url}">
                                ${doc.headline.main}
                            </a>
                        </h2>
            
                        <p>${doc.abstract}</p>
                    </li>
                    `
                    ul.innerHTML += htmlContent
                });

                responseContainer.append(ul)
            } else {
            responseContainer.insertAdjacentHTML('beforeend', '<div class="error-no-articles">no articles found</div>')
            }
        }

        // handler for error
        function noArticles(params) {
            responseContainer.insertAdjacentHTML('beforeend', '<div class="error-no-articles">no articles found</div>')
        }

        // make the request    
        let nyApiKey = 'wLrA6XucLrzDC88ZQlK9xEMlPR0AnW9o'

        let nyReq = new XMLHttpRequest()
        nyReq.open('GET', `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=${nyApiKey}`)
        nyReq.onload = addArticles
        nyReq.onerror = noArticles
        nyReq.send() 

    });
})();
