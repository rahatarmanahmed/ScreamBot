(function(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    // Check if they ain't got shit
    if(!navigator.getUserMedia || !window.AudioContext) {
        justGiveUp("dogg, your browser is too old all not supporting new web audio standards all holding back the web development industry. go get a good browser pls.")
        return;
    }


    var context = new AudioContext();
    var analyzer, buffer;
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
        buffer = new Uint8Array(analyser.frequencyBinCount);

        input.connect(analyzer);

        requestAnimFrame(render);
    }

    function render() {
        analyser.getByteTimeDomainData(buffer);
        $('#time').html(average(buffer));
        requestAnimFrame(render);
    }

    function average(arr) {
        return arr.reduce(function(sum, i){
            return sum + i;
        }) / arr.length;
    }
})();