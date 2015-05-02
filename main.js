(function(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // Check if they ain't got shit
    if(!navigator.getUserMedia || !window.AudioContext) {
        justGiveUp("dogg, your browser is too old all not supporting new web audio standards all holding back the web development industry. go get a good browser pls.")
        return;
    }

    var SCREAM_THRESHOLD = 70;
    var context = new AudioContext();
    var analyzer, buffer;
    var startTime = -1;
    navigator.getUserMedia({audio: true}, onMic, onMicError);

    function justGiveUp(msg) {
        $(body).html(msg);
    }

    function onMicError(e) {
        justGiveUp('dogg, you gotta give up your mic to even USE this website');
        console.error(e);
    }

    function onMic(stream) {
        var input = context.createMediaStreamSource(stream);
        analyser = context.createAnalyser();
        analyser.smoothingTimeConstant = .95;
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
            }
            seconds = ((new Date()).getTime() - startTime.getTime()) / 1000;
        }
        else {
            startTime = -1;
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