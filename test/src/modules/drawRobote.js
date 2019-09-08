import * as THREE from 'three';
import * as TWEEN from 'tween';
import Detector from "../assets/js/libs/Detector.js";
import { OrbitControls } from "../assets/js/control/OrbitControls";
import { GLTFLoader } from '../assets/js/libs/GLTFLoader';
import { GUI } from '../assets/js/libs/dat.gui.module';


import doorRight from "../assets/images/door_right.png";
import doorLeft from "../assets/images/door_left.png";
class DrawRobote {
    /**
     * 构造方法初始化
     * @param { 绘制对象 } el 
     * @param { 绘制对象距离屏幕左边的距离 } canvas_left 
     * @param { 绘制对象距离屏幕顶部的距离 } canvas_top 
     * @param { 返回函数 } callback  
     */
    constructor(el, canvas_left, canvas_top, callback) {
        this.el = el;
        this.callback = callback;
        this.canvas_left = canvas_left;
        this.canvas_top = canvas_top;

        this.transformCallback = null;

        this.container = "";
        this.controlRender = 1;

        this.camera = "";
        this.scene = null;
        this.renderer = null;
        this.plane = "";
        this.mouse = "";
        this.model = null;


        this.raycaster = new THREE.Raycaster();
        this.mouseVector = new THREE.Vector3();

        this.controls = null;

        this.camear__x = 1000;
        this.camear__y = 1000;
        this.camear__z = 1;

        // Three.js 全景贴图
        this.imgRendering = new THREE.TextureLoader();


        // 3D模型旋转返回角度
        this.angleCallback = "";

        this.objects = [];

        this.api = { state: 'Walking' };
        this.activeAction = null;
        this.actions = [];
    }

    init() {
        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
        }
        // 初始化场景
        this.cerateScene();
        // 初始化镜头
        this.createCamear();
        // 初始化灯光
        this.createLight();
        // 初始化渲染器
        this.createRenderer();
        // 控制函数
        this.createControls();
        // 初始化帧刷新
        this.animate();

        this.loadModel();
    };


    /**
     * 初始化材质
     */
    cerateScene() {
        this.scene = new THREE.Scene();
    };
    /**
     * 初始化相机
     */
    createCamear() {
        this.camera = new THREE.PerspectiveCamera(45, this.el.offsetWidth / this.el.offsetHeight, 1, 10000);
        this.camera.position.set(-5, 3, 10);
        var target = new THREE.Vector3(0, 2, 0);
        this.camera.lookAt(target);
    };

    /** 
     * 新建镭射器
     * 用于点击3D模型获取模型的Mesh（网格对象）
     */
    cerateRayCaster(x, y) {
        this.mouse = new THREE.Vector2();
        var geometry = new THREE.PlaneBufferGeometry(this.houseWidth + x, this.houseHeight + y);
        geometry.rotateX(-Math.PI / 2);
        this.plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
        this.scene.add(this.plane);

        this.objects.push(this.plane);
    };

    /**
     * 初始化光源
     */
    createLight() {
        // 设置环境光
        var ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);
        // 设置平行光
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(1, 0.75, 0.5).normalize();
        this.scene.add(directionalLight);
    };
    /**
     * 初始化渲染器
     */
    createRenderer() {
        /**
         * WebGLRenderer
         * antialias 抗锯齿，平滑，默认false
         * alpha 画布是否包含透明缓冲区，默认false
         * gammaInput: Boolean 所有的纹理和颜色预乘伽马，默认false
         * gammaOutput: Boolean 需要以预乘的伽马输出，默认false
         * shadowMap: 属性有enabled(默认false)/autoUpdate(默认true)/needsUpdate(默认false)/type(默认 THREE.PCFShadowMap)
         * setPixelRatio(value) 设置设备像素比
         * setSize(width, height) 设置渲染器的范围
         * setClearColor(color,alpha) 设置渲染的环境的颜色
         */
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight);

        this.renderer.setClearColor(0XFFFFFF, 0);

        this.el.innerHTML = "";
        this.el.appendChild(this.renderer.domElement);
        this.container__W = this.el.offsetWidth;
        this.container__H = this.el.offsetHeight;

        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.renderer.shadowMap.enabled = true;
    };

    createControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 450;
        this.controls.maxDistance = 5000;
    };
    /**
     * 初始化FPS函数
     */
    animate() {
        let _self = this;
        requestAnimationFrame(_self.animate.bind(this));
        this.render();
        TWEEN.update();
    };
    /**
     * 定义FPS函数执行的内容
     */
    render() {

        this.renderer.render(this.scene, this.camera);
        this.controlRender = 0;
        this.controls.update();

    };
    loadModel() {
        let loader = new GLTFLoader();
        let _self = this;

        loader.load('/static/model/RobotExpressive.glb', (gltf) => {
            _self.model = gltf.scene;
            _self.model.scale.set(50, 50, 50)
            _self.model.position.set(0, -100, 0)
            _self.scene.add(this.model);
            _self.createGUI(_self.model, gltf.animations);
        }, undefined, function(e) {
            console.error(e);
        });
    };

    createGUI(model, animations) {
        let _self = this;
        var states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
        var emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
        let gui = new GUI();
        let mixer = new THREE.AnimationMixer(model);
        _self.actions = {};
        for (var i = 0; i < animations.length; i++) {
            var clip = animations[i];
            var action = mixer.clipAction(clip);
            _self.actions[clip.name] = action;
            if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
        }
        // states
        var statesFolder = gui.addFolder('States');
        var clipCtrl = statesFolder.add(_self.api, 'state').options(states);
        clipCtrl.onChange(function() {
            _self.fadeToAction(_self.api.state, 0.5);
        });
        statesFolder.open();
        // emotes
        var emoteFolder = gui.addFolder('Emotes');

        function createEmoteCallback(name) {
            _self.api[name] = function() {
                _self.fadeToAction(name, 0.2);
                mixer.addEventListener('finished', restoreState);
            };
            emoteFolder.add(_self.api, name);
        }

        function restoreState() {
            mixer.removeEventListener('finished', restoreState);
            _self.fadeToAction(_self.api.state, 0.2);
        }
        for (var i = 0; i < emotes.length; i++) {
            createEmoteCallback(emotes[i]);
        }
        emoteFolder.open();
        // expressions
        let face = model.getObjectByName('Head_2');
        var expressions = Object.keys(face.morphTargetDictionary);
        var expressionFolder = gui.addFolder('Expressions');
        for (var i = 0; i < expressions.length; i++) {
            expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i]);
        }
        _self.activeAction = _self.actions['Walking'];
        _self.activeAction.play();
        expressionFolder.open();
    }
    fadeToAction(name, duration) {
        let previousAction = this.activeAction;
        this.activeAction = this.actions[name];
        if (previousAction !== this.activeAction) {
            previousAction.fadeOut(duration);
        }
        this.activeAction
            .reset()
            .setEffectiveTimeScale(1)
            .setEffectiveWeight(1)
            .fadeIn(duration)
            .play();
    }

};

export default DrawRobote;