import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Color, DoubleSide, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, Quaternion, ShaderMaterial, SphereGeometry, Texture, TextureLoader, Vector3 } from 'three';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';

const planetUrls = ['/assets/ascend-planet.glb', '/assets/ascend-planet-lights.glb'];
const cloudUrl = '/assets/ascend-planet-clouds.png';

function configureLoader(loader: GLTFLoader) {
  const draco = new DRACOLoader();
  draco.setDecoderPath('/draco/');
  draco.setDecoderConfig({ type: 'wasm' });
  loader.setDRACOLoader(draco);
}

function clonePlanetModel(gltf: GLTF, isNightLayer = false) {
  const scene = gltf.scene.clone(true);
  scene.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.frustumCulled = false;
    if (!isNightLayer) return;
    const source = Array.isArray(object.material) ? object.material[0] : object.material;
    const texture = source instanceof MeshStandardMaterial ? source.map : null;
    if (!texture) return;
    object.material = new MeshBasicMaterial({
      map: texture,
      color: new Color('#f4d79b'),
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: DoubleSide,
    });
  });
  return scene;
}

function Atmosphere() {
  const material = useMemo(() => new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      void main() {
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDirection = normalize(-viewPosition.xyz);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      void main() {
        float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDirection)), 0.0), 2.3);
        vec3 teal = vec3(0.13, 0.56, 0.68);
        vec3 gold = vec3(0.72, 0.40, 0.17);
        vec3 color = mix(teal, gold, smoothstep(-0.8, 0.8, vNormal.y + vNormal.x * 0.45));
        gl_FragColor = vec4(color, rim * 0.58);
      }
    `,
  }), []);

  return <mesh scale={1.035} material={material}><sphereGeometry args={[9.78, 72, 72]} /></mesh>;
}

function CloudShell({ texture }: { texture: Texture }) {
  const shell = useRef<Group>(null);
  const material = useMemo(() => new ShaderMaterial({
    uniforms: { uClouds: { value: texture } },
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
    blending: AdditiveBlending,
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      void main() {
        vUv = uv;
        vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDirection = normalize(-viewPosition.xyz);
        gl_Position = projectionMatrix * viewPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D uClouds;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDirection;
      void main() {
        vec4 cloud = texture2D(uClouds, vUv);
        float density = max(max(cloud.r, cloud.g), cloud.b);
        float rim = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDirection)), 0.0), 1.7);
        float alpha = smoothstep(0.06, 0.82, density) * 0.17 + rim * 0.035;
        vec3 cloudTint = mix(vec3(0.31, 0.74, 0.81), vec3(0.92, 0.69, 0.40), smoothstep(0.1, 0.9, vUv.x));
        gl_FragColor = vec4(cloudTint, alpha);
      }
    `,
  }), [texture]);

  useFrame((_, delta) => {
    if (shell.current) shell.current.rotation.y += delta * 0.006;
  });

  return <group ref={shell} scale={1.012}>
    <mesh material={material}><sphereGeometry args={[9.78, 72, 72]} /></mesh>
  </group>;
}

const markerLocations: Array<[number, number]> = [
  [31.63, -8.0], [33.59, -7.62], [48.86, 2.35], [25.2, 55.27], [40.71, -74.0], [-33.87, 151.2],
];

function RadarMarker({ latitude, longitude }: { latitude: number; longitude: number }) {
  const pulse = useRef<Mesh>(null);
  const normal = useMemo(() => {
    const lat = latitude * Math.PI / 180;
    const lon = longitude * Math.PI / 180;
    return new Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)).normalize();
  }, [latitude, longitude]);
  const orientation = useMemo(() => new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), normal), [normal]);
  const position = useMemo(() => normal.clone().multiplyScalar(9.9), [normal]);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const phase = (clock.elapsedTime * 0.3 + latitude * 0.01) % 1;
    const scale = 0.72 + phase * 1.8;
    pulse.current.scale.setScalar(scale);
    const material = pulse.current.material as MeshBasicMaterial;
    material.opacity = 0.68 * (1 - phase);
  });

  return <group position={position} quaternion={orientation}>
    <mesh><sphereGeometry args={[0.075, 12, 12]} /><meshBasicMaterial color="#ffdb8a" toneMapped={false} /></mesh>
    <mesh ref={pulse}>
      <ringGeometry args={[0.16, 0.19, 32]} />
      <meshBasicMaterial color="#f4c36b" transparent opacity={0.68} side={DoubleSide} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
    </mesh>
  </group>;
}

function Starfield() {
  const points = useMemo(() => {
    const positions = new Float32Array(900 * 3);
    let seed = 12_345;
    const random = () => {
      seed = (seed * 1_103_515_245 + 12_345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let index = 0; index < 900; index += 1) {
      const radius = 16 + random() * 25;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.cos(phi);
      positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return <points geometry={points}>
    <pointsMaterial color="#9ec6d2" size={0.055} transparent opacity={0.48} sizeAttenuation depthWrite={false} />
  </points>;
}

function PlanetScene() {
  const planetGroup = useRef<Group>(null);
  const [planetGltf, lightsGltf] = useLoader(GLTFLoader, planetUrls, configureLoader);
  const cloudTexture = useLoader(TextureLoader, cloudUrl);
  const { width } = useThree((state) => state.size);
  const isCompact = width < 760;
  const planet = useMemo(() => clonePlanetModel(planetGltf), [planetGltf]);
  const nightLights = useMemo(() => clonePlanetModel(lightsGltf, true), [lightsGltf]);

  useFrame((_, delta) => {
    if (planetGroup.current) planetGroup.current.rotation.y += delta * 0.012;
  });

  return <>
    <ambientLight intensity={0.2} />
    <directionalLight position={[-5, 4, 8]} intensity={1.25} color="#c8e7ee" />
    <group position={isCompact ? [0.15, 1.2, -1] : [3.2, -0.55, -1]} scale={isCompact ? 0.19 : 0.31} ref={planetGroup}>
      <primitive object={planet} />
      <primitive object={nightLights} />
      <CloudShell texture={cloudTexture} />
      <Atmosphere />
      {markerLocations.map(([latitude, longitude]) => <RadarMarker key={`${latitude}-${longitude}`} latitude={latitude} longitude={longitude} />)}
    </group>
    <Starfield />
  </>;
}

export default function PlanetCanvas() {
  return <Canvas
    camera={{ position: [0, 0, 12], fov: 42, near: 0.1, far: 100 }}
    dpr={[1, 1.35]}
    gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
    aria-hidden="true"
  >
    <PlanetScene />
  </Canvas>;
}
