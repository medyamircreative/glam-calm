import { useEffect, useRef, useState } from "react";
import "./Inkwell.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import collection from "./collection.js";

const Inkwell = () => {
  const galleryRef = useRef(null);
  const galleryContainerRef = useRef(null);
  const titleContainerRef = useRef(null);
  const cardsRef = useRef([]);
  const transformStateRef = useRef([]);
  const parallaxStateRef = useRef({
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    currentX: 0,
    currentY: 0,
    currentZ: 0,
  });

  const isPreviewActiveRef = useRef(false);
  const isTransitioningRef = useRef(false);
  const currentTitleRef = useRef(null);
  const configRef = useRef({
    imageCount: 25,
    radius: 275,
    sensitivity: 500,
    effectFalloff: 250,
    cardMoveAmount: 50,
    lerpFactor: 0.15,
    isMobile: window.innerWidth < 1000,
  });

  useEffect(() => {
    const gallery = galleryRef.current;
    const galleryContainer = galleryContainerRef.current;
    const titleContainer = titleContainerRef.current;

    if (!gallery || !galleryContainer || !titleContainer) return;

    const cards = [];
    const transformState = [];

    // Create cards exactly like the original
    for (let i = 0; i < configRef.current.imageCount; i++) {
      const angle = (i / configRef.current.imageCount) * Math.PI * 2;
      const x = configRef.current.radius * Math.cos(angle);
      const y = configRef.current.radius * Math.sin(angle);
      const cardIndex = i % collection.length;

      const card = document.createElement("div");
      card.className = "inkwell-card";
      card.dataset.index = i;
      card.dataset.title = collection[cardIndex].title;

      const img = document.createElement("img");
      img.src = collection[cardIndex].img;
      card.appendChild(img);

      gsap.set(card, {
        x,
        y,
        rotation: (angle * 180) / Math.PI + 90,
        transformPerspective: 800,
        transformOrigin: "center center",
      });

      gallery.appendChild(card);
      cards.push(card);
      transformState.push({
        currentRotation: 0,
        targetRotation: 0,
        currentX: 0,
        targetX: 0,
        currentY: 0,
        targetY: 0,
        currentScale: 1,
        targetScale: 1,
        angle,
      });

      card.addEventListener("click", (e) => {
        if (!isPreviewActiveRef.current && !isTransitioningRef.current) {
          togglePreview(parseInt(card.dataset.index));
          e.stopPropagation();
        }
      });
    }

    cardsRef.current = cards;
    transformStateRef.current = transformState;

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Create scatter animation based on scroll
    const scatterOffsets = cards.map(() => ({
      x: (Math.random() - 0.5) * 3,
      y: (Math.random() - 0.5) * 3,
      rotation: (Math.random() - 0.5) * 0.3
    }));

    // Add scatter state to transformState
    transformState.forEach((state, index) => {
      state.scatterX = 0;
      state.scatterY = 0;
      state.scatterRotation = 0;
    });

    const scatterTrigger = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        if (isPreviewActiveRef.current || isTransitioningRef.current) return;
        
        const progress = self.progress;
        const isMobile = window.innerWidth < 1000;
        const scatterAmount = progress * (isMobile ? 250 : 150); // Even more scatter on mobile
        
        transformState.forEach((state, index) => {
          const offset = scatterOffsets[index];
          state.scatterX = scatterAmount * offset.x;
          state.scatterY = scatterAmount * offset.y;
          state.scatterRotation = scatterAmount * offset.rotation;
        });
      }
    });

    function togglePreview(index) {
      isPreviewActiveRef.current = true;
      isTransitioningRef.current = true;

      const angle = transformState[index].angle;
      const targetPosition = (Math.PI * 3) / 2;
      let rotationRadians = targetPosition - angle;

      if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2;
      else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2;

      transformState.forEach((state) => {
        state.currentRotation = state.targetRotation = 0;
        state.currentScale = state.targetScale = 1;
        state.currentX = state.targetX = state.currentY = state.targetY = 0;
      });

      gsap.to(gallery, {
        onStart: () => {
          cards.forEach((card, i) => {
            gsap.to(card, {
              x: configRef.current.radius * Math.cos(transformState[i].angle),
              y: configRef.current.radius * Math.sin(transformState[i].angle),
              rotationY: 0,
              scale: 1,
              duration: 1.25,
              ease: "power4.out",
            });
          });
        },
        scale: 5,
        y: 1300,
        rotation: (rotationRadians * 180) / Math.PI + 360,
        duration: 2,
        ease: "power4.inOut",
        onComplete: () => {
          isTransitioningRef.current = false;
        },
      });

      gsap.to(parallaxStateRef.current, {
        currentX: 0,
        currentY: 0,
        currentZ: 0,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          gsap.set(galleryContainer, {
            rotateX: parallaxStateRef.current.currentX,
            rotateY: parallaxStateRef.current.currentY,
            rotation: parallaxStateRef.current.currentZ,
            transformOrigin: "center center",
          });
        },
      });

      const titleText = cards[index].dataset.title;
      const p = document.createElement("p");
      p.textContent = titleText;
      titleContainer.appendChild(p);
      currentTitleRef.current = p;

      // Simple text animation without SplitText
      gsap.set(p, { y: "125%" });
      gsap.to(p, {
        y: "0%",
        duration: 0.75,
        delay: 1.25,
        ease: "power4.out",
      });
    }

    function resetGallery() {
      if (isTransitioningRef.current) return;

      isTransitioningRef.current = true;

      if (currentTitleRef.current) {
        gsap.to(currentTitleRef.current, {
          y: "-125%",
          duration: 0.75,
          delay: 0.5,
          ease: "power4.out",
          onComplete: () => {
            if (currentTitleRef.current && currentTitleRef.current.parentNode) {
              currentTitleRef.current.parentNode.removeChild(currentTitleRef.current);
            }
            currentTitleRef.current = null;
          },
        });
      }

      const viewportWidth = window.innerWidth;
      let galleryScale = 1;

      if (viewportWidth < 768) {
        galleryScale = 0.6;
      } else if (viewportWidth < 1200) {
        galleryScale = 0.8;
      }

      gsap.to(gallery, {
        scale: galleryScale,
        y: 0,
        x: 0,
        rotation: 0,
        duration: 2.5,
        ease: "power4.inOut",
        onComplete: () => {
          isPreviewActiveRef.current = false;
          isTransitioningRef.current = false;
          Object.assign(parallaxStateRef.current, {
            targetX: 0,
            targetY: 0,
            targetZ: 0,
            currentX: 0,
            currentY: 0,
            currentZ: 0,
          });
        },
      });
    }

    function handleResize() {
      const viewportWidth = window.innerWidth;
      const isMobile = viewportWidth < 1000;
      
      configRef.current.isMobile = isMobile;
      configRef.current.radius = isMobile ? 200 : 275;
      configRef.current.sensitivity = isMobile ? 300 : 500;
      configRef.current.cardMoveAmount = isMobile ? 30 : 50;

      let galleryScale = 1;

      if (viewportWidth < 768) {
        galleryScale = 0.6;
      } else if (viewportWidth < 1200) {
        galleryScale = 0.8;
      }

      gsap.set(gallery, {
        scale: galleryScale,
      });

      if (!isPreviewActiveRef.current) {
        parallaxStateRef.current.targetX = 0;
        parallaxStateRef.current.targetY = 0;
        parallaxStateRef.current.targetZ = 0;
        parallaxStateRef.current.currentX = 0;
        parallaxStateRef.current.currentY = 0;
        parallaxStateRef.current.currentZ = 0;

        transformState.forEach((state) => {
          state.targetRotation = 0;
          state.currentRotation = 0;
          state.targetScale = 1;
          state.currentScale = 1;
          state.targetX = 0;
          state.currentX = 0;
          state.targetY = 0;
          state.currentY = 0;
        });
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    const handleDocumentClick = () => {
      if (isPreviewActiveRef.current && !isTransitioningRef.current) resetGallery();
    };

    const handleKeydown = (e) => {
      if (e.key === "Escape" && isPreviewActiveRef.current && !isTransitioningRef.current) resetGallery();
    };

    const handleMouseMove = (e) => {
      if (isPreviewActiveRef.current || isTransitioningRef.current) return;

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const percentX = (e.clientX - centerX) / centerX;
      const percentY = (e.clientY - centerY) / centerY;

      parallaxStateRef.current.targetY = percentX * 15;
      parallaxStateRef.current.targetX = -percentY * 15;
      parallaxStateRef.current.targetZ = (percentX + percentY) * 5;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const dx = e.clientX - (rect.left + rect.width / 2);
        const dy = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < configRef.current.sensitivity) {
          const flipFactor = Math.max(0, 1 - distance / configRef.current.effectFalloff);
          const angle = transformState[index].angle;
          const moveAmount = configRef.current.cardMoveAmount * flipFactor;

          transformState[index].targetRotation = 180 * flipFactor;
          transformState[index].targetScale = 1 + 0.3 * flipFactor;
          transformState[index].targetX = moveAmount * Math.cos(angle);
          transformState[index].targetY = moveAmount * Math.sin(angle);
        } else {
          transformState[index].targetRotation = 0;
          transformState[index].targetScale = 1;
          transformState[index].targetX = 0;
          transformState[index].targetY = 0;
        }
      });
    };

    const handleTouchMove = (e) => {
      if (isPreviewActiveRef.current || isTransitioningRef.current) return;
      
      e.preventDefault();
      const touch = e.touches[0];
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const percentX = (touch.clientX - centerX) / centerX;
      const percentY = (touch.clientY - centerY) / centerY;

      parallaxStateRef.current.targetY = percentX * 10;
      parallaxStateRef.current.targetX = -percentY * 10;
      parallaxStateRef.current.targetZ = (percentX + percentY) * 3;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const dx = touch.clientX - (rect.left + rect.width / 2);
        const dy = touch.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < configRef.current.sensitivity) {
          const flipFactor = Math.max(0, 1 - distance / configRef.current.effectFalloff);
          const angle = transformState[index].angle;
          const moveAmount = configRef.current.cardMoveAmount * flipFactor;

          transformState[index].targetRotation = 180 * flipFactor;
          transformState[index].targetScale = 1 + 0.2 * flipFactor;
          transformState[index].targetX = moveAmount * Math.cos(angle);
          transformState[index].targetY = moveAmount * Math.sin(angle);
        } else {
          transformState[index].targetRotation = 0;
          transformState[index].targetScale = 1;
          transformState[index].targetX = 0;
          transformState[index].targetY = 0;
        }
      });
    };

    const handleMouseOut = (e) => {
      if (
        (e.relatedTarget === null || e.relatedTarget.nodeName === "HTML") &&
        !isPreviewActiveRef.current &&
        !isTransitioningRef.current
      ) {
        transformState.forEach((state) => {
          state.targetRotation = 0;
          state.targetScale = 1;
          state.targetX = 0;
          state.targetY = 0;
        });
        parallaxStateRef.current.targetX = 0;
        parallaxStateRef.current.targetY = 0;
        parallaxStateRef.current.targetZ = 0;
      }
    };

    function animate() {
      if (!isPreviewActiveRef.current && !isTransitioningRef.current) {
        parallaxStateRef.current.currentX +=
          (parallaxStateRef.current.targetX - parallaxStateRef.current.currentX) * configRef.current.lerpFactor;
        parallaxStateRef.current.currentY +=
          (parallaxStateRef.current.targetY - parallaxStateRef.current.currentY) * configRef.current.lerpFactor;
        parallaxStateRef.current.currentZ +=
          (parallaxStateRef.current.targetZ - parallaxStateRef.current.currentZ) * configRef.current.lerpFactor;

        gsap.set(galleryContainer, {
          rotateX: parallaxStateRef.current.currentX,
          rotateY: parallaxStateRef.current.currentY,
          rotation: parallaxStateRef.current.currentZ,
          transformOrigin: "center center",
        });

        cards.forEach((card, index) => {
          const state = transformState[index];

          state.currentRotation +=
            (state.targetRotation - state.currentRotation) * configRef.current.lerpFactor;
          state.currentScale +=
            (state.targetScale - state.currentScale) * configRef.current.lerpFactor;
          state.currentX += (state.targetX - state.currentX) * configRef.current.lerpFactor;
          state.currentY += (state.targetY - state.currentY) * configRef.current.lerpFactor;

          const angle = state.angle;
          const x = configRef.current.radius * Math.cos(angle);
          const y = configRef.current.radius * Math.sin(angle);

          gsap.set(card, {
            x: x + state.currentX + (state.scatterX || 0),
            y: y + state.currentY + (state.scatterY || 0),
            rotationY: state.currentRotation,
            scale: state.currentScale,
            rotation: (angle * 180) / Math.PI + 90 + (state.scatterRotation || 0),
            transformOrigin: "center center",
            transformPerspective: 1000,
          });
        });
      }
      requestAnimationFrame(animate);
    }

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchstart", handleTouchMove, { passive: false });

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchstart", handleTouchMove);
      
      // Clean up ScrollTrigger
      if (scatterTrigger) {
        scatterTrigger.kill();
      }
      
      // Clean up cards
      cards.forEach(card => {
        if (card.parentNode) {
          card.parentNode.removeChild(card);
        }
      });
    };
  }, []);

  return (
    <div className="inkwell">
      <div className="inkwell-gallery-container" ref={galleryContainerRef}>
        <div className="inkwell-gallery" ref={galleryRef}></div>
      </div>
      <div className="inkwell-title-container" ref={titleContainerRef}></div>
    </div>
  );
};

export default Inkwell; 