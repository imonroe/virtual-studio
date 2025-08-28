uniform vec3 color;
uniform float time;

varying float vAlpha;

void main() {
    // Create circular particles
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Soft circular falloff
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    
    // Add subtle glow effect
    float glow = exp(-dist * 8.0);
    
    // Combine base alpha with glow
    alpha = max(alpha * 0.8, glow * 0.2);
    
    // Apply vertex alpha for animation
    alpha *= vAlpha;
    
    // Add subtle color variation
    vec3 finalColor = color;
    finalColor += vec3(0.1, 0.05, 0.0) * sin(time * 3.0 + gl_FragCoord.x * 0.01);
    
    gl_FragColor = vec4(finalColor, alpha);
}