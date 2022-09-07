// 임포트 THREE three.module.js
import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js'
import { VertexNormalsHelper } from "../examples/jsm/helpers/VertexNormalsHelper.js"

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

    /* _setupControls() */
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
        camera.position.z = 7;
        this._camera = camera;
        this._scene.add(camera);
    }

    /*Light setup*/
    _setupLight(){
        //광원 색상 세기 값 설정
        const color = 0xffffff;
        const intensity = 1;
        //광원 생성
        const light = new THREE.DirectionalLight(color, intensity);
        //광원 위치설정
        light.position.set(-1, 2, 4);
        //씬의 구성요소로 추가
        //this._scene.add(light);
        this._camera.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff,0.2);
        this._scene.add(ambientLight);
    }

    /*Model setup*/
    _setupModel(){
        /* texture 객체 생성*/
        const textureLoader = new THREE.TextureLoader();
        /* mapping 속성 */
        const map = textureLoader.load("Image/glass/Glass_Window_002_basecolor.jpg");
        const mapAO = textureLoader.load("Image/glass/Glass_Window_002_ambientOcclusion.jpg");
        const mapHeight = textureLoader.load("Image/glass/Glass_Window_002_height.png");
        const mapNormal = textureLoader.load("Image/glass/Glass_Window_002_normal.jpg");
        const mapMetalic = textureLoader.load("Image/glass/Glass_Window_002_roughness.jpg");
        const mapAlpha = textureLoader.load("Image/glass/Glass_Window_002_opacity.jpg");
        const mapRoughness = textureLoader.load("Image/glass/Glass_Window_002_roughness.jpg");



        const material = new THREE.MeshStandardMaterial({
            map:map,
            normalMap: mapNormal,
            displacementMap: mapHeight,
            displacementScale : 0.2,
            displacementBias : -0.15,
            aoMap: mapAO,
            aoMapIntensity: 5, //강도 지정 기본값 1

            roughnessMap : mapRoughness,
            roughness : 0.5, //기본값은 1

            metalnessMap: mapMetalic,
            metalness : 0.5, //기본값은 0

            //alphaMap : mapAlpha,
            transparent : true,
            side: THREE.DoubleSide,


        });

        const box = new THREE.Mesh(new THREE.BoxGeometry(1,1,1,256,256,256), material);
        box.position.set(-1,0,0);
        box.geometry.attributes.uv2 = box.geometry.attributes.uv;
        this._scene.add(box);

        const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.7,512,512),material);
        sphere.position.set(1,0,0);
        sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
        this._scene.add(sphere);

        
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
     
    }

}

/*윈도우 온로드에서 앱 클래스를 생성함*/
window.onload = function(){
    new App();
}