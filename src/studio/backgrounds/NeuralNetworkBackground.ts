import * as THREE from 'three';
import type { AnimatedConfig } from '@/types/studio';

// Data structures for neural network
interface NetworkNode {
  id: number;
  position: THREE.Vector2;
  connections: number[];
  activity: number; // 0-1, influences glow intensity
  opacity: number; // 0-1, for fade transitions
  targetOpacity: number; // Target opacity for smooth transitions
}

interface NetworkConnection {
  id: number;
  nodeA: number;
  nodeB: number;
  splinePath: THREE.Vector2[];
  pathLength: number;
}

interface DataPacket {
  connectionId: number;
  progress: number; // 0-1 along path
  speed: number;
  color: THREE.Color;
  activity: number; // Influences brightness
  opacity: number; // 0-1, for fade transitions
  targetOpacity: number; // Target opacity for smooth transitions
}

// Vertex shader for nodes
const nodeVertexShader = `
attribute float activity;
attribute float size;
attribute float opacity;
varying float vActivity;
varying float vOpacity;
varying vec2 vUv;

void main() {
  vActivity = activity;
  vOpacity = opacity;
  vUv = uv;
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

// Fragment shader for nodes with glow effect
const nodeFragmentShader = `
uniform vec3 nodeCore;
uniform vec3 nodeGlow;
varying float vActivity;
varying float vOpacity;
varying vec2 vUv;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  if (dist > 0.5) discard;
  
  // Create circular gradient from core to glow
  float intensity = 1.0 - smoothstep(0.0, 0.5, dist);
  intensity *= (0.7 + vActivity * 0.3); // Activity modulation
  intensity *= vOpacity; // Apply fade opacity
  
  // Color mixing: core in center, glow at edges
  vec3 color = mix(nodeGlow, nodeCore, intensity * 0.8);
  
  // Outer glow
  float glow = 1.0 - smoothstep(0.3, 0.5, dist);
  color += nodeGlow * glow * 0.3;
  
  gl_FragColor = vec4(color, intensity);
}
`;

// Vertex shader for data packets
const packetVertexShader = `
attribute float activity;
attribute float size;
attribute float opacity;
varying float vActivity;
varying float vOpacity;

void main() {
  vActivity = activity;
  vOpacity = opacity;
  
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * (300.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

// Fragment shader for data packets
const packetFragmentShader = `
uniform vec3 packetColor;
varying float vActivity;
varying float vOpacity;

void main() {
  vec2 center = gl_PointCoord - vec2(0.5);
  float dist = length(center);
  
  if (dist > 0.5) discard;
  
  float intensity = 1.0 - smoothstep(0.0, 0.4, dist);
  intensity *= vActivity;
  intensity *= vOpacity; // Apply fade opacity
  
  // Add bright core
  float core = 1.0 - smoothstep(0.0, 0.1, dist);
  intensity += core * 0.5 * vOpacity;
  
  gl_FragColor = vec4(packetColor, intensity);
}
`;

export class NeuralNetworkBackground {
  // Rendering components
  private group: THREE.Group;
  private nodesMesh: THREE.Points | null = null;
  private connectionsMesh: THREE.LineSegments | null = null;
  private packetsMesh: THREE.Points | null = null;

  // Geometries and materials
  private nodesGeometry: THREE.BufferGeometry | null = null;
  private nodesMaterial: THREE.ShaderMaterial | null = null;
  private connectionsGeometry: THREE.BufferGeometry | null = null;
  private connectionsMaterial: THREE.LineBasicMaterial | null = null;
  private packetsGeometry: THREE.BufferGeometry | null = null;
  private packetsMaterial: THREE.ShaderMaterial | null = null;

  // Network data
  private nodes: NetworkNode[] = [];
  private connections: NetworkConnection[] = [];
  private packets: DataPacket[] = [];
  
  private config: AnimatedConfig;
  private startTime: number = 0;
  private transitionSpeed: number = 2.0; // Fade speed (opacity units per second)

  constructor(config: AnimatedConfig) {
    this.config = config;
    this.group = new THREE.Group();
    this.startTime = performance.now() / 1000;
    void this.startTime; // Reserved for future timing features
  }

  create(): THREE.Group {
    const neuralConfig = this.config.neural || this.getDefaultNeuralConfig();

    // Generate network structure
    this.generateNetwork(neuralConfig);
    
    // Create nodes
    this.createNodes(neuralConfig);
    
    // Create connections
    this.createConnections(neuralConfig);
    
    // Create data packets
    this.createDataPackets(neuralConfig);

    this.group.position.z = -1; // Place behind other elements
    
    console.log('NeuralNetworkBackground created:', {
      nodes: this.nodes.length,
      connections: this.connections.length,
      packets: this.packets.length
    });
    
    return this.group;
  }

  private generateNetwork(config: NonNullable<AnimatedConfig['neural']>): void {
    // Generate nodes around screen periphery
    this.nodes = this.generatePeripheralNodes(config.nodeCount);
    
    // Generate connections between nodes
    this.connections = this.generateConnections(config.connectionDensity);
  }

  private generatePeripheralNodes(count: number): NetworkNode[] {
    const nodes: NetworkNode[] = [];
    
    // Use deterministic positioning based on node index to prevent jumping
    for (let i = 0; i < count; i++) {
      // Distribute nodes evenly around the perimeter with some controlled variation
      const angleStep = (Math.PI * 2) / count;
      const baseAngle = i * angleStep;
      
      // Add small deterministic variation based on node ID (not random)
      const variation = Math.sin(i * 0.7) * 0.3; // Deterministic "randomness"
      const angle = baseAngle + variation;
      
      // Calculate position on extended perimeter (outside visible area)
      const radius = 1.0 + Math.cos(i * 1.1) * 0.1; // Slight radius variation
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      // Clamp to screen edges with some padding
      const position = new THREE.Vector2(
        Math.max(-0.9, Math.min(0.9, x)),
        Math.max(-0.9, Math.min(0.9, y))
      );

      nodes.push({
        id: i,
        position,
        connections: [],
        activity: 0.5 + Math.sin(i * 0.5) * 0.25 + 0.25, // Deterministic activity 0.5-1.0
        opacity: 0.0, // Start faded out
        targetOpacity: 1.0 // Fade in to full opacity
      });
    }

    return nodes;
  }

  private generateConnections(density: number): NetworkConnection[] {
    const connections: NetworkConnection[] = [];
    let connectionId = 0;

    // Connect each node to 2-4 nearest neighbors based on density
    for (const node of this.nodes) {
      const maxConnections = Math.floor(2 + density * 2);
      const nearestNodes = this.findNearestNodes(node, maxConnections);

      for (const targetNode of nearestNodes) {
        // Avoid duplicate connections
        if (!this.connectionExists(node.id, targetNode.id)) {
          const connection = this.createConnection(connectionId++, node, targetNode);
          connections.push(connection);
          
          // Update node connection lists
          node.connections.push(targetNode.id);
          targetNode.connections.push(node.id);
        }
      }
    }

    return connections;
  }

  private findNearestNodes(node: NetworkNode, count: number): NetworkNode[] {
    return this.nodes
      .filter(n => n.id !== node.id)
      .sort((a, b) => {
        const distA = node.position.distanceTo(a.position);
        const distB = node.position.distanceTo(b.position);
        return distA - distB;
      })
      .slice(0, count);
  }

  private connectionExists(nodeA: number, nodeB: number): boolean {
    return this.connections.some(conn => 
      (conn.nodeA === nodeA && conn.nodeB === nodeB) ||
      (conn.nodeA === nodeB && conn.nodeB === nodeA)
    );
  }

  private createConnection(id: number, nodeA: NetworkNode, nodeB: NetworkNode): NetworkConnection {
    // Create slight curve for the connection path
    const start = nodeA.position;
    const end = nodeB.position;
    const mid = start.clone().add(end).multiplyScalar(0.5);
    
    // Add deterministic curve perpendicular to the line based on connection ID
    const direction = end.clone().sub(start).normalize();
    const perpendicular = new THREE.Vector2(-direction.y, direction.x);
    const curveAmount = Math.sin(id * 0.5) * 0.1; // Deterministic curve variation
    mid.add(perpendicular.multiplyScalar(curveAmount));

    return {
      id,
      nodeA: nodeA.id,
      nodeB: nodeB.id,
      splinePath: [start, mid, end],
      pathLength: start.distanceTo(end)
    };
  }

  private createNodes(config: NonNullable<AnimatedConfig['neural']>): void {
    this.nodesGeometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(this.nodes.length * 3);
    const activities = new Float32Array(this.nodes.length);
    const sizes = new Float32Array(this.nodes.length);
    const opacities = new Float32Array(this.nodes.length);

    this.nodes.forEach((node, i) => {
      positions[i * 3] = node.position.x;
      positions[i * 3 + 1] = node.position.y;
      positions[i * 3 + 2] = 0;
      
      activities[i] = node.activity;
      sizes[i] = config.nodeSize * (0.8 + Math.sin(i * 0.6) * 0.2 + 0.2); // Deterministic size variation
      opacities[i] = node.opacity;
    });

    this.nodesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.nodesGeometry.setAttribute('activity', new THREE.BufferAttribute(activities, 1));
    this.nodesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    this.nodesGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    this.nodesMaterial = new THREE.ShaderMaterial({
      vertexShader: nodeVertexShader,
      fragmentShader: nodeFragmentShader,
      uniforms: {
        nodeCore: { value: this.hexToVec3(config.colors.nodeCore) },
        nodeGlow: { value: this.hexToVec3(config.colors.nodeGlow) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    this.nodesMesh = new THREE.Points(this.nodesGeometry, this.nodesMaterial);
    this.group.add(this.nodesMesh);
  }

  private createConnections(config: NonNullable<AnimatedConfig['neural']>): void {
    this.connectionsGeometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(this.connections.length * 6); // 2 points per line
    let index = 0;

    this.connections.forEach(connection => {
      const nodeA = this.nodes[connection.nodeA];
      const nodeB = this.nodes[connection.nodeB];

      positions[index++] = nodeA.position.x;
      positions[index++] = nodeA.position.y;
      positions[index++] = 0;
      
      positions[index++] = nodeB.position.x;
      positions[index++] = nodeB.position.y;
      positions[index++] = 0;
    });

    this.connectionsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.connectionsMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(config.colors.connection),
      transparent: true,
      opacity: 0.3
    });

    this.connectionsMesh = new THREE.LineSegments(this.connectionsGeometry, this.connectionsMaterial);
    this.group.add(this.connectionsMesh);
  }

  private createDataPackets(config: NonNullable<AnimatedConfig['neural']>): void {
    // Initialize data packets with deterministic properties
    for (let i = 0; i < config.packetCount; i++) {
      // Use deterministic connection assignment and properties
      const connectionIndex = i % this.connections.length;
      const progress = (i / config.packetCount) % 1; // Spread evenly along paths
      const speedVariation = Math.sin(i * 0.3) * 0.2; // Deterministic speed variation
      
      this.packets.push({
        connectionId: connectionIndex,
        progress: progress,
        speed: config.dataFlowSpeed * (0.8 + speedVariation + 0.2),
        color: new THREE.Color(config.colors.packet),
        activity: 0.8 + Math.cos(i * 0.4) * 0.1 + 0.1, // Deterministic activity 0.8-1.0
        opacity: 0.0, // Start faded out
        targetOpacity: 1.0 // Fade in to full opacity
      });
    }

    this.packetsGeometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(this.packets.length * 3);
    const activities = new Float32Array(this.packets.length);
    const sizes = new Float32Array(this.packets.length);
    const opacities = new Float32Array(this.packets.length);

    this.packets.forEach((packet, i) => {
      const position = this.getPacketPosition(packet);
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = 0;
      
      activities[i] = packet.activity;
      sizes[i] = 4 + Math.sin(i * 0.8) * 1.5 + 1.5; // Deterministic size variation 4-7
      opacities[i] = packet.opacity;
    });

    this.packetsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.packetsGeometry.setAttribute('activity', new THREE.BufferAttribute(activities, 1));
    this.packetsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    this.packetsGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

    this.packetsMaterial = new THREE.ShaderMaterial({
      vertexShader: packetVertexShader,
      fragmentShader: packetFragmentShader,
      uniforms: {
        packetColor: { value: this.hexToVec3(config.colors.packet) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    this.packetsMesh = new THREE.Points(this.packetsGeometry, this.packetsMaterial);
    this.group.add(this.packetsMesh);
  }

  private getPacketPosition(packet: DataPacket): THREE.Vector2 {
    const connection = this.connections[packet.connectionId];
    if (!connection) return new THREE.Vector2(0, 0);

    // Simple linear interpolation for now (could use Bezier curves for curves)
    const nodeA = this.nodes[connection.nodeA];
    const nodeB = this.nodes[connection.nodeB];
    
    return nodeA.position.clone().lerp(nodeB.position, packet.progress);
  }

  update(_deltaTime: number): void {
    if (!this.packetsGeometry || !this.packets.length) return;

    const neuralConfig = this.config.neural || this.getDefaultNeuralConfig();
    
    // Update node opacity transitions
    let nodesNeedUpdate = false;
    this.nodes.forEach((node, i) => {
      if (Math.abs(node.opacity - node.targetOpacity) > 0.01) {
        const direction = node.targetOpacity > node.opacity ? 1 : -1;
        node.opacity += direction * this.transitionSpeed * _deltaTime;
        node.opacity = Math.max(0, Math.min(1, node.opacity)); // Clamp 0-1
        
        if (this.nodesGeometry) {
          const opacities = this.nodesGeometry.attributes.opacity as THREE.BufferAttribute;
          opacities.setX(i, node.opacity);
          nodesNeedUpdate = true;
        }
      }
    });
    
    if (nodesNeedUpdate && this.nodesGeometry) {
      this.nodesGeometry.attributes.opacity.needsUpdate = true;
    }
    
    // Update packet opacity transitions
    let packetsNeedUpdate = false;
    this.packets.forEach((packet, i) => {
      if (Math.abs(packet.opacity - packet.targetOpacity) > 0.01) {
        const direction = packet.targetOpacity > packet.opacity ? 1 : -1;
        packet.opacity += direction * this.transitionSpeed * _deltaTime;
        packet.opacity = Math.max(0, Math.min(1, packet.opacity)); // Clamp 0-1
        
        if (this.packetsGeometry) {
          const opacities = this.packetsGeometry.attributes.opacity as THREE.BufferAttribute;
          opacities.setX(i, packet.opacity);
          packetsNeedUpdate = true;
        }
      }
    });
    
    // Update data packet positions
    this.packets.forEach((packet, i) => {
      packet.progress += packet.speed * _deltaTime * 0.1;
      
      if (packet.progress >= 1.0) {
        // Respawn packet at next connection in sequence (deterministic)
        packet.connectionId = (packet.connectionId + 1) % this.connections.length;
        packet.progress = 0;
        const speedVariation = Math.sin(i * 0.3) * 0.2; // Same deterministic variation as initial
        packet.speed = neuralConfig.dataFlowSpeed * (0.8 + speedVariation + 0.2);
      }
      
      const position = this.getPacketPosition(packet);
      const positions = this.packetsGeometry!.attributes.position as THREE.BufferAttribute;
      positions.setXYZ(i, position.x, position.y, 0);
    });

    this.packetsGeometry.attributes.position.needsUpdate = true;
    
    if (packetsNeedUpdate && this.packetsGeometry) {
      this.packetsGeometry.attributes.opacity.needsUpdate = true;
    }
    
    void _deltaTime; // Explicitly ignore parameter
  }

  updateConfig(config: Partial<AnimatedConfig>): void {
    // Create a new config object to avoid modifying readonly properties
    this.config = { ...this.config, ...config };

    if (!config.neural) return;

    const neuralConfig = config.neural;
    const currentConfig = this.config.neural || this.getDefaultNeuralConfig();

    // Check if we need to rebuild the network (node count or connection density changed)
    const needsRebuild = 
      neuralConfig.nodeCount !== undefined && neuralConfig.nodeCount !== this.nodes.length ||
      neuralConfig.connectionDensity !== undefined && neuralConfig.connectionDensity !== currentConfig.connectionDensity;

    if (needsRebuild) {
      this.transitionToNewNetwork(neuralConfig);
    } else {
      // Just update material properties for visual changes
      this.updateMaterials(neuralConfig);
    }

    console.log('NeuralNetworkBackground config updated:', neuralConfig);
  }

  private updateMaterials(neuralConfig: Partial<NonNullable<AnimatedConfig['neural']>>): void {
    // Update materials if colors changed
    if (neuralConfig.colors && this.nodesMaterial) {
      this.nodesMaterial.uniforms.nodeCore.value.copy(this.hexToVec3(neuralConfig.colors.nodeCore));
      this.nodesMaterial.uniforms.nodeGlow.value.copy(this.hexToVec3(neuralConfig.colors.nodeGlow));
    }

    if (neuralConfig.colors && this.packetsMaterial) {
      this.packetsMaterial.uniforms.packetColor.value.copy(this.hexToVec3(neuralConfig.colors.packet));
    }

    if (neuralConfig.colors && this.connectionsMaterial) {
      this.connectionsMaterial.color.copy(new THREE.Color(neuralConfig.colors.connection));
    }
  }

  private transitionToNewNetwork(neuralConfig: Partial<NonNullable<AnimatedConfig['neural']>>): void {
    // Fade out existing nodes
    this.nodes.forEach(node => {
      node.targetOpacity = 0.0;
    });
    
    // Fade out existing packets
    this.packets.forEach(packet => {
      packet.targetOpacity = 0.0;
    });

    // Wait for fade out to complete, then regenerate network
    setTimeout(() => {
      this.regenerateNetwork(neuralConfig);
    }, 500); // Half second fade out
  }

  private regenerateNetwork(neuralConfig: Partial<NonNullable<AnimatedConfig['neural']>>): void {
    const fullConfig = { ...this.getDefaultNeuralConfig(), ...this.config.neural, ...neuralConfig };
    
    // Remove old meshes from group
    if (this.nodesMesh) {
      this.group.remove(this.nodesMesh);
      this.nodesMesh = null;
    }
    if (this.connectionsMesh) {
      this.group.remove(this.connectionsMesh);
      this.connectionsMesh = null;
    }
    if (this.packetsMesh) {
      this.group.remove(this.packetsMesh);
      this.packetsMesh = null;
    }

    // Dispose old geometries and materials
    if (this.nodesGeometry) {
      this.nodesGeometry.dispose();
      this.nodesGeometry = null;
    }
    if (this.nodesMaterial) {
      this.nodesMaterial.dispose();
      this.nodesMaterial = null;
    }
    if (this.connectionsGeometry) {
      this.connectionsGeometry.dispose();
      this.connectionsGeometry = null;
    }
    if (this.connectionsMaterial) {
      this.connectionsMaterial.dispose();
      this.connectionsMaterial = null;
    }
    if (this.packetsGeometry) {
      this.packetsGeometry.dispose();
      this.packetsGeometry = null;
    }
    if (this.packetsMaterial) {
      this.packetsMaterial.dispose();
      this.packetsMaterial = null;
    }

    // Generate new network
    this.generateNetwork(fullConfig);
    this.createNodes(fullConfig);
    this.createConnections(fullConfig);
    this.createDataPackets(fullConfig);
  }

  setVisible(visible: boolean): void {
    this.group.visible = visible;
  }

  private getDefaultNeuralConfig() {
    return {
      nodeCount: 25,
      nodeSize: 8,
      connectionDensity: 0.4,
      dataFlowSpeed: 1.0,
      packetCount: 20,
      colors: {
        background: '#1a1a2e',
        nodeCore: '#646cff',
        nodeGlow: '#00f5ff',
        connection: '#646cff',
        packet: '#00f5ff'
      },
      quality: 'auto' as const
    };
  }

  private hexToVec3(hex: string): THREE.Vector3 {
    const color = new THREE.Color(hex);
    return new THREE.Vector3(color.r, color.g, color.b);
  }

  dispose(): void {
    if (this.nodesGeometry) {
      this.nodesGeometry.dispose();
      this.nodesGeometry = null;
    }
    if (this.nodesMaterial) {
      this.nodesMaterial.dispose();
      this.nodesMaterial = null;
    }
    if (this.connectionsGeometry) {
      this.connectionsGeometry.dispose();
      this.connectionsGeometry = null;
    }
    if (this.connectionsMaterial) {
      this.connectionsMaterial.dispose();
      this.connectionsMaterial = null;
    }
    if (this.packetsGeometry) {
      this.packetsGeometry.dispose();
      this.packetsGeometry = null;
    }
    if (this.packetsMaterial) {
      this.packetsMaterial.dispose();
      this.packetsMaterial = null;
    }

    // Clear group
    this.group.clear();
  }

  getGroup(): THREE.Group {
    return this.group;
  }
}