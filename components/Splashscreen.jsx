"use client";
import React, { useState, useEffect, useCallback } from "react";
import Lottie from "react-lottie";
import animationData from "../public/loading.json";
import anime from "animejs";

const SplashScreen = ({ finishLoading }) => {
  const [isMounted, setIsMounted] = useState(false);

  const animate = useCallback(() => {
    const loader = anime.timeline({
      complete: () => finishLoading(),
    });

    loader.add({
      targets: "#logo",
      delay: 0,
      scale: 1,
      duration: 2000,
      easing: "easeInOutExpo",
    });
  }, [finishLoading]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 10);
    animate();
    return () => clearTimeout(timeout);
  }, [animate]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="flex h-screen items-center justify-center">
      {isMounted && (
        <div id="logo">
          <Lottie options={defaultOptions} height={100} width={100} />
        </div>
      )}
    </div>
  );
};

export default SplashScreen;
