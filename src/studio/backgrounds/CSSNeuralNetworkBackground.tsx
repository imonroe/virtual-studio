import React from 'react';
import type { AnimatedConfig } from '@/types/studio';

interface CSSNeuralNetworkBackgroundProps {
  config: AnimatedConfig;
}

export const CSSNeuralNetworkBackground: React.FC<CSSNeuralNetworkBackgroundProps> = ({ config }) => {
  const neuralConfig = config.neural || {
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

  const animationDuration = `${8 / neuralConfig.dataFlowSpeed}s`;
  
  // Generate node positions around screen periphery
  const generateNodes = () => {
    const nodes = [];
    const nodeCount = Math.min(neuralConfig.nodeCount, 20); // Limit for CSS performance
    
    for (let i = 0; i < nodeCount; i++) {
      const region = Math.floor(Math.random() * 4);
      let position: { x: string; y: string };

      switch (region) {
        case 0: // Top edge
          position = {
            x: `${10 + Math.random() * 80}%`,
            y: `${5 + Math.random() * 10}%`
          };
          break;
        case 1: // Right edge
          position = {
            x: `${85 + Math.random() * 10}%`,
            y: `${10 + Math.random() * 80}%`
          };
          break;
        case 2: // Bottom edge
          position = {
            x: `${10 + Math.random() * 80}%`,
            y: `${85 + Math.random() * 10}%`
          };
          break;
        default: // Left edge
          position = {
            x: `${5 + Math.random() * 10}%`,
            y: `${10 + Math.random() * 80}%`
          };
          break;
      }

      nodes.push(
        <div
          key={i}
          className={`neural-node node-${i}`}
          style={{
            position: 'absolute',
            left: position.x,
            top: position.y,
            width: `${neuralConfig.nodeSize}px`,
            height: `${neuralConfig.nodeSize}px`,
            background: `radial-gradient(circle, ${neuralConfig.colors.nodeCore}, ${neuralConfig.colors.nodeGlow}40, transparent 70%)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${neuralConfig.nodeSize * 2}px ${neuralConfig.colors.nodeGlow}60`,
            animation: `nodePulse${i % 3} ${animationDuration} ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
            zIndex: 3
          }}
        />
      );
    }
    
    return nodes;
  };

  // Generate connection lines (simplified for CSS)
  const generateConnections = () => {
    const connections = [];
    const connectionCount = Math.floor(neuralConfig.nodeCount * neuralConfig.connectionDensity);
    
    for (let i = 0; i < connectionCount; i++) {
      const angle = (i / connectionCount) * 360;
      const length = 30 + Math.random() * 40;
      
      connections.push(
        <div
          key={`connection-${i}`}
          className={`neural-connection connection-${i}`}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${length}%`,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${neuralConfig.colors.connection}40, transparent)`,
            transformOrigin: 'left center',
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            opacity: 0.6,
            zIndex: 1
          }}
        />
      );
    }
    
    return connections;
  };

  // Generate data packets (simplified animation)
  const generatePackets = () => {
    const packets = [];
    const packetCount = Math.min(neuralConfig.packetCount, 15); // Limit for performance
    
    for (let i = 0; i < packetCount; i++) {
      const delay = (i / packetCount) * parseFloat(animationDuration);
      
      packets.push(
        <div
          key={`packet-${i}`}
          className={`data-packet packet-${i}`}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: neuralConfig.colors.packet,
            borderRadius: '50%',
            boxShadow: `0 0 8px ${neuralConfig.colors.packet}`,
            animation: `packetFlow${i % 4} ${animationDuration} linear infinite`,
            animationDelay: `${delay}s`,
            zIndex: 2
          }}
        />
      );
    }
    
    return packets;
  };

  return (
    <div 
      className="css-neural-network-background"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `radial-gradient(ellipse at center, ${neuralConfig.colors.background}CC 0%, ${neuralConfig.colors.background} 70%)`,
        overflow: 'hidden',
        zIndex: 1
      }}
    >
      {/* Connections layer */}
      <div className="neural-connections">
        {generateConnections()}
      </div>

      {/* Nodes layer */}
      <div className="neural-nodes">
        {generateNodes()}
      </div>

      {/* Data packets layer */}
      <div className="neural-packets">
        {generatePackets()}
      </div>

      {/* CSS animations */}
      <style>{`
        /* Node pulsing animations */
        @keyframes nodePulse0 {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        
        @keyframes nodePulse1 {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          33% { transform: scale(1.1); opacity: 0.9; }
          66% { transform: scale(1.15); opacity: 1; }
        }
        
        @keyframes nodePulse2 {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          25% { transform: scale(1.05); opacity: 0.8; }
          75% { transform: scale(1.1); opacity: 1; }
        }

        /* Data packet movement animations */
        @keyframes packetFlow0 {
          0% { 
            left: 10%; top: 50%; 
            transform: translate(-50%, -50%); 
          }
          25% { 
            left: 50%; top: 10%; 
            transform: translate(-50%, -50%) scale(1.2); 
          }
          50% { 
            left: 90%; top: 50%; 
            transform: translate(-50%, -50%); 
          }
          75% { 
            left: 50%; top: 90%; 
            transform: translate(-50%, -50%) scale(0.8); 
          }
          100% { 
            left: 10%; top: 50%; 
            transform: translate(-50%, -50%); 
          }
        }
        
        @keyframes packetFlow1 {
          0% { 
            left: 50%; top: 10%; 
            transform: translate(-50%, -50%); 
          }
          50% { 
            left: 50%; top: 90%; 
            transform: translate(-50%, -50%) scale(1.1); 
          }
          100% { 
            left: 50%; top: 10%; 
            transform: translate(-50%, -50%); 
          }
        }
        
        @keyframes packetFlow2 {
          0% { 
            left: 90%; top: 50%; 
            transform: translate(-50%, -50%); 
          }
          50% { 
            left: 10%; top: 50%; 
            transform: translate(-50%, -50%) scale(0.9); 
          }
          100% { 
            left: 90%; top: 50%; 
            transform: translate(-50%, -50%); 
          }
        }
        
        @keyframes packetFlow3 {
          0% { 
            left: 20%; top: 20%; 
            transform: translate(-50%, -50%); 
          }
          25% { 
            left: 80%; top: 20%; 
            transform: translate(-50%, -50%) scale(1.3); 
          }
          50% { 
            left: 80%; top: 80%; 
            transform: translate(-50%, -50%); 
          }
          75% { 
            left: 20%; top: 80%; 
            transform: translate(-50%, -50%) scale(0.7); 
          }
          100% { 
            left: 20%; top: 20%; 
            transform: translate(-50%, -50%); 
          }
        }

        /* Accessibility: Respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .neural-node,
          .data-packet {
            animation: none !important;
          }
          
          .neural-node {
            opacity: 0.8 !important;
          }
        }
        
        /* Performance optimization for lower-end devices */
        @media (max-width: 768px) {
          .neural-connection {
            display: none; /* Hide connections on mobile for performance */
          }
          
          .data-packet {
            animation-duration: calc(${animationDuration} * 1.5) !important;
          }
        }
      `}</style>
    </div>
  );
};