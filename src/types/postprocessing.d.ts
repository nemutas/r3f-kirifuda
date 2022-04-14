import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ReactThreeFiber } from '@react-three/fiber';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			effectComposer: ReactThreeFiber.Node<EffectComposer, typeof EffectComposer>
			renderPass: ReactThreeFiber.Node<RenderPass, typeof RenderPass>
			shaderPass: ReactThreeFiber.Node<ShaderPass, typeof ShaderPass>
			unrealBloomPass: ReactThreeFiber.Node<UnrealBloomPass, typeof UnrealBloomPass>
		}
	}
}
