// 임포트 THREE three.module.js
import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { RectAreaLightUniformsLib } from "../examples/jsm/lights/RectAreaLightUniformsLib.js"
import { RectAreaLightHelper } from "../examples/jsm/helpers/RectAreaLightHelper.js"

//앞으로 추가할 코드
class App{
    constructor(){
		/*div요소 저장 및 class의 필드로 정의*/
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

		/*renderer 생성코드*/
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

		/*scene 객체 생성코드*/
        const scene = new THREE.Scene();
        this._scene = scene;

		/*setup 해야 할 코드*/
        this._setupCamera();
        this._setupLight();
        this._setupModel(); //geometry , material
        this._setupControls();


		/* 웹 페이지 사이즈 조절에 맞게 리사이즈*/
        window.onresize = this.resize.bind(this);
        this.resize();
		
		/*자바스크립트 API*/
        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls(){
        new OrbitControls(this._camera,this._divContainer);
    }


    /*카메라 setup*/
    //three.js가 3차원 그래픽을 출력할 영역에 대한 가로세로 크기를 얻어옴
    _setupCamera(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        //카메라 객체 생성
        const camera = new THREE.PerspectiveCamera(
            75,
            width/height,
            0.1,
            100
        );
        //camera.position.z = 2;
        camera.position.set(7,7,8);
        camera.lookAt(0,0,0); // 원점인 0, 0, 0 을 바라보게 만든다
        this._camera = camera;
    }

    /*Light setup*/
    _setupLight(){
        const auxLight = new THREE.DirectionalLight(0xffffff, 0.2);
        auxLight.position.set(0,5,0);
        auxLight.target.position.set(0,0,0);
        this._scene.add(auxLight.target);
        this._scene.add(auxLight);
        
        // const light = new THREE.DirectionalLight(0xffffff,0.5);
        // light.position.set(0,5,0);
        // light.target.position.set(0,0,0);
        // this._scene.add(light.target);
        // light.shadow.camera.top = light.shadow.camera.right = 6;
        // light.shadow.camera.bottom = light.shadow.camera.left = -6;
        
        // const light = new THREE.PointLight(0xffffff,0.7);
        // light.position.set(0,5,0);
        
        const light = new THREE.SpotLight(0xffffff,1);
        light.position.set(0,5,0);
        light.target.position.set(0,0,0);
        light.angle = THREE.MathUtils.radToDeg(30);
        light.penumbra = 0.2;
        this._scene.add(light.target);

        //그림자 품질 향상
        light.shadow.mapSize.width = light.shadow.mapSize.height = 2048;
        light.shadow.radius = 1; //그림자 외곽 블러처리

        const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
        this._scene.add(cameraHelper);

        this._scene.add(light);
        this._light = light;
        light.castShadow = true; //그림자 부여
    }

    /*Model setup*/
    _setupModel(){
        /* Ground */
       const groundGeometry = new THREE.PlaneGeometry(10,10);
       const groundMaterial = new THREE.MeshStandardMaterial({
            color : "#2c3e50",
            roughness : 0.5,
            metalness : 0.5,
            side : THREE.DoubleSide
       });

       const ground = new THREE.Mesh(groundGeometry,groundMaterial);
       ground.rotation.x = THREE.MathUtils.degToRad(-90);
       ground.receiveShadow = true;
       this._scene.add(ground);

        /* bigSphere */
       const bigSphereGeometry = new THREE.TorusKnotGeometry(1,0.3,128,64,2,3);
       const bigMaterial = new THREE.MeshStandardMaterial({
            color : "#ffffff",
            roughness : 0.1,
            metalness : 0.2,
       });

       const bigSphere = new THREE.Mesh(bigSphereGeometry,bigMaterial);
       //bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
       bigSphere.position.y = 1.6;
       bigSphere.receiveShadow = true;
       bigSphere.castShadow = true;
       this._scene.add(bigSphere);

       /* torus */
       const torusGeometry = new THREE.TorusGeometry(0.4,0.1,32,32);
       const torusMaterial = new THREE.MeshStandardMaterial({
            color : "#9b59b6",
            roughness : 0.5,
            metalness : 0.9,
       });

       for (let i=0; i<8; i++){
            const torusPivot = new THREE.Object3D(); //torusPivot
            const torus = new THREE.Mesh(torusGeometry,torusMaterial);
            torusPivot.rotation.y = THREE.MathUtils.degToRad(45 * i);
            torus.position.set(3,0.5,0);
            torus.receiveShadow = true;
            torus.castShadow = true;
            torusPivot.add(torus);
            this._scene.add(torusPivot);    
       }

       /* smallSphere */
       const smallSphereGeometry = new THREE.SphereGeometry(0.3,32,32);
       const smallSphereMaterial = new THREE.MeshStandardMaterial({
            color : "#e74c37",
            roughness : 0.2,
            metalness : 0.5,
       });

       const smallSpherePivot = new THREE.Object3D(); //smallSpherePivot
       const smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
       smallSpherePivot.add(smallSphere);
       smallSpherePivot.name = "smallSpherePivot"; //이름부여, 이름을 부여하면 추가된 곳에서 조회할 수 있다.
       smallSphere.position.set(3,0.5,0);
       smallSphere.receiveShadow = true;
       smallSphere.castShadow = true;
       this._scene.add(smallSpherePivot);
    }

    /* resize */
    resize(){
        //_divContainer의 크기 가져옴
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        //카메라 속성 값 설정
        this._camera.aspect = width/height;
        //변경된 값을 카메라에 적용
        this._camera.updateProjectionMatrix();
        //렌더러의 크기 설정
        this._renderer.setSize(width,height);
    }

    /* render */
    render(time){
        //랜더러가 씬을 카메라의 시점을 이용해서 랜더링하라는 의미
        this._renderer.render(this._scene,this._camera);
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    /* update */
    update(time){
        time *= 0.001; //second unit
        
        const smallSpherePivot = this._scene.getObjectByName("smallSpherePivot");
        if(smallSpherePivot){
            smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(time*50);
            
            //작은구체 추적라이트
            if(this._light.target){
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition(this._light.target.position);

                if(this._lightHelper){
                    this._lightHelper.update();
                }
            }

            //pointlight
            if(this._light instanceof THREE.PointLight){
                const smallSphere = smallSpherePivot.children[0];
                smallSphere.getWorldPosition(this._light.position);
            }

        }
    }

}

/*윈도우 온로드에서 앱 클래스를 생성함*/
window.onload = function(){
    new App();
}