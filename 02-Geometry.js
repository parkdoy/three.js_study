// 임포트 THREE three.module.js
import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { FontLoader } from "../examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "../examples/jsm/geometries/TextGeometry.js"

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

    /* setupControls 정의 */
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
        camera.position.z = 15;
        this._camera = camera;
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
        this._scene.add(light);
    }

    /*Model setup*/
    _setupModel(){
        /* TextGeometry */
        const fontLoader = new FontLoader();

        //loadfont 비동기함수 추가 비동기적 호출
        async function loadfont(that){
            const url = "../examples/fonts/helvetiker_regular.typeface.json"
            const font = await new Promise((resolve,reject) =>{
                fontLoader.load(url,resolve,undefined,reject);
            });

            //지오메트리 생성
            const geometry = new TextGeometry("Do",{
                font: font,
                size: 5,
                height: 1.6,
                curveSegments:2,
                //setting for ExtrudeGeometry
                bevelEnabled: true,
                bevelThickness: 0.3,
                bevelSize:0.7,
                bevelSegments: 2,
            });

            /* 메쉬 색상 정의 및 메쉬 생성 */
            const fillMaterial = new THREE.MeshPhongMaterial({color:0x515151});
            const cube = new THREE.Mesh(geometry,fillMaterial);

            /*라인 색상을 정의하고 먼저 만든 지오메트리에 와이어프레임 구분선으로 사용*/
            const lineMaterial = new THREE.LineBasicMaterial({color:0xffff00});
            const line = new THREE.LineSegments(
                new THREE.WireframeGeometry(geometry),lineMaterial);
            
            /*메쉬 오브젝트와 라인 오브젝트를 그룹으로 묶어 씬에 추가 */
            const group = new THREE.Group();
            group.add(cube);
            group.add(line);

            //씬객체에 구성요소로 추가
            that._scene.add(group);
            //필드정의
            that._cube = group;

        };
        loadfont(this);
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

        //cube의 x,y축으로 회전시킴
        //this._cube.rotation.x = time;
        //this._cube.rotation.y = time;
        
    }

}

/*윈도우 온로드에서 앱 클래스를 생성함*/
window.onload = function(){
    new App();
}