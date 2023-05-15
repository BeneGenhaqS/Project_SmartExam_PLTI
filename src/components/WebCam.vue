<template>
  <div style="position: relative;" :style="'width:' + width + 'px; height: ' + height + 'px;'">
    <video ref="video" autoplay muted :width="width" :height="height"></video>
    <canvas ref="canvasResult" style="position: absolute; top: 0; left: 0; z-index: 1"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, inject, onUnmounted, onBeforeUnmount } from 'vue';
import * as faceapi from 'face-api.js'
// TUTORIAL: https://www.youtube.com/watch?v=CVClHLwv-4I
// DOCS: https://justadudewhohacks.github.io/face-api.js/docs/index.html
// https://github.com/justadudewhohacks/face-api.js

import { resizedataURL } from '@/plugins/compress'
import { rekamSuara, matikanSuara, emitter as emitSuara } from '@/plugins/recorder';
const emitter = inject('emitter')

const decibel = ref(0)
const audio = ref(null)
emitSuara.on('getRecorderData', (data)=>{
  decibel.value = data.decibel
})
emitSuara.on('getRecorderSound', (data)=>{
  emitter.emit('getRecorderSound', data.dataSuara)
})

const props = defineProps({
  width: Number,
  height: Number,
  interval: Number,
  minConfidanceRate: Number,
  mode: String,
  dataSetWajah: {
    type: Array,
    default: []
  },
  label: {
    type: String,
    default: 'Wajah'
  },
  distanceRecognition: {
    type: Number,
    default: 0.6
  }
})


const video = ref(null)
const canvasResult = ref(null)
const MODEL_URL = '/models'
const faceMatcher = ref(null)


onMounted(async ()=>{
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
  await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
  // await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)

  // cek apakah disediakan datasetwajah, jika iya, maka otomatis mode recognition
  if(props.dataSetWajah.length > 0){
    // train wajah
    let descriptions = []
    for(let i=0; i<props.dataSetWajah.length; i++){
      let fetchImage = await faceapi.fetchImage(props.dataSetWajah[i])
      
      let detection = await faceapi.detectSingleFace(fetchImage, new faceapi.TinyFaceDetectorOptions({
        inputSize: faceapi.TinyYolov2SizeType.XS, // ukuran image untuk input
        scoreThreshold: props.minConfidanceRate // threshold face detection 0 - 1
      })).withFaceLandmarks().withFaceDescriptor();
      descriptions.push(detection.descriptor)
    }
    let faceDescriptor = new faceapi.LabeledFaceDescriptors(props.label, descriptions);
    faceMatcher.value = new faceapi.FaceMatcher(faceDescriptor, props.distanceRecognition);

    // pengecekkan suara aktif
    await rekamSuara()
  }

  startVideo()
})

const intervalVideo = ref(null)
const startVideo = () =>{

  navigator.getUserMedia(
    { video: {} },
    stream => video.value.srcObject = stream,
    err => console.error(err)
  )

  video.value.addEventListener('play', playCallback)
}
const playCallback = () => {
  const displaySize = { width: video.value.width, height: video.value.height }
  faceapi.matchDimensions(canvasResult.value, displaySize)
  intervalVideo.value = setInterval(async ()=>{
    
    let detection = undefined
    let recorder = undefined
    if(props.mode === 'detectSingleFace'){
      detection = await faceapi.detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions({
        inputSize: faceapi.TinyYolov2SizeType.XS, // ukuran image untuk input
        scoreThreshold: props.minConfidanceRate // threshold face detection 0 - 1
      })).withFaceLandmarks().withFaceExpressions()
    }else if(props.mode === 'detectMultipleFace'){
      detection = await faceapi.detectAllFaces(video.value, new faceapi.TinyFaceDetectorOptions({
        inputSize: faceapi.TinyYolov2SizeType.XS, // ukuran image untuk input
        scoreThreshold: props.minConfidanceRate // threshold face detection 0 - 1
      })).withFaceLandmarks().withFaceDescriptors()
    }
    
    if(typeof detection !== 'undefined' && detection.length !== 0){
      if(props.mode === 'detectSingleFace'){

        let canvasCropeed = document.createElement('canvas');
        faceapi.matchDimensions(canvasCropeed, displaySize)
        canvasCropeed.getContext('2d').drawImage(video.value, 0, 0, displaySize.width, displaySize.height);
        let image_data_url = canvasCropeed.toDataURL('image/jpeg');
        
        const regionsToExtract = [
          // new faceapi.Rect(detection.detection.box.x, detection.detection.box.y, detection.detection.box.width, detection.detection.box.height)
          new faceapi.Rect(0, 0, displaySize.width, displaySize.height)
        ];
        let image = new Image();
        image.src =image_data_url;
        let faceImages = await faceapi.extractFaces(image, regionsToExtract);
        detection.images = []
        faceImages.forEach((cnv) => {
          detection.images.push(cnv.toDataURL('image/jpeg', 1.0))
        });

        
      }else if(props.mode === 'detectMultipleFace'){
        let canvasCropeed = document.createElement('canvas');
        faceapi.matchDimensions(canvasCropeed, displaySize)
        canvasCropeed.getContext('2d').drawImage(video.value, 0, 0, displaySize.width, displaySize.height);
        let image_data_url = canvasCropeed.toDataURL('image/jpeg');
        
        for(let i=0; i<detection.length; i++){
          const regionsToExtract = [
            // new faceapi.Rect(detection[i].detection.box.x, detection[i].detection.box.y, detection[i].detection.box.width, detection[i].detection.box.height)
            new faceapi.Rect(0, 0, displaySize.width, displaySize.height)
          ];
          let image = new Image();
          image.src =image_data_url;
          let faceImages = await faceapi.extractFaces(image, regionsToExtract);
          detection[i].images = []
          for(let x=0; x< faceImages.length; x++){
            detection[i].images.push(await resizedataURL(faceImages[x].toDataURL('image/jpeg', 1.0), 0.3))
          }
        }
        
      } 
      
      // faceapi.draw.drawFaceExpressions(canvasResult.value, resizeDetection)
      // faceapi.draw.drawFaceLandmarks(canvasResult.value, resizeDetection)
      const resizeDetection = faceapi.resizeResults(detection, displaySize)
      let ctx = canvasResult.value.getContext("2d");
      ctx.clearRect(0,0, canvasResult.value.width, canvasResult.value.height)

      if(faceMatcher.value !== null){ // untuk recognition
        let result = resizeDetection.map(d => faceMatcher.value.findBestMatch(d.descriptor))
        for(let i=0; i<result.length; i++){
          let box = resizeDetection[i].detection.box;
          let pesertaLabel = result[i].label;
          let drawBox = new faceapi.draw.DrawBox(box, { label: pesertaLabel})
          drawBox.draw(canvasResult.value)
        }

        detection = detection.length > 0 ? {
          detection: detection,
          recognition: result
        } : undefined;

        recorder = {
          decibel: decibel.value
        }
      }else{
        faceapi.draw.drawDetections(canvasResult.value, resizeDetection)
      }
      
      emitter.emit('faceDetectionResult', { detection: detection, cameraCapture: undefined, recorder: recorder});
      
    }else{
      let ctx = canvasResult.value.getContext("2d");
      ctx.clearRect(0,0, canvasResult.value.width, canvasResult.value.height)
      let canvasCropeed = document.createElement('canvas');
      canvasCropeed.getContext('2d').drawImage(video.value, 0, 0, displaySize.width, displaySize.height);
      let image_data_url = (canvasCropeed.toDataURL('image/jpeg'));
      image_data_url = await resizedataURL(image_data_url, 0.4)
      emitter.emit('faceDetectionResult', { detection: detection, cameraCapture: image_data_url, recorder: recorder});
    }
    
  }, props.interval)
  
}

onUnmounted(async ()=>{
  if(intervalVideo.value !== null){
    clearInterval(intervalVideo.value)
  }
  matikanSuara()
    
})

emitter.on('stopRecording', async ()=>{
  matikanSuara()
})

emitter.on('stopWebcam', async ()=>{
  if(video.value !== null && video.value.srcObject !== null){
    video.value.srcObject.getTracks()[0].stop();
  }
  if(video.value !== null){
    video.value.removeEventListener('play', playCallback);
  }
  
  if(intervalVideo.value !== null){
    clearInterval(intervalVideo.value)
  }

  matikanSuara()
})

onBeforeUnmount(()=>{
  if(video.value !== null && video.value.srcObject !== null){
    video.value.srcObject.getTracks()[0].stop();
  }
  if(video.value !== null){
    video.value.removeEventListener('play', playCallback);
  }
  
  
})


</script>