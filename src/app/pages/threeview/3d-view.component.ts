import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzInputNumberLegacyModule } from 'ng-zorro-antd/input-number-legacy';
import * as THREE from 'three';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


@Component({
  selector: 'app-3d-view',
  imports: [
    NzCardModule, 
    NzGridModule, 
    NzSliderModule, 
    FormsModule, 
    NzInputNumberLegacyModule
  ],
  templateUrl: './3d-view.component.html',
  styleUrl: './3d-view.component.less'
})
export class ThreeViewComponent {
  @ViewChild('threeView') threeView!: ElementRef;

  geometryValue = {
    x: 100,
    y: 100,
    z: 100
  }
  cubeValue = {
    x: 0,
    y: 0,
    z: 0
  }
  cameraValue = {
    x: 200,
    y: 200,
    z: 100
  }
  cameraPerspective = {
    fov: 75,
    near: 0.1,
    far: 1000
  }

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh

  gui = new GUI();

 


  // 定义相机输出画布的尺寸(单位:像素px)
  width = 500; //宽度
  height = 500; //高度

  constructor() {

  }
  ngOnInit() {
    this.gui.add(this.geometryValue, 'x', 10, 200).onChange(() => this.updateScene());
    this.gui.add(this.geometryValue, 'y', 10, 200).onChange(() => this.updateScene());
    this.gui.add(this.geometryValue, 'z', 10, 200).onChange(() => this.updateScene());

  }

  ngAfterViewInit() {
    this.createScene();
  }

  updateScene() {
    this.cube.geometry.dispose(); // 释放旧几何体
    this.cube.geometry = new THREE.BoxGeometry(
      this.geometryValue.x,
      this.geometryValue.y,
      this.geometryValue.z
    );
    this.cube.position.set(this.cubeValue.x, this.cubeValue.y, this.cubeValue.z);

    // 更新相机位置
    this.camera = new THREE.PerspectiveCamera(this.cameraPerspective.fov, this.width / this.height, this.cameraPerspective.near, this.cameraPerspective.far);

    this.camera.position.set(this.cameraValue.x, this.cameraValue.y, this.cameraValue.z);
    this.camera.lookAt(this.cube.position);



    // 重新渲染
    this.renderer.render(this.scene, this.camera);
  }


  createScene() {
    this.scene = new THREE.Scene();
    

    //创建一个长方体几何对象Geometry
    const geometry = new THREE.BoxGeometry(100, 100, 100); 

    const material = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      opacity: 0.5,
      transparent: true


    });

    //创建一个网格模型Mesh
    this.cube = new THREE.Mesh(geometry, material); 
    this.cube.position.set(this.cubeValue.x, this.cubeValue.y, this.cubeValue.z);
    this.scene.add(this.cube); //网格模型添加到场景中

    const axesHelper = new THREE.AxesHelper(150);
    this.scene.add(axesHelper);

    //PerspectiveCamera( fov, aspect, near, far )
    //fov	相机视锥体竖直方向视野角度	50
    // aspect	相机视锥体水平方向和竖直方向长度比，一般设置为Canvas画布宽高比width / height	1
    // near	相机视锥体近裁截面相对相机距离	0.1
    // far	相机视锥体远裁截面相对相机距离，far-near构成了视锥体高度方向	2000
 
    this.camera = new THREE.PerspectiveCamera(this.cameraPerspective.fov, this.width / this.height, this.cameraPerspective.near, this.cameraPerspective.far);

    this.camera.position.set(this.cameraValue.x, this.cameraValue.y, this.cameraValue.z);
    this.camera.lookAt(this.cube.position);

    

    // 创建渲染器对象
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);

    this.renderer.render(this.scene, this.camera);


    this.threeView.nativeElement.appendChild(this.renderer.domElement);
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera); //执行渲染操作
    });//监听鼠标、键盘事件
  }
}
