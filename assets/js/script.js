document.addEventListener('DOMContentLoaded', function () {

    // 获取所需要的dom元素
    var video = document.querySelector('#camera-stream'),
        image = document.querySelector('#snap'),
        start_camera = document.querySelector('#start-camera'),
        controls = document.querySelector('.controls'),
        take_photo_btn = document.querySelector('#take-photo'),
        delete_photo_btn = document.querySelector('#delete-photo'),
        download_photo_btn = document.querySelector('#download-photo'),
        error_message = document.querySelector('#error-message');


   
    // 调用本地摄像头设备
    navigator.getMedia = ( 
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia
    );


	//判断浏览器是否支持
    if(!navigator.getMedia){
        displayErrorMessage("你的浏览器不支持navigator.getUserMedia！！！");
    }
    else{
        // 请求打开摄像头
        navigator.getMedia(
            {
                video: true
            },
            // 成功
            function(stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
                video.onplay = function() {
                    showVideo();
                };
            },
            // 失败
            function(err) {
                displayErrorMessage("调用失败: " + err.name, err);
            }
        );
    }
	
	//点击打开app
    start_camera.addEventListener("click", function(e) {

        e.preventDefault();
        video.play();
        showVideo();

    });

    //点击照相，重拍，图片另存为
    take_photo_btn.addEventListener("click", function(e) {

        e.preventDefault();

        var snap = takeSnapshot();

        image.setAttribute('src', snap);
        image.classList.add("visible");

        delete_photo_btn.classList.remove("disabled");
        download_photo_btn.classList.remove("disabled");


        download_photo_btn.href = snap;

        video.pause();

    });


    delete_photo_btn.addEventListener("click", function(e) {

        e.preventDefault();

        // Hide image.
        image.setAttribute('src', "");
        image.classList.remove("visible");

        // Disable delete and save buttons
        delete_photo_btn.classList.add("disabled");
        download_photo_btn.classList.add("disabled");

        // Resume playback of stream.
        video.play();

    });



    function takeSnapshot() {
        // Here we're using a trick that involves a hidden canvas element.  

        var hidden_canvas = document.querySelector('canvas'),
            context = hidden_canvas.getContext('2d');

        var width = video.videoWidth,
            height = video.videoHeight;

        if (width && height) {

            // Setup a canvas with the same dimensions as the video.
            hidden_canvas.width = width;
            hidden_canvas.height = height;

            // Make a copy of the current frame in the video on the canvas.
            context.drawImage(video, 0, 0, width, height);

            // Turn the canvas image into a dataURL that can be used as a src for our photo.
            return hidden_canvas.toDataURL('image/png');
        }
    }


    function showVideo() {
        hideUI();
        video.classList.add("visible");
        controls.classList.add("visible");
    }


    function displayErrorMessage(error_msg, error) {
        error = error || "";
        if(error){
            console.error(error);
        }

        error_message.innerText = error_msg;

        hideUI();
        error_message.classList.add("visible");
    }

   
    function hideUI() {
        // Helper function for clearing the app UI.

        controls.classList.remove("visible");
        start_camera.classList.remove("visible");
        video.classList.remove("visible");
        snap.classList.remove("visible");
        error_message.classList.remove("visible");
    }

});
