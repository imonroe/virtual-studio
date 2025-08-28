attribute vec3 position;
attribute float size;
attribute float alpha;
attribute vec3 velocity;

uniform float time;
uniform float speed;
uniform vec2 resolution;

varying float vAlpha;

// Simple random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec3 pos = position;
    
    // Apply velocity over time
    pos += velocity * time * speed;
    
    // Wrap particles around screen edges
    pos.x = mod(pos.x + 1.0, 2.0) - 1.0;
    pos.y = mod(pos.y + 1.0, 2.0) - 1.0;
    
    // Add subtle floating motion
    pos.x += sin(time * 0.5 + position.y * 10.0) * 0.01;
    pos.y += cos(time * 0.3 + position.x * 8.0) * 0.01;
    
    vAlpha = alpha * (0.5 + 0.5 * sin(time * 2.0 + position.x * 20.0));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    
    // Vary size slightly based on position and time
    float sizeVariation = 1.0 + 0.3 * sin(time + position.x * 5.0 + position.y * 3.0);
    gl_PointSize = size * sizeVariation * (300.0 / length(modelViewMatrix * vec4(pos, 1.0)));
}