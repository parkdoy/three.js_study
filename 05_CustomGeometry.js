// 임포트 THREE three.module.js
import * as THREE from '../build/three.module.js';
import { VertexNormalsHelper } from '../examples/jsm/helpers/VertexNormalsHelper.js'
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"

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
        camera.position.z = 2;
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
        //버텍스 좌표
        const rawPositions = [
            -1,-1,0,
            1,-1,0,
            -1,1,0,
            1,1,0
        ];

        //법선 벡터에 대한 배열 데이터
        const rawNormals= [
            0,0,1,
            0,0,1,
            0,0,1,
            0,0,1
        ];

        const rawColors = [
            1,0,0,
            0,1,0,
            0,0,1,
            1,1,0
         ]

        const rawUvs = [
            0,0,
            1,0,
            0,1,
            1,1
        ];

        //맵핑 
        const positions = new Float32Array(rawPositions);
        const normals = new Float32Array(rawNormals);
        const colors = new Float32Array(rawColors);
        const uvs = new Float32Array(rawUvs);
        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute("position", new THREE.BufferAttribute(positions,3));
        //법선 벡터를 지오메트리에 지정
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals,3)); 
        //지오메트리에 컬러 속성지정
        geometry.setAttribute("color", new THREE.BufferAttribute(colors,3)); 
        //UV 속성 지정
        geometry.setAttribute("uv", new THREE.BufferAttribute(uvs,2)); 

        /*버텍스 인덱스 지정 */
        geometry.setIndex([
            0,1,2,
            2,1,3
        ]);
        
        //모든 정점에 대한 법선 벡터지정
        // geometry.computeVertexNormals();

        const textureLoader = new THREE.TextureLoader();
        const map = textureLoader.load("../examples/textures/uv_grid_opengl.jpg");

        const material = new THREE.MeshPhongMaterial({
            color:0xffffff,
            //vertexColors : true,
            map : map,
        });
        
        const box = new THREE.Mesh(geometry,material);
        this._scene.add(box);

        const helper = new VertexNormalsHelper(box, 0.1, 0xffff00);
        this._scene.add(helper);
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