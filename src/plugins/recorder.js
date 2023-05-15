import mitt from "mitt"

let decibel = 0
let offset = 30
let refresh_rate = 1000 // ms
let localDbValues = []
let interval = null
let stream = null
let mediaRecorder = null
export const emitter = mitt()

const updateDecibel = () => {
  var volume = Math.round(localDbValues.reduce((a,b) => a+b, 0) / localDbValues.length);
  if (!isFinite(volume)) volume = 0;  // we don't want/need negative decibels in that case
  decibel = volume;
  localDbValues = []; // clear previous values

  // console.log('decibel: ', decibel)
  emitter.emit('getRecorderData', {
    decibel: decibel
  })
}

export const matikanSuara = () => {
  if(interval !== null) clearInterval(interval)
  if(stream !== null){
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  if(mediaRecorder !== null) mediaRecorder.stop();
  decibel = 0;
  localDbValues = [];
  stream = null;
  interval = null;
  mediaRecorder = null
  
  emitter.emit('getRecorderData', {
    decibel: decibel
  })
}

export const rekamSuara = async () => {
  stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

  const context = new AudioContext();
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(2048, 1, 1);
  const analyser = context.createAnalyser();

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 256;

  source.connect(analyser);
  analyser.connect(processor);
  processor.connect(context.destination);

  mediaRecorder = new MediaRecorder(stream, {mimeType: 'audio/webm; codecs=opus'});
  mediaRecorder.start(); 
  mediaRecorder.ondataavailable = function(e) {
    var blob = e.data;
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    
    reader.onloadend = function() {
      emitter.emit('getRecorderSound', {
        dataSuara: reader.result
      })
    }
  }

  processor.onaudioprocess = () => {

      var data = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(data);
      var values = 0;

      for (var i = 0; i < data.length; i++) {
          //if (data[i]>130) data[i]=130;
          values += data[i];
      }

      let offset_value = offset;
      let average = 20*Math.log10(values/data.length) + offset_value;
      localDbValues.push(average);
  };

  if(interval !== null) clearInterval(interval)
  interval = setInterval(updateDecibel, refresh_rate);
}

