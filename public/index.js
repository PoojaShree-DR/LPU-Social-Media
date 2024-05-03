const menuItems = document.querySelectorAll('.menu-item');


const messageNotification = document.querySelector('#messages-notifications');
const messages = document.querySelector('.messages');
const message = messages.querySelectorAll('.message');
const messageSearch = document.querySelector('#message-search');
const createModal=document.querySelector('.create-post');
const create=document.querySelector('#create');
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme');
const fontSize = document.querySelectorAll('.choose-size span');
var root = document.querySelector(':root');
const colorPalette = document.querySelectorAll('.choose-color span');
const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');

const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        changeActiveItem();
        item.classList.add('active');
        if(item.id != 'notifications') {
            document.querySelector('.notifications-popup').
            style.display = 'none';
        } else {
            document.querySelector('.notifications-popup').
            style.display = 'block';
            document.querySelector('#notifications .notification-count').
            style.display = 'none';
        }
    })
})




const searchMessage = () => {
    const val = messageSearch.value.toLowerCase();
    message.forEach(user => {
        let name = user.querySelector('h5').textContent.toLowerCase();
        if(name.indexOf(val) != -1) {
            user.style.display = 'flex'; 
        } else {
            user.style.display = 'none';
        }
    })
}


messageSearch.addEventListener('keyup', searchMessage);

messageNotification.addEventListener('click', () => {
    messages.style.boxShadow = '0 0 1rem var(--color-primary)';
    messageNotification.querySelector('.notification-count').style.display = 'none';
    setTimeout(() => {
        messages.style.boxShadow = 'none';
    }, 2000);
})


const openThemeModal = () => {
    themeModal.style.display = 'grid';
}

const closeThemeModal = (e) => {
    if(e.target.classList.contains('customize-theme')) {
        themeModal.style.display = 'none';
    }
}
const opencreateModal=()=>{
    createModal.style.display='grid';
}
const closecreateModal=(e)=>{
    if(e.target.classList.contains('create-post')) {
        createModal.style.display = 'none';
    }
}
themeModal.addEventListener('click', closeThemeModal);
theme.addEventListener('click', openThemeModal);
createModal.addEventListener('click',closecreateModal);
create.addEventListener('click',opencreateModal);

const removeSizeSelectors = () => {
    fontSize.forEach(size => {
        size.classList.remove('active');
    })
}

fontSize.forEach(size => { 
   size.addEventListener('click', () => {
        removeSizeSelectors();
        let fontSize;
        size.classList.toggle('active');

        if(size.classList.contains('font-size-1')) { 
            fontSize = '10px';
            root.style.setProperty('----sticky-top-left', '5.4rem');
            root.style.setProperty('----sticky-top-right', '5.4rem');
        } else if(size.classList.contains('font-size-2')) { 
            fontSize = '13px';
            root.style.setProperty('----sticky-top-left', '5.4rem');
            root.style.setProperty('----sticky-top-right', '-7rem');
        } else if(size.classList.contains('font-size-3')) {
            fontSize = '16px';
            root.style.setProperty('----sticky-top-left', '-2rem');
            root.style.setProperty('----sticky-top-right', '-17rem');
        } else if(size.classList.contains('font-size-4')) {
            fontSize = '19px';
            root.style.setProperty('----sticky-top-left', '-5rem');
            root.style.setProperty('----sticky-top-right', '-25rem');
        } else if(size.classList.contains('font-size-5')) {
            fontSize = '22px';
            root.style.setProperty('----sticky-top-left', '-12rem');
            root.style.setProperty('----sticky-top-right', '-35rem');
        }

        document.querySelector('html').style.fontSize = fontSize;
   })
})

const changeActiveColorClass = () => {
    colorPalette.forEach(colorPicker => {
        colorPicker.classList.remove('active');
    })
}

colorPalette.forEach(color => {
    color.addEventListener('click', () => {
        let primary;
        changeActiveColorClass(); 

        if(color.classList.contains('color-1')) {
            primaryHue = 252;
        } else if(color.classList.contains('color-2')) {
            primaryHue = 52;
        } else if(color.classList.contains('color-3')) {
            primaryHue = 352;
        } else if(color.classList.contains('color-4')) {
            primaryHue = 152;
        } else if(color.classList.contains('color-5')) {
            primaryHue = 202;
        }

        color.classList.add('active');
        root.style.setProperty('--primary-color-hue', primaryHue);
    })
})

let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

const changeBG = () => {
    root.style.setProperty('--light-color-lightness', lightColorLightness);
    root.style.setProperty('--white-color-lightness', whiteColorLightness);
    root.style.setProperty('--dark-color-lightness', darkColorLightness);
}

Bg1.addEventListener('click', () => {
    Bg1.classList.add('active');
    Bg2.classList.remove('active');
    Bg3.classList.remove('active');
    window.location.reload();
});

Bg2.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '20%';
    lightColorLightness = '15%';

    Bg2.classList.add('active');
    Bg1.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();
});

Bg3.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';

    Bg3.classList.add('active');
    Bg1.classList.remove('active');
    Bg2.classList.remove('active');
    changeBG();
});

function createPost() {
    const description = document.getElementById('desc').value;
    const image = document.getElementById('testImage').files[0];

    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', image);

    fetch('/createpost', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
            createModal.style.display = 'none';
        }
        return response.json();
    })
    .then(data => {
        console.log('Post created:', data);
        fetchFeeds()
        .then(() => {
            var feeds = localStorage.getItem('feeds');
            dynamicFeeds(JSON.parse(feeds));
        });
        createModal.style.display = 'none';
        // Do something with the response data if needed
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        createModal.style.display = 'none';
    });
}

async function fetchFeeds() {
    await fetch('/feeds')
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(feeds => {
        console.log('Feeds:', feeds);
        // Store the fetched feeds in localStorage
        localStorage.setItem('feeds', JSON.stringify(feeds));
        // Handle the fetched feeds here
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function dynamicFeeds(feeds) {
    var feedsContainer = document.querySelector('.feeds');

    feeds.forEach(feed => {
        // Create feed element
        var feedElement = document.createElement('div');
        feedElement.classList.add('feed');

        // Create head element
        var headElement = document.createElement('div');
        headElement.classList.add('head');

        // Create user element
        var userElement = document.createElement('div');
        userElement.classList.add('user');

        // Create profile photo element
        var profilePhotoElement = document.createElement('div');
        profilePhotoElement.classList.add('profile-photo');
        var profilePhotoImg = document.createElement('img');
        profilePhotoImg.src = "profile.jpg"
        profilePhotoElement.appendChild(profilePhotoImg);
        userElement.appendChild(profilePhotoElement);

        // Create info element
        var infoElement = document.createElement('div');
        infoElement.classList.add('info');
        var usernameElement = document.createElement('h3');
        usernameElement.textContent = feed.username;
        infoElement.appendChild(usernameElement);
        userElement.appendChild(infoElement);

        // Append user element to head element
        headElement.appendChild(userElement);

        // Create edit element
        var editElement = document.createElement('span');
        editElement.classList.add('edit');
        var editIcon = document.createElement('i');
        editIcon.classList.add('uil', 'uil-ellipsis-h');
        editElement.appendChild(editIcon);
        headElement.appendChild(editElement);

        // Append head element to feed element
        feedElement.appendChild(headElement);
        // Decode base64 data
        var imageData = "http://localhost:3000/uploads/" + feed.imageName;

        // Create photo element
        var photoElement = document.createElement('div');
        photoElement.classList.add('photo');
        var photoImg = document.createElement('img');
        photoImg.src = imageData;
        photoElement.appendChild(photoImg);
        feedElement.appendChild(photoElement);


        // Create action buttons element
        var actionButtonsElement = document.createElement('div');
        actionButtonsElement.classList.add('action-buttons');
        var interactionButtonsElement = document.createElement('div');
        interactionButtonsElement.classList.add('interaction-buttons');
        var heartIcon = document.createElement('span');
        heartIcon.innerHTML = '<i class="uil uil-heart"></i>';
        interactionButtonsElement.appendChild(heartIcon);
        var commentIcon = document.createElement('span');
        commentIcon.innerHTML = '<i class="uil uil-comment-dots"></i>';
        interactionButtonsElement.appendChild(commentIcon);
        var shareIcon = document.createElement('span');
        shareIcon.innerHTML = '<i class="uil uil-share-alt"></i>';
        interactionButtonsElement.appendChild(shareIcon);
        actionButtonsElement.appendChild(interactionButtonsElement);
        feedElement.appendChild(actionButtonsElement);

        // Create liked by element
        var likedByElement = document.createElement('div');
        likedByElement.classList.add('liked-by');
        likedByElement.innerHTML = `<p>Liked by <b>${feed.username}</b> and <b>${feed.likedBy.length} others</b></p>`;
        feedElement.appendChild(likedByElement);

        // Create caption element
        var captionElement = document.createElement('div');
        captionElement.classList.add('caption');
        var captionP = document.createElement('p');
        captionP.textContent = feed.description;
        captionElement.appendChild(captionP);
        feedElement.appendChild(captionElement);

        // Create comments element
        var commentsElement = document.createElement('div');
        commentsElement.classList.add('comments', 'text-muted');
        commentsElement.textContent = 'View all comments';
        feedElement.appendChild(commentsElement);

        // Append feed element to feeds container
        feedsContainer.appendChild(feedElement);
    });
}

fetchFeeds()
.then(() => {
    var feeds = localStorage.getItem('feeds');
    dynamicFeeds(JSON.parse(feeds));
});