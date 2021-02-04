const video =document.getElementById('video');

Promise.all([
    
    // this for tiny faces
   faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    
    // for detect mouth and nose etc..
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    
    
    //for let api to recognize where is your face by doing box suround it
    
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    
    // for recognize that i'am happy or sad or any thing else
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)


// start webcam by take the stream and but it to video.srcObject
function startVideo(){
    navigator.getUserMedia(
        {video:{}},
        stream => video.srcObject=stream,
        err=> console.error(err)
        
    )
}

// event listener when video play 
video.addEventListener('play', () => {
    
    // create canvas element 
    const canvas=faceapi.createCanvas(video);
    
const displaySize={width: video.width, height:video.height};

    //append canvas in the  body of html page
    document.body.append(canvas);
    

    setInterval(async () => {
        
        //await faceapiDetect all faces with landmark(shap around mouth and nose and so on) & faceExpression( is this face happy or sad etc..)
      const detections = await faceapi.detectAllFaces
      (video, new faceapi.TinyFaceDetectorOptions()).
      withFaceLandmarks().withFaceExpressions()
      
        //resize the result which come from faceapi by using function in faceapi called ressizeResult(detection,size-we-want)
        const resizeDetection=faceapi.resizeResults(detections,displaySize);
        
        //clear canvas every time before draw it  agin
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)
        console.log(detections);
        
        // draw detection ( the box around the face)
        faceapi.draw.drawDetections(canvas,resizeDetection);
        
        //draw canvas around mouth and nose 
        faceapi.draw.drawFaceLandmarks(canvas,resizeDetection);
        
        // draw face expression (sad or happy  etc...)
        faceapi.draw.drawFaceExpressions(canvas,resizeDetection)
    }, 100)
    
  })

