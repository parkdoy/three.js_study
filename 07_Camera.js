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
    _setupCamera(){
       
        //PerspectiveCamera
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        // //OrthographicCamera
        // const aspect = window.innerWidth / window.innerHeight;
        // const camera = new THREE.OrthographicCamera(
        //     -1*aspect,1*aspect, //xLeft, xRight
        //     1,-1, //yTop, yBottom
        //     0.1, 100 //zNear, zFar
        // );
        // camera.zoom = 0.15;

        //camera.position.z = 2;
        camera.position.set(7,7,8);
        camera.lookAt(0,0,0); // 원점인 0, 0, 0 을 바라보게 만든다
        this._camera = camera;
    }

    /*Light setup*/
    _setupLight(){
        RectAreaLightUniformsLib.init();
       
        const light = new THREE.RectAreaLight(0xffffff,50,3,0.5);
        light.position.set(0,5,0);
        light.rotation.x = THREE.MathUtils.degToRad(-90);
       
        const helper = new RectAreaLightHelper(light);
        this._scene.add(helper);
        
        this._scene.add(light);
        this._light = light;
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
       this._scene.add(ground);

        /* bigSphere */
       const bigSphereGeometry = new THREE.SphereGeometry(1.5,64,64,0,Math.PI);
       const bigMaterial = new THREE.MeshStandardMaterial({
            color : "#ffffff",
            roughness : 0.1,
            metalness : 0.2,
       });

       const bigSphere = new THREE.Mesh(bigSphereGeometry,bigMaterial);
       bigSphere.rotation.x = THREE.MathUtils.degToRad(-90);
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
       this._scene.add(smallSpherePivot);

       //
       const targetPivot = new THREE.Object3D();
       const target = new THREE.Object3D();
       targetPivot.add(target);
       targetPivot.name = "targetPivot";
       target.position.set(3,0.5,0);
       this._scene.add(targetPivot);
       //

    }

    /* resize */
    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const aspect = width/height;

        if(this._camera instanceof THREE.PerspectiveCamera){
            this._camera.aspect = aspect;
        }
        else{
            this._camera.left = -1 * aspect; //xLeft
            this._camera.right = 1 * aspect; //xRight
        }
    
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
            
            //
            const smallSphere = smallSpherePivot.children[0];
            smallSphere.getWorldPosition(this._camera.position);
           
            const targetPivot = this._scene.getObjectByName("targetPivot");
            if(targetPivot){
                targetPivot.rotation.y = THREE.MathUtils.degToRad(time*50 +10);

                const target = targetPivot.children[0];
                const pt = new THREE.Vector3();

                target.getWorldPosition(pt);
                this._camera.lookAt(pt);
            }
            //
            
        }
    }

}

/*윈도우 온로드에서 앱 클래스를 생성함*/
window.onload = function(){
    new App();
}