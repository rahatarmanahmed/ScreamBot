$(function(){

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // Check if they ain't got shit
    if(!navigator.getUserMedia || !window.AudioContext) {
        justGiveUp("dogg, your browser ain't even support microphones? holding back the web development industry, much???? go get a <a href='http://caniuse.com/#feat=stream'>Good Browser</a>!");
        return;
    }

    // Preload GIFs
    var screamGifs = ['img/screaming/1.gif', 'img/screaming/2.gif', 'img/screaming/3.gif', 'img/screaming/4.gif', 'img/screaming/5.gif']
    screamGifs.forEach(function(gif){
        var image = new Image();
        image.src = gif;
    })

    var SCREAM_THRESHOLD = 40;
    var POST_SCREAM_DELAY = 3000;
    var MIN_TIME_TO_DELAY = 1000;
    var context = new AudioContext();
    var analyzer, buffer;
    var startTime = -1;
    var endTime = new Date(0);
    navigator.getUserMedia({audio: true}, onMic, onMicError);

    $('#reset-btn').click(function() {
        localStorage.removeItem('screamhighscore');
    })

    // shit's fucked, just show a message
    function justGiveUp(msg) {
        $(document.body).html('<p>' + msg + '</p>');
    }

    function onMicError(e) {
        justGiveUp('dogg, you gotta give up your mic to even USE this website');
        console.error(e);
    }

    function onMic(stream) {
        var input = context.createMediaStreamSource(stream);
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = .70;
        buffer = new Uint8Array(analyser.frequencyBinCount);

        input.connect(analyser);

        requestAnimationFrame(render);
    }

    function render() {
        analyser.getByteFrequencyData(buffer);
        
        var volume = average(buffer);
        var seconds = 0;

        if(volume >= SCREAM_THRESHOLD && msSince(endTime) > POST_SCREAM_DELAY)  {
            if(startTime === -1) {
                startTime = new Date();
                $('#gif-container').css('background-image', "url('"+screamGifs[Math.floor(Math.random() * screamGifs.length)]+"')");
            }
            seconds = msSince(startTime) / 1000;
        }   
        else {
            if(startTime !== -1) {
                if(msSince(startTime) >= MIN_TIME_TO_DELAY) {
                    endTime = new Date();
                }
                $('#gif-container').css('background-image', "url('img/idle.gif')")
                startTime = -1;    
            }
        }
        if(msSince(endTime) > POST_SCREAM_DELAY) {
            $('#time').html(seconds + 's');
        }

        var highscore = localStorage.getItem('screamhighscore') || 0;
        if(seconds > highscore) {
            highscore = seconds;
            localStorage.setItem('screamhighscore', highscore);
        }

        $('#highscore').html(highscore + 's');

        requestAnimationFrame(render);
    }

    function duration(start, end) {
        return end.getTime() - start.getTime();
    }

    function msSince(date) {
        return duration(date, new Date());
    }

    function average(arr) {
        return [].reduce.call(arr, function(sum, i){
            return sum + i;
        }) / arr.length;
    }
});