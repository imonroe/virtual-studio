uniform float time;
uniform vec3 colorA;
uniform vec3 colorB;
uniform vec3 colorC;
uniform float angle;
uniform float animationSpeed;
uniform int gradientType; // 0: linear, 1: radial, 2: conic

varying vec2 vUv;

// Simplex noise for organic animations
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+10.0)*x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,
                      0.366025403784439,
                     -0.577350269189626,
                      0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 linearGradient(vec2 uv, float angle) {
  float rad = radians(angle);
  vec2 dir = vec2(cos(rad), sin(rad));
  float t = dot(uv - vec2(0.5), dir) + 0.5;
  
  // Add noise-based animation
  float noise = snoise(uv * 3.0 + time * animationSpeed * 0.1) * 0.05;
  t = clamp(t + noise, 0.0, 1.0);
  
  // Three-color gradient
  vec3 color;
  if (t < 0.5) {
    color = mix(colorA, colorB, t * 2.0);
  } else {
    color = mix(colorB, colorC, (t - 0.5) * 2.0);
  }
  
  return color;
}

vec3 radialGradient(vec2 uv) {
  vec2 center = vec2(0.5, 0.5);
  float dist = distance(uv, center) * 2.0;
  
  // Add animated distortion
  float noise = snoise(uv * 2.0 + time * animationSpeed * 0.15) * 0.1;
  dist = clamp(dist + noise, 0.0, 1.0);
  
  // Three-color gradient
  vec3 color;
  if (dist < 0.5) {
    color = mix(colorA, colorB, dist * 2.0);
  } else {
    color = mix(colorB, colorC, (dist - 0.5) * 2.0);
  }
  
  return color;
}

vec3 conicGradient(vec2 uv) {
  vec2 center = vec2(0.5, 0.5);
  vec2 dir = normalize(uv - center);
  float angle = atan(dir.y, dir.x) / (2.0 * 3.14159265359) + 0.5;
  
  // Add rotation animation
  angle = fract(angle + time * animationSpeed * 0.05);
  
  // Three-color gradient
  vec3 color;
  if (angle < 0.33) {
    color = mix(colorA, colorB, angle * 3.0);
  } else if (angle < 0.66) {
    color = mix(colorB, colorC, (angle - 0.33) * 3.0);
  } else {
    color = mix(colorC, colorA, (angle - 0.66) * 3.0);
  }
  
  return color;
}

void main() {
  vec3 color;
  
  if (gradientType == 0) {
    color = linearGradient(vUv, angle);
  } else if (gradientType == 1) {
    color = radialGradient(vUv);
  } else {
    color = conicGradient(vUv);
  }
  
  // Add subtle brightness variation
  float brightness = 1.0 + snoise(vUv * 1.5 + time * animationSpeed * 0.05) * 0.03;
  color *= brightness;
  
  gl_FragColor = vec4(color, 1.0);
}