document.addEventListener("DOMContentLoaded", function() {


    const thumbnailsContainer = document.getElementById('video-thumbnails');
    const mainVideo = document.getElementById('main-video');



    thumbnailsContainer.addEventListener('click', function(e) {
        if (e.target && e.target.nodeName === 'IMG') {
            const videoId = e.target.getAttribute('data-video-id');
            mainVideo.src = `https://www.youtube.com/embed/${videoId}`;
        }
    });
});
