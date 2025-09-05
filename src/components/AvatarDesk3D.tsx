"use client";

import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/** Public props for the presenter */
type Props = {
  modelUrl: string;
  mediaUrl?: string;

  /** Avatar height in meters (default 1.6) */
  avatarHeight?: number;

  /** Screen height in meters (default 2.0) */
  screenHeight?: number;

  /** Screen aspect ratio (default 16 / 9) */
  screenAspect?: number;

  /** Horizontal gap between avatar and screen (default 0.8) */
  gap?: number;
};

/* -----------------------------------------------------------
   Inline media plane (Html overlay) – image or video or blank
----------------------------------------------------------- */
function MediaOnScreen({ url, w, h }: { url?: string; w: number; h: number }) {
  const isVideo = !!url && /\.(mp4|m4v|webm|mov)$/i.test(url);
  const isImage = !!url && /\.(gif|png|jpe?g|webp|avif)$/i.test(url);

  if (!url) {
    return (
      <mesh position={[0, h / 2, 0]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#cfd4da" />
      </mesh>
    );
  }

  const pxW = Math.round(w * 180);
  const pxH = Math.round(h * 180);

  return (
    <Html position={[0, h / 2, 0.006]} transform={false} zIndexRange={[0, 0]}>
      {isVideo ? (
        <video
          src={url}
          width={pxW}
          height={pxH}
          autoPlay
          muted
          loop
          playsInline
          style={{ borderRadius: 8, boxShadow: "0 6px 22px rgba(0,0,0,.22)" }}
        />
      ) : isImage ? (
        <img
          src={url}
          width={pxW}
          height={pxH}
          alt="Slide"
          style={{ borderRadius: 8, boxShadow: "0 6px 22px rgba(0,0,0,.22)" }}
        />
      ) : null}
    </Html>
  );
}

/* -----------------------------------------------------------
   Inner scene presenter (uses required props)
----------------------------------------------------------- */
function Presenter({
  modelUrl,
  mediaUrl,
  avatarHeight,
  screenHeight,
  screenAspect,
  gap,
}: Required<Omit<Props, "mediaUrl">> & { mediaUrl?: string }) {

  const avatarGroup = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, avatarGroup);
  const [avatarWidth, setAvatarWidth] = useState(0);

  // Normalize avatar: center X/Z, set feet to y=0, scale to target height, measure width
  useLayoutEffect(() => {
    if (!scene) return;

    // center X/Z
    const box0 = new THREE.Box3().setFromObject(scene);
    const c = box0.getCenter(new THREE.Vector3());
    scene.position.x -= c.x;
    scene.position.z -= c.z;

    // feet on floor
    const box1 = new THREE.Box3().setFromObject(scene);
    scene.position.y -= box1.min.y;

    // scale to match desired avatarHeight
    const size1 = box1.getSize(new THREE.Vector3());
    const s = size1.y > 0 ? avatarHeight / size1.y : 1;
    scene.scale.setScalar(s);

    // compute width after scaling
    const size2 = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    setAvatarWidth(size2.x);
  }, [scene, avatarHeight]);

  // Face forward once
  useEffect(() => {
    if (!avatarGroup.current) return;
    avatarGroup.current.rotation.set(0, 0, 0);
  }, []);

  // Play first animation safely; cleanup returns void
  useEffect(() => {
    const first =
      ((Object.values(actions ?? {}) as (THREE.AnimationAction | null | undefined)[])[0] ??
        null) as THREE.AnimationAction | null;

    first?.reset().fadeIn(0.3).play();

    return () => {
      if (first) {
        first.fadeOut(0.2);
        first.stop();
      }
    };
  }, [actions]);

  // Layout
  const screenW = screenHeight * screenAspect;
  const avatarX = 0;
  const screenX = avatarWidth / 2 + gap + screenW / 2;

  return (
    <group>
      {/* Avatar at y=0 */}
      <group ref={avatarGroup} position={[avatarX, 0, 0]}>
        <primitive object={scene} />
      </group>

      {/* Projector + screen (media overlay via Html) */}
      <group position={[screenX, 0, 0]}>
        <mesh position={[0, screenHeight / 2, -0.02]}>
          <boxGeometry args={[0.05, screenHeight + 0.4, 0.05]} />
          <meshStandardMaterial color="#7e8ca0" />
        </mesh>

        <mesh position={[0, screenHeight / 2, 0]}>
          <planeGeometry args={[screenW + 0.1, screenHeight + 0.1]} />
          <meshStandardMaterial color="#adb5bd" />
        </mesh>

        <MediaOnScreen url={mediaUrl} w={screenW} h={screenHeight} />
      </group>
    </group>
  );
}

/* -----------------------------------------------------------
   Public component (defaults provided here)
----------------------------------------------------------- */
export default function AvatarPresenter({
  modelUrl,
  mediaUrl,
  avatarHeight = 1.6,
  screenHeight = 2.0,
  screenAspect = 16 / 9,
  gap = 0.8, // set to 0.3 if you prefer that default
}: Props) {
  // camera target mid-point between avatar and screen (plus small offset)
  const focusX = (0 + (screenHeight * screenAspect) / 2 + gap + 0.4) / 2;

  return (
    <div className="relative w-full h-[520px]">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1.6, 4.6], fov: 35 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 6]} intensity={0.9} />
        <directionalLight position={[-3, 5, -4]} intensity={0.35} />

        <Suspense fallback={null}>
          <Presenter
            modelUrl={modelUrl}
            mediaUrl={mediaUrl}
            avatarHeight={avatarHeight}
            screenHeight={screenHeight}
            screenAspect={screenAspect}
            gap={gap}
          />
        </Suspense>

        <OrbitControls enablePan={false} target={[focusX, 1.0, 0]} />
      </Canvas>
    </div>
  );
}

// Preload default avatar GLB
useGLTF.preload("/avatars/avatar.glb");
