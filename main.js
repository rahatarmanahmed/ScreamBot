(function(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // Check if they ain't got shit
    if(!navigator.getUserMedia || !window.AudioContext) {
        justGiveUp("dogg, your browser is too old all not supporting new web audio standards all holding back the web development industry. go get a good browser pls.")
        return;
    }

    // Preload GIFs
    var screamGifs = ['img/screaming/1.gif', 'img/screaming/2.gif', 'img/screaming/3.gif', 'img/screaming/4.gif', 'img/screaming/5.gif']
    screamGifs.forEach(function(gif){
        var image = new Image();
        image.src = gif;
    })

    var SCREAM_THRESHOLD = 80;
    var context = new AudioContext();
    var analyzer, buffer;
    var startTime = -1;
    navigator.getUserMedia({audio: true}, onMic, onMicError);

    function justGiveUp(msg) {
        $(document.body).html(msg);
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

        if(volume >= SCREAM_THRESHOLD) {
            if(startTime === -1) {
                startTime = new Date();
                $('#sampson')[0].src = screamGifs[Math.floor(Math.random() * screamGifs.length)];
            }
            seconds = ((new Date()).getTime() - startTime.getTime()) / 1000;
        }   
        else {
            if(startTime !== -1) {
                $('#sampson')[0].src = 'img/idle.gif'
                startTime = -1;    
            }
        }
        
        $('#time').html(seconds + 's');

        var highscore = localStorage.getItem('screamhighscore') || 0;
        if(seconds > highscore) {
            highscore = seconds;
            localStorage.setItem('screamhighscore', highscore);
        }

        $('#highscore').html(highscore + 's');

        requestAnimationFrame(render);
    }

    function average(arr) {
        return [].reduce.call(arr, function(sum, i){
            return sum + i;
        }) / arr.length;
    }
})();