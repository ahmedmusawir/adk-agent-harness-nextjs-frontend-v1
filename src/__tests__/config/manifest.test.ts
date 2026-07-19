/**
 * Unit tests for the agent manifest loader (BIM-003).
 * Intent (Rule K9): the validator fails LOUDLY on every malformed shape
 * (M-G5), resolution routes each agent to its own bundle's env var (M-G3),
 * and the committed manifest itself is valid and complete.
 */

import {
  DEFAULT_AGENT,
  KNOWN_AGENTS,
  MANIFEST,
  agentsForUi,
  resolveBundleEnvVar,
  resolveBundleEnvVarIn,
  validateManifest,
} from '@/config/manifest';

const VALID = {
  bundles: [
    { id: 'v1', label: 'Bundle One', urlEnv: 'URL_ONE' },
    { id: 'v2', label: 'Bundle Two', urlEnv: 'URL_TWO' },
  ],
  agents: [
    { name: 'alpha_agent', bundle: 'v1', label: 'Alpha' },
    { name: 'beta_agent', bundle: 'v2', label: 'Beta' },
  ],
};

describe('validateManifest (M-G5 — loud failures)', () => {
  it('accepts a valid manifest', () => {
    expect(() => validateManifest(VALID)).not.toThrow();
  });

  it('rejects duplicate agent names, naming the duplicate', () => {
    const bad = {
      ...VALID,
      agents: [...VALID.agents, { name: 'alpha_agent', bundle: 'v1', label: 'Dup' }],
    };
    expect(() => validateManifest(bad)).toThrow(/duplicate agent name "alpha_agent"/);
  });

  it('rejects duplicate bundle ids, naming the duplicate', () => {
    const bad = {
      ...VALID,
      bundles: [...VALID.bundles, { id: 'v1', label: 'Again', urlEnv: 'URL_X' }],
    };
    expect(() => validateManifest(bad)).toThrow(/duplicate bundle id "v1"/);
  });

  it('rejects an unknown bundle reference, naming agent and bundle', () => {
    const bad = {
      ...VALID,
      agents: [{ name: 'ghost_agent', bundle: 'nope', label: 'Ghost' }],
    };
    expect(() => validateManifest(bad)).toThrow(
      /"ghost_agent"\) references unknown bundle "nope"/,
    );
  });

  it('rejects empty lists', () => {
    expect(() => validateManifest({ bundles: [], agents: [] })).toThrow(
      /`bundles` must not be empty[\s\S]*`agents` must not be empty/,
    );
  });

  it('rejects missing/empty fields with the exact path', () => {
    const bad = {
      bundles: [{ id: 'v1', label: '', urlEnv: 'URL_ONE' }],
      agents: [{ name: 'a', bundle: 'v1' }],
    };
    expect(() => validateManifest(bad)).toThrow(/bundles\[0\]\.label/);
    expect(() => validateManifest(bad)).toThrow(/agents\[0\]\.label/);
  });

  it('rejects non-object input without crashing', () => {
    expect(() => validateManifest(null)).toThrow(/must be an array/);
    expect(() => validateManifest('nope')).toThrow(/must be an array/);
  });

  it('lists ALL problems in one throw (not first-error-only)', () => {
    const bad = {
      bundles: [{ id: 'v1', label: 'One', urlEnv: 'URL_ONE' }],
      agents: [
        { name: 'a', bundle: 'v1', label: 'A' },
        { name: 'a', bundle: 'missing', label: 'A2' },
      ],
    };
    try {
      validateManifest(bad);
      throw new Error('expected validateManifest to throw');
    } catch (e) {
      const message = String(e);
      expect(message).toContain('duplicate agent name "a"');
      expect(message).toContain('references unknown bundle "missing"');
    }
  });
});

describe('resolution (M-G3 — each agent to its own bundle)', () => {
  it('routes agents to their own bundle env vars in a two-bundle manifest', () => {
    const manifest = validateManifest(VALID);
    expect(resolveBundleEnvVarIn(manifest, 'alpha_agent')).toBe('URL_ONE');
    expect(resolveBundleEnvVarIn(manifest, 'beta_agent')).toBe('URL_TWO');
  });

  it('returns null for unknown agents (routes turn this into 400)', () => {
    const manifest = validateManifest(VALID);
    expect(resolveBundleEnvVarIn(manifest, 'ghost_agent')).toBeNull();
  });
});

describe('the committed manifest', () => {
  it('is valid, carries the five roster agents on v1, and declares v2-local', () => {
    expect(KNOWN_AGENTS).toEqual([
      'greeting_agent',
      'jarvis_agent',
      'calc_agent',
      'product_agent',
      'ghl_mcp_agent',
    ]);
    expect(MANIFEST.bundles.map((b) => b.id)).toEqual(['v1', 'v2-local']);
    for (const agent of KNOWN_AGENTS) {
      expect(resolveBundleEnvVar(agent)).toBe('ADK_BUNDLE_URL_V1');
    }
  });

  it('defaults to the first manifest agent (FLAG-B)', () => {
    expect(DEFAULT_AGENT).toBe('greeting_agent');
  });

  it('exposes ui items with human labels', () => {
    const items = agentsForUi();
    expect(items[0]).toEqual({ name: 'greeting_agent', label: 'Greeting Agent' });
    expect(items).toHaveLength(5);
  });

  it('carries env-var NAMES, never URLs (AM-2)', () => {
    const raw = JSON.stringify(MANIFEST);
    expect(raw).not.toMatch(/https?:\/\//);
  });
});
