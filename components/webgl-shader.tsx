"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WebGLShaderProps {
  className?: string;
  intensity?: number;
}

export function WebGLShader({ className, intensity = 0.5 }: WebGLShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // Fragment shader with noise and time-based animation
    const fragmentShaderSource = `
      precision mediump float;
      varying vec2 vUv;
      uniform float u_time;
      uniform float u_intensity;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;

      // Simplex noise function
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 perm(vec4 x) { return mod289(((x * 34.0 + 1.0) * x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577195983479233, 0.0243902424);
        vec4 i = perm(v.xyxy);
        vec4 p = perm(((i.xy + i.zw) * 0.02439024 + i.zw));
        float a = p.x;
        float b = p.y;
        float c = p.z;
        float d = p.w;
        return ((a + b + c + d) * 0.25 - 1.0);
      }

      void main() {
        vec2 uv = vUv;
        vec2 mouse = u_mouse / u_resolution;

        float time = u_time * 0.5;

        // Create flowing noise pattern
        float noise1 = snoise(uv * 3.0 + time);
        float noise2 = snoise(uv * 5.0 - time * 0.5);
        float noise3 = snoise(uv * 8.0 + mouse);

        // Combine noises
        float combinedNoise = (noise1 + noise2 * 0.5 + noise3 * 0.25) * 0.5 + 0.5;

        // Create color gradient based on noise
        vec3 color1 = vec3(0.388, 0.4, 0.949); // git-branch
        vec3 color2 = vec3(0.133, 0.773, 0.369); // git-clean
        vec3 color3 = vec3(0.918, 0.702, 0.031); // git-modified

        vec3 color = mix(color1, color2, combinedNoise);
        color = mix(color, color3, noise2 * 0.5);

        // Add mouse influence
        float mouseInfluence = 1.0 - length(uv - mouse) * 2.0;
        mouseInfluence = clamp(mouseInfluence, 0.0, 1.0);

        // Increase intensity near mouse
        color += mouseInfluence * 0.2;

        // Add subtle scanlines
        float scanline = sin(vUv.y * 200.0 + time * 10.0) * 0.02;
        color += scanline * 0.05;

        // Apply overall intensity
        color *= u_intensity;

        // Add glow effect
        float glow = snoise(uv * 2.0 + time * 0.3) * 0.3;
        color += glow * mouseInfluence * 0.2;

        gl_FragColor = vec4(color, 0.15);
      }
    `;

    // Compile shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return;

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;

    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vertexShader));
      return;
    }

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fragmentShader));
      return;
    }

    // Create program
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Get attribute and uniform locations
    const positionLocation = gl.getAttribLocation(program, "position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const intensityLocation = gl.getUniformLocation(program, "u_intensity");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");

    // Create buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Set viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Mouse tracking
    let mouseX = 0.5;
    let mouseY = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = 1 - (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let startTime = Date.now();

    const render = () => {
      const currentTime = (Date.now() - startTime) / 1000;

      gl.uniform1f(timeLocation, currentTime);
      gl.uniform1f(intensityLocation, intensity);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      requestAnimationFrame(render);
    };

    render();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ mixBlendMode: "screen" }}
    />
  );
}
